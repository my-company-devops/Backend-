const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

require("dotenv").config();

const DATA_DIR = process.env.DS_DATA_DIR;
const EXPECTED_CONFIRMATION = "IMPORT_DATASET";
const DATABASE_TIMEOUT_MS = 30000;
let activePool = null;
let activeClient = null;
let transactionActive = false;
let shutdownInProgress = false;

const TABLES = {
    support_teams: {
        file: "support_teams (1).csv",
        primaryKey: "team_id",
        columns: ["team_id", "name", "created_at", "updated_at", "created_by", "updated_by"]
    },
    users: {
        file: "users (1).csv",
        primaryKey: "user_id",
        columns: ["user_id", "full_name", "email", "password_hash", "role", "reporter_type", "team_id", "created_at", "updated_at"]
    },
    location: {
        file: "location (1).csv",
        primaryKey: "loc_id",
        columns: ["loc_id", "code", "floor", "room_type", "created_at", "updated_at"]
    },
    business_hours: {
        file: "business_hours (1).csv",
        primaryKey: "id",
        columns: ["id", "name", "day_of_week", "start_time", "end_time", "is_working_day", "created_at", "updated_at"]
    },
    assets: {
        file: "assets (1).csv",
        primaryKey: "assets_id",
        columns: ["assets_id", "asset_tag", "asset_type", "location_id", "created_at", "updated_at", "created_by", "updated_by"]
    },
    categories: {
        file: "categories (1).csv",
        primaryKey: "category_id",
        columns: ["category_id", "name", "team_id", "created_at", "updated_at", "created_by", "updated_by"]
    },
    tickets: {
        file: "tickets (1).csv",
        primaryKey: "ticket_id",
        columns: ["ticket_id", "title", "description", "asset_id", "reporter_id", "category_id", "location_id", "urgency", "priority", "first_response_time", "resolve_time", "created_at", "updated_at", "created_by", "updated_by"]
    },
    sla_profiles: {
        file: "sla_profiles (1).csv",
        primaryKey: "sla_profile_id",
        columns: ["sla_profile_id", "name", "category_id", "team_id", "business_hours_id", "target_response_time", "target_resolution_time", "created_at", "updated_at", "created_by", "updated_by"]
    },
    ticket_status_history: {
        file: "ticket_status_history (1).csv",
        primaryKey: "id",
        columns: ["id", "ticket_id", "from_status", "to_status", "changed_date", "changed_by", "reason"]
    },
    assignments: {
        file: "assignments (1).csv",
        primaryKey: "id",
        columns: ["id", "ticket_id", "assigned_to", "team_id", "assigned_by", "assigned_at", "unassigned_at", "created_at"]
    },
    attachments: {
        file: "attachments (1).csv",
        primaryKey: "id",
        columns: ["id", "ticket_id", "uploaded_by", "file_name", "file_reference", "size", "visibility", "created_at"]
    },
    comments: {
        file: "comments (1).csv",
        primaryKey: "id",
        columns: ["id", "ticket_id", "author_id", "body", "visibility", "created_at", "updated_at", "updated_by"]
    },
    escalation: {
        file: "escalation (1).csv",
        primaryKey: "id",
        columns: ["id", "ticket_id", "escalated_at", "escalated_by", "escalated_to", "reason", "created_at"]
    },
    work_logs: {
        file: "work_logs (1).csv",
        primaryKey: "id",
        columns: ["id", "ticket_id", "user_id", "action", "work_time", "parts", "resolution_code", "created_at", "updated_at"]
    },
    predictions: {
        file: "predictions (1).csv",
        primaryKey: "id",
        columns: ["id", "ticket_id", "suggested_category_id", "suggested_priority", "duplicate_candidate_ticket_id", "sla_risk_flag", "confidence", "explanation", "model_version", "decision", "decided_by", "decided_at", "created_at"]
    },
    feedback: {
        file: "feedback (1).csv",
        primaryKey: "id",
        columns: ["id", "ticket_id", "reporter_id", "resolution_confirmed", "rating", "reopen_reason", "created_at", "updated_at"]
    }
};

const INSERT_ORDER = [
    "support_teams",
    "users",
    "location",
    "business_hours",
    "assets",
    "categories",
    "tickets",
    "sla_profiles",
    "ticket_status_history",
    "assignments",
    "attachments",
    "comments",
    "escalation",
    "work_logs",
    "predictions",
    "feedback"
];

const FK_RULES = [
    ["users", "team_id", "support_teams"],
    ["assets", "location_id", "location"],
    ["assets", "created_by", "users"],
    ["assets", "updated_by", "users"],
    ["categories", "team_id", "support_teams"],
    ["categories", "created_by", "users"],
    ["categories", "updated_by", "users"],
    ["support_teams", "created_by", "users"],
    ["support_teams", "updated_by", "users"],
    ["tickets", "asset_id", "assets"],
    ["tickets", "reporter_id", "users"],
    ["tickets", "category_id", "categories"],
    ["tickets", "location_id", "location"],
    ["tickets", "created_by", "users"],
    ["tickets", "updated_by", "users"],
    ["ticket_status_history", "ticket_id", "tickets"],
    ["ticket_status_history", "changed_by", "users"],
    ["attachments", "ticket_id", "tickets"],
    ["attachments", "uploaded_by", "users"],
    ["comments", "ticket_id", "tickets"],
    ["comments", "author_id", "users"],
    ["comments", "updated_by", "users"],
    ["escalation", "ticket_id", "tickets"],
    ["escalation", "escalated_by", "users"],
    ["escalation", "escalated_to", "users"],
    ["assignments", "ticket_id", "tickets"],
    ["assignments", "assigned_to", "users"],
    ["assignments", "team_id", "support_teams"],
    ["assignments", "assigned_by", "users"],
    ["sla_profiles", "category_id", "categories"],
    ["sla_profiles", "team_id", "support_teams"],
    ["sla_profiles", "business_hours_id", "business_hours"],
    ["sla_profiles", "created_by", "users"],
    ["sla_profiles", "updated_by", "users"],
    ["work_logs", "ticket_id", "tickets"],
    ["work_logs", "user_id", "users"],
    ["predictions", "ticket_id", "tickets"],
    ["predictions", "suggested_category_id", "categories"],
    ["predictions", "duplicate_candidate_ticket_id", "tickets"],
    ["predictions", "decided_by", "users"],
    ["feedback", "ticket_id", "tickets"],
    ["feedback", "reporter_id", "users"]
];

const ENUMS = {
    role: new Set(["Reporter", "Agent", "Technician", "Service_Manager", "Auditor"]),
    reporter_type: new Set(["Student", "Faculty", "Staff", "Visitor"]),
    from_status: new Set(["New", "Triaged", "Assigned", "In_Progress", "Waiting", "Resolved", "Reopened", "Closed"]),
    to_status: new Set(["New", "Triaged", "Assigned", "In_Progress", "Waiting", "Resolved", "Reopened", "Closed"]),
    urgency: new Set(["Low", "Medium", "High", "Critical"]),
    priority: new Set(["Low", "Medium", "High", "Critical"]),
    suggested_priority: new Set(["Low", "Medium", "High", "Critical"]),
    visibility: new Set(["Reporter_Visible", "Internal"]),
    decision: new Set(["Pending", "Accepted", "Overridden"])
};

const UUID_COLUMNS = new Set([
    "id", "team_id", "user_id", "loc_id", "assets_id", "category_id", "ticket_id",
    "sla_profile_id", "asset_id", "reporter_id", "location_id", "created_by", "updated_by",
    "changed_by", "uploaded_by", "author_id", "updated_by", "escalated_by", "escalated_to",
    "assigned_to", "assigned_by", "business_hours_id", "duplicate_candidate_ticket_id", "decided_by"
]);

function fail(table, rowNumber, message) {
    throw new Error(`${table}, CSV row ${rowNumber}: ${message}`);
}

function parseCsv(text, table) {
    const rows = [];
    let row = [];
    let value = "";
    let quoted = false;

    for (let index = 0; index < text.length; index += 1) {
        const character = text[index];
        const next = text[index + 1];

        if (quoted) {
            if (character === '"' && next === '"') {
                value += '"';
                index += 1;
            } else if (character === '"') {
                quoted = false;
            } else {
                value += character;
            }
        } else if (character === '"' && value.length === 0) {
            quoted = true;
        } else if (character === ",") {
            row.push(value);
            value = "";
        } else if (character === "\n") {
            row.push(value.endsWith("\r") ? value.slice(0, -1) : value);
            rows.push(row);
            row = [];
            value = "";
        } else {
            value += character;
        }
    }

    if (quoted) {
        fail(table, rows.length + 2, "unterminated quoted CSV field");
    }

    if (value.length > 0 || row.length > 0) {
        row.push(value);
        rows.push(row);
    }

    if (rows.length === 0) {
        fail(table, 1, "file is empty");
    }

    const headers = rows.shift();
    return rows.filter((currentRow) => currentRow.some((item) => item !== "")).map((currentRow, index) => {
        if (currentRow.length !== headers.length) {
            fail(table, index + 2, `expected ${headers.length} fields but found ${currentRow.length}`);
        }

        return Object.fromEntries(headers.map((header, columnIndex) => [header, currentRow[columnIndex]]));
    });
}

function readDataset() {
    if (!DATA_DIR) {
        throw new Error("DS_DATA_DIR is required and must point to the directory containing the 16 CSV files");
    }

    const datasets = {};

    for (const [table, definition] of Object.entries(TABLES)) {
        const filePath = path.join(DATA_DIR, definition.file);
        if (!fs.existsSync(filePath)) {
            throw new Error(`${table}: missing file ${filePath}`);
        }

        const rows = parseCsv(fs.readFileSync(filePath, "utf8"), table);
        const headers = rows.length > 0 ? Object.keys(rows[0]) : definition.columns;
        const missing = definition.columns.filter((column) => !headers.includes(column));
        const extra = headers.filter((column) => !definition.columns.includes(column));

        if (missing.length > 0 || extra.length > 0) {
            throw new Error(`${table}: columns do not match; missing=${missing.join(",") || "none"}; extra=${extra.join(",") || "none"}`);
        }

        datasets[table] = rows;
    }

    return datasets;
}

function validateRows(datasets) {
    for (const [table, definition] of Object.entries(TABLES)) {
        const seenIds = new Set();

        datasets[table].forEach((row, index) => {
            const rowNumber = index + 2;
            const id = row[definition.primaryKey];

            if (!id) {
                fail(table, rowNumber, `${definition.primaryKey} is required`);
            }

            if (seenIds.has(id)) {
                fail(table, rowNumber, `duplicate primary key ${definition.primaryKey}=${id}`);
            }
            seenIds.add(id);

            for (const [column, value] of Object.entries(row)) {
                if (!value) {
                    continue;
                }

                if (UUID_COLUMNS.has(column) && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
                    fail(table, rowNumber, `${column} is not a valid UUID: ${value}`);
                }

                if (ENUMS[column] && !ENUMS[column].has(value)) {
                    fail(table, rowNumber, `${column} has invalid enum value: ${value}`);
                }
            }

            if (table === "business_hours") {
                const day = Number(row.day_of_week);
                if (!Number.isInteger(day) || day < 0 || day > 6) {
                    fail(table, rowNumber, `day_of_week is outside 0..6: ${row.day_of_week}`);
                }
                if (row.is_working_day === "true" && (!row.start_time || !row.end_time || row.start_time >= row.end_time)) {
                    fail(table, rowNumber, "working day requires start_time < end_time");
                }
            }

            if (table === "feedback" && row.rating && (Number(row.rating) < 1 || Number(row.rating) > 5)) {
                fail(table, rowNumber, `rating is outside 1..5: ${row.rating}`);
            }

            if (table === "predictions" && row.confidence && (Number(row.confidence) < 0 || Number(row.confidence) > 1)) {
                fail(table, rowNumber, `confidence is outside 0..1: ${row.confidence}`);
            }
        });
    }

    const ids = Object.fromEntries(Object.entries(TABLES).map(([table, definition]) => [
        table,
        new Set(datasets[table].map((row) => row[definition.primaryKey]))
    ]));

    for (const [table, column, parent] of FK_RULES) {
        datasets[table].forEach((row, index) => {
            if (row[column] && !ids[parent].has(row[column])) {
                fail(table, index + 2, `${column} references missing ${parent} ID ${row[column]}`);
            }
        });
    }
}

function sqlValue(value, column) {
    if (value === "") {
        return null;
    }
    if (["is_working_day", "resolution_confirmed", "sla_risk_flag"].includes(column)) {
        return value === "true";
    }
    if (["day_of_week", "size", "rating"].includes(column)) {
        return Number(value);
    }
    if (column === "confidence") {
        return Number(value);
    }
    return value;
}

async function insertRows(client, table, rows) {
    const definition = TABLES[table];
    const columnSql = definition.columns.join(", ");
    const placeholders = definition.columns.map((_, index) => `$${index + 1}`).join(", ");

    console.log(`Starting table: ${table} (${rows.length} rows)`);

    for (const [index, row] of rows.entries()) {
        const rowNumber = index + 2;
        const values = definition.columns.map((column) => sqlValue(row[column], column));

        try {
            await client.query(
                `INSERT INTO ${table} (${columnSql}) VALUES (${placeholders})`,
                values
            );
        } catch (error) {
            fail(table, rowNumber, error.message);
        }
    }

    console.log(`Completed table: ${table}`);
}

async function insertSupportTeamsWithoutAuditUsers(client, rows) {
    const columns = TABLES.support_teams.columns;
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");

    console.log(`Starting table: support_teams (${rows.length} rows)`);

    for (const [index, row] of rows.entries()) {
        const rowNumber = index + 2;
        const values = columns.map((column) => sqlValue(row[column], column));
        values[4] = null;
        values[5] = null;

        try {
            await client.query(
                `INSERT INTO support_teams (${columns.join(", ")}) VALUES (${placeholders})`,
                values
            );
        } catch (error) {
            fail("support_teams", rowNumber, error.message);
        }
    }

    console.log("Completed table: support_teams");
}

async function restoreSupportTeamAuditUsers(client, rows) {
    console.log(`Starting table: support_teams audit fields (${rows.length} rows)`);

    for (const [index, row] of rows.entries()) {
        try {
            await client.query(
                `UPDATE support_teams SET created_by = $1, updated_by = $2 WHERE team_id = $3`,
                [sqlValue(row.created_by, "created_by"), sqlValue(row.updated_by, "updated_by"), row.team_id]
            );
        } catch (error) {
            fail("support_teams", index + 2, error.message);
        }
    }

    console.log("Completed table: support_teams audit fields");
}

async function validateDatabaseState(pool) {
    const counts = {};

    for (const table of Object.keys(TABLES)) {
        const result = await pool.query(`SELECT COUNT(*)::int AS count FROM ${table}`);
        counts[table] = result.rows[0].count;
    }

    console.log("Current database row counts:");
    console.table(counts);
    console.log("No write operation was executed.");
}

async function handleSigint() {
    if (shutdownInProgress) {
        return;
    }

    shutdownInProgress = true;
    console.error("SIGINT received. Starting graceful shutdown.");

    if (transactionActive && activeClient) {
        console.log("Starting ROLLBACK from SIGINT handler");
        try {
            await Promise.race([
                activeClient.query("ROLLBACK"),
                new Promise((_, reject) => {
                    const timer = setTimeout(
                        () => reject(new Error("ROLLBACK timed out during shutdown")),
                        DATABASE_TIMEOUT_MS
                    );
                    timer.unref();
                })
            ]);
            transactionActive = false;
            console.log("Completed ROLLBACK from SIGINT handler");
        } catch (error) {
            console.error(`ROLLBACK during shutdown failed: ${error.message}`);
        }
    }

    if (activeClient) {
        activeClient.release(true);
        activeClient = null;
    }

    if (activePool) {
        console.log("Starting pool.end() from SIGINT handler");
        await activePool.end();
        activePool = null;
        console.log("Completed pool.end() from SIGINT handler");
    }

    process.exitCode = 130;
    process.exit();
}

async function runImport(datasets) {
    if (process.env.CONFIRM_DATA_IMPORT !== EXPECTED_CONFIRMATION) {
        throw new Error(`Refusing import: set CONFIRM_DATA_IMPORT=${EXPECTED_CONFIRMATION} explicitly after review`);
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: DATABASE_TIMEOUT_MS,
        query_timeout: DATABASE_TIMEOUT_MS,
        statement_timeout: DATABASE_TIMEOUT_MS,
        idle_in_transaction_session_timeout: DATABASE_TIMEOUT_MS
    });
    activePool = pool;

    console.log("Starting pool.connect()");
    const client = await pool.connect();
    activeClient = client;
    console.log("Completed pool.connect()");

    try {
        console.log("Starting BEGIN");
        await client.query("BEGIN");
        transactionActive = true;
        console.log("Completed BEGIN");

        await insertSupportTeamsWithoutAuditUsers(client, datasets.support_teams);
        await insertRows(client, "users", datasets.users);
        await restoreSupportTeamAuditUsers(client, datasets.support_teams);

        for (const table of INSERT_ORDER.slice(2)) {
            await insertRows(client, table, datasets[table]);
        }

        console.log("Starting COMMIT");
        await client.query("COMMIT");
        transactionActive = false;
        console.log("Completed COMMIT");
        console.log("Import committed successfully.");
    } catch (error) {
        console.error(`Import failed: ${error.message}`);
        if (transactionActive) {
            console.log("Starting ROLLBACK");
            await client.query("ROLLBACK");
            transactionActive = false;
            console.log("Completed ROLLBACK");
        }
        console.error("Import rolled back.");
        throw error;
    } finally {
        activeClient = null;
        client.release();
        console.log("Starting pool.end()");
        await pool.end();
        activePool = null;
        console.log("Completed pool.end()");
    }
}

async function main() {
    const datasets = readDataset();
    validateRows(datasets);
    console.log("CSV validation passed for all 16 datasets.");

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await validateDatabaseState(pool);
    } finally {
        await pool.end();
    }

    if (process.argv.includes("--import")) {
        await runImport(datasets);
    } else {
        console.log("Dry run only. No INSERT, UPDATE, DELETE, or schema operation was executed.");
    }
}

main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});

process.once("SIGINT", handleSigint);

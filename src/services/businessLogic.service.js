const pool = require("../config/database");

const STATUS_TRANSITIONS = {
    New: {
        allowedNextStatuses: ["Triaged"],
        allowedRoles: ["Agent"]
    },

    Triaged: {
        allowedNextStatuses: [],
        allowedRoles: []
    },

    Assigned: {
        allowedNextStatuses: ["In_Progress"],
        allowedRoles: ["Technician"]
    },

    In_Progress: {
        allowedNextStatuses: [
            "Waiting",
            "Resolved"
        ],
        allowedRoles: ["Technician"]
    },

    Waiting: {
        allowedNextStatuses: ["In_Progress"],
        allowedRoles: ["Technician"]
    },

    Resolved: {
        allowedNextStatuses: [],
        allowedRoles: []
    },

    Reopened: {
        allowedNextStatuses: ["Triaged"],
        allowedRoles: ["Agent"]
    },

    Closed: {
        allowedNextStatuses: [],
        allowedRoles: []
    }
};


const ALLOWED_PRIORITIES = [
    "Low",
    "Medium",
    "High",
    "Critical"
];


const COMMENT_VISIBILITIES = [
    "Reporter_Visible",
    "Internal"
];


const ATTACHMENT_VISIBILITIES = [
    "Reporter_Visible",
    "Internal"
];


function appError(message, statusCode = 400) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}


async function getActor(db, actorId) {
    const result = await db.query(
        `SELECT
            user_id,
            full_name,
            role,
            team_id
         FROM users
         WHERE user_id = $1`,
        [actorId]
    );

    if (result.rows.length === 0) {
        throw appError("User not found", 400);
    }

    return result.rows[0];
}


async function getCurrentStatus(db, ticketId) {
    const result = await db.query(
        `SELECT
            to_status
         FROM ticket_status_history
         WHERE ticket_id = $1
         ORDER BY changed_date DESC, id DESC
         LIMIT 1`,
        [ticketId]
    );

    if (result.rows.length === 0) {
        throw appError(
            "Ticket has no status history",
            400
        );
    }

    return result.rows[0].to_status;
}


async function ensureAssignedTechnician(
    db,
    ticketId,
    actorId
) {
    const result = await db.query(
        `SELECT
            assigned_to,
            team_id
         FROM assignments
         WHERE ticket_id = $1
           AND unassigned_at IS NULL
         ORDER BY assigned_at DESC
         LIMIT 1`,
        [ticketId]
    );

    if (result.rows.length === 0) {
        throw appError(
            "Ticket has no active technician assignment",
            400
        );
    }

    if (
        result.rows[0].assigned_to !== actorId
    ) {
        throw appError(
            "Only the assigned technician can perform this action",
            403
        );
    }

    return result.rows[0];
}


function validateStatusTransition(
    currentStatus,
    newStatus,
    actorRole
) {
    if (!STATUS_TRANSITIONS[currentStatus]) {
        return {
            valid: false,
            error: "Invalid current ticket status"
        };
    }

    if (currentStatus === newStatus) {
        return {
            valid: false,
            error:
                "Ticket is already in this status"
        };
    }

    const transition =
        STATUS_TRANSITIONS[currentStatus];

    if (
        !transition.allowedNextStatuses.includes(
            newStatus
        )
    ) {
        return {
            valid: false,
            error:
                `Transition from ${currentStatus} to ${newStatus} is not allowed`
        };
    }

    if (
        !transition.allowedRoles.includes(
            actorRole
        )
    ) {
        return {
            valid: false,
            error:
                `Role ${actorRole} is not allowed to change ticket from ${currentStatus} to ${newStatus}`
        };
    }

    return {
        valid: true
    };
}


/*
|--------------------------------------------------------------------------
| Ticket Status Workflow
|--------------------------------------------------------------------------
*/

async function changeTicketStatus({
    ticketId,
    actorId,
    newStatus,
    reason
}) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const ticketResult = await client.query(
            `SELECT
                ticket_id,
                reporter_id,
                first_response_time,
                resolve_time
            FROM tickets
            WHERE ticket_id = $1
            FOR UPDATE`,
            [ticketId]
        );

        if (ticketResult.rows.length === 0) {
            throw appError(
                "Ticket not found",
                404
            );
        }

        const ticket =
            ticketResult.rows[0];

        const currentStatus =
            await getCurrentStatus(
                client,
                ticketId
            );

        const actor =
            await getActor(
                client,
                actorId
            );

        const validation =
            validateStatusTransition(
                currentStatus,
                newStatus,
                actor.role
            );

        if (!validation.valid) {
            throw appError(
                validation.error,
                400
            );
        }

        if (
            actor.role === "Technician"
        ) {
            await ensureAssignedTechnician(
                client,
                ticketId,
                actorId
            );

            if (
                newStatus === "Waiting" ||
                newStatus === "Resolved"
            ) {
                if (
                    !reason ||
                    !reason.trim()
                ) {
                    throw appError(
                        "Reason is required for this status change"
                    );
                }
            }
        }

        if (
            newStatus === "Assigned"
        ) {
            throw appError(
                "Use the assignment endpoint to assign a ticket"
            );
        }

        if (
            newStatus === "Reopened" ||
            newStatus === "Closed"
        ) {
            throw appError(
                "Use the feedback endpoint for Reopen or Close"
            );
        }

        let updateResult;

        if (
            newStatus === "In_Progress" &&
            !ticket.first_response_time
        ) {
            updateResult =
                await client.query(
                    `UPDATE tickets
                     SET
                         first_response_time =
                             CURRENT_TIMESTAMP,
                         updated_at =
                             CURRENT_TIMESTAMP,
                         updated_by = $1
                     WHERE ticket_id = $2
                     RETURNING *`,
                    [
                        actorId,
                        ticketId
                    ]
                );

        } else if (
            newStatus === "Resolved"
        ) {
            updateResult =
                await client.query(
                    `UPDATE tickets
                     SET
                         resolve_time =
                             CURRENT_TIMESTAMP,
                         updated_at =
                             CURRENT_TIMESTAMP,
                         updated_by = $1
                     WHERE ticket_id = $2
                     RETURNING *`,
                    [
                        actorId,
                        ticketId
                    ]
                );

            await client.query(
                `UPDATE assignments
                 SET unassigned_at =
                     CURRENT_TIMESTAMP
                 WHERE ticket_id = $1
                   AND unassigned_at IS NULL`,
                [ticketId]
            );

        } else {
            updateResult =
                await client.query(
                    `UPDATE tickets
                     SET
                         updated_at =
                             CURRENT_TIMESTAMP,
                         updated_by = $1
                     WHERE ticket_id = $2
                     RETURNING *`,
                    [
                        actorId,
                        ticketId
                    ]
                );
        }

        await client.query(
            `INSERT INTO ticket_status_history
            (
                id,
                ticket_id,
                from_status,
                to_status,
                changed_date,
                changed_by,
                reason
            )
            VALUES
            (
                gen_random_uuid(),
                $1,
                $2,
                $3,
                CURRENT_TIMESTAMP,
                $4,
                $5
            )`,
            [
                ticketId,
                currentStatus,
                newStatus,
                actorId,
                reason || null
            ]
        );

        await client.query("COMMIT");

        return {
            ticket:
                updateResult.rows[0],
            previous_status:
                currentStatus,
            new_status:
                newStatus
        };

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
}


/*
|--------------------------------------------------------------------------
| Assignment
|--------------------------------------------------------------------------
*/

async function assignTicket({
    ticketId,
    assignedTo,
    assignedBy,
    reason
}) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const ticketResult =
            await client.query(
                `SELECT ticket_id
                 FROM tickets
                 WHERE ticket_id = $1
                 FOR UPDATE`,
                [ticketId]
            );

        if (ticketResult.rows.length === 0) {
            throw appError(
                "Ticket not found",
                404
            );
        }

        const currentStatus =
            await getCurrentStatus(
                client,
                ticketId
            );

        if (currentStatus !== "Triaged") {
            throw appError(
                `Ticket cannot be assigned from status ${currentStatus}`
            );
        }

        const assigner =
            await getActor(
                client,
                assignedBy
            );

        if (assigner.role !== "Agent") {
            throw appError(
                "Only an Agent can assign a ticket",
                403
            );
        }

        const technician =
            await getActor(
                client,
                assignedTo
            );

        if (
            technician.role !== "Technician"
        ) {
            throw appError(
                "Ticket can only be assigned to a Technician"
            );
        }

        if (!technician.team_id) {
            throw appError(
                "Technician is not assigned to a support team"
            );
        }

        const activeAssignment =
            await client.query(
                `SELECT id
                 FROM assignments
                 WHERE ticket_id = $1
                   AND unassigned_at IS NULL
                 LIMIT 1`,
                [ticketId]
            );

        if (
            activeAssignment.rows.length > 0
        ) {
            throw appError(
                "Ticket already has an active assignment"
            );
        }

        const assignmentResult =
            await client.query(
                `INSERT INTO assignments
                (
                    id,
                    ticket_id,
                    assigned_to,
                    team_id,
                    assigned_by,
                    assigned_at,
                    created_at
                )
                VALUES
                (
                    gen_random_uuid(),
                    $1,
                    $2,
                    $3,
                    $4,
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP
                )
                RETURNING *`,
                [
                    ticketId,
                    assignedTo,
                    technician.team_id,
                    assignedBy
                ]
            );

        await client.query(
            `UPDATE tickets
             SET
                 updated_at =
                     CURRENT_TIMESTAMP,
                 updated_by = $1
             WHERE ticket_id = $2`,
            [
                assignedBy,
                ticketId
            ]
        );

        await client.query(
            `INSERT INTO ticket_status_history
            (
                id,
                ticket_id,
                from_status,
                to_status,
                changed_date,
                changed_by,
                reason
            )
            VALUES
            (
                gen_random_uuid(),
                $1,
                $2,
                'Assigned',
                CURRENT_TIMESTAMP,
                $3,
                $4
            )`,
            [
                ticketId,
                currentStatus,
                assignedBy,
                reason ||
                    "Ticket assigned"
            ]
        );

        await client.query("COMMIT");

        return {
            assignment:
                assignmentResult.rows[0],
            previous_status:
                currentStatus,
            new_status:
                "Assigned"
        };

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
}


/*
|--------------------------------------------------------------------------
| Work Logs
|--------------------------------------------------------------------------
*/

async function addWorkLog({
    ticketId,
    actorId,
    action,
    workTime,
    parts,
    resolutionCode
}) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const ticketResult =
            await client.query(
                `SELECT ticket_id
                 FROM tickets
                 WHERE ticket_id = $1
                 FOR UPDATE`,
                [ticketId]
            );

        if (
            ticketResult.rows.length === 0
        ) {
            throw appError(
                "Ticket not found",
                404
            );
        }

        const currentStatus =
            await getCurrentStatus(
                client,
                ticketId
            );

        if (
            currentStatus !== "In_Progress"
        ) {
            throw appError(
                "Work logs can only be added while the ticket is In_Progress"
            );
        }

        const actor =
            await getActor(
                client,
                actorId
            );

        if (actor.role !== "Technician") {
            throw appError(
                "Only a Technician can add work logs",
                403
            );
        }

        await ensureAssignedTechnician(
            client,
            ticketId,
            actorId
        );

        if (
            !action ||
            !action.trim()
        ) {
            throw appError(
                "action is required"
            );
        }

        if (
            !workTime ||
            !String(workTime).trim()
        ) {
            throw appError(
                "work_time is required"
            );
        }

        const result =
            await client.query(
                `INSERT INTO work_logs
                (
                    id,
                    ticket_id,
                    user_id,
                    action,
                    work_time,
                    parts,
                    resolution_code,
                    created_at,
                    updated_at
                )
                VALUES
                (
                    gen_random_uuid(),
                    $1,
                    $2,
                    $3,
                    $4::interval,
                    $5,
                    $6,
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP
                )
                RETURNING *`,
                [
                    ticketId,
                    actorId,
                    action,
                    workTime,
                    parts || null,
                    resolutionCode || null
                ]
            );

        await client.query("COMMIT");

        return result.rows[0];

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
}


async function getWorkLogs(ticketId) {
    const result =
        await pool.query(
            `SELECT
                wl.*,
                u.full_name
             FROM work_logs wl
             JOIN users u
               ON u.user_id =
                  wl.user_id
             WHERE wl.ticket_id = $1
             ORDER BY wl.created_at`,
            [ticketId]
        );

    return result.rows;
}


/*
|--------------------------------------------------------------------------
| Comments
|--------------------------------------------------------------------------
*/

async function addComment({
    ticketId,
    actorId,
    body,
    visibility
}) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const ticketResult =
            await client.query(
                `SELECT reporter_id
                 FROM tickets
                 WHERE ticket_id = $1
                 FOR UPDATE`,
                [ticketId]
            );

        if (
            ticketResult.rows.length === 0
        ) {
            throw appError(
                "Ticket not found",
                404
            );
        }

        const ticket =
            ticketResult.rows[0];

        const actor =
            await getActor(
                client,
                actorId
            );

        const finalVisibility =
            visibility ||
            "Reporter_Visible";

        if (
            !COMMENT_VISIBILITIES.includes(
                finalVisibility
            )
        ) {
            throw appError(
                "Invalid comment visibility"
            );
        }

        if (
            !body ||
            !body.trim()
        ) {
            throw appError(
                "Comment body is required"
            );
        }

        if (actor.role === "Reporter") {
            if (
                ticket.reporter_id !==
                actor.user_id
            ) {
                throw appError(
                    "Reporter can only comment on their own ticket",
                    403
                );
            }

            if (
                finalVisibility !==
                "Reporter_Visible"
            ) {
                throw appError(
                    "Reporter cannot create internal comments",
                    403
                );
            }
        }

        if (
            actor.role === "Technician"
        ) {
            await ensureAssignedTechnician(
                client,
                ticketId,
                actorId
            );
        }

        if (
            actor.role === "Auditor"
        ) {
            throw appError(
                "Auditor is read-only",
                403
            );
        }

        const result =
            await client.query(
                `INSERT INTO comments
                (
                    id,
                    ticket_id,
                    author_id,
                    body,
                    visibility,
                    created_at,
                    updated_at,
                    updated_by
                )
                VALUES
                (
                    gen_random_uuid(),
                    $1,
                    $2,
                    $3,
                    $4,
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP,
                    $2
                )
                RETURNING *`,
                [
                    ticketId,
                    actorId,
                    body,
                    finalVisibility
                ]
            );

        await client.query(
            `UPDATE tickets
             SET
                 updated_at =
                     CURRENT_TIMESTAMP,
                 updated_by = $1
             WHERE ticket_id = $2`,
            [
                actorId,
                ticketId
            ]
        );

        await client.query("COMMIT");

        return result.rows[0];

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
}


async function getComments({
    ticketId,
    actorId
}) {
    const actor =
        await getActor(
            pool,
            actorId
        );

    const ticketResult =
        await pool.query(
            `SELECT reporter_id
             FROM tickets
             WHERE ticket_id = $1`,
            [ticketId]
        );

    if (
        ticketResult.rows.length === 0
    ) {
        throw appError(
            "Ticket not found",
            404
        );
    }

    const ticket =
        ticketResult.rows[0];

    if (
        actor.role === "Reporter" &&
        ticket.reporter_id !==
            actor.user_id
    ) {
        throw appError(
            "Reporter can only access their own ticket",
            403
        );
    }

    if (
        actor.role === "Technician"
    ) {
        await ensureAssignedTechnician(
            pool,
            ticketId,
            actorId
        );
    }

    if (
        actor.role === "Reporter"
    ) {
        const result =
            await pool.query(
                `SELECT
                    c.*,
                    u.full_name
                 FROM comments c
                 JOIN users u
                   ON u.user_id =
                      c.author_id
                 WHERE c.ticket_id = $1
                   AND c.visibility =
                       'Reporter_Visible'
                 ORDER BY c.created_at`,
                [ticketId]
            );

        return result.rows;
    }

    const result =
        await pool.query(
            `SELECT
                c.*,
                u.full_name
             FROM comments c
             JOIN users u
               ON u.user_id =
                  c.author_id
             WHERE c.ticket_id = $1
             ORDER BY c.created_at`,
            [ticketId]
        );

    return result.rows;
}


/*
|--------------------------------------------------------------------------
| Attachments
|--------------------------------------------------------------------------
*/

async function addAttachment({
    ticketId,
    actorId,
    fileName,
    fileReference,
    size,
    visibility
}) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const ticketResult =
            await client.query(
                `SELECT reporter_id
                 FROM tickets
                 WHERE ticket_id = $1
                 FOR UPDATE`,
                [ticketId]
            );

        if (
            ticketResult.rows.length === 0
        ) {
            throw appError(
                "Ticket not found",
                404
            );
        }

        const ticket =
            ticketResult.rows[0];

        const actor =
            await getActor(
                client,
                actorId
            );

        const finalVisibility =
            visibility ||
            "Reporter_Visible";

        if (
            !ATTACHMENT_VISIBILITIES.includes(
                finalVisibility
            )
        ) {
            throw appError(
                "Invalid attachment visibility"
            );
        }

        if (
            !fileName ||
            !fileName.trim()
        ) {
            throw appError(
                "file_name is required"
            );
        }

        if (
            !fileReference ||
            !fileReference.trim()
        ) {
            throw appError(
                "file_reference is required"
            );
        }

        if (
            Number.isNaN(Number(size)) ||
            Number(size) < 0
        ) {
            throw appError(
                "size must be a valid non-negative number"
            );
        }

        if (
            actor.role === "Reporter"
        ) {
            if (
                ticket.reporter_id !==
                actor.user_id
            ) {
                throw appError(
                    "Reporter can only add attachments to their own ticket",
                    403
                );
            }

            if (
                finalVisibility !==
                "Reporter_Visible"
            ) {
                throw appError(
                    "Reporter cannot create internal attachments",
                    403
                );
            }
        }

        if (
            actor.role === "Technician"
        ) {
            await ensureAssignedTechnician(
                client,
                ticketId,
                actorId
            );
        }

        if (
            actor.role === "Auditor"
        ) {
            throw appError(
                "Auditor is read-only",
                403
            );
        }

        const result =
            await client.query(
                `INSERT INTO attachments
                (
                    id,
                    ticket_id,
                    uploaded_by,
                    file_name,
                    file_reference,
                    size,
                    visibility,
                    created_at
                )
                VALUES
                (
                    gen_random_uuid(),
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    CURRENT_TIMESTAMP
                )
                RETURNING *`,
                [
                    ticketId,
                    actorId,
                    fileName,
                    fileReference,
                    Number(size),
                    finalVisibility
                ]
            );

        await client.query("COMMIT");

        return result.rows[0];

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
}


async function getAttachments({
    ticketId,
    actorId
}) {
    const actor =
        await getActor(
            pool,
            actorId
        );

    const ticketResult =
        await pool.query(
            `SELECT reporter_id
             FROM tickets
             WHERE ticket_id = $1`,
            [ticketId]
        );

    if (
        ticketResult.rows.length === 0
    ) {
        throw appError(
            "Ticket not found",
            404
        );
    }

    const ticket =
        ticketResult.rows[0];

    if (
        actor.role === "Reporter" &&
        ticket.reporter_id !==
            actor.user_id
    ) {
        throw appError(
            "Reporter can only access their own ticket",
            403
        );
    }

    if (
        actor.role === "Technician"
    ) {
        await ensureAssignedTechnician(
            pool,
            ticketId,
            actorId
        );
    }

    if (
        actor.role === "Reporter"
    ) {
        const result =
            await pool.query(
                `SELECT
                    a.*,
                    u.full_name
                 FROM attachments a
                 JOIN users u
                   ON u.user_id =
                      a.uploaded_by
                 WHERE a.ticket_id = $1
                   AND a.visibility =
                       'Reporter_Visible'
                 ORDER BY a.created_at`,
                [ticketId]
            );

        return result.rows;
    }

    const result =
        await pool.query(
            `SELECT
                a.*,
                u.full_name
             FROM attachments a
             JOIN users u
               ON u.user_id =
                  a.uploaded_by
             WHERE a.ticket_id = $1
             ORDER BY a.created_at`,
            [ticketId]
        );

    return result.rows;
}


/*
|--------------------------------------------------------------------------
| Escalation
|--------------------------------------------------------------------------
*/

async function escalateTicket({
    ticketId,
    actorId,
    escalatedTo,
    reason
}) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const ticketResult =
            await client.query(
                `SELECT ticket_id
                 FROM tickets
                 WHERE ticket_id = $1
                 FOR UPDATE`,
                [ticketId]
            );

        if (
            ticketResult.rows.length === 0
        ) {
            throw appError(
                "Ticket not found",
                404
            );
        }

        if (
            !reason ||
            !reason.trim()
        ) {
            throw appError(
                "reason is required for escalation"
            );
        }

        const actor =
            await getActor(
                client,
                actorId
            );

        if (
            actor.role !== "Agent" &&
            actor.role !==
                "Technician" &&
            actor.role !==
                "Service_Manager"
        ) {
            throw appError(
                "You are not allowed to escalate tickets",
                403
            );
        }

        if (
            actor.role === "Technician"
        ) {
            await ensureAssignedTechnician(
                client,
                ticketId,
                actorId
            );
        }

        const target =
            await getActor(
                client,
                escalatedTo
            );

        if (
            target.role !==
            "Service_Manager"
        ) {
            throw appError(
                "escalated_to must be a Service_Manager"
            );
        }

        const result =
            await client.query(
                `INSERT INTO escalation
                (
                    id,
                    ticket_id,
                    escalated_at,
                    escalated_by,
                    escalated_to,
                    reason,
                    created_at
                )
                VALUES
                (
                    gen_random_uuid(),
                    $1,
                    CURRENT_TIMESTAMP,
                    $2,
                    $3,
                    $4,
                    CURRENT_TIMESTAMP
                )
                RETURNING *`,
                [
                    ticketId,
                    actorId,
                    escalatedTo,
                    reason
                ]
            );

        await client.query(
            `UPDATE tickets
             SET
                 updated_at =
                     CURRENT_TIMESTAMP,
                 updated_by = $1
             WHERE ticket_id = $2`,
            [
                actorId,
                ticketId
            ]
        );

        await client.query("COMMIT");

        return result.rows[0];

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
}


/*
|--------------------------------------------------------------------------
| Feedback / Close / Reopen
|--------------------------------------------------------------------------
*/

async function submitFeedback({
    ticketId,
    reporterId,
    resolutionConfirmed,
    rating,
    reopenReason
}) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const ticketResult =
            await client.query(
                `SELECT
                    ticket_id,
                    reporter_id
                 FROM tickets
                 WHERE ticket_id = $1
                 FOR UPDATE`,
                [ticketId]
            );

        if (
            ticketResult.rows.length === 0
        ) {
            throw appError(
                "Ticket not found",
                404
            );
        }

        const ticket =
            ticketResult.rows[0];

        if (
            ticket.reporter_id !==
            reporterId
        ) {
            throw appError(
                "Only the ticket reporter can submit feedback",
                403
            );
        }

        const currentStatus =
            await getCurrentStatus(
                client,
                ticketId
            );

        if (
            currentStatus !==
            "Resolved"
        ) {
            throw appError(
                "Feedback can only be submitted for a Resolved ticket"
            );
        }

        if (
            typeof resolutionConfirmed !==
            "boolean"
        ) {
            throw appError(
                "resolution_confirmed must be true or false"
            );
        }

        const numericRating =
            Number(rating);

        if (
            Number.isNaN(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            throw appError(
                "rating must be between 1 and 5"
            );
        }

        if (
            !resolutionConfirmed &&
            (
                !reopenReason ||
                !reopenReason.trim()
            )
        ) {
            throw appError(
                "reopen_reason is required when resolution is not confirmed"
            );
        }

        const feedbackResult =
            await client.query(
                `INSERT INTO feedback
                (
                    id,
                    ticket_id,
                    reporter_id,
                    resolution_confirmed,
                    rating,
                    reopen_reason,
                    created_at,
                    updated_at
                )
                VALUES
                (
                    gen_random_uuid(),
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP
                )
                RETURNING *`,
                [
                    ticketId,
                    reporterId,
                    resolutionConfirmed,
                    numericRating,
                    reopenReason || null
                ]
            );

        const nextStatus =
            resolutionConfirmed
                ? "Closed"
                : "Reopened";

        const reason =
            resolutionConfirmed
                ? "Resolution confirmed by reporter"
                : reopenReason;

        await client.query(
            `UPDATE tickets
             SET
                 updated_at =
                     CURRENT_TIMESTAMP,
                 updated_by = $1
             WHERE ticket_id = $2`,
            [
                reporterId,
                ticketId
            ]
        );

        await client.query(
            `INSERT INTO ticket_status_history
            (
                id,
                ticket_id,
                from_status,
                to_status,
                changed_date,
                changed_by,
                reason
            )
            VALUES
            (
                gen_random_uuid(),
                $1,
                $2,
                $3,
                CURRENT_TIMESTAMP,
                $4,
                $5
            )`,
            [
                ticketId,
                currentStatus,
                nextStatus,
                reporterId,
                reason
            ]
        );

        if (
            nextStatus === "Reopened"
        ) {
            await client.query(
                `UPDATE assignments
                 SET
                     unassigned_at =
                         CURRENT_TIMESTAMP
                 WHERE ticket_id = $1
                   AND unassigned_at IS NULL`,
                [ticketId]
            );
        }

        await client.query("COMMIT");

        return {
            feedback:
                feedbackResult.rows[0],
            previous_status:
                currentStatus,
            new_status:
                nextStatus
        };

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
}


/*
|--------------------------------------------------------------------------
| Priority
|--------------------------------------------------------------------------
*/

async function updatePriority({
    ticketId,
    actorId,
    priority
}) {
    if (
        !ALLOWED_PRIORITIES.includes(
            priority
        )
    ) {
        throw appError(
            "Invalid priority"
        );
    }

    const client = await pool.connect();

    try {
        const actor =
            await getActor(
                client,
                actorId
            );

        if (
            actor.role !== "Agent" &&
            actor.role !==
                "Service_Manager"
        ) {
            throw appError(
                "Only Agent or Service_Manager can update priority",
                403
            );
        }

        const result =
            await client.query(
                `UPDATE tickets
                 SET
                     priority = $1,
                     updated_at =
                         CURRENT_TIMESTAMP,
                     updated_by = $2
                 WHERE ticket_id = $3
                 RETURNING *`,
                [
                    priority,
                    actorId,
                    ticketId
                ]
            );

        if (
            result.rows.length === 0
        ) {
            throw appError(
                "Ticket not found",
                404
            );
        }

        return result.rows[0];

    } finally {
        client.release();
    }
}


/*
|--------------------------------------------------------------------------
| SLA - MVP
|--------------------------------------------------------------------------
*/

async function getSla(ticketId) {
    const result =
        await pool.query(
            `SELECT
                t.ticket_id,
                t.created_at,
                t.first_response_time,
                t.resolve_time,

                a.team_id AS active_team_id,

                s.sla_profile_id,
                s.name AS sla_name,
                s.target_response_time,
                s.target_resolution_time,

                t.created_at +
                    s.target_response_time
                    AS response_due_at,

                t.created_at +
                    s.target_resolution_time
                    AS resolution_due_at,

                bh.name AS business_hours_name

             FROM tickets t

             LEFT JOIN LATERAL
             (
                SELECT
                    team_id
                FROM assignments
                WHERE ticket_id =
                    t.ticket_id
                  AND unassigned_at IS NULL
                ORDER BY assigned_at DESC
                LIMIT 1
             ) a ON TRUE

             LEFT JOIN LATERAL
             (
                SELECT
                    s.*
                FROM sla_profiles s
                WHERE
                    s.category_id =
                        t.category_id
                    AND
                    (
                        s.team_id =
                            a.team_id
                        OR
                        s.team_id IS NULL
                    )
                ORDER BY
                    CASE
                        WHEN
                            s.team_id =
                            a.team_id
                        THEN 0
                        ELSE 1
                    END,
                    s.created_at ASC
                LIMIT 1
             ) s ON TRUE

             LEFT JOIN business_hours bh
               ON bh.id =
                  s.business_hours_id

             WHERE t.ticket_id = $1`,
            [ticketId]
        );

    if (
        result.rows.length === 0
    ) {
        throw appError(
            "Ticket not found",
            404
        );
    }

    const data =
        result.rows[0];

    if (
        !data.sla_profile_id
    ) {
        return {
            ticket_id:
                ticketId,
            status:
                "No_SLA",
            message:
                "No matching SLA profile found"
        };
    }

    function evaluateSla(
        dueAt,
        completedAt
    ) {
        if (completedAt) {
            return {
                status:
                    "Completed",
                due_at:
                    dueAt
            };
        }

        if (!dueAt) {
            return {
                status:
                    "No_Target",
                due_at:
                    null
            };
        }

        const now =
            Date.now();

        const due =
            new Date(
                dueAt
            ).getTime();

        const created =
            new Date(
                data.created_at
            ).getTime();

        const total =
            due - created;

        const remaining =
            due - now;

        if (remaining <= 0) {
            return {
                status:
                    "Breached",
                due_at:
                    dueAt
            };
        }

        if (
            total > 0 &&
            remaining <=
                total * 0.20
        ) {
            return {
                status:
                    "At_Risk",
                due_at:
                    dueAt
            };
        }

        return {
            status:
                "On_Track",
            due_at:
                dueAt
        };
    }

    return {
        ticket_id:
            data.ticket_id,

        sla_profile_id:
            data.sla_profile_id,

        sla_name:
            data.sla_name,

        business_hours_name:
            data.business_hours_name,

        response:
            evaluateSla(
                data.response_due_at,
                data.first_response_time
            ),

        resolution:
            evaluateSla(
                data.resolution_due_at,
                data.resolve_time
            ),

        business_hours_applied:
            false,

        note:
            "MVP SLA uses configured target intervals as calendar time."
    };
}


/*
|--------------------------------------------------------------------------
| Predictions
|--------------------------------------------------------------------------
*/

async function createPrediction({
    ticketId,
    suggestedCategoryId,
    suggestedPriority,
    duplicateCandidateTicketId,
    slaRiskFlag,
    confidence,
    explanation,
    modelVersion
}) {
    if (
        suggestedPriority &&
        !ALLOWED_PRIORITIES.includes(
            suggestedPriority
        )
    ) {
        throw appError(
            "Invalid suggested priority"
        );
    }

    if (
        confidence !== undefined &&
        (
            Number(confidence) < 0 ||
            Number(confidence) > 1
        )
    ) {
        throw appError(
            "confidence must be between 0 and 1"
        );
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const ticketResult =
            await client.query(
                `SELECT ticket_id
                 FROM tickets
                 WHERE ticket_id = $1`,
                [ticketId]
            );

        if (
            ticketResult.rows.length === 0
        ) {
            throw appError(
                "Ticket not found",
                404
            );
        }

        if (suggestedCategoryId) {
            const categoryResult =
                await client.query(
                    `SELECT category_id
                     FROM categories
                     WHERE category_id = $1`,
                    [suggestedCategoryId]
                );

            if (
                categoryResult.rows.length === 0
            ) {
                throw appError(
                    "Suggested category not found"
                );
            }
        }

        if (
            duplicateCandidateTicketId
        ) {
            const duplicateResult =
                await client.query(
                    `SELECT ticket_id
                     FROM tickets
                     WHERE ticket_id = $1`,
                    [
                        duplicateCandidateTicketId
                    ]
                );

            if (
                duplicateResult.rows.length === 0
            ) {
                throw appError(
                    "Duplicate candidate ticket not found"
                );
            }

            if (
                duplicateCandidateTicketId ===
                ticketId
            ) {
                throw appError(
                    "Ticket cannot be its own duplicate candidate"
                );
            }
        }

        const result =
            await client.query(
                `INSERT INTO predictions
                (
                    id,
                    ticket_id,
                    suggested_category_id,
                    suggested_priority,
                    duplicate_candidate_ticket_id,
                    sla_risk_flag,
                    confidence,
                    explanation,
                    model_version,
                    decision,
                    created_at
                )
                VALUES
                (
                    gen_random_uuid(),
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    'Pending',
                    CURRENT_TIMESTAMP
                )
                RETURNING *`,
                [
                    ticketId,
                    suggestedCategoryId ||
                        null,
                    suggestedPriority ||
                        null,
                    duplicateCandidateTicketId ||
                        null,
                    slaRiskFlag ?? false,
                    confidence ??
                        null,
                    explanation ||
                        null,
                    modelVersion ||
                        null
                ]
            );

        await client.query("COMMIT");

        return result.rows[0];

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
}


async function decidePrediction({
    predictionId,
    actorId,
    decision,
    overrideCategoryId,
    overridePriority
}) {
    if (
        decision !== "Accepted" &&
        decision !== "Overridden"
    ) {
        throw appError(
            "decision must be Accepted or Overridden"
        );
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const actor =
            await getActor(
                client,
                actorId
            );

        if (
            actor.role !== "Agent" &&
            actor.role !==
                "Service_Manager"
        ) {
            throw appError(
                "Only Agent or Service_Manager can decide a prediction",
                403
            );
        }

        const predictionResult =
            await client.query(
                `SELECT *
                 FROM predictions
                 WHERE id = $1
                 FOR UPDATE`,
                [predictionId]
            );

        if (
            predictionResult.rows.length === 0
        ) {
            throw appError(
                "Prediction not found",
                404
            );
        }

        const prediction =
            predictionResult.rows[0];

        let finalCategory =
            prediction.suggested_category_id;

        let finalPriority =
            prediction.suggested_priority;

        if (
            decision === "Overridden"
        ) {
            if (
                !overrideCategoryId &&
                !overridePriority
            ) {
                throw appError(
                    "Override must contain category_id or priority"
                );
            }

            finalCategory =
                overrideCategoryId ||
                null;

            finalPriority =
                overridePriority ||
                null;
        }

        if (
            finalPriority &&
            !ALLOWED_PRIORITIES.includes(
                finalPriority
            )
        ) {
            throw appError(
                "Invalid priority"
            );
        }

        if (finalCategory) {
            const categoryResult =
                await client.query(
                    `SELECT category_id
                     FROM categories
                     WHERE category_id = $1`,
                    [finalCategory]
                );

            if (
                categoryResult.rows.length === 0
            ) {
                throw appError(
                    "Prediction category not found"
                );
            }
        }

        const result =
            await client.query(
                `UPDATE predictions
                 SET
                     decision = $1,
                     decided_by = $2,
                     decided_at =
                         CURRENT_TIMESTAMP
                 WHERE id = $3
                 RETURNING *`,
                [
                    decision,
                    actorId,
                    predictionId
                ]
            );

        if (
            finalCategory ||
            finalPriority
        ) {
            await client.query(
                `UPDATE tickets
                 SET
                     category_id =
                         COALESCE(
                             $1,
                             category_id
                         ),
                     priority =
                         COALESCE(
                             $2,
                             priority
                         ),
                     updated_at =
                         CURRENT_TIMESTAMP,
                     updated_by = $3
                 WHERE ticket_id = $4`,
                [
                    finalCategory,
                    finalPriority,
                    actorId,
                    prediction.ticket_id
                ]
            );
        }

        await client.query("COMMIT");

        return {
            prediction:
                result.rows[0]
        };

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
}


module.exports = {
    STATUS_TRANSITIONS,
    validateStatusTransition,
    changeTicketStatus,
    assignTicket,
    addWorkLog,
    getWorkLogs,
    addComment,
    getComments,
    addAttachment,
    getAttachments,
    escalateTicket,
    submitFeedback,
    updatePriority,
    getSla,
    createPrediction,
    decidePrediction
};
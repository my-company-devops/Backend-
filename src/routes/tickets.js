const express = require("express");
const pool = require("../config/database");

const {
    validateCreateTicket,
    validateUpdateTicket,
    validateStatusChange,
    validateAssignment,
    validateWorkLog,
    validateComment,
    validateAttachment,
    validateEscalation,
    validateFeedback,
    validatePriority,
    validatePredictionDecision
} = require("../middleware/validation");

const {
    changeTicketStatus
} = require("../services/ticketWorkflow.service");

const {
    assignTicket
} = require("../services/assignment.service");

const {
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
} = require("../services/businessLogic.service");

const router = express.Router();

console.log("TICKETS ROUTER LOADED");
console.log("GET BY ID ROUTE LOADED");


function sendError(res, error, fallbackMessage) {
    console.error(error.message);

    res.status(error.statusCode || 500).json({
        error:
            error.message ||
            fallbackMessage
    });
}


/*
|--------------------------------------------------------------------------
| Test
|--------------------------------------------------------------------------
*/

router.get("/test", (req, res) => {
    res.json({
        message:
            "Tickets router is working"
    });
});


/*
|--------------------------------------------------------------------------
| Get All Tickets
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
    try {
        const result =
            await pool.query(
                `SELECT *
                FROM tickets
                ORDER BY created_at DESC`
            );

        res.json(result.rows);

    } catch (error) {
        sendError(
            res,
            error,
            "Failed to fetch tickets"
        );
    }
});


/*
|--------------------------------------------------------------------------
| Create Ticket
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    validateCreateTicket,
    async (req, res) => {
        const client =
            await pool.connect();

        try {
            await client.query("BEGIN");

            const {
                title,
                description,
                reporter_id,
                asset_id,
                category_id,
                location_id,
                urgency
            } = req.body;

            const reporterResult =
                await client.query(
                    `SELECT
                        user_id,
                        role
                    FROM users
                     WHERE user_id = $1`,
                    [reporter_id]
                );

            if (
                reporterResult.rows.length === 0
            ) {
                const error =
                    new Error(
                        "Reporter not found"
                    );

                error.statusCode = 400;
                throw error;
            }

            if (
                reporterResult.rows[0].role !==
                "Reporter"
            ) {
                const error =
                    new Error(
                        "Ticket reporter must have Reporter role"
                    );

                error.statusCode = 400;
                throw error;
            }

            const categoryResult =
                await client.query(
                    `SELECT category_id
                     FROM categories
                     WHERE category_id = $1`,
                    [category_id]
                );

            if (
                categoryResult.rows.length === 0
            ) {
                const error =
                    new Error(
                        "Category not found"
                    );

                error.statusCode = 400;
                throw error;
            }

            if (asset_id) {
                const assetResult =
                    await client.query(
                        `SELECT assets_id
                         FROM assets
                         WHERE assets_id = $1`,
                        [asset_id]
                    );

                if (
                    assetResult.rows.length === 0
                ) {
                    const error =
                        new Error(
                            "Asset not found"
                        );

                    error.statusCode = 400;
                    throw error;
                }
            }

            if (location_id) {
                const locationResult =
                    await client.query(
                        `SELECT loc_id
                         FROM location
                         WHERE loc_id = $1`,
                        [location_id]
                    );

                if (
                    locationResult.rows.length === 0
                ) {
                    const error =
                        new Error(
                            "Location not found"
                        );

                    error.statusCode = 400;
                    throw error;
                }
            }

            // MVP priority mapping:
            // urgency becomes the initial priority.
            const priority = urgency;

            const ticketResult =
                await client.query(
                    `INSERT INTO tickets
                    (
                        ticket_id,
                        title,
                        description,
                        asset_id,
                        reporter_id,
                        category_id,
                        location_id,
                        urgency,
                        priority,
                        first_response_time,
                        resolve_time,
                        created_at,
                        updated_at,
                        created_by,
                        updated_by
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
                        NULL,
                        NULL,
                        CURRENT_TIMESTAMP,
                        CURRENT_TIMESTAMP,
                        $4,
                        $4
                    )
                    RETURNING *`,
                    [
                        title,
                        description,
                        asset_id || null,
                        reporter_id,
                        category_id,
                        location_id || null,
                        urgency,
                        priority
                    ]
                );

            const ticket =
                ticketResult.rows[0];

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
                    NULL,
                    'New',
                    CURRENT_TIMESTAMP,
                    $2,
                    'Ticket created'
                )`,
                [
                    ticket.ticket_id,
                    reporter_id
                ]
            );

            await client.query("COMMIT");

            res.status(201).json({
                ticket,
                status: "New"
            });

        } catch (error) {
            await client.query("ROLLBACK");

            sendError(
                res,
                error,
                "Failed to create ticket"
            );

        } finally {
            client.release();
        }
    }
);


/*
|--------------------------------------------------------------------------
| Get Ticket By ID
|--------------------------------------------------------------------------
*/

router.get("/:id", async (req, res) => {
    try {
        const result =
            await pool.query(
                `SELECT *
                FROM tickets
                WHERE ticket_id = $1`,
                [req.params.id]
            );

        if (
            result.rows.length === 0
        ) {
            return res.status(404).json({
                error:
                    "Ticket not found"
            });
        }

        res.json(
            result.rows[0]
        );

    } catch (error) {
        sendError(
            res,
            error,
            "Failed to fetch ticket"
        );
    }
});


/*
|--------------------------------------------------------------------------
| Assignment
|--------------------------------------------------------------------------
*/

router.patch(
    "/:id/assign",
    validateAssignment,
    async (req, res) => {
        try {
            const result =
                await assignTicket({
                    ticketId:
                        req.params.id,

                    assignedTo:
                        req.body.assigned_to,

                    assignedBy:
                        req.user.user_id,

                    reason:
                        req.body.reason
                });

            res.json(result);

        } catch (error) {
            sendError(
                res,
                error,
                "Failed to assign ticket"
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| Status
|--------------------------------------------------------------------------
*/

router.patch(
    "/:id/status",
    validateStatusChange,
    async (req, res) => {
        try {
            const result =
                await changeTicketStatus({
                    ticketId:
                        req.params.id,

                    actorId:
                        req.user.user_id,

                    newStatus:
                        req.body.new_status,

                    reason:
                        req.body.reason
                });

            res.json(result);

        } catch (error) {
            sendError(
                res,
                error,
                "Failed to change ticket status"
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| Priority
|--------------------------------------------------------------------------
*/

router.patch(
    "/:id/priority",
    validatePriority,
    async (req, res) => {
        try {
            const result =
                await updatePriority({
                    ticketId:
                        req.params.id,
                    actorId:
                        req.user.user_id,
                    priority:
                        req.body.priority
                });

            res.json(result);

        } catch (error) {
            sendError(
                res,
                error,
                "Failed to update priority"
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Work Logs
|--------------------------------------------------------------------------
*/

router.post(
    "/:id/work-logs",
    validateWorkLog,
    async (req, res) => {
        try {
            const result =
                await addWorkLog({
                    ticketId:
                        req.params.id,

                    actorId:
                        req.user.user_id,

                    action:
                        req.body.action,

                    workTime:
                        req.body.work_time,

                    parts:
                        req.body.parts,

                    resolutionCode:
                        req.body.resolution_code
                });

            res.status(201).json(
                result
            );

        } catch (error) {
            sendError(
                res,
                error,
                "Failed to create work log"
            );
        }
    }
);

router.get(
    "/:id/work-logs",
    async (req, res) => {
        try {
            const result =
                await getWorkLogs(
                    req.params.id
                );

            res.json(result);

        } catch (error) {
            sendError(
                res,
                error,
                "Failed to fetch work logs"
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Comments
|--------------------------------------------------------------------------
*/

router.post(
    "/:id/comments",
    validateComment,
    async (req, res) => {
        try {
            const result =
                await addComment({
                    ticketId:
                        req.params.id,

                    actorId:
                        req.user.user_id,

                    body:
                        req.body.body,

                    visibility:
                        req.body.visibility
                });

            res.status(201).json(
                result
            );

        } catch (error) {
            sendError(
                res,
                error,
                "Failed to create comment"
            );
        }
    }
);


router.get(
    "/:id/comments",
    async (req, res) => {
        try {
            const result =
                await getComments(
                    req.params.id,
                    req.user.user_id
                );

            res.json(result);

        } catch (error) {
            sendError(
                res,
                error,
                "Failed to fetch comments"
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Attachments Metadata
|--------------------------------------------------------------------------
*/

router.post(
    "/:id/attachments",
    validateAttachment,
    async (req, res) => {
        try {
            const result =
                await addAttachment({
                    ticketId:
                        req.params.id,

                    actorId:
                        req.user.user_id,

                    fileName:
                        req.body.file_name,

                    fileReference:
                        req.body.file_reference,

                    size:
                        req.body.size,

                    visibility:
                        req.body.visibility
                });

            res.status(201).json(
                result
            );

        } catch (error) {
            sendError(
                res,
                error,
                "Failed to create attachment"
            );
        }
    }
);


router.get(
    "/:id/attachments",
    async (req, res) => {
        try {
            const result =
                await getAttachments({
                    ticketId:
                        req.params.id,

                    actorId:
                        req.user.user_id
                });

            res.json(result);

        } catch (error) {
            sendError(
                res,
                error,
                "Failed to fetch attachments"
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Escalation
|--------------------------------------------------------------------------
*/

router.post(
    "/:id/escalate",
    validateEscalation,
    async (req, res) => {
        try {
            const result =
                await escalateTicket({
                    ticketId:
                        req.params.id,
                    actorId:
                        req.user.user_id,
                    escalatedTo:
                        req.body.escalated_to,
                    reason:
                        req.body.reason
                });

            res.status(201).json(
                result
            );

        } catch (error) {
            sendError(
                res,
                error,
                "Failed to escalate ticket"
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Feedback / Close / Reopen
|--------------------------------------------------------------------------
*/

router.post(
    "/:id/feedback",
    validateFeedback,
    async (req, res) => {
        try {
            const result =
                await submitFeedback({
                    ticketId:
                        req.params.id,
                    reporterId:
                        req.user.user_id,
                    resolutionConfirmed:
                        req.body.resolution_confirmed,
                    rating:
                        req.body.rating,
                    reopenReason:
                        req.body.reopen_reason
                });

            res.status(201).json(
                result
            );

        } catch (error) {
            sendError(
                res,
                error,
                "Failed to submit feedback"
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| SLA
|--------------------------------------------------------------------------
*/

router.get(
    "/:id/sla",
    async (req, res) => {
        try {
            const result =
                await getSla(
                    req.params.id
                );

            res.json(result);

        } catch (error) {
            sendError(
                res,
                error,
                "Failed to calculate SLA"
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Predictions
|--------------------------------------------------------------------------
*/

router.post(
    "/:id/predictions",
    async (req, res) => {
        try {
            const result =
                await createPrediction({
                    ticketId:
                        req.params.id,
                    suggestedCategoryId:
                        req.body.suggested_category_id,
                    suggestedPriority:
                        req.body.suggested_priority,
                    duplicateCandidateTicketId:
                        req.body
                            .duplicate_candidate_ticket_id,
                    slaRiskFlag:
                        req.body.sla_risk_flag,
                    confidence:
                        req.body.confidence,
                    explanation:
                        req.body.explanation,
                    modelVersion:
                        req.body.model_version
                });

            res.status(201).json(
                result
            );

        } catch (error) {
            sendError(
                res,
                error,
                "Failed to create prediction"
            );
        }
    }
);


router.patch(
    "/:ticketId/predictions/:predictionId/decision",
    validatePredictionDecision,
    async (req, res) => {
        try {
            const result =
                await decidePrediction({
                    predictionId:
                        req.params.predictionId,
                    actorId:
                        req.user.user_id,
                    decision:
                        req.body.decision,
                    overrideCategoryId:
                        req.body
                            .override_category_id,
                    overridePriority:
                        req.body
                            .override_priority
                });

            res.json(result);

        } catch (error) {
            sendError(
                res,
                error,
                "Failed to decide prediction"
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Basic Ticket Update
|--------------------------------------------------------------------------
*/

router.patch(
    "/:id",
    validateUpdateTicket,
    async (req, res) => {
        const {
            title,
            description,
            urgency
        } = req.body;

        try {
            const result =
                await pool.query(
                    `UPDATE tickets
                     SET
                         title =
                             COALESCE($1, title),
                         description =
                             COALESCE(
                                 $2,
                                 description
                             ),
                         urgency =
                             COALESCE(
                                 $3,
                                 urgency
                             ),
                         updated_at =
                             CURRENT_TIMESTAMP
                     WHERE ticket_id = $4
                     RETURNING *`,
                    [
                        title || null,
                        description || null,
                        urgency || null,
                        req.params.id
                    ]
                );

            if (
                result.rows.length === 0
            ) {
                return res.status(404).json({
                    error:
                        "Ticket not found"
                });
            }

            res.json(
                result.rows[0]
            );

        } catch (error) {
            sendError(
                res,
                error,
                "Failed to update ticket"
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Delete Ticket
|--------------------------------------------------------------------------
*/

router.delete(
    "/:id",
    async (req, res) => {
        try {
            const result =
                await pool.query(
                    `DELETE FROM tickets
                     WHERE ticket_id = $1
                     RETURNING *`,
                    [req.params.id]
                );

            if (
                result.rows.length === 0
            ) {
                return res.status(404).json({
                    error:
                        "Ticket not found"
                });
            }

            res.json({
                message:
                    "Ticket deleted successfully",
                ticket:
                    result.rows[0]
            });

        } catch (error) {
            sendError(
                res,
                error,
                "Failed to delete ticket"
            );
        }
    }
);


module.exports = router;
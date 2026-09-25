const express = require("express");
const cors = require("cors");

const ticketsRouter =
    require("./src/routes/tickets");

    const authRouter =
    require("./src/routes/auth.routes");

const app = express();


const openapiDocument = {
    openapi: "3.0.3",

    info: {
        title:
            "Campus Helpdesk API",

        version:
            "1.0.0",

        description:
            "MVP API for Campus Helpdesk ticket management, workflow, assignments, SLA, comments, work logs, escalation, feedback and AI predictions. Protected endpoints require Authorization: Bearer <JWT>. The development CORS origin is http://localhost:5173."
    },

    security: [
        {
            BearerAuth: []
        }
    ],

    servers: [
        {
            url:
                "http://localhost:3000"
        }
    ],

    paths: {
        "/": {
            get: {
                summary:
                    "Check backend status",

                security: [],

                responses: {
                    200: {
                        description:
                            "Backend is running"
                    }
                }
            }
        },

        "/tickets/test": {
            get: {
                summary:
                    "Check tickets router",

                responses: {
                    200: {
                        description:
                            "Tickets router is working"
                    }
                }
            }
        },

        "/auth/login": {
            post: {
                summary:
                    "Authenticate a user",

                security: [],

                tags: [
                    "Auth"
                ],

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                $ref:
                                    "#/components/schemas/LoginRequest"
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description:
                            "Login successful",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/LoginResponse"
                                }
                            }
                        }
                    },

                    400: {
                        $ref:
                            "#/components/responses/BadRequest"
                    },

                    401: {
                        $ref:
                            "#/components/responses/Unauthorized"
                    }
                }
            }
        },

        "/api-docs.json": {
            get: {
                summary:
                    "Get the OpenAPI document",

                security: [],

                responses: {
                    200: {
                        description:
                            "OpenAPI document"
                    }
                }
            }
        },

        "/api-docs": {
            get: {
                summary:
                    "Open Swagger UI",

                security: [],

                responses: {
                    200: {
                        description:
                            "Swagger UI HTML"
                    }
                }
            }
        },

        "/tickets": {
            get: {
                summary:
                    "Get all tickets",

                responses: {
                    200: {
                        description:
                            "List of tickets"
                    }
                }
            },

            post: {
                summary:
                    "Create a new ticket. The supplied reporter_id must identify a Reporter.",

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                $ref:
                                    "#/components/schemas/CreateTicket"
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description:
                            "Ticket created"
                    },

                    400: {
                        $ref:
                            "#/components/responses/BadRequest"
                    },

                    500: {
                        $ref:
                            "#/components/responses/ServerError"
                    }
                }
            }
        },


        "/tickets/{id}": {
            get: {
                summary:
                    "Get ticket by ID",

                parameters: [
                    {
                        $ref:
                            "#/components/parameters/TicketId"
                    }
                ],

                responses: {
                    200: {
                        description:
                            "Ticket details"
                    },

                    404: {
                        $ref:
                            "#/components/responses/NotFound"
                    }
                }
            },

            patch: {
                summary:
                    "Update basic ticket fields",

                parameters: [
                    {
                        $ref:
                            "#/components/parameters/TicketId"
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                $ref:
                                    "#/components/schemas/UpdateTicket"
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description:
                            "Ticket updated"
                    }
                }
            },

            delete: {
                summary:
                    "Delete ticket",

                parameters: [
                    {
                        $ref:
                            "#/components/parameters/TicketId"
                    }
                ],

                responses: {
                    200: {
                        description:
                            "Ticket deleted"
                    }
                }
            }
        },


        "/tickets/{id}/status": {
            patch: {
                summary:
                    "Change ticket status according to the current status transition and actor role.",

                parameters: [
                    {
                        $ref:
                            "#/components/parameters/TicketId"
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                $ref:
                                    "#/components/schemas/StatusChange"
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description:
                            "Status changed"
                    }
                }
            }
        },


        "/tickets/{id}/assign": {
            patch: {
                summary:
                    "Assign a ticket. Only an Agent can assign it, and assigned_to must identify a Technician.",

                parameters: [
                    {
                        $ref:
                            "#/components/parameters/TicketId"
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                $ref:
                                    "#/components/schemas/Assignment"
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description:
                            "Ticket assigned"
                    }
                }
            }
        },


        "/tickets/{id}/priority": {
            patch: {
                summary:
                    "Update ticket priority. Only an Agent or Service_Manager can perform this operation.",

                parameters: [
                    {
                        $ref:
                            "#/components/parameters/TicketId"
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                $ref:
                                    "#/components/schemas/PriorityUpdate"
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description:
                            "Priority updated"
                    }
                }
            }
        },


        "/tickets/{id}/work-logs": {
            get: {
                summary:
                    "Get ticket work logs",

                parameters: [
                    {
                        $ref:
                            "#/components/parameters/TicketId"
                    }
                ],

                responses: {
                    200: {
                        description:
                            "Work logs"
                    }
                }
            },

            post: {
                summary:
                    "Add a work log. Only the assigned Technician can perform this operation.",

                parameters: [
                    {
                        $ref:
                            "#/components/parameters/TicketId"
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                $ref:
                                    "#/components/schemas/WorkLog"
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description:
                            "Work log created"
                    }
                }
            }
        },


        "/tickets/{id}/comments": {
            get: {
                summary:
                    "Get ticket comments",

                parameters: [
                    {
                        $ref:
                            "#/components/parameters/TicketId"
                    }
                ],

                responses: {
                    200: {
                        description:
                            "Comments"
                    }
                }
            },

            post: {
                summary:
                    "Add a comment. Reporter ownership, Technician assignment, visibility, and Auditor restrictions are enforced by the backend.",

                parameters: [
                    {
                        $ref:
                            "#/components/parameters/TicketId"
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                $ref:
                                    "#/components/schemas/Comment"
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description:
                            "Comment created"
                    }
                }
            }
        },


        "/tickets/{id}/attachments": {
            get: {
                summary:
                    "Get ticket attachments",

                parameters: [
                    {
                        $ref:
                            "#/components/parameters/TicketId"
                    }
                ],

                responses: {
                    200: {
                        description:
                            "Attachments"
                    }
                }
            },

            post: {
                summary:
                    "Add attachment metadata. Reporter ownership, Technician assignment, visibility, and Auditor restrictions are enforced by the backend.",

                parameters: [
                    {
                        $ref:
                            "#/components/parameters/TicketId"
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                $ref:
                                    "#/components/schemas/Attachment"
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description:
                            "Attachment metadata created"
                    }
                }
            }
        },


        "/tickets/{id}/escalate": {
            post: {
                summary:
                    "Escalate a ticket. Agents, assigned Technicians, and Service_Manager users may escalate; escalated_to must be a Service_Manager.",

                parameters: [
                    {
                        $ref:
                            "#/components/parameters/TicketId"
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                $ref:
                                    "#/components/schemas/Escalation"
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description:
                            "Escalation created"
                    }
                }
            }
        },


        "/tickets/{id}/feedback": {
            post: {
                summary:
                    "Submit feedback as the ticket reporter for a Resolved ticket and close or reopen it.",

                parameters: [
                    {
                        $ref:
                            "#/components/parameters/TicketId"
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                $ref:
                                    "#/components/schemas/Feedback"
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description:
                            "Feedback submitted"
                    }
                }
            }
        },


        "/tickets/{id}/sla": {
            get: {
                summary:
                    "Get ticket SLA status",

                parameters: [
                    {
                        $ref:
                            "#/components/parameters/TicketId"
                    }
                ],

                responses: {
                    200: {
                        description:
                            "SLA status"
                    }
                }
            }
        },


        "/tickets/{id}/predictions": {
            post: {
                summary:
                    "Store AI prediction",

                parameters: [
                    {
                        $ref:
                            "#/components/parameters/TicketId"
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                $ref:
                                    "#/components/schemas/Prediction"
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description:
                            "Prediction stored"
                    }
                }
            }
        },


        "/tickets/{ticketId}/predictions/{predictionId}/decision": {
            patch: {
                summary:
                    "Accept or override an AI prediction. Only an Agent or Service_Manager can decide it.",

                parameters: [
                    {
                        name:
                            "ticketId",

                        in:
                            "path",

                        required:
                            true,

                        schema: {
                            type:
                                "string",

                            format:
                                "uuid"
                        }
                    },

                    {
                        name:
                            "predictionId",

                        in:
                            "path",

                        required:
                            true,

                        schema: {
                            type:
                                "string",

                            format:
                                "uuid"
                        }
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                $ref:
                                    "#/components/schemas/PredictionDecision"
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description:
                            "Prediction decision stored"
                    }
                }
            }
        }
    },


    components: {
        securitySchemes: {
            BearerAuth: {
                type:
                    "http",
                scheme:
                    "bearer",
                bearerFormat:
                    "JWT"
            }
        },

        parameters: {
            TicketId: {
                name:
                    "id",

                in:
                    "path",

                required:
                    true,

                schema: {
                    type:
                        "string",

                    format:
                        "uuid"
                }
            }
        },


        schemas: {
            LoginRequest: {
                type:
                    "object",

                required: [
                    "email",
                    "password"
                ],

                properties: {
                    email: {
                        type:
                            "string",

                        format:
                            "email",

                        example:
                            "user@bua.edu.eg",

                        description:
                            "Must end with @bua.edu.eg"
                    },

                    password: {
                        type:
                            "string",

                        format:
                            "password",

                        example:
                            "Password123"
                    }
                }
            },

            LoginResponse: {
                type:
                    "object",

                required: [
                    "token",
                    "user"
                ],

                properties: {
                    token: {
                        type:
                            "string",
                        description:
                            "JWT valid for one hour"
                    },

                    user: {
                        $ref:
                            "#/components/schemas/User"
                    }
                }
            },

            User: {
                type:
                    "object",

                properties: {
                    user_id: {
                        type:
                            "string",
                        format:
                            "uuid"
                    },

                    email: {
                        type:
                            "string",
                        format:
                            "email"
                    },

                    full_name: {
                        type:
                            "string"
                    },

                    role: {
                        type:
                            "string",
                        enum: [
                            "Reporter",
                            "Agent",
                            "Technician",
                            "Service_Manager",
                            "Auditor"
                        ]
                    },

                    reporter_type: {
                        type:
                            "string",
                        nullable:
                            true
                    },

                    team_id: {
                        type:
                            "string",
                        format:
                            "uuid",
                        nullable:
                            true
                    }
                }
            },

            ErrorResponse: {
                type:
                    "object",

                required: [
                    "error"
                ],

                properties: {
                    error: {
                        type:
                            "string"
                    }
                }
            },

            CreateTicket: {
                type:
                    "object",

                required: [
                    "title",
                    "description",
                    "reporter_id",
                    "category_id",
                    "urgency"
                ],

                properties: {
                    title: {
                        type:
                            "string"
                    },

                    description: {
                        type:
                            "string"
                    },

                    reporter_id: {
                        type:
                            "string",

                        format:
                            "uuid"
                    },

                    asset_id: {
                        type:
                            "string",

                        format:
                            "uuid",

                        nullable:
                            true
                    },

                    category_id: {
                        type:
                            "string",

                        format:
                            "uuid"
                    },

                    location_id: {
                        type:
                            "string",

                        format:
                            "uuid",

                        nullable:
                            true
                    },

                    urgency: {
                        type:
                            "string",

                        enum: [
                            "Low",
                            "Medium",
                            "High",
                            "Critical"
                        ]
                    }
                }
            },


            Ticket: {
                type:
                    "object",

                additionalProperties:
                    true,

                properties: {
                    ticket_id: {
                        type:
                            "string",

                        format:
                            "uuid"
                    },

                    title: {
                        type:
                            "string"
                    },

                    description: {
                        type:
                            "string"
                    },

                    reporter_id: {
                        type:
                            "string",

                        format:
                            "uuid"
                    },

                    category_id: {
                        type:
                            "string",

                        format:
                            "uuid"
                    },

                    urgency: {
                        type:
                            "string"
                    },

                    priority: {
                        type:
                            "string",

                        enum: [
                            "Low",
                            "Medium",
                            "High",
                            "Critical"
                        ],

                        nullable:
                            true
                    }
                }
            },


            UpdateTicket: {
                type:
                    "object",

                properties: {
                    title: {
                        type:
                            "string"
                    },

                    description: {
                        type:
                            "string"
                    },

                    urgency: {
                        type:
                            "string",

                        enum: [
                            "Low",
                            "Medium",
                            "High",
                            "Critical"
                        ],

                        example:
                            "High"
                    }
                }
            },


            StatusChange: {
                type:
                    "object",

                required: [
                    "new_status"
                ],

                properties: {
                    new_status: {
                        type:
                            "string",

                        enum: [
                            "New",
                            "Triaged",
                            "Assigned",
                            "In_Progress",
                            "Waiting",
                            "Resolved",
                            "Reopened",
                            "Closed"
                        ]
                    },

                    reason: {
                        type:
                            "string"
                    }
                }
            },


            Assignment: {
                type:
                    "object",

                required: [
                    "assigned_to"
                ],

                properties: {
                    assigned_to: {
                        type:
                            "string",

                        format:
                            "uuid"
                    },

                    reason: {
                        type:
                            "string"
                    }
                }
            },


            PriorityUpdate: {
                type:
                    "object",

                required: [
                    "priority"
                ],

                properties: {
                    priority: {
                        type:
                            "string",

                        enum: [
                            "Low",
                            "Medium",
                            "High",
                            "Critical"
                        ]
                    }
                }
            },


            WorkLog: {
                type:
                    "object",

                required: [
                    "action",
                    "work_time"
                ],

                properties: {
                    action: {
                        type:
                            "string"
                    },

                    work_time: {
                        type:
                            "string",

                        example:
                            "01:30:00"
                    },

                    parts: {
                        type:
                            "string"
                    },

                    resolution_code: {
                        type:
                            "string"
                    }
                }
            },


            Comment: {
                type:
                    "object",

                required: [
                    "body"
                ],

                properties: {
                    body: {
                        type:
                            "string"
                    },

                    visibility: {
                        type:
                            "string",

                        enum: [
                            "Reporter_Visible",
                            "Internal"
                        ]
                    }
                }
            },


            Attachment: {
                type:
                    "object",

                required: [
                    "file_name",
                    "file_reference",
                    "size"
                ],

                properties: {
                    file_name: {
                        type:
                            "string"
                    },

                    file_reference: {
                        type:
                            "string"
                    },

                    size: {
                        type:
                            "integer",

                        minimum:
                            0
                    },

                    visibility: {
                        type:
                            "string",

                        enum: [
                            "Reporter_Visible",
                            "Internal"
                        ]
                    }
                }
            },


            Escalation: {
                type:
                    "object",

                required: [
                    "escalated_to",
                    "reason"
                ],

                properties: {
                    escalated_to: {
                        type:
                            "string",

                        format:
                            "uuid"
                    },

                    reason: {
                        type:
                            "string"
                    }
                }
            },


            Feedback: {
                type:
                    "object",

                required: [
                    "resolution_confirmed",
                    "rating"
                ],

                properties: {
                    resolution_confirmed: {
                        type:
                            "boolean"
                    },

                    rating: {
                        type:
                            "integer",

                        minimum:
                            1,

                        maximum:
                            5
                    },

                    reopen_reason: {
                        type:
                            "string"
                    }
                }
            },


            Prediction: {
                type:
                    "object",

                properties: {
                    suggested_category_id: {
                        type:
                            "string",

                        format:
                            "uuid"
                    },

                    suggested_priority: {
                        type:
                            "string",

                        enum: [
                            "Low",
                            "Medium",
                            "High",
                            "Critical"
                        ]
                    },

                    duplicate_candidate_ticket_id: {
                        type:
                            "string",

                        format:
                            "uuid"
                    },

                    sla_risk_flag: {
                        type:
                            "boolean"
                    },

                    confidence: {
                        type:
                            "number",

                        minimum:
                            0,

                        maximum:
                            1
                    },

                    explanation: {
                        type:
                            "string"
                    },

                    model_version: {
                        type:
                            "string"
                    }
                }
            },


            PredictionDecision: {
                type:
                    "object",

                required: [
                    "decision"
                ],

                properties: {
                    decision: {
                        type:
                            "string",

                        enum: [
                            "Accepted",
                            "Overridden"
                        ],

                        example:
                            "Accepted"
                    },

                    override_category_id: {
                        type:
                            "string",

                        format:
                            "uuid"
                    },

                    override_priority: {
                        type:
                            "string",

                        enum: [
                            "Low",
                            "Medium",
                            "High",
                            "Critical"
                        ]
                    }
                }
            }
        },


        responses: {
            BadRequest: {
                description:
                    "Invalid request",
                content: {
                    "application/json": {
                        schema: {
                            $ref:
                                "#/components/schemas/ErrorResponse"
                        }
                    }
                }
            },

            Unauthorized: {
                description:
                    "Authentication failed. Possible messages include missing token, invalid Authorization header, expired token, or invalid token.",
                content: {
                    "application/json": {
                        schema: {
                            $ref:
                                "#/components/schemas/ErrorResponse"
                        }
                    }
                }
            },

            NotFound: {
                description:
                    "Resource not found",
                content: {
                    "application/json": {
                        schema: {
                            $ref:
                                "#/components/schemas/ErrorResponse"
                        }
                    }
                }
            },

            ServerError: {
                description:
                    "Internal server error",
                content: {
                    "application/json": {
                        schema: {
                            $ref:
                                "#/components/schemas/ErrorResponse"
                        }
                    }
                }
            },

            Forbidden: {
                description:
                    "Authenticated user is not authorized for this operation",
                content: {
                    "application/json": {
                        schema: {
                            $ref:
                                "#/components/schemas/ErrorResponse"
                        }
                    }
                }
            }
        }
    }
};


app.use(express.json());

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://front-end.moustafabadawyfouad.workers.dev"
        ]
    })
);

app.use(
    "/auth",
    authRouter
);

const { authenticateToken } = require("./src/middleware/auth");

app.use(
    "/tickets",
    authenticateToken,
    ticketsRouter
);

app.get(
    "/api-docs.json",
    (req, res) => {
        res.json(
            openapiDocument
        );
    }
);


app.get(
    "/api-docs",
    (req, res) => {
        res.type("html")
            .send(`<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
    >

    <title>Campus Helpdesk API Docs</title>

    <link
        rel="stylesheet"
        href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
    >
</head>

<body>
    <div id="swagger-ui"></div>

    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>

    <script>
        window.onload = () => {
            SwaggerUIBundle({
                url: "/api-docs.json",
                dom_id: "#swagger-ui"
            });
        };
    </script>
</body>
</html>`);
    }
);


const PORT =
    process.env.PORT || 3000;


app.get(
    "/",
    (req, res) => {
        res.send(
            "Campus Helpdesk Backend is running"
        );
    }
);


app.use(
    (err, req, res, next) => {
        console.error(err);

        res.status(500).json({
            error:
                "Internal server error"
        });
    }
);


const server = app.listen(
    PORT,
    () => {
        console.log(
            `Server is running on http://localhost:${PORT}`
        );
    }
);

server.on("close", () => {
    console.log("SERVER CLOSED");
});

server.on("error", (error) => {
    console.error("SERVER ERROR:", error);
});
const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ALLOWED_URGENCIES = [
    "Low",
    "Medium",
    "High",
    "Critical"
];

const ALLOWED_PRIORITIES = [
    "Low",
    "Medium",
    "High",
    "Critical"
];

const ALLOWED_STATUSES = [
    "New",
    "Triaged",
    "Assigned",
    "In_Progress",
    "Waiting",
    "Resolved",
    "Reopened",
    "Closed"
];

const ALLOWED_VISIBILITIES = [
    "Reporter_Visible",
    "Internal"
];

function isValidUUID(value) {
    return typeof value === "string" &&
        UUID_REGEX.test(value);
}


function validateCreateTicket(req, res, next) {
    const {
        title,
        description,
        reporter_id,
        category_id,
        urgency
    } = req.body;

    if (
        !title ||
        typeof title !== "string" ||
        !title.trim()
    ) {
        return res.status(400).json({
            error:
                "title is required and must be a non-empty string"
        });
    }

    if (
        !description ||
        typeof description !== "string" ||
        !description.trim()
    ) {
        return res.status(400).json({
            error:
                "description is required and must be a non-empty string"
        });
    }

    if (!reporter_id) {
        return res.status(400).json({
            error: "reporter_id is required"
        });
    }

    if (!isValidUUID(reporter_id)) {
        return res.status(400).json({
            error:
                "reporter_id must be a valid UUID"
        });
    }

    if (!category_id) {
        return res.status(400).json({
            error: "category_id is required"
        });
    }

    if (!isValidUUID(category_id)) {
        return res.status(400).json({
            error:
                "category_id must be a valid UUID"
        });
    }

    if (!urgency) {
        return res.status(400).json({
            error: "urgency is required"
        });
    }

    if (!ALLOWED_URGENCIES.includes(urgency)) {
        return res.status(400).json({
            error: "Invalid urgency"
        });
    }

    if (
        req.body.asset_id &&
        !isValidUUID(req.body.asset_id)
    ) {
        return res.status(400).json({
            error:
                "asset_id must be a valid UUID"
        });
    }

    if (
        req.body.location_id &&
        !isValidUUID(req.body.location_id)
    ) {
        return res.status(400).json({
            error:
                "location_id must be a valid UUID"
        });
    }

    next();
}


function validateUpdateTicket(req, res, next) {
    const {
        title,
        description,
        urgency
    } = req.body;

    if (
        title === undefined &&
        description === undefined &&
        urgency === undefined
    ) {
        return res.status(400).json({
            error:
                "At least one field is required"
        });
    }

    if (
        title !== undefined &&
        (
            typeof title !== "string" ||
            !title.trim()
        )
    ) {
        return res.status(400).json({
            error:
                "title must be a non-empty string"
        });
    }

    if (
        description !== undefined &&
        (
            typeof description !== "string" ||
            !description.trim()
        )
    ) {
        return res.status(400).json({
            error:
                "description must be a non-empty string"
        });
    }

    if (
        urgency !== undefined &&
        !ALLOWED_URGENCIES.includes(urgency)
    ) {
        return res.status(400).json({
            error: "Invalid urgency"
        });
    }

    next();
}

function validateStatusChange(req, res, next) {
    const {
        new_status
    } = req.body;

    if (!new_status) {
        return res.status(400).json({
            error:
                "new_status is required"
        });
    }

    if (!ALLOWED_STATUSES.includes(new_status)) {
        return res.status(400).json({
            error:
                "Invalid status"
        });
    }

    next();
}


function validateAssignment(req, res, next) {
    const {
        assigned_to
    } = req.body;

    if (!assigned_to) {
        return res.status(400).json({
            error:
                "assigned_to is required"
        });
    }

    if (!isValidUUID(assigned_to)) {
        return res.status(400).json({
            error:
                "assigned_to must be a valid UUID"
        });
    }

    next();
}
function validateWorkLog(req, res, next) {
    const {
        action,
        work_time
    } = req.body;

    if (!action || !work_time) {
        return res.status(400).json({
            error:
                "action and work_time are required"
        });
    }

    if (
        typeof action !== "string" ||
        !action.trim()
    ) {
        return res.status(400).json({
            error:
                "action must be a non-empty string"
        });
    }

    next();
}
function validateComment(req, res, next) {
    const {
        body,
        visibility
    } = req.body;

    if (!body) {
        return res.status(400).json({
            error:
                "body is required"
        });
    }

    if (
        visibility !== undefined &&
        !ALLOWED_VISIBILITIES.includes(visibility)
    ) {
        return res.status(400).json({
            error:
                "Invalid comment visibility"
        });
    }

    if (
        typeof body !== "string" ||
        !body.trim()
    ) {
        return res.status(400).json({
            error:
                "body must be a non-empty string"
        });
    }

    next();
}

function validateAttachment(req, res, next) {
    const {
        file_name,
        file_reference,
        size,
        visibility
    } = req.body;

    if (
        !file_name ||
        !file_reference ||
        size === undefined
    ) {
        return res.status(400).json({
            error:
                "file_name, file_reference and size are required"
        });
    }

    if (
        Number.isNaN(Number(size)) ||
        Number(size) < 0
    ) {
        return res.status(400).json({
            error:
                "size must be a valid non-negative number"
        });
    }

    if (
        visibility !== undefined &&
        !ALLOWED_VISIBILITIES.includes(visibility)
    ) {
        return res.status(400).json({
            error:
                "Invalid attachment visibility"
        });
    }

    next();
}

function validateEscalation(req, res, next) {
    const {
        escalated_to,
        reason
    } = req.body;

    if (
        !escalated_to ||
        !reason
    ) {
        return res.status(400).json({
            error:
                "escalated_to and reason are required"
        });
    }

    if (
        !isValidUUID(escalated_to)
    ) {
        return res.status(400).json({
            error:
                "escalated_to must be a valid UUID"
        });
    }

    if (
        typeof reason !== "string" ||
        !reason.trim()
    ) {
        return res.status(400).json({
            error:
                "reason must be a non-empty string"
        });
    }

    next();
}


function validateFeedback(req, res, next) {
    const {
        resolution_confirmed,
        rating
    } = req.body;

    if (
        resolution_confirmed === undefined ||
        rating === undefined
    ) {
        return res.status(400).json({
            error:
                "resolution_confirmed and rating are required"
        });
    }

    if (
        typeof resolution_confirmed !== "boolean"
    ) {
        return res.status(400).json({
            error:
                "resolution_confirmed must be true or false"
        });
    }

    if (
        Number.isNaN(Number(rating)) ||
        Number(rating) < 1 ||
        Number(rating) > 5
    ) {
        return res.status(400).json({
            error:
                "rating must be between 1 and 5"
        });
    }

    if (
        !resolution_confirmed &&
        (
            !req.body.reopen_reason ||
            !req.body.reopen_reason.trim()
        )
    ) {
        return res.status(400).json({
            error:
                "reopen_reason is required when resolution is not confirmed"
        });
    }

    next();
}


function validatePriority(req, res, next) {
    const {
        priority
    } = req.body;

    if (!priority) {
        return res.status(400).json({
            error:
                "priority is required"
        });
    }

    if (!ALLOWED_PRIORITIES.includes(priority)) {
        return res.status(400).json({
            error:
                "Invalid priority"
        });
    }

    next();
}


function validatePredictionDecision(req, res, next) {
    const {
        decision
    } = req.body;

    if (!decision) {
        return res.status(400).json({
            error:
                "decision is required"
        });
    }

    if (
        decision !== "Accepted" &&
        decision !== "Overridden"
    ) {
        return res.status(400).json({
            error:
                "decision must be Accepted or Overridden"
        });
    }

    next();
}


module.exports = {
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
    validatePredictionDecision,
    isValidUUID
};
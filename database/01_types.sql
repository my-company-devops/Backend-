-- =========================================
-- Campus Helpdesk
-- PostgreSQL ENUM Types
-- =========================================

CREATE TYPE ticket_status AS ENUM (
    'New',
    'Triaged',
    'Assigned',
    'In_Progress',
    'Waiting',
    'Resolved',
    'Reopened',
    'Closed'
);

CREATE TYPE user_role AS ENUM (
    'Reporter',
    'Agent',
    'Technician',
    'Service_Manager',
    'Auditor'
);

CREATE TYPE reporter_type AS ENUM (
    'Student',
    'Faculty',
    'Staff',
    'Visitor'
);

CREATE TYPE ticket_urgency AS ENUM (
    'Low',
    'Medium',
    'High',
    'Critical'
);

CREATE TYPE ticket_priority AS ENUM (
    'Low',
    'Medium',
    'High',
    'Critical'
);

CREATE TYPE comment_visibility AS ENUM (
    'Reporter_Visible',
    'Internal'
);

CREATE TYPE attachment_visibility AS ENUM (
    'Reporter_Visible',
    'Internal'
);

CREATE TYPE prediction_decision AS ENUM (
    'Pending',
    'Accepted',
    'Overridden'
);
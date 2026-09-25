-- =========================================
-- Campus Helpdesk
-- Database Tables - Schema V2
-- =========================================

-- =========================================
-- 1. Support Teams
-- =========================================

CREATE TABLE support_teams (
    team_id UUID PRIMARY KEY,
    name VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID
);


-- =========================================
-- 2. Users
-- =========================================

CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password_hash TEXT,
    full_name VARCHAR,
    role user_role,
    reporter_type reporter_type,
    team_id UUID,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- =========================================
-- 3. Location
-- =========================================

CREATE TABLE location (
    loc_id UUID PRIMARY KEY,
    code VARCHAR,
    floor VARCHAR,
    room_type VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);


-- =========================================
-- 4. Assets
-- =========================================

CREATE TABLE assets (
    assets_id UUID PRIMARY KEY,
    asset_tag VARCHAR,
    asset_type VARCHAR,
    location_id UUID,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID
);


-- =========================================
-- 5. Categories
-- =========================================

CREATE TABLE categories (
    category_id UUID PRIMARY KEY,
    name VARCHAR,
    team_id UUID,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID
);


-- =========================================
-- 6. Business Hours
-- =========================================

CREATE TABLE business_hours (
    id UUID PRIMARY KEY,
    name VARCHAR,
    day_of_week INT,
    start_time TIME,
    end_time TIME,
    is_working_day BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);


-- =========================================
-- 7. Tickets
-- =========================================

CREATE TABLE tickets (
    ticket_id UUID PRIMARY KEY,
    title VARCHAR,
    description TEXT,
    asset_id UUID,
    reporter_id UUID,
    category_id UUID,
    location_id UUID,
    urgency ticket_urgency,
    priority ticket_priority,
    first_response_time TIMESTAMP,
    resolve_time TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID
);


-- =========================================
-- 8. Ticket Status History
-- =========================================

CREATE TABLE ticket_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID,
    from_status ticket_status,
    to_status ticket_status,
    changed_date TIMESTAMP,
    changed_by UUID,
    reason TEXT
);


-- =========================================
-- 9. Attachments
-- =========================================

CREATE TABLE attachments (
    id UUID PRIMARY KEY,
    ticket_id UUID,
    uploaded_by UUID,
    file_name VARCHAR,
    file_reference VARCHAR,
    size INT,
    visibility attachment_visibility,
    created_at TIMESTAMP
);


-- =========================================
-- 10. Comments
-- =========================================

CREATE TABLE comments (
    id UUID PRIMARY KEY,
    ticket_id UUID,
    author_id UUID,
    body TEXT,
    visibility comment_visibility,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    updated_by UUID
);


-- =========================================
-- 11. Escalation
-- =========================================

CREATE TABLE escalation (
    id UUID PRIMARY KEY,
    ticket_id UUID,
    escalated_at TIMESTAMP,
    escalated_by UUID,
    escalated_to UUID,
    reason TEXT,
    created_at TIMESTAMP
);


-- =========================================
-- 12. Assignments
-- =========================================

CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID,
    assigned_to UUID,
    team_id UUID,
    assigned_by UUID,
    assigned_at TIMESTAMP,
    unassigned_at TIMESTAMP,
    created_at TIMESTAMP
);


-- =========================================
-- 13. SLA Profiles
-- =========================================

CREATE TABLE sla_profiles (
    sla_profile_id UUID PRIMARY KEY,
    name VARCHAR,
    category_id UUID,
    team_id UUID,
    business_hours_id UUID,
    target_response_time INTERVAL,
    target_resolution_time INTERVAL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID
);


-- =========================================
-- 14. Work Logs
-- =========================================

CREATE TABLE work_logs (
    id UUID PRIMARY KEY,
    ticket_id UUID,
    user_id UUID,
    action TEXT,
    work_time INTERVAL,
    parts TEXT,
    resolution_code VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);


-- =========================================
-- 15. Predictions
-- =========================================

CREATE TABLE predictions (
    id UUID PRIMARY KEY,
    ticket_id UUID,
    suggested_category_id UUID,
    suggested_priority ticket_priority,
    duplicate_candidate_ticket_id UUID,
    sla_risk_flag BOOLEAN,
    confidence DECIMAL,
    explanation TEXT,
    model_version VARCHAR,
    decision prediction_decision,
    decided_by UUID,
    decided_at TIMESTAMP,
    created_at TIMESTAMP
);


-- =========================================
-- 16. Feedback
-- =========================================

CREATE TABLE feedback (
    id UUID PRIMARY KEY,
    ticket_id UUID,
    reporter_id UUID,
    resolution_confirmed BOOLEAN,
    rating INT,
    reopen_reason TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
-- =========================================
-- Campus Helpdesk
-- Database Constraints - Schema V2
-- =========================================


-- =========================================
-- USERS
-- =========================================

ALTER TABLE users
ADD CONSTRAINT fk_users_team
FOREIGN KEY (team_id)
REFERENCES support_teams(team_id);


-- =========================================
-- ASSETS
-- =========================================

ALTER TABLE assets
ADD CONSTRAINT fk_assets_location
FOREIGN KEY (location_id)
REFERENCES location(loc_id);

ALTER TABLE assets
ADD CONSTRAINT fk_assets_created_by
FOREIGN KEY (created_by)
REFERENCES users(user_id);

ALTER TABLE assets
ADD CONSTRAINT fk_assets_updated_by
FOREIGN KEY (updated_by)
REFERENCES users(user_id);


-- =========================================
-- CATEGORIES
-- =========================================

ALTER TABLE categories
ADD CONSTRAINT fk_categories_team
FOREIGN KEY (team_id)
REFERENCES support_teams(team_id);

ALTER TABLE categories
ADD CONSTRAINT fk_categories_created_by
FOREIGN KEY (created_by)
REFERENCES users(user_id);

ALTER TABLE categories
ADD CONSTRAINT fk_categories_updated_by
FOREIGN KEY (updated_by)
REFERENCES users(user_id);


-- =========================================
-- SUPPORT TEAMS
-- =========================================

ALTER TABLE support_teams
ADD CONSTRAINT fk_support_teams_created_by
FOREIGN KEY (created_by)
REFERENCES users(user_id);

ALTER TABLE support_teams
ADD CONSTRAINT fk_support_teams_updated_by
FOREIGN KEY (updated_by)
REFERENCES users(user_id);


-- =========================================
-- TICKETS
-- =========================================

ALTER TABLE tickets
ADD CONSTRAINT fk_tickets_asset
FOREIGN KEY (asset_id)
REFERENCES assets(assets_id);

ALTER TABLE tickets
ADD CONSTRAINT fk_tickets_reporter
FOREIGN KEY (reporter_id)
REFERENCES users(user_id);

ALTER TABLE tickets
ADD CONSTRAINT fk_tickets_category
FOREIGN KEY (category_id)
REFERENCES categories(category_id);

ALTER TABLE tickets
ADD CONSTRAINT fk_tickets_location
FOREIGN KEY (location_id)
REFERENCES location(loc_id);

ALTER TABLE tickets
ADD CONSTRAINT fk_tickets_created_by
FOREIGN KEY (created_by)
REFERENCES users(user_id);

ALTER TABLE tickets
ADD CONSTRAINT fk_tickets_updated_by
FOREIGN KEY (updated_by)
REFERENCES users(user_id);


-- =========================================
-- TICKET STATUS HISTORY
-- =========================================

ALTER TABLE ticket_status_history
ADD CONSTRAINT fk_status_history_ticket
FOREIGN KEY (ticket_id)
REFERENCES tickets(ticket_id);

ALTER TABLE ticket_status_history
ADD CONSTRAINT fk_status_history_changed_by
FOREIGN KEY (changed_by)
REFERENCES users(user_id);


-- =========================================
-- ATTACHMENTS
-- =========================================

ALTER TABLE attachments
ADD CONSTRAINT fk_attachments_ticket
FOREIGN KEY (ticket_id)
REFERENCES tickets(ticket_id);

ALTER TABLE attachments
ADD CONSTRAINT fk_attachments_uploaded_by
FOREIGN KEY (uploaded_by)
REFERENCES users(user_id);


-- =========================================
-- COMMENTS
-- =========================================

ALTER TABLE comments
ADD CONSTRAINT fk_comments_ticket
FOREIGN KEY (ticket_id)
REFERENCES tickets(ticket_id);

ALTER TABLE comments
ADD CONSTRAINT fk_comments_author
FOREIGN KEY (author_id)
REFERENCES users(user_id);

ALTER TABLE comments
ADD CONSTRAINT fk_comments_updated_by
FOREIGN KEY (updated_by)
REFERENCES users(user_id);


-- =========================================
-- ESCALATION
-- =========================================

ALTER TABLE escalation
ADD CONSTRAINT fk_escalation_ticket
FOREIGN KEY (ticket_id)
REFERENCES tickets(ticket_id);

ALTER TABLE escalation
ADD CONSTRAINT fk_escalation_escalated_by
FOREIGN KEY (escalated_by)
REFERENCES users(user_id);

ALTER TABLE escalation
ADD CONSTRAINT fk_escalation_escalated_to
FOREIGN KEY (escalated_to)
REFERENCES users(user_id);


-- =========================================
-- ASSIGNMENTS
-- =========================================

ALTER TABLE assignments
ADD CONSTRAINT fk_assignments_ticket
FOREIGN KEY (ticket_id)
REFERENCES tickets(ticket_id);

ALTER TABLE assignments
ADD CONSTRAINT fk_assignments_assigned_to
FOREIGN KEY (assigned_to)
REFERENCES users(user_id);

ALTER TABLE assignments
ADD CONSTRAINT fk_assignments_team
FOREIGN KEY (team_id)
REFERENCES support_teams(team_id);

ALTER TABLE assignments
ADD CONSTRAINT fk_assignments_assigned_by
FOREIGN KEY (assigned_by)
REFERENCES users(user_id);


-- =========================================
-- SLA PROFILES
-- =========================================

ALTER TABLE sla_profiles
ADD CONSTRAINT fk_sla_profiles_category
FOREIGN KEY (category_id)
REFERENCES categories(category_id);

ALTER TABLE sla_profiles
ADD CONSTRAINT fk_sla_profiles_team
FOREIGN KEY (team_id)
REFERENCES support_teams(team_id);

ALTER TABLE sla_profiles
ADD CONSTRAINT fk_sla_profiles_business_hours
FOREIGN KEY (business_hours_id)
REFERENCES business_hours(id);

ALTER TABLE sla_profiles
ADD CONSTRAINT fk_sla_profiles_created_by
FOREIGN KEY (created_by)
REFERENCES users(user_id);

ALTER TABLE sla_profiles
ADD CONSTRAINT fk_sla_profiles_updated_by
FOREIGN KEY (updated_by)
REFERENCES users(user_id);


-- =========================================
-- WORK LOGS
-- =========================================

ALTER TABLE work_logs
ADD CONSTRAINT fk_work_logs_ticket
FOREIGN KEY (ticket_id)
REFERENCES tickets(ticket_id);

ALTER TABLE work_logs
ADD CONSTRAINT fk_work_logs_user
FOREIGN KEY (user_id)
REFERENCES users(user_id);


-- =========================================
-- PREDICTIONS
-- =========================================

ALTER TABLE predictions
ADD CONSTRAINT fk_predictions_ticket
FOREIGN KEY (ticket_id)
REFERENCES tickets(ticket_id);

ALTER TABLE predictions
ADD CONSTRAINT fk_predictions_category
FOREIGN KEY (suggested_category_id)
REFERENCES categories(category_id);

ALTER TABLE predictions
ADD CONSTRAINT fk_predictions_duplicate_ticket
FOREIGN KEY (duplicate_candidate_ticket_id)
REFERENCES tickets(ticket_id);

ALTER TABLE predictions
ADD CONSTRAINT fk_predictions_decided_by
FOREIGN KEY (decided_by)
REFERENCES users(user_id);


-- =========================================
-- FEEDBACK
-- =========================================

ALTER TABLE feedback
ADD CONSTRAINT fk_feedback_ticket
FOREIGN KEY (ticket_id)
REFERENCES tickets(ticket_id);

ALTER TABLE feedback
ADD CONSTRAINT fk_feedback_reporter
FOREIGN KEY (reporter_id)
REFERENCES users(user_id);


-- =========================================
-- BASIC VALIDATION CONSTRAINTS
-- =========================================

ALTER TABLE feedback
ADD CONSTRAINT chk_feedback_rating
CHECK (rating IS NULL OR rating BETWEEN 1 AND 5);

ALTER TABLE business_hours
ADD CONSTRAINT chk_business_hours_day
CHECK (day_of_week BETWEEN 0 AND 6);

ALTER TABLE business_hours
ADD CONSTRAINT chk_business_hours_time
CHECK (
    NOT is_working_day
    OR (
        start_time IS NOT NULL
        AND end_time IS NOT NULL
        AND start_time < end_time
    )
);

ALTER TABLE predictions
ADD CONSTRAINT chk_prediction_confidence
CHECK (
    confidence IS NULL
    OR (confidence >= 0 AND confidence <= 1)
);
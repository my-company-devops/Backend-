--
-- PostgreSQL database dump
--

\restrict ReVLSUhvE6qbh3UFGId1kE2y0AYJNClBbhnywU0WUX5v7jzMz3hDHnBlzN8wFh9

-- Dumped from database version 18.6 (6569466)
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.location (loc_id, code, floor, room_type, created_at, updated_at) VALUES ('33333333-3333-3333-3333-333333333333', 'B101', '1', 'Classroom', '2026-09-20 23:54:44.838248', '2026-09-20 23:54:44.838248');
INSERT INTO public.location (loc_id, code, floor, room_type, created_at, updated_at) VALUES ('44444444-4444-4444-4444-444444444444', 'LAB01', '2', 'Computer Lab', '2026-09-20 23:54:44.838248', '2026-09-20 23:54:44.838248');


--
-- Data for Name: support_teams; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.support_teams (team_id, name, created_at, updated_at, created_by, updated_by) VALUES ('11111111-1111-1111-1111-111111111111', 'IT Support', '2026-09-20 23:54:44.838248', '2026-09-20 23:54:44.838248', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'cccccccc-cccc-cccc-cccc-cccccccccccc');
INSERT INTO public.support_teams (team_id, name, created_at, updated_at, created_by, updated_by) VALUES ('22222222-2222-2222-2222-222222222222', 'Maintenance', '2026-09-20 23:54:44.838248', '2026-09-20 23:54:44.838248', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'cccccccc-cccc-cccc-cccc-cccccccccccc');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users (user_id, full_name, role, reporter_type, team_id, created_at, updated_at, email, password_hash) VALUES ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Sara Ahmed', 'Service_Manager', 'Staff', '11111111-1111-1111-1111-111111111111', '2026-09-20 23:54:44.838248', '2026-09-20 23:54:44.838248', 'sara.ahmed@bua.edu.eg', '$2b$10$F2RL4AzoR7eNfrY239kRwO6HQf73rig2VsHXyr3mkB7CCrb9GABxa');
INSERT INTO public.users (user_id, full_name, role, reporter_type, team_id, created_at, updated_at, email, password_hash) VALUES ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Omar Khaled', 'Reporter', 'Student', NULL, '2026-09-20 23:54:44.838248', '2026-09-20 23:54:44.838248', 'omar.khaled@bua.edu.eg', '$2b$10$dUPx8a51ao8XVSkYIVUtRuuaVaLiQAFDFpDwZigEj3xXrnD/QPlfG');
INSERT INTO public.users (user_id, full_name, role, reporter_type, team_id, created_at, updated_at, email, password_hash) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Mohamed Hassan', 'Technician', 'Staff', '22222222-2222-2222-2222-222222222222', '2026-09-20 23:54:44.838248', '2026-09-20 23:54:44.838248', 'mohamed.hassan@bua.edu.eg', '$2b$10$WIccwWTCEOWyvQsD3IZ2guxcirfUKxj1x11vpWM0iPB/u.b4Y5M6O');
INSERT INTO public.users (user_id, full_name, role, reporter_type, team_id, created_at, updated_at, email, password_hash) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ahmed Ali', 'Agent', 'Staff', '11111111-1111-1111-1111-111111111111', '2026-09-20 23:54:44.838248', '2026-09-20 23:54:44.838248', 'ahmed.ali@bua.edu.eg', '$2b$10$3wXmBoPWdvVtb76OrW4RYuqSn3jM7JfvoN/QPOiDLMMYx2EesSIQW');


--
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.assets (assets_id, asset_tag, asset_type, location_id, created_at, updated_at, created_by, updated_by) VALUES ('55555555-5555-5555-5555-555555555555', 'PC-001', 'Computer', '44444444-4444-4444-4444-444444444444', '2026-09-20 23:54:44.838248', '2026-09-20 23:54:44.838248', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
INSERT INTO public.assets (assets_id, asset_tag, asset_type, location_id, created_at, updated_at, created_by, updated_by) VALUES ('66666666-6666-6666-6666-666666666666', 'PROJ-001', 'Projector', '33333333-3333-3333-3333-333333333333', '2026-09-20 23:54:44.838248', '2026-09-20 23:54:44.838248', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.categories (category_id, name, team_id, created_at, updated_at, created_by, updated_by) VALUES ('77777777-7777-7777-7777-777777777777', 'Hardware', '11111111-1111-1111-1111-111111111111', '2026-09-20 23:54:44.838248', '2026-09-20 23:54:44.838248', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'cccccccc-cccc-cccc-cccc-cccccccccccc');
INSERT INTO public.categories (category_id, name, team_id, created_at, updated_at, created_by, updated_by) VALUES ('88888888-8888-8888-8888-888888888888', 'Electrical', '22222222-2222-2222-2222-222222222222', '2026-09-20 23:54:44.838248', '2026-09-20 23:54:44.838248', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'cccccccc-cccc-cccc-cccc-cccccccccccc');


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tickets (ticket_id, title, description, asset_id, reporter_id, category_id, location_id, urgency, priority, first_response_time, resolve_time, created_at, updated_at, created_by, updated_by) VALUES ('f48bed13-ac91-4659-aa9f-5ef45b5475a3', 'Printer problem', 'The printer in the maintenance area is not working.', NULL, 'dddddddd-dddd-dddd-dddd-dddddddddddd', '77777777-7777-7777-7777-777777777777', NULL, 'Medium', NULL, NULL, NULL, '2026-09-22 09:50:19.423772', '2026-09-22 11:54:00.946793', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'dddddddd-dddd-dddd-dddd-dddddddddddd');
INSERT INTO public.tickets (ticket_id, title, description, asset_id, reporter_id, category_id, location_id, urgency, priority, first_response_time, resolve_time, created_at, updated_at, created_by, updated_by) VALUES ('cccccccc-1111-1111-1111-111111111111', 'Projector is not working', 'The projector in classroom B101 is not displaying an image.', '66666666-6666-6666-6666-666666666666', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '77777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', 'High', 'Low', '2026-09-20 23:54:44.838248', NULL, '2026-09-20 23:54:44.838248', '2026-09-23 09:06:23.960238', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
INSERT INTO public.tickets (ticket_id, title, description, asset_id, reporter_id, category_id, location_id, urgency, priority, first_response_time, resolve_time, created_at, updated_at, created_by, updated_by) VALUES ('4791a505-225e-40e6-8e6a-803f90b403b0', 'Computer not working', 'The computer in the lab is not starting.', NULL, 'dddddddd-dddd-dddd-dddd-dddddddddddd', '77777777-7777-7777-7777-777777777777', NULL, 'Medium', 'High', NULL, NULL, '2026-09-22 04:32:13.295922', '2026-09-24 08:47:21.945186', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
INSERT INTO public.tickets (ticket_id, title, description, asset_id, reporter_id, category_id, location_id, urgency, priority, first_response_time, resolve_time, created_at, updated_at, created_by, updated_by) VALUES ('04ccd940-8d9d-4663-b7ba-f8e553b11ed9', 'API integration smoke test (safe to delete)', 'Automated round-trip validation of the frontend integration.', '55555555-5555-5555-5555-555555555555', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '77777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', 'Medium', 'Medium', '2026-09-24 08:26:51.903395', '2026-09-24 08:26:56.285954', '2026-09-24 08:26:46.630698', '2026-09-24 08:26:56.285954', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
INSERT INTO public.tickets (ticket_id, title, description, asset_id, reporter_id, category_id, location_id, urgency, priority, first_response_time, resolve_time, created_at, updated_at, created_by, updated_by) VALUES ('b3280db7-6e66-4f78-8193-840ebd1855c1', 'API integration smoke test (safe to delete)', 'Automated round-trip validation of the frontend integration.', '55555555-5555-5555-5555-555555555555', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '77777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', 'Medium', 'Medium', '2026-09-24 08:23:21.440962', '2026-09-24 08:23:25.850078', '2026-09-24 08:23:17.406222', '2026-09-24 08:26:00.580935', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
INSERT INTO public.tickets (ticket_id, title, description, asset_id, reporter_id, category_id, location_id, urgency, priority, first_response_time, resolve_time, created_at, updated_at, created_by, updated_by) VALUES ('1538f188-2e28-4f85-896c-532105ca4916', 'Swagger API Test Ticket - Updated', 'Updated successfully through Swagger API test', NULL, 'dddddddd-dddd-dddd-dddd-dddddddddddd', '77777777-7777-7777-7777-777777777777', NULL, 'High', 'High', '2026-09-24 08:47:39.947492', '2026-09-24 08:47:48.915427', '2026-09-24 08:43:10.818446', '2026-09-24 08:47:50.3174', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'dddddddd-dddd-dddd-dddd-dddddddddddd');
INSERT INTO public.tickets (ticket_id, title, description, asset_id, reporter_id, category_id, location_id, urgency, priority, first_response_time, resolve_time, created_at, updated_at, created_by, updated_by) VALUES ('14c8dcfd-88db-435b-80fa-c4bbeddd235c', 'API integration smoke test (safe to delete)', 'Automated round-trip validation of the frontend integration.', '55555555-5555-5555-5555-555555555555', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '77777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', 'Medium', 'High', '2026-09-24 08:26:13.939069', '2026-09-24 08:26:18.408056', '2026-09-24 08:26:09.687477', '2026-09-24 08:26:32.136566', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
INSERT INTO public.tickets (ticket_id, title, description, asset_id, reporter_id, category_id, location_id, urgency, priority, first_response_time, resolve_time, created_at, updated_at, created_by, updated_by) VALUES ('89768be7-0f5b-4a35-81fb-63dc545fb355', 'API integration smoke test (safe to delete)', 'Automated round-trip validation of the frontend integration.', '55555555-5555-5555-5555-555555555555', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '77777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', 'Medium', 'High', '2026-09-24 08:27:39.42643', '2026-09-24 08:27:43.957837', '2026-09-24 08:27:34.756796', '2026-09-24 08:46:35.812011', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
INSERT INTO public.tickets (ticket_id, title, description, asset_id, reporter_id, category_id, location_id, urgency, priority, first_response_time, resolve_time, created_at, updated_at, created_by, updated_by) VALUES ('9cd504a1-bbea-4e79-9e32-7b1837ed53a1', 'Postman Test Ticket', 'Testing ticket creation', NULL, 'dddddddd-dddd-dddd-dddd-dddddddddddd', '77777777-7777-7777-7777-777777777777', NULL, 'Low', 'High', '2026-09-24 08:48:43.509729', NULL, '2026-09-23 08:04:15.688884', '2026-09-24 12:55:27.980731', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
INSERT INTO public.tickets (ticket_id, title, description, asset_id, reporter_id, category_id, location_id, urgency, priority, first_response_time, resolve_time, created_at, updated_at, created_by, updated_by) VALUES ('251c8de5-0e51-40ae-8a15-10276e231dd0', 'Testing new classroom projector', 'The projector in classroom B101 is not displaying an image.', '66666666-6666-6666-6666-666666666666', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '77777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', 'Medium', 'High', NULL, NULL, '2026-09-24 18:33:23.712384', '2026-09-24 18:36:05.752102', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'dddddddd-dddd-dddd-dddd-dddddddddddd');


--
-- Data for Name: assignments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.assignments (id, ticket_id, assigned_to, team_id, assigned_by, assigned_at, unassigned_at, created_at) VALUES ('11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '2026-09-20 23:54:44.838248', NULL, '2026-09-20 23:54:44.838248');
INSERT INTO public.assignments (id, ticket_id, assigned_to, team_id, assigned_by, assigned_at, unassigned_at, created_at) VALUES ('883859ec-9ad2-4f53-97fb-aa1772174aa0', 'f48bed13-ac91-4659-aa9f-5ef45b5475a3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-09-22 10:16:21.27044', NULL, '2026-09-22 10:16:21.27044');
INSERT INTO public.assignments (id, ticket_id, assigned_to, team_id, assigned_by, assigned_at, unassigned_at, created_at) VALUES ('447657ff-23fa-4d04-9845-bede9136a8be', 'b3280db7-6e66-4f78-8193-840ebd1855c1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-09-24 08:23:19.857284', '2026-09-24 08:23:25.850078', '2026-09-24 08:23:19.857284');
INSERT INTO public.assignments (id, ticket_id, assigned_to, team_id, assigned_by, assigned_at, unassigned_at, created_at) VALUES ('07a6a127-347b-4864-9570-2193d347e17a', '14c8dcfd-88db-435b-80fa-c4bbeddd235c', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-09-24 08:26:12.397328', '2026-09-24 08:26:18.408056', '2026-09-24 08:26:12.397328');
INSERT INTO public.assignments (id, ticket_id, assigned_to, team_id, assigned_by, assigned_at, unassigned_at, created_at) VALUES ('bb850f28-f2a8-411e-8091-65fad928676e', '04ccd940-8d9d-4663-b7ba-f8e553b11ed9', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-09-24 08:26:49.794529', '2026-09-24 08:26:56.285954', '2026-09-24 08:26:49.794529');
INSERT INTO public.assignments (id, ticket_id, assigned_to, team_id, assigned_by, assigned_at, unassigned_at, created_at) VALUES ('8d108764-6067-4736-baad-92a68199f864', '89768be7-0f5b-4a35-81fb-63dc545fb355', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-09-24 08:27:37.598861', '2026-09-24 08:27:43.957837', '2026-09-24 08:27:37.598861');
INSERT INTO public.assignments (id, ticket_id, assigned_to, team_id, assigned_by, assigned_at, unassigned_at, created_at) VALUES ('58c67572-d358-428a-9376-a9b74cc8e0a7', '1538f188-2e28-4f85-896c-532105ca4916', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-09-24 08:47:38.340181', '2026-09-24 08:47:48.915427', '2026-09-24 08:47:38.340181');
INSERT INTO public.assignments (id, ticket_id, assigned_to, team_id, assigned_by, assigned_at, unassigned_at, created_at) VALUES ('74421e23-0e8f-403e-8ff9-17b6177e46f8', '9cd504a1-bbea-4e79-9e32-7b1837ed53a1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-09-24 08:48:42.05203', NULL, '2026-09-24 08:48:42.05203');


--
-- Data for Name: attachments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.attachments (id, ticket_id, uploaded_by, file_name, file_reference, size, visibility, created_at) VALUES ('450d3e75-0f74-434f-b22d-45ce1ed21323', 'b3280db7-6e66-4f78-8193-840ebd1855c1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'smoke.png', 'local/smoke.png', 1234, 'Reporter_Visible', '2026-09-24 08:23:24.355815');
INSERT INTO public.attachments (id, ticket_id, uploaded_by, file_name, file_reference, size, visibility, created_at) VALUES ('371861a2-031e-4370-983f-53a333c71fac', '14c8dcfd-88db-435b-80fa-c4bbeddd235c', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'smoke.png', 'local/smoke.png', 1234, 'Reporter_Visible', '2026-09-24 08:26:16.852047');
INSERT INTO public.attachments (id, ticket_id, uploaded_by, file_name, file_reference, size, visibility, created_at) VALUES ('a8f63c76-b5a2-449e-83c6-4b669297a61b', '04ccd940-8d9d-4663-b7ba-f8e553b11ed9', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'smoke.png', 'local/smoke.png', 1234, 'Reporter_Visible', '2026-09-24 08:26:54.802496');
INSERT INTO public.attachments (id, ticket_id, uploaded_by, file_name, file_reference, size, visibility, created_at) VALUES ('717b1ddc-767d-4bb9-ae36-c01b2faf818c', '89768be7-0f5b-4a35-81fb-63dc545fb355', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'smoke.png', 'local/smoke.png', 1234, 'Reporter_Visible', '2026-09-24 08:27:42.336461');
INSERT INTO public.attachments (id, ticket_id, uploaded_by, file_name, file_reference, size, visibility, created_at) VALUES ('cf021aee-3e29-4ab5-800a-ea78b26c40ed', '1538f188-2e28-4f85-896c-532105ca4916', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'port-test.jpg', 'https://storage.example/port-test.jpg', 184320, 'Internal', '2026-09-24 08:47:45.148646');
INSERT INTO public.attachments (id, ticket_id, uploaded_by, file_name, file_reference, size, visibility, created_at) VALUES ('c917b374-5b50-4853-9a19-3c81f39e061a', '9cd504a1-bbea-4e79-9e32-7b1837ed53a1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'probe.txt', 'https://example.com/probe.txt', 2048, 'Internal', '2026-09-24 08:48:46.410568');


--
-- Data for Name: business_hours; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.business_hours (id, name, day_of_week, start_time, end_time, is_working_day, created_at, updated_at) VALUES ('99999999-9999-9999-9999-999999999999', 'Monday', 1, '09:00:00', '17:00:00', true, '2026-09-20 23:54:44.838248', '2026-09-20 23:54:44.838248');
INSERT INTO public.business_hours (id, name, day_of_week, start_time, end_time, is_working_day, created_at, updated_at) VALUES ('aaaaaaaa-1111-1111-1111-111111111111', 'Tuesday', 2, '09:00:00', '17:00:00', true, '2026-09-20 23:54:44.838248', '2026-09-20 23:54:44.838248');


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.comments (id, ticket_id, author_id, body, visibility, created_at, updated_at, updated_by) VALUES ('22222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'The issue has been reviewed and assigned for investigation.', 'Reporter_Visible', '2026-09-20 23:54:44.838248', '2026-09-20 23:54:44.838248', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
INSERT INTO public.comments (id, ticket_id, author_id, body, visibility, created_at, updated_at, updated_by) VALUES ('44e257dd-0e70-4e2f-b8a6-7dee8ad0e980', 'cccccccc-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Postman security test', 'Reporter_Visible', '2026-09-23 08:23:46.831844', '2026-09-23 08:23:46.831844', 'dddddddd-dddd-dddd-dddd-dddddddddddd');
INSERT INTO public.comments (id, ticket_id, author_id, body, visibility, created_at, updated_at, updated_by) VALUES ('6977acdb-381a-44b0-91d2-125d502a9415', 'b3280db7-6e66-4f78-8193-840ebd1855c1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Smoke test comment', 'Reporter_Visible', '2026-09-24 08:23:22.738792', '2026-09-24 08:23:22.738792', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
INSERT INTO public.comments (id, ticket_id, author_id, body, visibility, created_at, updated_at, updated_by) VALUES ('abc69389-a4e6-4c48-8bc5-47ff83baa49c', '14c8dcfd-88db-435b-80fa-c4bbeddd235c', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Smoke test comment', 'Reporter_Visible', '2026-09-24 08:26:15.1512', '2026-09-24 08:26:15.1512', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
INSERT INTO public.comments (id, ticket_id, author_id, body, visibility, created_at, updated_at, updated_by) VALUES ('b89f8a30-fff3-4485-8e5c-f08857474c00', '04ccd940-8d9d-4663-b7ba-f8e553b11ed9', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Smoke test comment', 'Reporter_Visible', '2026-09-24 08:26:53.110658', '2026-09-24 08:26:53.110658', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
INSERT INTO public.comments (id, ticket_id, author_id, body, visibility, created_at, updated_at, updated_by) VALUES ('a224c71d-2410-4f42-a990-9fa25cf7ef12', '89768be7-0f5b-4a35-81fb-63dc545fb355', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Smoke test comment', 'Reporter_Visible', '2026-09-24 08:27:40.640988', '2026-09-24 08:27:40.640988', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
INSERT INTO public.comments (id, ticket_id, author_id, body, visibility, created_at, updated_at, updated_by) VALUES ('9a458982-9ca8-448c-9036-d552b1128c25', '1538f188-2e28-4f85-896c-532105ca4916', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Internal note: bench test passed after the cable swap.', 'Internal', '2026-09-24 08:47:42.63385', '2026-09-24 08:47:42.63385', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
INSERT INTO public.comments (id, ticket_id, author_id, body, visibility, created_at, updated_at, updated_by) VALUES ('175509f8-d7e9-45b5-ab3f-56aa329051e1', '1538f188-2e28-4f85-896c-532105ca4916', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'We replaced the patch cable; please confirm the connection is stable.', 'Reporter_Visible', '2026-09-24 08:47:44.018255', '2026-09-24 08:47:44.018255', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
INSERT INTO public.comments (id, ticket_id, author_id, body, visibility, created_at, updated_at, updated_by) VALUES ('d409955c-cbbb-4741-8d9c-5b3b88419600', '9cd504a1-bbea-4e79-9e32-7b1837ed53a1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Raw shape probe comment', 'Internal', '2026-09-24 08:48:44.7441', '2026-09-24 08:48:44.7441', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
INSERT INTO public.comments (id, ticket_id, author_id, body, visibility, created_at, updated_at, updated_by) VALUES ('0bc0d62b-f158-47e5-9a06-346dbd182ab1', '9cd504a1-bbea-4e79-9e32-7b1837ed53a1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'UI smoke test note (safe to delete)', 'Internal', '2026-09-24 09:53:38.107646', '2026-09-24 09:53:38.107646', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
INSERT INTO public.comments (id, ticket_id, author_id, body, visibility, created_at, updated_at, updated_by) VALUES ('a2333bf7-aaf2-4951-9cb4-85e98ffee9f5', '9cd504a1-bbea-4e79-9e32-7b1837ed53a1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'UI smoke test note (safe to delete)', 'Internal', '2026-09-24 09:55:19.413583', '2026-09-24 09:55:19.413583', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');


--
-- Data for Name: escalation; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.escalation (id, ticket_id, escalated_at, escalated_by, escalated_to, reason, created_at) VALUES ('33333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-1111-1111-1111-111111111111', '2026-09-20 23:54:44.838248', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'High priority issue requires manager attention.', '2026-09-20 23:54:44.838248');
INSERT INTO public.escalation (id, ticket_id, escalated_at, escalated_by, escalated_to, reason, created_at) VALUES ('a9784115-2c91-4983-8ef0-bd47bed01163', '89768be7-0f5b-4a35-81fb-63dc545fb355', '2026-09-24 08:42:09.537912', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Escalation endpoint validation from the frontend integration pass', '2026-09-24 08:42:09.537912');
INSERT INTO public.escalation (id, ticket_id, escalated_at, escalated_by, escalated_to, reason, created_at) VALUES ('b42dbefc-899f-4f18-9fea-6399df190c38', '1538f188-2e28-4f85-896c-532105ca4916', '2026-09-24 08:47:47.240813', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Integration test: needs manager approval for a replacement unit.', '2026-09-24 08:47:47.240813');


--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.feedback (id, ticket_id, reporter_id, resolution_confirmed, rating, reopen_reason, created_at, updated_at) VALUES ('66666666-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', false, NULL, NULL, '2026-09-20 23:54:44.838248', '2026-09-20 23:54:44.838248');
INSERT INTO public.feedback (id, ticket_id, reporter_id, resolution_confirmed, rating, reopen_reason, created_at, updated_at) VALUES ('0adc1a05-57e2-4f61-a6a8-70733948a93e', 'f48bed13-ac91-4659-aa9f-5ef45b5475a3', 'dddddddd-dddd-dddd-dddd-dddddddddddd', true, 5, NULL, '2026-09-22 11:54:00.946793', '2026-09-22 11:54:00.946793');
INSERT INTO public.feedback (id, ticket_id, reporter_id, resolution_confirmed, rating, reopen_reason, created_at, updated_at) VALUES ('c162081e-6bf9-4964-af81-941fd34203a5', 'b3280db7-6e66-4f78-8193-840ebd1855c1', 'dddddddd-dddd-dddd-dddd-dddddddddddd', true, 5, NULL, '2026-09-24 08:25:57.789224', '2026-09-24 08:25:57.789224');
INSERT INTO public.feedback (id, ticket_id, reporter_id, resolution_confirmed, rating, reopen_reason, created_at, updated_at) VALUES ('3b482a69-09ca-4a66-8f7e-971de71b9c8c', '89768be7-0f5b-4a35-81fb-63dc545fb355', 'dddddddd-dddd-dddd-dddd-dddddddddddd', true, 5, NULL, '2026-09-24 08:27:45.51809', '2026-09-24 08:27:45.51809');
INSERT INTO public.feedback (id, ticket_id, reporter_id, resolution_confirmed, rating, reopen_reason, created_at, updated_at) VALUES ('27c89480-7ef8-4212-aab9-67b9917acb56', '1538f188-2e28-4f85-896c-532105ca4916', 'dddddddd-dddd-dddd-dddd-dddddddddddd', true, 5, NULL, '2026-09-24 08:47:50.3174', '2026-09-24 08:47:50.3174');


--
-- Data for Name: predictions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.predictions (id, ticket_id, suggested_category_id, suggested_priority, duplicate_candidate_ticket_id, sla_risk_flag, confidence, explanation, model_version, decision, decided_by, decided_at, created_at) VALUES ('55555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777777', 'High', NULL, true, 0.91, 'Projector issue appears to be a high priority hardware problem.', 'dev-model-v1', 'Accepted', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-09-20 23:54:44.838248', '2026-09-20 23:54:44.838248');
INSERT INTO public.predictions (id, ticket_id, suggested_category_id, suggested_priority, duplicate_candidate_ticket_id, sla_risk_flag, confidence, explanation, model_version, decision, decided_by, decided_at, created_at) VALUES ('88db7873-7ba4-4502-8d2b-039e6d731ac0', 'cccccccc-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777777', 'Low', NULL, true, 1, 'Postman prediction test', 'test-v1', 'Accepted', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-09-23 09:06:23.960238', '2026-09-23 08:54:01.876502');


--
-- Data for Name: sla_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sla_profiles (sla_profile_id, name, category_id, team_id, business_hours_id, target_response_time, target_resolution_time, created_at, updated_at, created_by, updated_by) VALUES ('bbbbbbbb-1111-1111-1111-111111111111', 'Hardware SLA', '77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999999', '01:00:00', '08:00:00', '2026-09-20 23:54:44.838248', '2026-09-20 23:54:44.838248', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'cccccccc-cccc-cccc-cccc-cccccccccccc');


--
-- Data for Name: ticket_status_history; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('eeeeeeee-1111-1111-1111-111111111111', 'cccccccc-1111-1111-1111-111111111111', NULL, 'New', '2026-09-20 23:54:44.838248', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Ticket created');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('ffffffff-1111-1111-1111-111111111111', 'cccccccc-1111-1111-1111-111111111111', 'New', 'Triaged', '2026-09-20 23:54:44.838248', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ticket reviewed');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('0440d6f6-fcdb-44ee-bf10-1d0ddec51011', '4791a505-225e-40e6-8e6a-803f90b403b0', NULL, 'New', '2026-09-22 04:32:13.295922', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Ticket created');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('ba3b82b3-ddd2-472b-a51f-287aa0056140', '4791a505-225e-40e6-8e6a-803f90b403b0', 'New', 'Triaged', '2026-09-22 04:38:36.694217', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Initial triage completed');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('876b2780-2412-421f-b8ee-47077c67ad1d', '4791a505-225e-40e6-8e6a-803f90b403b0', 'Triaged', 'Assigned', '2026-09-22 04:45:46.656559', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ticket assigned to technician');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('fbd64218-33a3-4506-b50a-bfb9772eb3e1', 'f48bed13-ac91-4659-aa9f-5ef45b5475a3', NULL, 'New', '2026-09-22 09:50:19.423772', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Ticket created');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('5da28b53-0625-41b4-ab49-31bfe3fc23cc', 'f48bed13-ac91-4659-aa9f-5ef45b5475a3', 'New', 'Triaged', '2026-09-22 10:12:50.589052', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Initial triage completed');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('547e335a-a712-44c1-ac31-fd73649498b9', 'f48bed13-ac91-4659-aa9f-5ef45b5475a3', 'Triaged', 'Assigned', '2026-09-22 10:16:21.27044', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Assigned to maintenance technician');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('0f4d067a-2746-4721-a1cf-863a45aba3c7', 'f48bed13-ac91-4659-aa9f-5ef45b5475a3', 'Assigned', 'In_Progress', '2026-09-22 11:36:44.099227', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Technician started working on the ticket');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('620dd66d-7928-489a-a68c-af8f1e000340', 'f48bed13-ac91-4659-aa9f-5ef45b5475a3', 'In_Progress', 'Waiting', '2026-09-22 11:38:49.543526', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Waiting for additional information');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('c79e425b-9c05-4f3b-8064-0f1f8a3b73d4', 'f48bed13-ac91-4659-aa9f-5ef45b5475a3', 'Waiting', 'In_Progress', '2026-09-22 11:38:49.622845', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Information received and work resumed');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('47c4873e-566e-4ff9-97c9-65f5d799195d', 'f48bed13-ac91-4659-aa9f-5ef45b5475a3', 'In_Progress', 'Resolved', '2026-09-22 11:38:49.630539', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Printer issue resolved and tested successfully');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('3f0308b2-e18a-4ed0-b424-9cb2e7956642', 'f48bed13-ac91-4659-aa9f-5ef45b5475a3', 'Resolved', 'Closed', '2026-09-22 11:54:00.946793', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Resolution confirmed by reporter');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('c0b50967-e407-450a-a64f-e255d9f8de59', '9cd504a1-bbea-4e79-9e32-7b1837ed53a1', NULL, 'New', '2026-09-23 08:04:15.688884', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Ticket created');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('bffca2c8-e85b-434c-baa9-f6f51dfec48f', 'b3280db7-6e66-4f78-8193-840ebd1855c1', NULL, 'New', '2026-09-24 08:23:17.406222', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Ticket created');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('2a0627a6-065e-4610-81a8-cc08f016610f', 'b3280db7-6e66-4f78-8193-840ebd1855c1', 'New', 'Triaged', '2026-09-24 08:23:18.7953', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Smoke test triage');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('6529a005-9263-422a-848b-ef7461cbb25d', 'b3280db7-6e66-4f78-8193-840ebd1855c1', 'Triaged', 'Assigned', '2026-09-24 08:23:19.857284', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Smoke assign');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('1c6f6766-2467-4eca-a671-dae7dee61fdb', 'b3280db7-6e66-4f78-8193-840ebd1855c1', 'Assigned', 'In_Progress', '2026-09-24 08:23:21.440962', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Smoke test start');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('8ef1fb57-6ebb-4504-841a-178cfce2f127', 'b3280db7-6e66-4f78-8193-840ebd1855c1', 'In_Progress', 'Resolved', '2026-09-24 08:23:25.850078', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Smoke test resolve');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('b8978194-d178-4c75-b42a-05be546f70a2', 'b3280db7-6e66-4f78-8193-840ebd1855c1', 'Resolved', 'Closed', '2026-09-24 08:25:57.789224', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Resolution confirmed by reporter');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('e3de2d99-661d-4170-803e-45265013c7ef', '14c8dcfd-88db-435b-80fa-c4bbeddd235c', NULL, 'New', '2026-09-24 08:26:09.687477', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Ticket created');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('6d8ae0d8-4552-4173-addc-d32ea28848ac', '14c8dcfd-88db-435b-80fa-c4bbeddd235c', 'New', 'Triaged', '2026-09-24 08:26:11.18621', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Smoke test triage');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('4445e4ea-3173-4a87-83c0-c4ba6fae1093', '14c8dcfd-88db-435b-80fa-c4bbeddd235c', 'Triaged', 'Assigned', '2026-09-24 08:26:12.397328', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Smoke assign');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('9aed3027-a6e9-487b-aa7c-a775755d0021', '14c8dcfd-88db-435b-80fa-c4bbeddd235c', 'Assigned', 'In_Progress', '2026-09-24 08:26:13.939069', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Smoke test start');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('29814244-4d40-42a1-a667-07e197e01f41', '14c8dcfd-88db-435b-80fa-c4bbeddd235c', 'In_Progress', 'Resolved', '2026-09-24 08:26:18.408056', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Smoke test resolve');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('9e42178e-1813-4a40-830e-c56611352735', '04ccd940-8d9d-4663-b7ba-f8e553b11ed9', NULL, 'New', '2026-09-24 08:26:46.630698', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Ticket created');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('2f8d745d-a4e1-45e5-9dce-f292b30e59bf', '04ccd940-8d9d-4663-b7ba-f8e553b11ed9', 'New', 'Triaged', '2026-09-24 08:26:48.44946', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Smoke test triage');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('9363db0a-d79f-4d52-9c31-83c2ebd9db09', '04ccd940-8d9d-4663-b7ba-f8e553b11ed9', 'Triaged', 'Assigned', '2026-09-24 08:26:49.794529', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Smoke assign');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('fc41062c-4304-4d52-8829-5e475dc5b600', '04ccd940-8d9d-4663-b7ba-f8e553b11ed9', 'Assigned', 'In_Progress', '2026-09-24 08:26:51.903395', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Smoke test start');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('bc7d25ea-08b4-4751-a10c-9438793f115b', '04ccd940-8d9d-4663-b7ba-f8e553b11ed9', 'In_Progress', 'Resolved', '2026-09-24 08:26:56.285954', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Smoke test resolve');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('925e77ed-de9e-4bbe-9f79-e6e07be0875c', '89768be7-0f5b-4a35-81fb-63dc545fb355', NULL, 'New', '2026-09-24 08:27:34.756796', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Ticket created');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('4b058ae5-2799-48bf-93ed-b1f666764c24', '89768be7-0f5b-4a35-81fb-63dc545fb355', 'New', 'Triaged', '2026-09-24 08:27:36.502502', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Smoke test triage');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('8e94bbea-52f4-4493-8dc4-51e41152f573', '89768be7-0f5b-4a35-81fb-63dc545fb355', 'Triaged', 'Assigned', '2026-09-24 08:27:37.598861', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Smoke assign');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('d919ceb4-3c4d-44c3-990b-bd537a6d30c1', '89768be7-0f5b-4a35-81fb-63dc545fb355', 'Assigned', 'In_Progress', '2026-09-24 08:27:39.42643', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Smoke test start');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('3c50a7a9-e09f-4a00-9ee6-1da4a0f17547', '89768be7-0f5b-4a35-81fb-63dc545fb355', 'In_Progress', 'Resolved', '2026-09-24 08:27:43.957837', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Smoke test resolve');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('19ae34d9-a7be-425d-b2d3-3f5b980f496b', '89768be7-0f5b-4a35-81fb-63dc545fb355', 'Resolved', 'Closed', '2026-09-24 08:27:45.51809', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Resolution confirmed by reporter');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('5c8a4935-4552-4f9e-863c-b0907ed73568', '1538f188-2e28-4f85-896c-532105ca4916', NULL, 'New', '2026-09-24 08:43:10.818446', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Ticket created');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('f0343630-469d-4927-8886-875558073fc0', '1538f188-2e28-4f85-896c-532105ca4916', 'New', 'Triaged', '2026-09-24 08:46:47.725222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'probe');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('d534d00f-7229-4e16-9a27-ab31f732db46', '9cd504a1-bbea-4e79-9e32-7b1837ed53a1', 'New', 'Triaged', '2026-09-24 08:46:51.223148', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'probe');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('898e48a0-2b2a-498f-94c1-d0cbfcc31465', '1538f188-2e28-4f85-896c-532105ca4916', 'Triaged', 'Assigned', '2026-09-24 08:47:38.340181', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Integration test: assign technician');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('7762deab-451a-40e7-9b56-aaf516413a30', '1538f188-2e28-4f85-896c-532105ca4916', 'Assigned', 'In_Progress', '2026-09-24 08:47:39.947492', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Integration test: start work');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('0738d89f-a9ac-47df-9784-201f84b57f90', '1538f188-2e28-4f85-896c-532105ca4916', 'In_Progress', 'Resolved', '2026-09-24 08:47:48.915427', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Integration test: fix verified');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('278776ab-93d0-46b6-b72e-f83a148d590d', '1538f188-2e28-4f85-896c-532105ca4916', 'Resolved', 'Closed', '2026-09-24 08:47:50.3174', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Resolution confirmed by reporter');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('4cbce6e9-51a3-410c-8b2c-5672122d0862', '9cd504a1-bbea-4e79-9e32-7b1837ed53a1', 'Triaged', 'Assigned', '2026-09-24 08:48:42.05203', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'raw shape probe');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('c25e5176-49b5-4542-bccf-3d6ecdaba644', '9cd504a1-bbea-4e79-9e32-7b1837ed53a1', 'Assigned', 'In_Progress', '2026-09-24 08:48:43.509729', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'raw shape probe');
INSERT INTO public.ticket_status_history (id, ticket_id, from_status, to_status, changed_date, changed_by, reason) VALUES ('9eaaf4f2-7e0d-4622-82d1-cf46f1c0a14e', '251c8de5-0e51-40ae-8a15-10276e231dd0', NULL, 'New', '2026-09-24 18:33:23.712384', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Ticket created');


--
-- Data for Name: work_logs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.work_logs (id, ticket_id, user_id, action, work_time, parts, resolution_code, created_at, updated_at) VALUES ('44444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Checked projector connections.', '00:30:00', NULL, NULL, '2026-09-20 23:54:44.838248', '2026-09-20 23:54:44.838248');
INSERT INTO public.work_logs (id, ticket_id, user_id, action, work_time, parts, resolution_code, created_at, updated_at) VALUES ('6063f375-e09c-47bf-91f1-c3f2416005b5', 'f48bed13-ac91-4659-aa9f-5ef45b5475a3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Checked printer connection and power supply', '00:30:00', 'None', NULL, '2026-09-22 11:37:06.726039', '2026-09-22 11:37:06.726039');
INSERT INTO public.work_logs (id, ticket_id, user_id, action, work_time, parts, resolution_code, created_at, updated_at) VALUES ('dc78643d-c2c5-4dee-8df3-bf2c48ac6c43', '1538f188-2e28-4f85-896c-532105ca4916', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Reseated the network cable and re-tested the port.', '00:45:00', 'Cat6 patch cable', 'HW-FIX', '2026-09-24 08:47:41.313172', '2026-09-24 08:47:41.313172');


--
-- PostgreSQL database dump complete
--

\unrestrict ReVLSUhvE6qbh3UFGId1kE2y0AYJNClBbhnywU0WUX5v7jzMz3hDHnBlzN8wFh9


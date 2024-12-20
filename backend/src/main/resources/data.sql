insert into member (member_id, created_at, email, password, phone_number)
values (1, '2024-07-29 15:49:40.798309', 'ssafy1@ssafy.com',
        '$2a$10$3r6F/VxEqrA2KJxSUk3uPO6PTvq8Kz/i039mf72/fn9at4de71w6C', '01012345678'),
       (2, '2024-07-29 15:49:40.798309', 'ssafy2@ssafy.com',
        '$2a$10$3r6F/VxEqrA2KJxSUk3uPO6PTvq8Kz/i039mf72/fn9at4de71w6C', '01022345678'),
       (3, '2024-07-29 15:49:40.798309', 'ssafy3@ssafy.com',
        '$2a$10$3r6F/VxEqrA2KJxSUk3uPO6PTvq8Kz/i039mf72/fn9at4de71w6C', '01032345678'),
       (4, '2024-07-29 15:49:40.798309', 'ssafy4@ssafy.com',
        '$2a$10$3r6F/VxEqrA2KJxSUk3uPO6PTvq8Kz/i039mf72/fn9at4de71w6C', '01042345678'),
       (5, '2024-07-29 15:49:40.798309', 'ssafy5@ssafy.com',
        '$2a$10$3r6F/VxEqrA2KJxSUk3uPO6PTvq8Kz/i039mf72/fn9at4de71w6C', '01052345678'),
       (6, '2024-07-29 15:49:40.798309', 'ssafy6@ssafy.com',
        '$2a$10$3r6F/VxEqrA2KJxSUk3uPO6PTvq8Kz/i039mf72/fn9at4de71w6C', '01062345678');

INSERT INTO `cam` (`cam_id`, `name`, `ip`, `status`, `region`, `member_id`, `thumbnail_url`)
VALUES (1, 'Cam1', '192.168.1.1', 'REGISTERED', 'Region1', 1, '/api/v1/cams/1/thumbnail'),
       (2, 'Cam2', '192.168.1.2', 'REGISTERED', 'Region2', 2, '/api/v1/cams/2/thumbnail'),
       (3, 'Cam3', '192.168.1.3', 'UNREGISTERED', 'Region3', 3, '/api/v1/cams/3/thumbnail'),
       (4, 'Cam4', '192.168.1.4', 'UNREGISTERED', 'Region1', 4, '/api/v1/cams/4/thumbnail'),
       (5, 'Cam5', '192.168.1.5', 'UNREGISTERED', 'Region2', 5, '/api/v1/cams/5/thumbnail');

INSERT INTO `video` (`video_id`, `record_started_at`, `stream_url`, `download_url`, `length`, `thumbnail_url`, `cam_id`,
                     `is_threat`)
VALUES (1, '2023-07-29 10:00:00', '/api/v1/cams/videos/1/stream', '/api/v1/cams/videos/1/download', 120,
        '/api/v1/cams/videos/1/thumbnail', 1, 0),
       (2, '2023-07-29 11:00:00', '/api/v1/cams/videos/2/stream', '/api/v1/cams/videos/2/download', 150,
        '/api/v1/cams/videos/2/thumbnail', 2, 0),
       (3, '2023-07-29 13:00:00', '/api/v1/cams/videos/3/stream', '/api/v1/cams/videos/3/download', 180,
        '/api/v1/cams/videos/3/thumbnail', 1, 0);

INSERT INTO `event` (`event_id`, `occurred_at`, `type`, `cam_id`, `video_id`, `is_read`)
VALUES (1, '2023-07-29 10:00:00', 'INVASION', 1, 1, 0),
       (2, '2023-07-29 11:00:00', 'SOUND', 2, 2, 0),
       (3, '2023-07-29 12:00:00', 'FIRE', 1, 2, 1),
       (4, '2023-07-29 13:00:00', 'SOUND', 1, 3, 0),
       (5, '2023-07-29 14:00:00', 'INVASION', 1, 1, 1);



INSERT INTO `env_info` (`env_info_id`, `recorded_at`, `temperature`, `humidity`, `status`, `cam_id`)
VALUES (1, '2023-07-29 09:00:00', 25.5, 60.0, 'RECORDING', 1),
       (2, '2023-07-29 09:30:00', 26.0, 55.0, 'RECORDING', 2),
       (3, '2023-07-29 10:00:00', 24.0, 65.0, 'RECORDING', 1),
       (4, '2023-07-29 10:30:00', 27.5, 70.0, 'OFFLINE', 2),
       (5, '2023-07-29 11:00:00', 23.5, 50.0, 'OFFLINE', 1);

-- 더미 데이터 삽입: SHARE 테이블
INSERT INTO `share` (`share_id`, `member_id`, `shared_member_id`, `nickname`)
VALUES (1, 1, 2, '엄마'),
       (2, 1, 3, '아빠'),
       (3, 1, 4, '형'),
       (4, 1, 5, '누나');

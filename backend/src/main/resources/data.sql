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

insert
into member_roles (member_member_id, roles)
values (1, 'ROLE_USER'),
       (2, 'ROLE_USER'),
       (3, 'ROLE_USER'),
       (4, 'ROLE_USER'),
       (5, 'ROLE_USER'),
       (6, 'ROLE_USER');

INSERT INTO `cam` (`cam_id`, `name`, `ip`, `status`, `region`, `member_id`)
VALUES (1, 'Cam1', '192.168.1.1', 'REGISTERED', 'Region1', 1),
       (2, 'Cam2', '192.168.1.2', 'REGISTERED', 'Region2', 2),
       (3, 'Cam3', '192.168.1.3', 'UNREGISTERED', 'Region3', 3),
       (4, 'Cam4', '192.168.1.4', 'UNREGISTERED', 'Region1', 4),
       (5, 'Cam5', '192.168.1.5', 'UNREGISTERED', 'Region2', 5);

INSERT INTO `video` (`video_id`, `record_started_at`, `url`, `length`, `thumbnail_url`, `cam_id`,  `is_threat`)
VALUES (1, '2023-07-29 10:00:00', 'http://example.com/video1.mp4', 120, 'http://example.com/thumb1.jpg', 1, 0),
       (2, '2023-07-29 11:00:00', 'http://example.com/video2.mp4', 150, 'http://example.com/thumb2.jpg', 2, 0),
       (3, '2023-07-29 13:00:00', 'http://example.com/video3.mp4', 180, 'http://example.com/thumb3.jpg', 1, 0);

INSERT INTO `event` (`event_id`, `occurred_at`, `type`, `cam_id`, `video_id`)
VALUES (1, '2023-07-29 10:00:00', 'INVASION', 1, 1),
       (2, '2023-07-29 11:00:00', 'SOUND', 2, 2),
       (3, '2023-07-29 12:00:00', 'FIRE', 1, 2),
       (4, '2023-07-29 13:00:00', 'SOUND', 1, 3),
       (5, '2023-07-29 14:00:00', 'INVASION', 1, 1);



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

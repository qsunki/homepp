package ssafy.age.backend.video.web;

import ssafy.age.backend.video.service.VideoCommand;

public record VideoRecordRequestDto(String key, VideoCommand command) {}

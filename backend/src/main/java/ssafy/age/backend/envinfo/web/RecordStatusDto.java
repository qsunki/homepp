package ssafy.age.backend.envinfo.web;

import ssafy.age.backend.envinfo.persistence.RecordStatus;

public record RecordStatusDto(Long camId, RecordStatus status) {}

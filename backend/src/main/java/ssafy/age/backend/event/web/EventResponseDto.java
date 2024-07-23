package ssafy.age.backend.event.web;

import lombok.Data;
import ssafy.age.backend.event.persistence.EventType;

import java.util.Date;

@Data
public class EventResponseDto {

    private Date occurredAt;//TODO: 타입수정
    private EventType type;
    private Long camId;
    private Long videoId;
}

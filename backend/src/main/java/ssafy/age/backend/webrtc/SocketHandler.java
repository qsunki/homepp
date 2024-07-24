package ssafy.age.backend.webrtc;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ArrayListMultimap;
import com.google.common.collect.Multimap;
import com.google.common.collect.Multimaps;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class SocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper;

    // roomId를 키로 하고 해당 room에 속한 WebSocketSession을 값으로 가지는 Multimap
    Multimap<String, WebSocketSession> multimap = ArrayListMultimap.create();
    Multimap<String, WebSocketSession> sessions = Multimaps.synchronizedMultimap(multimap);

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        String payload = message.getPayload();
        log.debug("Received message: " + payload);

        // message가 특정 방에 속하는 경우를 가정하여 roomId를 추출
        String roomId = extractRoomIdFromMessage(payload);
        if (roomId != null) {
            // roomId에 해당하는 모든 세션에 메시지 전송
            sendMessageToRoom(roomId, message);
        } else {
            log.warn("No roomId found in message: " + payload);
        }
    }

    private String extractRoomIdFromMessage(String message) {
        // 메시지에서 roomId를 추출하는 로직 구현 (예: JSON 파싱)
        // 예시: {"roomId": "room1", "message": "Hello World"}
        try {
            JsonNode json = objectMapper.readTree(message);
            if (!json.has("roomId")) {
                return null;
            }
            return json.get("roomId").asText();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void sendMessageToRoom(String roomId, TextMessage message) throws IOException {
        for (WebSocketSession session : sessions.get(roomId)) {
            if (session.isOpen()) {
                session.sendMessage(message);
            }
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // 연결이 맺어진 후 클라이언트를 특정 room에 추가하는 로직
        String roomId = extractRoomIdFromSession(session);
        if (roomId != null) {
            sessions.put(roomId, session);
            log.info("Session added to room: " + roomId);
        } else {
            log.warn("No roomId found for session: " + session.getId());
        }
    }

    private String extractRoomIdFromSession(WebSocketSession session) {
        // session에서 roomId를 추출하는 로직 구현 (예: URL 또는 초기 메시지에서 추출)
        // 예시: WebSocketSession의 URI 쿼리 파라미터에서 roomId 추출
        String uri = session.getUri().toString();
        String[] queryParams = uri.split("\\?");
        if (queryParams.length > 1) {
            for (String param : queryParams[1].split("&")) {
                String[] keyValue = param.split("=");
                if (keyValue.length == 2 && keyValue[0].equals("roomId")) {
                    return keyValue[1];
                }
            }
        }
        return null;
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // 연결이 종료된 후 클라이언트를 특정 room에서 제거하는 로직
        String roomId = extractRoomIdFromSession(session);
        if (roomId != null) {
            sessions.remove(roomId, session);
            log.info("Session removed from room: " + roomId);
        }
    }
}

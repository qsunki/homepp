package ssafy.age.backend.webrtc;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Type;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.converter.StringMessageConverter;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class SignalControllerTest {
    @MockitoBean
    MqttPahoClientFactory mqttClientFactory;

    @MockitoBean
    MessageProducer inbound;

    @MockitoBean
    MessageHandler mqttOutbound;

    @LocalServerPort
    int port;

    WebSocketStompClient stompClient;
    StompSession stompSession;
    CompletableFuture<String> completableFuture;

    @BeforeEach
    void setUp() throws Exception {
        stompClient = new WebSocketStompClient(new SockJsClient(createTransportClient()));
        stompClient.setMessageConverter(new StringMessageConverter());

        stompSession = stompClient
                .connectAsync("ws://localhost:" + port + "/ws", new StompSessionHandlerAdapter() {})
                .get(1, TimeUnit.SECONDS);

        completableFuture = new CompletableFuture<>();
    }

    @Test
    void camToClient() throws Exception {
        // given
        stompSession.subscribe("/sub/client/1", new StringStompFrameHandler(completableFuture));
        String expected = "cam to client message";

        // when
        stompSession.send("/pub/cam/1", expected);

        // then
        String result = completableFuture.get(3, TimeUnit.SECONDS);
        assertThat(result).isEqualTo(expected);
    }

    private List<Transport> createTransportClient() {
        return List.of(new WebSocketTransport(new StandardWebSocketClient()));
    }

    private record StringStompFrameHandler(CompletableFuture<String> completableFuture) implements StompFrameHandler {

        @Override
        public Type getPayloadType(StompHeaders headers) {
            return String.class;
        }

        @Override
        public void handleFrame(StompHeaders headers, Object payload) {
            completableFuture.complete((String) payload);
        }
    }
}

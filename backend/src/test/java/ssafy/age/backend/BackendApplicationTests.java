package ssafy.age.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.messaging.MessageHandler;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
class BackendApplicationTests {

    @MockitoBean MqttPahoClientFactory mqttClientFactory;
    @MockitoBean MessageProducer inbound;
    @MockitoBean MessageHandler mqttOutbound;

    @Test
    void contextLoads() {}
}

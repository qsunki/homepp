package ssafy.age.backend.mqtt;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.Router;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.annotation.Transformer;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.handler.annotation.Header;
import ssafy.age.backend.envinfo.web.EnvInfoReceivedDto;
import ssafy.age.backend.envinfo.web.RecordStatusDto;
import ssafy.age.backend.event.service.EventDto;

@Configuration
public class MqttConfig {

    private final String brokerUrl;
    private final String[] topics;
    private final ObjectMapper objectMapper;

    public MqttConfig(
            ObjectMapper objectMapper,
            @Value("${mqtt.broker.topics}") String[] topics,
            @Value("${mqtt.broker.url}") String brokerUrl) {
        this.objectMapper = objectMapper;
        this.topics = topics;
        this.brokerUrl = brokerUrl;
    }

    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();
        options.setCleanSession(true);
        options.setAutomaticReconnect(true);
        options.setServerURIs(new String[] {brokerUrl});
        factory.setConnectionOptions(options);
        return factory;
    }

    @Bean
    @ServiceActivator(inputChannel = "mqttOutboundChannel")
    public MessageHandler mqttOutbound(MqttPahoClientFactory mqttClientFactory) {
        MqttPahoMessageHandler messageHandler = new MqttPahoMessageHandler("serverClient", mqttClientFactory);
        messageHandler.setDefaultTopic("/topic");
        return messageHandler;
    }

    @Bean
    public MessageChannel mqttOutboundChannel() {
        return new DirectChannel();
    }

    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }

    @Bean
    public MessageProducer inbound(MqttPahoClientFactory mqttClientFactory) {
        MqttPahoMessageDrivenChannelAdapter adapter = new MqttPahoMessageDrivenChannelAdapter(
                brokerUrl, MqttAsyncClient.generateClientId(), mqttClientFactory, topics);
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
    }

    @Router(inputChannel = "mqttInputChannel")
    public String router(@Header(MqttHeaders.RECEIVED_TOPIC) String topic) {
        return switch (topic) {
            case "server/envInfo" -> "envInfo";
            case "server/event" -> "event";
            case "server/status" -> "status";
            default -> null;
        };
    }

    @Bean
    public MessageChannel envInfo() {
        return new DirectChannel();
    }

    @Bean
    public MessageChannel envInfoDto() {
        return new DirectChannel();
    }

    @Bean
    public MessageChannel event() {
        return new DirectChannel();
    }

    @Bean
    public MessageChannel eventDto() {
        return new DirectChannel();
    }

    @Bean
    public MessageChannel status() {
        return new DirectChannel();
    }

    @Bean
    public MessageChannel statusDto() {
        return new DirectChannel();
    }

    @Bean
    public MessageChannel mqttTempChannel() {
        return new DirectChannel();
    }

    @Bean
    public MessageChannel gatewayRequest() {
        return new DirectChannel();
    }

    @Transformer(inputChannel = "envInfo", outputChannel = "envInfoDto")
    public EnvInfoReceivedDto envInfoTransformer(String payload) throws JsonProcessingException {
        return objectMapper.readValue(payload, EnvInfoReceivedDto.class);
    }

    @Transformer(inputChannel = "event", outputChannel = "eventDto")
    public EventDto eventTransformer(String payload) throws JsonProcessingException {
        return objectMapper.readValue(payload, EventDto.class);
    }

    @Transformer(inputChannel = "status", outputChannel = "statusDto")
    public RecordStatusDto envStatusTransformer(String payload) throws JsonProcessingException {
        return objectMapper.readValue(payload, RecordStatusDto.class);
    }

    @Transformer(inputChannel = "gatewayRequest", outputChannel = "mqttOutboundChannel")
    public String requestTransformer(Object payload) throws JsonProcessingException {
        return objectMapper.writeValueAsString(payload);
    }
}

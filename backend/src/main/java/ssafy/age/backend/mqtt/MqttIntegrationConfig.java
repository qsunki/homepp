package ssafy.age.backend.mqtt;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.dsl.IntegrationFlow;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;
import ssafy.age.backend.envinfo.web.EnvInfoReceivedDto;
import ssafy.age.backend.envinfo.web.RecordStatusDto;
import ssafy.age.backend.event.service.EventDto;

@Configuration
public class MqttIntegrationConfig {

    private final String brokerUrl;
    private final String[] topics;
    private final ObjectMapper objectMapper;
    private final MqttMessageHandler mqttMessageHandler;

    public MqttIntegrationConfig(
            ObjectMapper objectMapper,
            @Value("${mqtt.broker.topics}") String[] topics,
            @Value("${mqtt.broker.url}") String brokerUrl,
            MqttMessageHandler mqttMessageHandler) {
        this.objectMapper = objectMapper;
        this.topics = topics;
        this.brokerUrl = brokerUrl;
        this.mqttMessageHandler = mqttMessageHandler;
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
    public IntegrationFlow mqttOutboundFlow(MessageHandler mqttOutbound) {
        return IntegrationFlow.from("gatewayRequest")
                .transform(this::objectToString)
                .handle(mqttOutbound)
                .get();
    }

    @Bean
    public MessageHandler mqttOutbound(MqttPahoClientFactory mqttClientFactory) {
        MqttPahoMessageHandler messageHandler = new MqttPahoMessageHandler("serverClient", mqttClientFactory);
        messageHandler.setDefaultTopic("/topic");
        return messageHandler;
    }

    public String objectToString(Object payload) {
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException e) {
            throw new JsonTransformationException(e);
        }
    }

    @Bean
    public IntegrationFlow mqttInboundFlow() {
        return IntegrationFlow.from("mqttInputChannel")
                .route("headers['mqtt_receivedTopic']", mapping -> mapping.subFlowMapping(
                                "server/envInfo", sf -> sf.<String, EnvInfoReceivedDto>transform(
                                                payload -> transform(payload, EnvInfoReceivedDto.class))
                                        .handle(m ->
                                                mqttMessageHandler.handleEnvInfo((EnvInfoReceivedDto) m.getPayload())))
                        .subFlowMapping("server/event", sf -> sf.<String, EventDto>transform(
                                        payload -> transform(payload, EventDto.class))
                                .handle(m -> mqttMessageHandler.handleEvent((EventDto) m.getPayload())))
                        .subFlowMapping("server/status", sf -> sf.<String, RecordStatusDto>transform(
                                        payload -> transform(payload, RecordStatusDto.class))
                                .handle(m -> mqttMessageHandler.handleEnvInfoStatus((RecordStatusDto) m.getPayload()))))
                .get();
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

    public <T> T transform(String payload, Class<T> clazz) {
        try {
            return objectMapper.readValue(payload, clazz);
        } catch (JsonProcessingException e) {
            throw new JsonTransformationException(e);
        }
    }
}

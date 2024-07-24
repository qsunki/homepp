package ssafy.age.backend.notification.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ssafy.age.backend.notification.persistence.FCMToken;
import ssafy.age.backend.notification.persistence.FCMTokenRepository;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class FCMService {

    private final FCMTokenRepository fcmTokenRepository;

    public List<FCMToken> getAllFCMTokens() {
        return fcmTokenRepository.findAll();
    }

    public void sendMessageToAll(String title, String body) {
        List<FCMToken> fcmTokens = fcmTokenRepository.findAll();
        for (FCMToken fcmToken : fcmTokens) {
            sendMessage(fcmToken.getToken(), title, body);
        }
    }

    public FCMTokenDto save(FCMTokenDto token) {
        FCMToken fcmToken = new FCMToken(token.value);
        fcmTokenRepository.save(fcmToken);
        return token;
    }

    public void sendMessage(String targetToken, String title, String body) {
        Message message = Message.builder()
                .setToken(targetToken)
                .setNotification(Notification.builder().setTitle(title).setBody(body).build())
                .build();

        try {
            String response = FirebaseMessaging.getInstance().send(message);
            log.debug(response);
        } catch (FirebaseMessagingException e) {
            throw new RuntimeException(e);
        }

    }
}

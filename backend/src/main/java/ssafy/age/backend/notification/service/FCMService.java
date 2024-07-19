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

@Service
@Slf4j
@RequiredArgsConstructor
public class FCMService {

    private FCMTokenRepository fcmTokenRepository;

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

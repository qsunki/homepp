package ssafy.age.backend.notification.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ssafy.age.backend.auth.service.AuthService;
import ssafy.age.backend.event.persistence.Event;
import ssafy.age.backend.member.exception.MemberNotFoundException;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemberRepository;
import ssafy.age.backend.notification.persistence.FCMToken;
import ssafy.age.backend.notification.persistence.FCMTokenRepository;
import ssafy.age.backend.notification.web.FCMTokenDto;
import ssafy.age.backend.video.persistence.Video;

@Service
@Slf4j
@RequiredArgsConstructor
public class FCMService {

    private final FCMTokenRepository fcmTokenRepository;
    private final AuthService authService;
    private final MemberRepository memberRepository;

    public List<FCMToken> getAllFCMTokens() {
        return fcmTokenRepository.findAll();
    }

    public void sendMessageToAll(Video video) {
        List<FCMToken> fcmTokens = fcmTokenRepository.findAll();
        for (FCMToken fcmToken : fcmTokens) {
            sendThreatMessage(fcmToken.getToken(), video);
        }
    }

    @Transactional
    public FCMTokenDto save(String token) {
        log.debug("FCM token: {}", token);
        String memberEmail = authService.getMemberEmail();
        Member member =
                memberRepository.findByEmail(memberEmail).orElseThrow(MemberNotFoundException::new);
        FCMToken fcmToken = new FCMToken(token, member);
        member.getFcmTokenList().add(fcmToken);
        memberRepository.save(member);
        FCMToken saved = fcmTokenRepository.save(fcmToken);
        return new FCMTokenDto(saved.getToken());
    }

    public void sendSuccessMessage() {
        String email = authService.getMemberEmail();
        List<FCMToken> fcmTokens = fcmTokenRepository.findByMemberEmail(email);

        for (FCMToken fcmToken : fcmTokens) {
            log.debug("FCM Token in for loop : {}", fcmToken.getToken());
            Message message =
                    Message.builder()
                            .setToken(fcmToken.getToken())
                            .putData("messageType", "register")
                            .putData("result", "success")
                            .build();
            try {
                String response = FirebaseMessaging.getInstance().send(message);
                log.debug(response);
            } catch (FirebaseMessagingException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public void sendThreatMessage(String targetToken, Video video) {
        Message message = buildThreatMessage(targetToken, video);

        try {
            String response = FirebaseMessaging.getInstance().send(message);
            log.debug(response);
        } catch (FirebaseMessagingException e) {
            throw new RuntimeException(e);
        }
    }

    public Message buildThreatMessage(String targetToken, Video video) {
        StringBuilder types = new StringBuilder();
        for (Event event : video.getEvents()) {
            types.append(event.getType());
            if (!event.equals(video.getEvents().getLast())) {
                types.append('/');
            }
        }

        String messageTitle = video.getCam().getRegion() + types + " 발생";

        String messageBody =
                "금일 "
                        + video.getRecordStartedAt().getHour()
                        + "시 "
                        + video.getRecordStartedAt().getMinute()
                        + "분 경 "
                        + video.getCam().getRegion()
                        + " 인근 "
                        + types
                        + " 발생, 인근 지역 주민들은 주의 바랍니다.";
        return Message.builder()
                .setToken(targetToken)
                .putData("messageTitle", messageTitle)
                .putData("messageBody", messageBody)
                .putData("messageType", "threat")
                .build();
    }
}

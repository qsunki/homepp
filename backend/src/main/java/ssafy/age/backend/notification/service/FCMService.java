package ssafy.age.backend.notification.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ssafy.age.backend.security.service.AuthService;
import ssafy.age.backend.event.persistence.Event;
import ssafy.age.backend.event.persistence.EventType;
import ssafy.age.backend.member.exception.MemberNotFoundException;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemberRepository;
import ssafy.age.backend.notification.persistence.FCMToken;
import ssafy.age.backend.notification.persistence.FCMTokenRepository;
import ssafy.age.backend.notification.web.FCMTokenDto;
import ssafy.age.backend.share.persistence.Share;
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
            sendThreatMessage(fcmToken, video);
        }
    }

    @Transactional
    public FCMTokenDto save(String token) {
        String memberEmail = authService.getMemberEmail();
        Member member =
                memberRepository.findByEmail(memberEmail).orElseThrow(MemberNotFoundException::new);

        Boolean exist = fcmTokenRepository.existsByTokenAndMember(token, member);

        if (exist) {
            return new FCMTokenDto(token);
        }

        FCMToken fcmToken = new FCMToken(token, member);
        FCMToken saved = fcmTokenRepository.save(fcmToken);
        member.getFcmTokenList().add(saved);
        memberRepository.save(member);
        return new FCMTokenDto(saved.getToken());
    }

    public void sendRegisterMessage(String email) {
        List<FCMToken> fcmTokens = fcmTokenRepository.findByMemberEmail(email);

        for (FCMToken fcmToken : fcmTokens) {
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
                fcmTokenRepository.delete(fcmToken);
                throw new RuntimeException(e);
            }
        }
    }

    public void sendOnOffMessage(String status, Long camId) {
        Member member =
                memberRepository.findByCamId(camId).orElseThrow(MemberNotFoundException::new);
        List<FCMToken> fcmTokens = fcmTokenRepository.findByMemberEmail(member.getEmail());
        for (FCMToken fcmToken : fcmTokens) {
            Message message =
                    Message.builder()
                            .setToken(fcmToken.getToken())
                            .putData("messageType", "onOff")
                            .putData("status", status)
                            .build();
            try {
                String response = FirebaseMessaging.getInstance().send(message);
                log.debug(response);
            } catch (FirebaseMessagingException e) {
                fcmTokenRepository.delete(fcmToken);
                throw new RuntimeException(e);
            }
        }
    }

    public void sendSharedMessage(String email, String sharedMemberEmail) {
        List<FCMToken> fcmTokens = fcmTokenRepository.findByMemberEmail(sharedMemberEmail);
        for (FCMToken fcmToken : fcmTokens) {
            Message message =
                    Message.builder()
                            .setToken(fcmToken.getToken())
                            .putData("messageType", "share")
                            .putData("email", email)
                            .build();
            try {
                String response = FirebaseMessaging.getInstance().send(message);
                log.debug(response);
            } catch (FirebaseMessagingException e) {
                fcmTokenRepository.delete(fcmToken);
                throw new RuntimeException(e);
            }
        }
    }

    @Transactional
    public void sendEventMessage(Event event) {
        Member member =
                memberRepository
                        .findByCamId(event.getCam().getId())
                        .orElseThrow(MemberNotFoundException::new);
        log.debug("sendEventMessage email : {}", member.getEmail());
        List<FCMToken> fcmTokens = fcmTokenRepository.findByMemberEmail(member.getEmail());
        log.debug("sendEventMessage fcmTokens size : {}", fcmTokens.size());

        for (FCMToken fcmToken : fcmTokens) {
            Message message =
                    buildEventMessage(fcmToken.getToken(), event, member.getEmail(), "home");
            try {
                String response = FirebaseMessaging.getInstance().send(message);
                log.debug(response);
            } catch (FirebaseMessagingException e) {
                fcmTokenRepository.delete(fcmToken);
                throw new RuntimeException(e);
            }
        }

        for (Share share : member.getShareList()) {
            Member sharedMember = share.getSharedMember();
            List<FCMToken> sharedMemberTokens =
                    fcmTokenRepository.findByMemberEmail(sharedMember.getEmail());
            for (FCMToken fcmToken : sharedMemberTokens) {
                Message message =
                        buildEventMessage(fcmToken.getToken(), event, member.getEmail(), "shared");
                try {
                    String response = FirebaseMessaging.getInstance().send(message);
                    log.debug(response);
                } catch (FirebaseMessagingException e) {
                    fcmTokenRepository.delete(fcmToken);
                    throw new RuntimeException(e);
                }
            }
        }
    }

    public Message buildEventMessage(String targetToken, Event event, String email, String flag) {
        String messageTitle = "";
        String messageBody = "";
        String eventType;

        if (flag.equals("home")) {
            messageTitle += "자택 ";
        } else {
            messageTitle += "공유받은 캠 ";
        }

        if (event.getType() == EventType.INVASION) {
            eventType = "침입 ";
        } else if (event.getType() == EventType.FIRE) {
            eventType = "화재 ";
        } else if (event.getType() == EventType.SOUND) {
            eventType = "소음 ";
        } else {
            eventType = "미분류 ";
        }
        messageTitle += eventType + "감지";

        messageBody +=
                event.getOccurredAt().getHour() + "시 " + event.getOccurredAt().getMinute() + "분 경";
        if (flag.equals("home")) {
            messageBody += " 자택 ";
        } else {
            messageBody += email.split("@")[0] + " 공유받은 캠 ";
        }
        messageBody +=
                event.getCam().getName() + " 에서 " + eventType + "감지되었습니다. " + "영상 확인 후 신고 바랍니다.";

        return Message.builder()
                .setToken(targetToken)
                .putData("messageType", "event")
                .putData("messageTitle", messageTitle)
                .putData("messageBody", messageBody)
                .build();
    }

    public void sendThreatMessage(FCMToken targetToken, Video video) {
        Message message = buildThreatMessage(targetToken.getToken(), video);

        try {
            String response = FirebaseMessaging.getInstance().send(message);
            log.debug(response);
        } catch (FirebaseMessagingException e) {
            fcmTokenRepository.delete(targetToken);
            throw new RuntimeException(e);
        }
    }

    public Message buildThreatMessage(String targetToken, Video video) {
        StringBuilder types = new StringBuilder();
        for (Event event : video.getEvents()) {
            if (event.getType() == EventType.INVASION) {
                types.append("침입");
            } else if (event.getType() == EventType.FIRE) {
                types.append("화재");
            } else if (event.getType() == EventType.SOUND) {
                types.append("소음");
            }
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
        System.out.println(messageBody);
        return Message.builder()
                .setToken(targetToken)
                .putData("messageTitle", messageTitle)
                .putData("messageBody", messageBody)
                .putData("messageType", "threat")
                .build();
    }
}

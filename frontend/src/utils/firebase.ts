import { initializeApp } from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  MessagePayload,
} from 'firebase/messaging';

// Firebase 구성 객체
const firebaseConfig = {
  apiKey: 'AIzaSyAPmerBQN_IWn3EQP8k2onJRJqcxQikHWs',
  authDomain: 'homepp-ab3e3.firebaseapp.com',
  projectId: 'homepp-ab3e3',
  storageBucket: 'homepp-ab3e3.appspot.com',
  messagingSenderId: '833529439916',
  appId: '1:833529439916:web:69d2daf5b67c558808e109',
  measurementId: 'G-JKGWEXGBDX',
};

// Firebase 초기화
console.log('Initializing Firebase...');
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
console.log('Firebase initialized.');

// 알림 권한 요청 및 토큰 가져오기 함수
const requestPermissionAndGetToken = async (vapidKey: string) => {
  console.log('Requesting notification permission...');
  try {
    const permission = await Notification.requestPermission();
    console.log('Notification permission status:', permission);
    if (permission === 'granted') {
      console.log('Permission granted, getting FCM token...');
      const currentToken = await getToken(messaging, { vapidKey });
      if (currentToken) {
        console.log('FCM token obtained:', currentToken);
        return currentToken;
      } else {
        console.error(
          'No registration token available. Request permission to generate one.'
        );
      }
    } else {
      console.error('Unable to get permission to notify.');
    }
  } catch (error) {
    console.error('An error occurred while retrieving token:', error);
  }
  return null;
};

// VAPID 키 설정
const VAPID_KEY =
  'BM6ml0bVdvvGo9EXGvM9KMtdlsMxUzalN_xxHTc9yvBNmc-t9AD89MOkJZ2xe-J_2gyeXJ7HiyrlpMxhISY9HW8';

// 알림 데이터 타입 정의
interface FCMNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  click_action?: string;
}

// FCM 메시지 수신 처리
onMessage(messaging, (payload: MessagePayload) => {
  console.log('Message received: ', payload);

  // Navbar 알림 갱신
  // if (payload.data) {
  //   updateNavbarNotifications(payload.data);
  // }

  // 메시지 수신 리스너 설정
  // console.log('Setting up onMessage listener...');
  // onMessage(messaging, (payload) => {
  //   console.log('Message received:', payload);

  if (payload.notification) {
    // 만약 notification이 있다면 브라우저 알림 표시
    console.log('Notification payload found, showing browser notification.');
    showBrowserNotification({
      title: payload.notification.title || 'Default Title',
      body: payload.notification.body || 'No content available',
      icon: payload.notification.icon,
    });
  } else if (payload.data) {
    // notification이 없다면 data를 사용하여 알림 생성
    console.log('Data payload found, using data to show browser notification.');
    showBrowserNotification({
      title: payload.data.messageTitle || 'Default Title',
      body: payload.data.messageBody || 'No content available',
      icon: undefined, // 필요한 경우 다른 아이콘 설정 가능
    });
  }

  // 메시지 타입에 따라 카드 알림을 먼저 표시한 후, Navbar 알림 갱신
  if (payload.data) {
    const messageType = payload.data.messageType;
    console.log('Message type:', messageType);

    // 먼저 카드 알림 표시
    switch (messageType) {
      case 'threat':
        console.log('Threat message detected, showing custom notification.');
        showCustomNotification({
          title: payload.data.messageTitle || '위협 알림',
          body: payload.data.messageBody || '위협이 감지되었습니다.',
          type: 'threat',
        });
        break;
      case 'event':
        console.log('Event message detected, showing custom notification.');
        showCustomNotification({
          title: payload.data.messageTitle || '이벤트 알림',
          body: payload.data.messageBody || '이벤트가 발생했습니다.',
          type: 'event',
        });
        break;
      case 'register':
        console.log('Register message detected, showing custom notification.');
        showCustomNotification({
          title: '캠 등록 완료',
          body: '캠이 성공적으로 등록되었습니다.',
          type: 'register',
        });
        break;
      case 'share':
        console.log('Share message detected, showing custom notification.');
        showCustomNotification({
          title: '새로운 공유 알림',
          body: `${
            payload.data.email || '알 수 없는 사용자'
          }님이 캠을 공유했습니다.`,
          type: 'share',
        });
        break;
      case 'onOff':
        console.log('OnOff message detected, showing custom notification.');
        showCustomNotification({
          title: '감지 모드 상태 변경',
          body: `현재 상태: ${payload.data.status || '알 수 없음'}`,
          type: 'onOff',
        });
        break;
      default:
        console.error('Unknown message type:', messageType);
    }

    // 카드 알림이 표시된 후 Navbar 알림 갱신
    // console.log('Updating Navbar notifications...');
    // updateNavbarNotifications(payload.data);
  }
});

// 브라우저 알림을 표시하는 함수
function showBrowserNotification(notification: FCMNotificationPayload) {
  const title = notification.title;
  const body = notification.body;
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: body,
      icon: notification.icon,
    });
  }
}

// 커스텀 알림을 표시하는 함수
function showCustomNotification({
  title,
  body,
  type,
}: {
  title: string;
  body: string;
  type: string;
}) {
  console.log('Showing custom notification:', { title, body, type });
  const notificationElement = document.createElement('div');
  notificationElement.className = `notification ${type}`;
  notificationElement.style.position = 'fixed';
  notificationElement.style.bottom = '20px';
  notificationElement.style.right = '20px';
  notificationElement.style.zIndex = '1000';
  notificationElement.style.borderRadius = '12px';
  notificationElement.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  notificationElement.style.padding = '16px';
  notificationElement.style.maxWidth = '300px';
  notificationElement.style.fontFamily =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  notificationElement.style.display = 'flex';
  notificationElement.style.alignItems = 'center';
  notificationElement.style.gap = '12px';

  // 각 타입에 따른 스타일 적용
  switch (type) {
    case 'threat':
      notificationElement.style.backgroundColor = '#FF3B30'; // 애플 레드
      notificationElement.style.color = 'white';
      break;
    case 'event':
      notificationElement.style.backgroundColor = '#FF9500'; // 애플 오렌지
      notificationElement.style.color = 'white';
      break;
    case 'register':
      notificationElement.style.backgroundColor = '#34C759'; // 애플 그린
      notificationElement.style.color = 'white';
      break;
    case 'share':
      notificationElement.style.backgroundColor = '#007AFF'; // 애플 블루
      notificationElement.style.color = 'white';
      break;
    case 'onOff':
      notificationElement.style.backgroundColor = '#8E8E93'; // 애플 그레이
      notificationElement.style.color = 'white';
      break;
    default:
      notificationElement.style.backgroundColor = '#333333'; // 다크 모드 기본 배경
      notificationElement.style.color = 'white';
  }

  // 아이콘 추가 (선택 사항)
  const iconElement = document.createElement('div');
  iconElement.style.width = '24px';
  iconElement.style.height = '24px';
  iconElement.style.borderRadius = '50%';
  iconElement.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
  notificationElement.appendChild(iconElement);

  const textContent = document.createElement('div');
  textContent.innerHTML = `<strong>${title}</strong><p>${body}</p>`;

  notificationElement.appendChild(textContent);

  document.body.appendChild(notificationElement);

  // 일정 시간 후 알림 제거
  setTimeout(() => {
    console.log('Removing custom notification:', notificationElement);
    document.body.removeChild(notificationElement);
  }, 6000);
}

// Navbar 알림을 갱신하는 함수
// function updateNavbarNotifications(data: Record<string, unknown>) {
//   console.log('Navbar notifications data:', data);
// }

// 모듈 내보내기
export {
  messaging,
  getToken,
  onMessage,
  requestPermissionAndGetToken,
  VAPID_KEY,
};

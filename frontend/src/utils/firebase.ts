import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyAPmerBQN_IWn3EQP8k2onJRJqcxQikHWs',
  authDomain: 'homepp-ab3e3.firebaseapp.com',
  projectId: 'homepp-ab3e3',
  storageBucket: 'homepp-ab3e3.appspot.com',
  messagingSenderId: '833529439916',
  appId: '1:833529439916:web:69d2daf5b67c558808e109',
  measurementId: 'G-JKGWEXGBDX',
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const requestPermissionAndGetToken = async (vapidKey: string) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const currentToken = await getToken(messaging, { vapidKey });
      if (currentToken) {
        return currentToken;
      } else {
        console.log(
          'No registration token available. Request permission to generate one.'
        );
      }
    } else {
      console.log('Unable to get permission to notify.');
    }
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
  }
  return null;
};

const VAPID_KEY =
  'BM6ml0bVdvvGo9EXGvM9KMtdlsMxUzalN_xxHTc9yvBNmc-t9AD89MOkJZ2xe-J_2gyeXJ7HiyrlpMxhISY9HW8';

// 메시지 수신 처리 로직 추가
onMessage(messaging, (payload) => {
  // console.log('Message received. ', payload);

  if (!payload.data) {
    // console.log('No data in the payload');
    return;
  }

  const messageType = payload.data.messageType;

  // 메시지 타입에 따라 알림을 다르게 처리
  switch (messageType) {
    case 'threat':
      showCustomNotification({
        title: payload.data.messageTitle || '위협 알림',
        body: payload.data.messageBody || '위협이 감지되었습니다.',
        type: 'threat',
      });
      break;
    case 'event':
      showCustomNotification({
        title: payload.data.messageTitle || '이벤트 알림',
        body: payload.data.messageBody || '이벤트가 발생했습니다.',
        type: 'event',
      });
      break;
    case 'register':
      showCustomNotification({
        title: '캠 등록 완료',
        body: '캠이 성공적으로 등록되었습니다.',
        type: 'register',
      });
      break;
    case 'share':
      showCustomNotification({
        title: '새로운 공유 알림',
        body: `${
          payload.data.email || '알 수 없는 사용자'
        }님이 캠을 공유했습니다.`,
        type: 'share',
      });
      break;
    case 'onOff':
      showCustomNotification({
        title: '감지 모드 상태 변경',
        body: `현재 상태: ${payload.data.status || '알 수 없음'}`,
        type: 'onOff',
      });
      break;
    default:
      console.log('Unknown message type:', messageType);
  }
});

// 알림을 표시하는 함수
function showCustomNotification({
  title,
  body,
  type,
}: {
  title: string;
  body: string;
  type: string;
}) {
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
    document.body.removeChild(notificationElement);
  }, 5000);
}

export {
  messaging,
  getToken,
  onMessage,
  requestPermissionAndGetToken,
  VAPID_KEY,
};

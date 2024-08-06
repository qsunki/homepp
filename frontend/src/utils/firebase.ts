import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  // Your web app's Firebase configuration here
  // See https://firebase.google.com/docs/web/setup#add-sdks-initialize
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
        console.log('FCM token:', currentToken);
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

// Firebase 콘솔에서 얻은 VAPID 키를 여기에 설정합니다
const VAPID_KEY =
  'BM6ml0bVdvvGo9EXGvM9KMtdlsMxUzalN_xxHTc9yvBNmc-t9AD89MOkJZ2xe-J_2gyeXJ7HiyrlpMxhISY9HW8';

export {
  messaging,
  getToken,
  onMessage,
  requestPermissionAndGetToken,
  VAPID_KEY,
};

// firebase-messaging-sw.js
importScripts(
  'https://www.gstatic.com/firebasejs/9.1.2/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.1.2/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyAPmerBQN_IWn3EQP8k2onJRJqcxQikHWs',
  authDomain: 'homepp-ab3e3.firebaseapp.com',
  projectId: 'homepp-ab3e3',
  storageBucket: 'homepp-ab3e3.appspot.com',
  messagingSenderId: '833529439916',
  appId: '1:833529439916:web:69d2daf5b67c558808e109',
  measurementId: 'G-JKGWEXGBDX',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

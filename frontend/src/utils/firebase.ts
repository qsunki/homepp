// // src/firebase.ts
// import firebase from 'firebase/app';
// import 'firebase/messaging';

// const firebaseConfig = {
//   apiKey: 'YOUR_API_KEY',
//   authDomain: 'YOUR_AUTH_DOMAIN',
//   projectId: 'YOUR_PROJECT_ID',
//   storageBucket: 'YOUR_STORAGE_BUCKET',
//   messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
//   appId: 'YOUR_APP_ID',
// };

// firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();

// messaging
//   .requestPermission()
//   .then(() => messaging.getToken())
//   .then((token) => {
//     console.log('FCM Token:', token);
//     // Save token to your database
//   })
//   .catch((error) => {
//     console.error('FCM Error:', error);
//   });

// export default messaging;

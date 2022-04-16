importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/8.1.2/firebase-messaging.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyBNG5Gay9Ft3oRA9Ysv5IB9lprATZ8c_mY',
  authDomain: 'imi-server.firebaseapp.com',
  databaseURL: 'https://imi-server.firebaseio.com',
  projectId: 'imi-server',
  storageBucket: 'imi-server.appspot.com',
  messagingSenderId: '162776018644',
  appId: '1:162776018644:web:9da5bac3fd0e491334d541',
  measurementId: 'G-VYXW4H7089',
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  const {
    notification: { title, body },
  } = payload;

  const notificationOptions = {
    body,
    vibrate: [200, 100, 200, 100, 200, 100, 200],
  };

  return self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', event => {
  console.log(event)
  return event;
});
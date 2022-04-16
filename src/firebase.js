import firebase from "firebase";
import "firebase/messaging";
import { PUBLIC_VAPID_KEY } from './constant';

firebase.initializeApp({
  apiKey: "AIzaSyBNG5Gay9Ft3oRA9Ysv5IB9lprATZ8c_mY",
  authDomain: "imi-server.firebaseapp.com",
  databaseURL: "https://imi-server.firebaseio.com",
  projectId: "imi-server",
  storageBucket: "imi-server.appspot.com",
  messagingSenderId: "162776018644",
  appId: "1:162776018644:web:9da5bac3fd0e491334d541",
  measurementId: "G-VYXW4H7089"
})

let messaging = null;

// we need to check if messaging is supported by the browser
if(firebase.messaging.isSupported()) {
    messaging = firebase.messaging();
    messaging.usePublicVapidKey(PUBLIC_VAPID_KEY);
}

export default messaging;

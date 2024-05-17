// src/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDFDKitQ58rrmQqUSCVJw5CoEEbxeDJRpM",
  authDomain: "clubloyalty-abd8b.firebaseapp.com",
  projectId: "clubloyalty-abd8b",
  storageBucket: "clubloyalty-abd8b.appspot.com",
  messagingSenderId: "97317602521",
  appId: "1:97317602521:web:b8aa49437719e78839aac8",
  measurementId: "G-WGQDDP9DJ1"
});

const messaging = firebase.messaging();

console.log("service worker", messaging);
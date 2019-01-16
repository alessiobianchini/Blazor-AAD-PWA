importScripts('https://www.gstatic.com/firebasejs/5.7.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.7.3/firebase-messaging.js');

//[TODO]: Add FCM Configuration
var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
};
firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    var notificationTitle = 'Background Message Title';
    var notificationOptions = {
        body: 'Background Message body.',
        icon: '/img/badge.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});
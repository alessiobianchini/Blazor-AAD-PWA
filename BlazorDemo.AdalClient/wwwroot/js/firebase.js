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

messaging.usePublicVapidKey('<[TODO]: Replace with FCM Web Push certificate key pair>');

messaging.requestPermission().then(function () {
    console.log('Notification permission granted.');
    resetUI();
}).catch(function (err) {
    console.log('Unable to get permission to notify.', err);
});

messaging.onTokenRefresh(function () {
    messaging.getToken().then(function (refreshedToken) {
        console.log('Token refreshed.');
        setTokenSentToServer(false);
        sendTokenToServer(refreshedToken);
        resetUI();
    }).catch(function (err) {
        console.log('Unable to retrieve refreshed token ', err);
    });
});

messaging.onMessage(function (payload) {

    console.log('Message received. ', payload);

    const title = 'Blazor PWA';
    const options = {
        body: payload.data.message,
        vibrate: [200, 50, 200, 50, 200],
        icon: 'img/icon-192x192.png',
        badge: 'img/badge.png'
    };

    navigator.serviceWorker.getRegistration().then(registration => {
        registration.showNotification(title, options);
    });

});

function resetUI() {
    messaging.getToken().then(function (currentToken) {
        if (currentToken) {
            sendTokenToServer(currentToken);
        } else {
            // Show permission request.
            console.log('No Instance ID token available. Request permission to generate one.');
            // Show permission UI.
            setTokenSentToServer(false);
        }
    }).catch(function (err) {
        console.log('An error occurred while retrieving token. ', err);
        setTokenSentToServer(false);
    });
}

function sendTokenToServer(currentToken) {
    window.localStorage.setItem('notificationToken', currentToken);
    if (!isTokenSentToServer()) {
        console.log('Sending token to server...');
        setTokenSentToServer(true);
    } else {
        console.log('Token already sent to server so won\'t send it again ' +
            'unless it changes');
    }
}
function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') === '1';
}
function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? '1' : '0');
}

function deleteToken() {
    messaging.getToken().then(function (currentToken) {
        messaging.deleteToken(currentToken).then(function () {
            console.log('Token deleted.');
            setTokenSentToServer(false);
            resetUI();
        }).catch(function (err) {
            console.log('Unable to delete token. ', err);
        });
    }).catch(function (err) {
        console.log('Error retrieving Instance ID token. ', err);
    });
}
resetUI();

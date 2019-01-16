'use strict';

const applicationServerPublicKey = '< [TODO]: Replace with FCM Server key >';

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function subscribeUser() {
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true
    })
        .then(function (sub) {
            console.log('User is subscribed.');
            var endpointSections = sub.endpoint.split('/');
            var subscriptionId = endpointSections[endpointSections.length - 1];
            var newKey = firebase.database().ref().child('token').push().key;
            firebase.database().ref('token/' + newKey).set({ subscriptionId: subscriptionId });
            console.log('endpoint:', subscriptionId);
            isSubscribed = true;
        })
        .catch(function (err) {
            console.log('Failed to subscribe the user: ', err);
            swRegistration.pushManager.getSubscription()
                .then(function (subscription) {
                    if (subscription) {
                        return subscription.unsubscribe();
                    }
                })
                .catch(function (error) {
                    console.log('Error unsubscribing', error);
                })
                .then(function () {
                    console.log('User is unsubscribed.');
                    isSubscribed = false;
                });
        });
}

function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            if (subscription) {
                return subscription.unsubscribe();
            }
        })
        .catch(function (error) {
            console.log('Error unsubscribing', error);
        })
        .then(function () {
            console.log('User is unsubscribed.');
            isSubscribed = false;
        });
}

function initializeUI() {
    if (isSubscribed) {
        unsubscribeUser();
    } else {
        subscribeUser();
    }
    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            isSubscribed = !(subscription === null);

            if (isSubscribed) {
                console.log('User IS subscribed.');
            } else {
                console.log('User is NOT subscribed.');
            }

        });
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');

    navigator.serviceWorker.register('serviceworker.js')
        .then(function (swReg) {
            console.log('Service Worker is registered', swReg);

            swRegistration = swReg;
            initializeUI();
        })
        .catch(function (error) {
            console.error('Service Worker Error', error);
        });
} else {
    console.warn('Push messaging is not supported');
}

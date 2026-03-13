// src/firebase.js  ← initialize ONCE here
import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

import { getMessaging, getToken, onMessage} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAm0WivNJ-mQiOVdQmVz8VxvcLEdhO8W3A",
  authDomain: "hello-world-311604.firebaseapp.com",
  projectId: "hello-world-311604",
  storageBucket: "hello-world-311604.firebasestorage.app",
  messagingSenderId: "178689462685",
  appId: "1:178689462685:web:ca5268e9602f1b7dcadf74",
  measurementId: "G-H70QP4Y22V"
};

const app = initializeApp(firebaseConfig);

// export const db = getFirestore(app);
// export const auth = getAuth(app);

export const messaging = getMessaging(app);
// app itself is rarely exported — the services are what you use

/**
 * Returns the initialized Messaging service instance.
 * Other modules can import this to access the messaging API.
 */
export function getMessagingService() {
  return messaging;
}

/**
 * Request notification permission (via the browser) and attempt to get an
 * FCM registration token. By default the function uses the environment
 * variable VITE_FIREBASE_VAPID_KEY if no key is passed.
 *
 * Returns the token string on success, null if not granted/available.
 * Throws if getToken itself errors.
 */
export async function registerService() {
  try {

     // TODO: Request permission
 // TODO: Register with FCM
 // TODO: Set up foreground message handler
 // TODO: Set up background message handler
 // TODO: Subscribe to a topic

    const vapidKey = "BCeDiTe-0QFJVPuIt8U-boP2iShVYgIRhd8KbXrntzF7zgUnEBX0HFeAeefqMVjXFb35XqeHrFAHezg8mh6UkLg";


    // Ask the user for permission to send notifications
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted.');
      return null;
    }

    const currentToken = await getToken(messaging, vapidKey);
    if (currentToken) {
      // Optionally: send token to your server here
      console.log('Registration token retrieved:', currentToken);

    }else{
      console.log('No registration token available.');

    }

    return null;
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err);
    
  }
}

//Safer check of service worker registration
export const validateAndRegisterSW = async () => {
  // bail out if browser doesn't support service workers
  if (!('serviceWorker' in navigator)) {
    console.warn('OH MY!  Are you using Netscape? Service workers not supported in this browser');
    return null;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    const existingWorker = registrations.find(reg =>
      reg.scope.includes('firebase-cloud-messaging-push-scope')
    );

    if (existingWorker) {
      // Check what state it's actually in
      if (existingWorker.active) {
        console.log('SW is active and healthy, checking for updates...');
        await existingWorker.update();
        return existingWorker;
      }

      if (existingWorker.waiting) {
        console.log('SW is waiting — old worker still in control');
        // force the new one to take over immediately
        existingWorker.waiting.postMessage({ type: 'SKIP_WAITING' });
        return existingWorker;
      }

      if (existingWorker.installing) {
        console.log('SW is still installing...');
        return existingWorker;
      }

      // If we get here something is wrong — nuke it and start fresh
      console.warn('SW found but in bad state, unregistering...');
      await existingWorker.unregister();
    }

    // Either no SW existed or we just cleared a bad one
    // Let Firebase re-register it fresh via getToken
    console.log('Registering fresh service worker...');
    const token = await getToken(messaging, {
      vapidKey: 'YOUR_VAPID_KEY'
    });

    return token;

  } catch (error) {
    console.error('SW validation failed:', error);
    return null;
  }
};

onMessage(messaging, (payload) => {
  console.log('Foreground message received:', payload);

  new Notification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon.png'
  });
  
  // Firebase does NOT auto-show a notification in the foreground
  // You have to handle the UI yourself here
});

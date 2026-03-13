// src/firebase.js  ← initialize ONCE here
import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

import { getMessaging, getToken, onMessage} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "REDACTED",
  authDomain: "REDACTED",
  projectId: "REDACTED",
  storageBucket: "REDACTED.firebasestorage.app",
  messagingSenderId: "REDACTED",
  appId: "1:REDACTED:web:ca5268e9602f1b7dcadf74",
  measurementId: "REDACTED"
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

onMessage(messaging, (payload) => {
  console.log('Foreground message received:', payload);

  new Notification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon.png'
  });
  
  // Firebase does NOT auto-show a notification in the foreground
  // You have to handle the UI yourself here
});

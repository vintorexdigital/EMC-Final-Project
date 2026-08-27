import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { isSupported, getAnalytics } from 'firebase/analytics';

const requiredConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
const config = { ...requiredConfig, measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID };
export const firebaseEnabled = Object.values(requiredConfig).every(Boolean);
const app = firebaseEnabled ? initializeApp(config) : null;
export const auth = app ? getAuth(app) : null;
export let analytics = null;
if (app && config.measurementId) {
  isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  });
}

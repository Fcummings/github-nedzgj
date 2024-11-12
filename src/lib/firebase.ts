import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, logEvent, Analytics } from 'firebase/analytics';

function validateFirebaseConfig() {
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Firebase configuration. Please add the following to your .env file:\n` +
      missingVars.map(varName => `${varName}="your-value-here"`).join('\n')
    );
  }
}

function getFirebaseConfig(): FirebaseOptions {
  validateFirebaseConfig();

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };
}

let app;
let analytics: Analytics | null = null;

try {
  app = initializeApp(getFirebaseConfig());
  // Only initialize analytics in production and if the measurement ID is available
  if (import.meta.env.PROD && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export const auth = getAuth(app);
export const db = getFirestore(app);

// Custom analytics events
export const logCustomEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, eventParams);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }
};

// Predefined analytics events
export const analyticsEvents = {
  pageView: (pageName: string) => logCustomEvent('page_view', { page_name: pageName }),
  signUpStart: () => logCustomEvent('sign_up_start'),
  signUpComplete: () => logCustomEvent('sign_up_complete'),
  emailVerificationSent: () => logCustomEvent('email_verification_sent'),
  emailVerified: () => logCustomEvent('email_verified'),
  loginSuccess: () => logCustomEvent('login_success'),
  downloadLogo: () => logCustomEvent('logo_download'),
  featureClick: (featureName: string) => logCustomEvent('feature_click', { feature_name: featureName }),
  faqExpand: (question: string) => logCustomEvent('faq_expand', { question }),
};
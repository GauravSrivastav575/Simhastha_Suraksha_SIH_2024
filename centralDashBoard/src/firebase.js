// firebase.js
import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
} from "firebase/messaging";
import toast from "react-hot-toast";
import { TiWarningOutline } from "react-icons/ti";

// Load environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};
const YOUR_VAPID_KEY = process.env.REACT_APP_FIREBASE_VAPID_KEY;

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Get FCM token
export const getFCMToken = async () => {
  try {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    console.log("Service Worker Registered: ", registration);

    const currentToken = await getToken(messaging, {
      vapidKey: YOUR_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    if (currentToken) {
      console.log("FCM Token: ", currentToken);
      return currentToken;
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
  } catch (err) {
    console.error("An error occurred while retrieving token. ", err);
  }
};

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      return true;
    } else {
      console.log("Notification permission denied.");
      return false;
    }
  } catch (err) {
    console.error("Error requesting notification permission: ", err);
    return false;
  }
};

const CustomToast = ({ title, body }) => (
  <div>
    <div className="text-xl font-semibold">{title}</div> 
    <div className="">{body}</div>
  </div>
);

const handleToggleTheme = (title, body ) => {
  toast(
    <CustomToast title={title} body={body} />,
    {
      icon: <TiWarningOutline className="text-white text-2xl"/>,
      style: {
        borderRadius: "10px",
        background: '#ef4444',
        color: "#fff",
      },
    }
  );
};

onMessage(messaging, (payload) => {
  console.log("Message received: ", payload);
  handleToggleTheme(payload.notification.title, payload.notification.body);
  setTimeout(() => { window.location.reload(); }, 2000);
});

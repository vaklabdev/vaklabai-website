import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider, getToken } from "firebase/app-check";

const firebaseConfig = {
  projectId: "vaklabai-site",
  appId: "1:856775349887:web:c1018bb9faab72df8b514a",
  apiKey: "AIzaSyAjt_A7LZiBM0POaJyRE6J7zZKJW-F_ERE",
  authDomain: "vaklabai-site.firebaseapp.com",
  messagingSenderId: "856775349887",
  measurementId: "G-TM70XXKFYY",
};

const app = initializeApp(firebaseConfig);

// Enable debug token in development
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

let appCheck;
try {
  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider("6LcVDsAsAAAAADIeAre2WSjBSS7s0TT6lM3NiTcO"),
    isTokenAutoRefreshEnabled: true,
  });
} catch (e) {
  console.warn("App Check initialization failed:", e);
}

export async function getAppCheckToken() {
  if (!appCheck) return null;
  try {
    const result = await getToken(appCheck, false);
    return result.token;
  } catch {
    return null;
  }
}

export { app, appCheck };

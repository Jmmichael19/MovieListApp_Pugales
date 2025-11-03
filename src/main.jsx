import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AppRouter from "./AppRouter.jsx";
import { registerSW } from "virtual:pwa-register"; // ✅ from vite-plugin-pwa

// --- ✅ Register Service Worker ---
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("A new version is available. Refresh now?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("✅ App is ready to work offline!");
  },
});

// --- 🌐 Handle Online/Offline Status ---
function handleNetworkChange() {
  if (!navigator.onLine) {
    alert("⚠️ You are offline. Some features may not be available.");
  } else {
    console.log("✅ You are back online!");
  }
}

window.addEventListener("online", handleNetworkChange);
window.addEventListener("offline", handleNetworkChange);

// --- 🚀 Render App ---
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </StrictMode>
);

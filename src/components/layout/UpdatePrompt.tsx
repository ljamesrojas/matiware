import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { CloudOff, RefreshCw } from "lucide-react";
import styles from "./UpdatePrompt.module.css";

const UPDATE_CHECK_MS = 60 * 60 * 1000; // classroom tabs stay open for hours

/**
 * Offline cache status: a one-time "ready to work offline" notice, and a prompt to reload
 * when a new version has been deployed (so everyone sees the same content).
 */
export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (registration) setInterval(() => registration.update(), UPDATE_CHECK_MS);
    },
  });

  // The offline notice is informational only, so it goes away by itself.
  useEffect(() => {
    if (!offlineReady) return;
    const t = window.setTimeout(() => setOfflineReady(false), 6000);
    return () => window.clearTimeout(t);
  }, [offlineReady, setOfflineReady]);

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      {needRefresh ? (
        <>
          <RefreshCw size={16} strokeWidth={1.8} aria-hidden="true" className={styles.icon} />
          <span className={styles.text}>A new version is available.</span>
          <button type="button" className={styles.primary} onClick={() => updateServiceWorker(true)}>
            Reload
          </button>
          <button type="button" className={styles.ghost} onClick={() => setNeedRefresh(false)}>
            Later
          </button>
        </>
      ) : (
        <>
          <CloudOff size={16} strokeWidth={1.8} aria-hidden="true" className={styles.icon} />
          <span className={styles.text}>Ready to work offline.</span>
          <button type="button" className={styles.ghost} onClick={() => setOfflineReady(false)}>
            OK
          </button>
        </>
      )}
    </div>
  );
}

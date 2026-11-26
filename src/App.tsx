import { lazy, Suspense } from "react";
import styles from "./App.module.css";
import { UpdatePrompt } from "./components/layout/UpdatePrompt";
import { LandingPage } from "./pages/LandingPage";
import { useRoute } from "./router";

// The explorer (and three.js) loads only when it's opened, so the landing page stays light.
const ExplorerPage = lazy(() => import("./pages/ExplorerPage"));

export default function App() {
  const route = useRoute();

  return (
    <>
      {route.view === "landing" ? (
        <LandingPage />
      ) : (
        <Suspense
          fallback={
            <div className={styles.loading}>
              <span className="mono-label">Loading explorer…</span>
            </div>
          }
        >
          <ExplorerPage deviceId={route.deviceId} />
        </Suspense>
      )}
      <UpdatePrompt />
    </>
  );
}

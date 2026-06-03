import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { RouteContext } from "./context/RouteContext";
import { AppProvider }  from "./context/AppContext";

import ScannerPage from "./pages/ScannerPage";
import LoadingScreen from "./components/LoadingScreen";
import Layout        from "./layouts/Layout";

import HomePage      from "./pages/HomePage";
import PickupPage    from "./pages/PickupPage";
import EducationPage from "./pages/EducationPage";
import RewardsPage   from "./pages/RewardsPage";
import AboutPage     from "./pages/AboutPage";

const PAGE_MAP = {
  home: <HomePage />,
  pickup: <PickupPage />,
  education: <EducationPage />,
  rewards: <RewardsPage />,
  about: <AboutPage />,
  scanner: <ScannerPage />,
};

export default function App() {
  const [page,   setPage]   = useState("landing");
  const [loaded, setLoaded] = useState(false);

  const navigate = useCallback((p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleLoadDone = useCallback(() => {
    setLoaded(true);
    setPage("home");
  }, []);

  return (
    <RouteContext.Provider value={{ page, navigate }}>
      <AppProvider>
        <AnimatePresence mode="wait">
          {!loaded && (
            <motion.div key="loader" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <LoadingScreen onDone={handleLoadDone} />
            </motion.div>
          )}
        </AnimatePresence>

        {loaded && (
          <Layout>
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                {PAGE_MAP[page] ?? <HomePage />}
              </motion.div>
            </AnimatePresence>
          </Layout>
        )}
      </AppProvider>
    </RouteContext.Provider>
  );
}

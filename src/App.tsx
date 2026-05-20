import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Nav } from '@/components/Nav';
import { LandingPage } from '@/pages/LandingPage';
import { SearchPage } from '@/pages/SearchPage';
import { DJPage } from '@/pages/DJPage';
import { UserPage } from '@/pages/UserPage';
import { ToastProvider } from '@/components/ToastProvider';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <LandingPage />
            </PageWrapper>
          }
        />
        <Route
          path="/search"
          element={
            <PageWrapper>
              <SearchPage />
            </PageWrapper>
          }
        />
        <Route
          path="/dj"
          element={
            <PageWrapper>
              <DJPage />
            </PageWrapper>
          }
        />
        <Route
          path="/user"
          element={
            <PageWrapper>
              <UserPage />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Nav />
        <main>
          <AnimatedRoutes />
        </main>
      </ToastProvider>
    </BrowserRouter>
  );
}

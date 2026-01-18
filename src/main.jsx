import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { GlobalProvider } from './context/GlobalProvider.jsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from './components/global/Layout.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import SessionProvider from './context/session_context/SessionContextProvider.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ItemPage from './pages/ItemPage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Impressum from './components/legal/Impressum.jsx';
import PrivacyPolicy from './components/legal/PrivacyPolicy.jsx';
import TermsOfUse from './components/legal/TermsOfUse.jsx';
import LegalLayout from './components/legal/LegalLayout.jsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Routes>
          <Route path="/legal" element={<LegalLayout />}>
            <Route path="/legal/imprint" element={<Impressum />} />
            <Route path="/legal/privacy" element={<PrivacyPolicy />} />
            <Route path="/legal/terms" element={<TermsOfUse />} />
          </Route>

          <Route
            path="/"
            element={
              <SessionProvider>
                <GlobalProvider>
                  <Layout />
                </GlobalProvider>
              </SessionProvider>
            }
          >
            <Route index element={<ProfilePage />}></Route>
            <Route path="/community" element={<CommunityPage />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/items/:id" element={<ItemPage />}></Route>
            <Route path="*" element={<ErrorPage />}></Route>
          </Route>
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);

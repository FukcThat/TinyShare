import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { GlobalProvider } from './context/GlobalProvider.jsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from './components/global/Layout.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ItemsPage from './pages/ItemsPage.jsx';
import ItemContextProvider from './context/item_context/ItemContextProvider.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import SessionProvider from './context/session_context/SessionContextProvider.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ItemPage from './pages/ItemPage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <SessionProvider>
          <GlobalProvider>
            <ItemContextProvider>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<ProfilePage />}></Route>
                  <Route path="/community" element={<CommunityPage />}></Route>
                  <Route path="/items" element={<ItemsPage />}></Route>
                  <Route path="/items/:id" element={<ItemPage />}></Route>
                  <Route path="*" element={<ErrorPage />}></Route>
                </Route>
              </Routes>
            </ItemContextProvider>
          </GlobalProvider>
        </SessionProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);

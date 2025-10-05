import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { GlobalProvider } from './context/GlobalProvider.jsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import ErrorPage from './components/ErrorPage.jsx';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MembersPage from './pages/MembersPage.jsx';
import ItemsPage from './pages/ItemsPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />}></Route>
            <Route path="/profile" element={<ProfilePage />}></Route>
            <Route path="/members" element={<MembersPage />}></Route>
            <Route path="/items" element={<ItemsPage />}></Route>
            <Route path="*" element={<ErrorPage />}></Route>
          </Route>
        </Routes>
      </GlobalProvider>
    </BrowserRouter>
  </StrictMode>
);

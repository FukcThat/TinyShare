import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { GlobalProvider } from "./context/GlobalProvider.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/global/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import MembersPage from "./pages/MembersPage.jsx";
import ItemsPage from "./pages/ItemsPage.jsx";
import ItemContextProvider from "./context/item_context/ItemContextProvider.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import SessionProvider from "./context/session_context/SessionContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <GlobalProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />}></Route>
              <Route path="/profile" element={<ProfilePage />}></Route>
              <Route path="/members" element={<MembersPage />}></Route>
              <Route
                path="/items"
                element={
                  <ItemContextProvider>
                    <ItemsPage />
                  </ItemContextProvider>
                }
              ></Route>
              <Route path="*" element={<ErrorPage />}></Route>
            </Route>
          </Routes>
        </GlobalProvider>
      </SessionProvider>
    </BrowserRouter>
  </StrictMode>
);

import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";

export default function Layout() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(false);

  const ToggleSidebar = () => setIsShowingSidebar(!isShowingSidebar);

  return (
    <div>
      <Navbar ToggleSidebar={ToggleSidebar} />
      {isShowingSidebar ? (
        <Sidebar />
      ) : (
        <div>
          <Outlet />
        </div>
      )}
    </div>
  );
}

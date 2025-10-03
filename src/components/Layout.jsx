import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div>
      <div>NavBar</div>
      <Outlet />
    </div>
  );
}

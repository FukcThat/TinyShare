import { Link, Outlet } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

import { Outlet } from 'react-router';
import Navbar from './components/global/Navbar';
import Footer from './components/global/Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow pb-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

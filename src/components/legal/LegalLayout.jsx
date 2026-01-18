import { Link, Outlet } from 'react-router';
import Footer from '../global/Footer';
import Button from '../ui/Button';

export default function LegalLayout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Link className="fixed top-6 right-6" to="/">
        <Button
          text="Back to TinyShare"
          styles="bg-secondary hover:bg-secondary/80"
        />
      </Link>

      <div className="flex-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

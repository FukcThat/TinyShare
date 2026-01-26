import { Link } from 'react-router';

export default function Footer() {
  return (
    <nav
      className="
        w-full
        bg-primary/20 backdrop-blur-lg border-t py-4 flex gap-6 justify-center
        static bottom-0"
    >
      <Link className="hover:text-accent hover:scale-105" to="/legal/imprint">
        Imprint
      </Link>
      <Link className="hover:text-accent hover:scale-105" to="/legal/terms">
        Terms
      </Link>
      <Link className="hover:text-accent hover:scale-105" to="/legal/privacy">
        Privacy
      </Link>
    </nav>
  );
}

import { Link, useLocation } from "react-router";

const NavElements = [
  { path: "/", name: "Home" },
  { path: "/items", name: "Items" },
  { path: "/members", name: "Members" },
  { path: "/profile", name: "Profile" },
];

export default function Navbar() {
  const location = useLocation();
  return (
    <div className="flex gap-4 my-6 px-10 w-full justify-end">
      {NavElements.map((element) => {
        return (
          <Link
            key={element.path}
            to={element.path}
            className={`hover:scale-110 transition-all duration-50 ease-in ${
              location.pathname === element.path && " text-blue-400"
            }`}
          >
            {element.name}
          </Link>
        );
      })}
    </div>
  );
}

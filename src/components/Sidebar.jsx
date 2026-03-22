import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `block px-4 py-2 rounded ${
      pathname === path
        ? "bg-black text-white"
        : "text-gray-600 hover:bg-gray-200"
    }`;

  return (
    <div className="w-64 bg-white h-screen shadow p-4">

      <h1 className="text-xl font-bold mb-6">OrderFlow</h1>

      <nav className="space-y-2">
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          Dashboard
        </Link>

        <Link to="/orders" className={linkClass("/orders")}>
          Orders
        </Link>
      </nav>

    </div>
  );
}
import { useNavigate } from "react-router-dom";

export default function Topbar() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-white px-6 py-4 flex justify-between items-center shadow">

      <h2 className="text-lg font-semibold">Dashboard</h2>

      <div className="flex items-center gap-4">

        <span className="text-sm text-gray-600">
          {user?.name}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Logout
        </button>

      </div>

    </div>
  );
}
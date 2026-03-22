import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Topbar />

        <div className="bg-gray-100 min-h-screen p-6">
          {children}
        </div>

      </div>

    </div>
  );
}
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import {
  Package,
  Clock,
  CheckCircle,
  DollarSign
} from "lucide-react";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  const stored = JSON.parse(localStorage.getItem("user"));
  const userId = stored?.user?.id || stored?.id;

  const fetchOrders = async () => {
    const res = await api.get("/orders", {
      params: { user_id: userId },
    });
    setOrders(res.data);
  };

  useEffect(() => {
    if (userId) fetchOrders();
  }, []);

  const total = orders.length;
  const pending = orders.filter(o => o.status === "pending").length;
  const completed = orders.filter(o => o.status === "completed").length;
  const revenue = orders.reduce((sum, o) => sum + Number(o.price), 0);

  return (
    <Layout>
      <div className="p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500 text-sm">
              Overview of your orders
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

          <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <h3 className="text-xl font-bold">{total}</h3>
            </div>
            <div className="bg-gray-100 p-2 rounded-lg">
              <Package size={20} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <h3 className="text-xl font-bold">{pending}</h3>
            </div>
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Clock size={20} className="text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <h3 className="text-xl font-bold">{completed}</h3>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Revenue</p>
              <h3 className="text-xl font-bold">${revenue.toFixed(2)}</h3>
            </div>
            <div className="bg-indigo-100 p-2 rounded-lg">
              <DollarSign size={20} className="text-indigo-600" />
            </div>
          </div>

        </div>

        {/* REVENUE CARD */}
        <div className="bg-[#0f172a] text-white p-6 rounded-xl mb-6">
          <p className="text-gray-300 text-sm">Total Revenue</p>
          <h2 className="text-3xl font-bold">
            ${revenue.toFixed(2)}
          </h2>
        </div>

        {/* RECENT ORDERS */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <h3 className="p-4 font-semibold border-b">
            Recent Orders
          </h3>

          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="p-4">Client</th>
                <th>Product</th>
                <th>Price</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="border-t hover:bg-gray-50 cursor-pointer">
                  <td className="p-4 font-medium">{o.client_name}</td>
                  <td>{o.product}</td>
                  <td>${o.price}</td>

                  <td>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      o.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {o.status === "completed" ? "Confirmed" : "Pending"}
                    </span>
                  </td>

                  <td className="text-gray-500 text-sm">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </Layout>
  );
}
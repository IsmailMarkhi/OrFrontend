import { useEffect, useState } from "react";
import api from "../services/api";
import OrderForm from "../components/OrderForm";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-600",
  completed: "bg-blue-100 text-blue-600",
};

export default function Orders() {

  const navigate = useNavigate(); // ✅ هنا فقط

  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const stored = JSON.parse(localStorage.getItem("user"));
  const userId = stored?.user?.id || stored?.id;

  const fetchOrders = async () => {
    const res = await api.get("/orders", {
      params: { user_id: userId },
    });
    setOrders(res.data);
    setFiltered(res.data);
  };

  useEffect(() => {
    if (userId) fetchOrders();
  }, []);

  useEffect(() => {
    let data = [...orders];

    if (search) {
      data = data.filter(
        (o) =>
          o.client_name.toLowerCase().includes(search.toLowerCase()) ||
          o.product.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      data = data.filter((o) => o.status === status);
    }

    setFiltered(data);
  }, [search, status, orders]);

  return (
    <Layout>
      <div className="p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-gray-500 text-sm">
              {orders.length} total orders
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-5 py-2 rounded-lg cursor-pointer"
          >
            + Add Order
          </button>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by client or product..."
            className="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-lg px-4 py-2"
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Confirmed</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
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
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => navigate(`/orders/${o.id}`)}
                  className="border-t hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="p-4 font-medium">{o.client_name}</td>
                  <td>{o.product}</td>
                  <td className="font-medium">${o.price}</td>

                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${statusStyles[o.status]}`}
                    >
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

        {/* MODAL */}
        {open && (
          <OrderForm onClose={() => setOpen(false)} onCreated={fetchOrders} />
        )}
      </div>
    </Layout>
  );
}
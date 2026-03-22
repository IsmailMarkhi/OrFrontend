import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import EditOrderForm from "../components/EditOrderForm";
import api from "../services/api";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-600",
  completed: "bg-green-100 text-green-600",
};

export default function OrderDetails() {
  const [editing, setEditing] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const stored = JSON.parse(localStorage.getItem("user"));
  const userId = stored?.user?.id || stored?.id;

  const fetchOrder = useCallback(async () => {
    try {
      const res = await api.get(`/orders/${id}`, {
        params: { user_id: userId },
      });
      setOrder(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [id, userId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const deleteOrder = async () => {
    await api.delete(`/orders/${id}`, {
      params: { user_id: userId },
    });
    navigate("/orders");
  };

  const updateStatus = async (status) => {
    await api.put(`/orders/${id}/status`, {
      status,
      user_id: userId,
    });
    setOrder((prev) => ({ ...prev, status })); // ⚡ instant UI update
  };

  // 🔄 loading skeleton
  if (loading) {
    return (
      <Layout>
        <div className="p-6 max-w-3xl animate-pulse">
          <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-40"></div>
            <div className="h-4 bg-gray-200 rounded w-52"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) return null;

  return (
    <Layout>
      <div className="p-6 max-w-3xl">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/orders")}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <ArrowLeft size={18} />
            </button>

            <h1 className="text-xl font-semibold tracking-tight">
              Order Details
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="p-2 rounded-lg hover:bg-blue-400 bg-blue-500 text-white transition cursor-pointer"
              title="edit order"
            >
              <Pencil size={18} />
            </button>
            {editing && (
              <EditOrderForm
                order={order}
                onClose={() => setEditing(false)}
                onUpdated={fetchOrder}
              />
            )}

            <button
              onClick={deleteOrder}
              className="p-2 rounded-lg hover:bg-red-400 bg-red-500 text-white transition cursor-pointer"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {/* STATUS + PRICE */}
          <div className="flex justify-between items-center mb-6">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[order.status]}`}
            >
              {order.status === "completed" ? "Confirmed" : "Pending"}
            </span>

            <h2 className="text-2xl font-semibold">${order.price}</h2>
          </div>

          {/* INFO */}
          <div className="grid gap-5 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-1">Client</p>
              <p className="font-medium">{order.client_name}</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs mb-1">Product</p>
              <p className="font-medium">{order.product}</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs mb-1">Created</p>
              <p className="font-medium">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          {/* STATUS UPDATE */}
          <div className="mt-8">
            <p className="text-xs text-gray-400 mb-2">Quick Status Update</p>

            <select
              value={order.status}
              onChange={(e) => updateStatus(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option value="pending">Pending</option>
              <option value="completed">Confirmed</option>
            </select>
          </div>
        </div>
      </div>
    </Layout>
  );
}

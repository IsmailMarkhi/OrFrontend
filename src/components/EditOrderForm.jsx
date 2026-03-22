import { useState } from "react";
import api from "../services/api";

export default function EditOrderForm({ order, onClose, onUpdated }) {

  const [form, setForm] = useState({
    client_name: order.client_name,
    product: order.product,
    price: order.price,
  });

  const stored = JSON.parse(localStorage.getItem("user"));
  const userId = stored?.user?.id || stored?.id;

  const submit = async () => {
    await api.put(`/orders/${order.id}`, {
      ...form,
      user_id: userId,
    });

    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-xl w-96 shadow">

        <h2 className="text-lg font-semibold mb-4">Edit Order</h2>

        <input
          value={form.client_name}
          onChange={(e)=>setForm({...form,client_name:e.target.value})}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          value={form.product}
          onChange={(e)=>setForm({...form,product:e.target.value})}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="number"
          value={form.price}
          onChange={(e)=>setForm({...form,price:e.target.value})}
          className="w-full border p-2 mb-4 rounded"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>

      </div>

    </div>
  );
}
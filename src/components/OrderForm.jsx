import { useState } from "react";
import api from "../services/api";

export default function OrderForm({onClose,onCreated}){

 const user = JSON.parse(localStorage.getItem("user"));

 const [form,setForm]=useState({
  client_name:"",
  product:"",
  price:""
 });

const submit = async ()=>{
  const stored = JSON.parse(localStorage.getItem("user"));

  const userId = stored.user.id;

  await api.post("/orders", {
    user_id: userId,
    client_name: form.client_name,
    product: form.product,
    price: Number(form.price)
  });

  onCreated();
  onClose();
};

 return(
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
    <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">

      <h2 className="text-xl font-bold mb-4">New Order</h2>

      <input
        placeholder="Client"
        className="w-full border p-2 mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        onChange={e=>setForm({...form,client_name:e.target.value})}
      />

      <input
        placeholder="Product"
        className="w-full border p-2 mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        onChange={e=>setForm({...form,product:e.target.value})}
      />

      <input type="number"
        placeholder="Price"
        className="w-full border p-2 mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        onChange={e=>setForm({...form,price:e.target.value})}
      />

      <div className="flex justify-end gap-2">
        <button onClick={onClose}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition cursor-pointer"
        >Cancel</button>
        <button
          onClick={submit}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition cursor-pointer"
        >
          Create
        </button>
      </div>

    </div>

  </div>
 );
}
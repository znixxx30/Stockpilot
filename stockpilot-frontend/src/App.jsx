import { useState, useEffect } from "react";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      setMessage("Login successful");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="p-10 font-sans">
      <h1 className="text-2xl font-bold mb-4">StockPilot Login</h1>

      <form onSubmit={handleLogin} className="space-y-3">
        <input
          className="border p-2 rounded w-64"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br />

        <input
          className="border p-2 rounded w-64"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>

      <p className="mt-3">{message}</p>
    </div>
  );
}

function Dashboard({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    low_stock_threshold: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      sku: "",
      price: "",
      stock: "",
      low_stock_threshold: ""
    });
    setEditingProduct(null);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const url = editingProduct
        ? `http://localhost:5000/api/products/${editingProduct.id}`
        : "http://localhost:5000/api/products";

      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setShowForm(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      sku: product.sku,
      price: product.price,
      stock: product.stock,
      low_stock_threshold: product.low_stock_threshold
    });
    setShowForm(true);
  };

  return (
    <div className="p-10 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📊 StockPilot Dashboard</h1>
        <button
          onClick={onLogout}
          className="bg-gray-800 text-white px-3 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <button
        onClick={() => {
          resetForm();
          setShowForm(!showForm);
        }}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        ➕ Add Product
      </button>

      {showForm && (
        <form
          onSubmit={handleCreateOrUpdate}
          className="border p-4 rounded mb-6 space-y-2 max-w-md"
        >
          <input
            className="border p-2 rounded w-full"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            className="border p-2 rounded w-full"
            placeholder="SKU"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            required
          />

          <input
            className="border p-2 rounded w-full"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <input
            className="border p-2 rounded w-full"
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />

          <input
            className="border p-2 rounded w-full"
            placeholder="Low Stock Threshold"
            type="number"
            value={form.low_stock_threshold}
            onChange={(e) =>
              setForm({ ...form, low_stock_threshold: e.target.value })
            }
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            {editingProduct ? "Update Product" : "Create Product"}
          </button>
        </form>
      )}

      <table className="border-collapse border w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">SKU</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.sku}</td>
              <td className="border p-2">₹{p.price}</td>
              <td className="border p-2">{p.stock}</td>
              <td className="border p-2">
                {p.isLowStock ? "⚠️ Low Stock" : "✅ OK"}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  ✏️ Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { useEffect, useState } from "react";
import client, { setToken } from "../api/client";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    details: "",
    price: "",
    stock: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("create");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [errors, setErrors] = useState({});

  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setToken(token);
    fetchProducts();
  }, []);

  useEffect(() => {
    if (type === "success" && message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [message, type]);

  const fetchProducts = async () => {
    const res = await client.get("items/");
    setProducts(res.data);
  };

  const handleSubmit = async () => {
    setMessage("");
    setType("");
    setErrors({});

    let newErrors = {};

    if (!form.title) newErrors.title = "Product name is required";
    if (!form.details) newErrors.details = "Description is required";
    if (!form.price) newErrors.price = "Price is required";
    if (!form.stock) newErrors.stock = "Stock is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      title: form.title,
      details: form.details,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      if (editingId) {
        await client.put(`items/${editingId}/`, payload);
        setType("success");
        setMessage(`"${form.title}" updated successfully`);
        setEditingId(null);
      } else {
        await client.post("items/", payload);
        setType("success");
        setMessage(`"${form.title}" added successfully`);
      }

      setForm({ title: "", details: "", price: "", stock: "" });
      fetchProducts();

    } catch (err) {
      setType("error");
      setMessage(
        err.response?.data?.detail ||
        `Failed to save "${form.title}"`
      );
    }
  };

  const deleteProduct = async (id, title) => {
    try {
      await client.delete(`items/${id}/`);
      setType("success");
      setMessage(`"${title}" deleted`);
      fetchProducts();
    } catch (err) {
      setType("error");
      setMessage(`Failed to delete "${title}"`);
    }
  };

  const editProduct = (p) => {
    setActiveTab("create");
    setForm({
      title: p.title,
      details: p.details,
      price: p.price,
      stock: p.stock,
    });
    setEditingId(p.id);
  };

  const confirmLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>VendorHub</h2>

        <button
          className={activeTab === "create" ? "active" : ""}
          onClick={() => setActiveTab("create")}
        >
          + Create Product
        </button>

        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          📦 Products
        </button>
      </aside>

      <div className="main">
        <header className="navbar dark">
          <div>
            <h3>
              {activeTab === "create"
                ? "Create Product"
                : "Product Inventory"}
            </h3>
            <p className="subtext">Welcome, {username}</p>
          </div>

          <button
            className="logout-btn"
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </button>
        </header>

        <div className={`content ${activeTab === "create" ? "split" : ""}`}>
          {activeTab === "create" && (
            <>
              <div className="card form-card">
                <div className="form-header">
                  <h3>{editingId ? "Edit Product" : "New Product"}</h3>
                  <p>Add items to your inventory</p>
                </div>

                {message && type === "success" && (
                  <div className="form-success">{message}</div>
                )}

                <div className="form-group">

                  <div>
                    <input
                      placeholder="Product Title"
                      value={form.title}
                      disabled={editingId !== null}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                    />
                    {errors.title && <span className="field-error">{errors.title}</span>}
                  </div>

                  <div>
                    <input
                      placeholder="Description"
                      value={form.details}
                      onChange={(e) =>
                        setForm({ ...form, details: e.target.value })
                      }
                    />
                    {errors.details && <span className="field-error">{errors.details}</span>}
                  </div>

                  <div>
                    <input
                      type="number"
                      placeholder="Price"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                    />
                    {errors.price && <span className="field-error">{errors.price}</span>}
                  </div>

                  <div>
                    <input
                      type="number"
                      placeholder="Stock"
                      value={form.stock}
                      onChange={(e) =>
                        setForm({ ...form, stock: e.target.value })
                      }
                    />
                    {errors.stock && <span className="field-error">{errors.stock}</span>}
                  </div>

                </div>

                <div className="form-actions">
                  <button
                    className="small-dark-btn"
                    onClick={handleSubmit}
                  >
                    {editingId ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </div>

              <div className="side-panel">
                <h4>📊 Quick Stats</h4>
                <p>Total Products: {products.length}</p>

                <div style={{ height: "12px" }}></div>

                <h4>💡 Tips</h4>
                <p>• Use meaningful product names</p>
                <p>• Keep stock updated</p>
                <p>• Accurate pricing improves trust</p>
              </div>
            </>
          )}

          {activeTab === "products" && (
            <div className="card table-full">
              <h3>All Products</h3>

              {message && (
                <p className={`form-message ${type}`}>{message}</p>
              )}

              <div className="table">
                <div className="table-header">
                  <span>Title</span>
                  <span>Price</span>
                  <span>Stock</span>
                  <span>Actions</span>
                </div>

                {products.map((p) => (
                  <div key={p.id} className="table-row">
                    <span>{p.title}</span>
                    <span>₹{p.price}</span>
                    <span>{p.stock}</span>

                    <div className="actions-text">
                      <span onClick={() => editProduct(p)}>Edit</span>
                      <span onClick={() => deleteProduct(p.id, p.title)}>
                        Delete
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {products.length === 0 && (
                <p className="empty">No products found</p>
              )}
            </div>
          )}
        </div>
      </div>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
/**
 * Admin panel for ToyLand — order & catalog overview.
 */
import React, { useEffect, useState } from "react";
import { orderingService } from "../services/orderingService";
import { catalogService } from "../services/catalogService";
import "./AdminPage.css";

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [orderRes, catalogRes] = await Promise.all([
          orderingService.getOrders(1, 20),
          catalogService.getProducts(1, 1).catch(() => ({ totalCount: 0 })),
        ]);
        setOrders(orderRes.data || []);
        setProductCount(catalogRes.totalCount || 0);
      } catch (err) {
        setError(err.message || "Yonetim verileri yuklenemedi");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statusLabel = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "processing") return "Isleniyor";
    if (s === "delivered") return "Teslim";
    if (s === "shipped") return "Kargoda";
    if (s === "pending") return "Beklemede";
    return status || "-";
  };

  const customerName = (order) => {
    const a = order.shippingAddress || {};
    const name = `${a.firstName || ""} ${a.lastName || ""}`.trim();
    return name || order.customerName || "—";
  };

  const processing = orders.filter((o) =>
    /processing|pending|shipped/i.test(o.status || "")
  ).length;
  const revenue = orders.reduce(
    (sum, o) => sum + (Number(o.totalPrice) || 0),
    0
  );

  if (loading) {
    return <div className="admin-loading">Yonetim paneli yukleniyor...</div>;
  }

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Yonetim Paneli</h1>
        <p>Siparis, stok ve kullanici ozeti</p>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <div className="n">{orders.length}</div>
          <div className="l">Listelenen siparis</div>
        </div>
        <div className="admin-stat">
          <div className="n">{processing}</div>
          <div className="l">Aktif / islenen</div>
        </div>
        <div className="admin-stat">
          <div className="n">{productCount || "—"}</div>
          <div className="l">Urun</div>
        </div>
        <div className="admin-stat">
          <div className="n">
            {revenue ? `₺${revenue.toFixed(2)}` : "—"}
          </div>
          <div className="l">Gorunen toplam</div>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Siparis</th>
              <th>Musteri</th>
              <th>Durum</th>
              <th>Tutar</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={4}>Henuz siparis yok.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id || order.orderName}>
                  <td>#{order.orderName || order.id}</td>
                  <td>{customerName(order)}</td>
                  <td>
                    <span className={`admin-tag ${String(order.status || "").toLowerCase()}`}>
                      {statusLabel(order.status)}
                    </span>
                  </td>
                  <td>
                    {order.totalPrice != null
                      ? `₺${Number(order.totalPrice).toFixed(2)}`
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;

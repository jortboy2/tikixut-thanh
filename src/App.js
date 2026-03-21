import React, { useState } from "react";
import "./App.css";

function App() {
  const email = "vonghung849@gmail.com";
  const paymentMethod = "momo";

  const PRICE = 497500; // giá thực tế
  const DISPLAY_PRICE = 500000; // giá hiển thị

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const totalAmount = PRICE * quantity;

  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN") + "đ";
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        "https://vannghimomo.onrender.com/api/order/muathe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quantity: quantity,
          }),
        },
      );

      const data = await res.json();
      setResult(data);

      if (data?.redirect_url) {
        setTimeout(() => window.location.assign(data.redirect_url), 250);
      }
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  return (
    <div className="App">
      <div className="container">
        <div className="payment-card">
          <h1 className="title">Thanh toán nạp tiền</h1>

          {/* Mệnh giá */}
          <div className="row">
            <span>Mệnh giá</span>
            <b className="price">500.000đ</b>
          </div>

          {/* Số lượng */}
          <div className="row">
            <span>Số lượng</span>
            <div className="quantity-control">
              <button onClick={decrease}>-</button>
              <span>{quantity}</span>
              <button onClick={increase}>+</button>
            </div>
          </div>

          {/* Tổng */}
          <div className="row total">
            <span>Tổng tiền</span>
            <b>{formatCurrency(totalAmount)}</b>
          </div>

          {/* Guide */}
          <div className="guide">
            <p>
              Vui lòng bấm <b>"Thanh toán"</b> và hoàn tất ngay.
            </p>
            <p>
              Nếu mua số lượng lớn (ví dụ: 500k × 2 = 1.000.000đ), hãy chọn số
              lượng trước rồi thanh toán ngay để tránh lỗi hết hạn.
            </p>
          </div>

          <button className="pay-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang xử lý..." : "Thanh toán"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

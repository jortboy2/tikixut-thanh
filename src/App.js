import React, { useState } from "react";
import "./App.css";

function App() {
  const denominationMap = {
    "200k": "1559583",
    "300k": "7321981",
    "400k": "7322049",
    "500k": "1559587",
    "800k": "9672466",
    "1 TRIỆU": "1559591",
    "1 TRIỆU 500K": "24376737",
    "2 TRIỆU": "1559595",
    "3 TRIỆU": "2648647",
    "4 TRIỆU": "24382189",
    "5 TRIỆU": "1559603",
    "10 TRIỆU": "7322125",
  };

  const [denomination, setDenomination] = useState("200k");
  const [productId, setProductId] = useState(denominationMap["200k"]);
  const email = "hamvui1123@gmail.com";
  const paymentMethod = "momo";
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [preConfirm, setPreConfirm] = useState(false);


  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("https://vannghimomo.onrender.com/api/order/ca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId }),
      });

      const data = await res.json();
      setResult(data);

      if (data?.redirect_url) {
        // redirect immediately after successful checkout creation
        setTimeout(() => window.location.assign(data.redirect_url), 250);
      }
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="App">
      <main className="App-main">
        <div className="qr-card nice-card">
          <header className="card-header">
            <h1>Thanh toán nạp tiền</h1>
            <p className="subtitle">Chọn mệnh giá, bấm Thanh toán. Khi thanh toán xong, chụp bill lại cho Nghị.</p>
          </header>
          
          <div className="card-body">
            <div className="left">
              <div className="field">
                <div className="field-label">Chọn mệnh giá</div>
                <div className="denom-grid">
                  {Object.keys(denominationMap).map((k) => {
                    const active = k === denomination;
                    return (
                      <button
                        key={k}
                        type="button"
                        className={`denom-tile ${active ? 'active' : ''}`}
                        onClick={() => {
                          setDenomination(k);
                          setProductId(denominationMap[k]);
                          // show confirmation before submitting
                          setPreConfirm(true);
                        }}
                      >
                        {k}
                      </button>
                    );
                  })}
                </div>
              </div>

                            <div style={{ display: 'none' }}>
                <input value={productId} readOnly />
                <input value={paymentMethod} readOnly />
                <input value={email} readOnly />
              </div>

              {/* removed intermediate check button; confirmation shown right after selecting a tile */}
              {preConfirm && (
                <div className="confirm-box">
                  <div className="message">Bạn chắc muốn thanh toán {denomination}?</div>
                  <button
                    className="primary confirm"
                    onClick={() => {
                      setPreConfirm(false);
                      handleSubmit();
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                  </button>
                  <button
                    className="secondary"
                    onClick={() => setPreConfirm(false)}
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>

    
        
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

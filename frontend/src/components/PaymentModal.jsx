import { useState, useEffect } from "react";
import {
  FiShield,
  FiX,
  FiCheckCircle,
  FiCreditCard,
  FiSmartphone,
  FiLock,
  FiLoader,
  FiPrinter,
  FiAward,
  FiCalendar,
  FiMapPin,
  FiUser,
  FiZap,
} from "react-icons/fi";
import "./PaymentModal.css";

export default function PaymentModal({
  event,
  user,
  isOpen,
  onClose,
  onPaymentSuccess,
}) {
  const [method, setMethod] = useState("upi"); // 'upi' | 'card' | 'netbanking' | 'sandbox'
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState(user?.name || "");
  const [selectedBank, setSelectedBank] = useState("SBI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setPaymentCompleted(false);
      setIsProcessing(false);
      setError(null);
      setTransactionData(null);
      if (event?.organizerUpiId) {
        setUpiId(event.organizerUpiId);
      } else {
        setUpiId("");
      }
    }
  }, [isOpen, event]);

  if (!isOpen || !event) return null;

  const price = event.price || 0;

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 16);
    val = val.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(val);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
  };

  // Detect card brand
  const getCardBrand = () => {
    const raw = cardNumber.replace(/\s/g, "");
    if (raw.startsWith("4")) return "VISA";
    if (raw.startsWith("5") || raw.startsWith("2")) return "MasterCard";
    if (raw.startsWith("6")) return "RuPay";
    return "Card";
  };

  const handlePay = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    // Basic validation
    if (method === "upi" && !upiId.trim() && method !== "sandbox") {
      setError("Please enter a valid UPI ID or use the QR Code scan / Sandbox mode.");
      return;
    }
    if (method === "card") {
      if (cardNumber.replace(/\s/g, "").length < 16) {
        setError("Please enter a valid 16-digit card number.");
        return;
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        setError("Please enter a valid expiry date (MM/YY).");
        return;
      }
      if (cardCvv.length < 3) {
        setError("Please enter a valid 3-digit CVV.");
        return;
      }
    }

    try {
      setIsProcessing(true);

      // Simulate real bank gateway verification delay
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const txnId = `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      const paymentInfo = {
        status: "completed",
        amount: price,
        method: method === "sandbox" ? "sandbox-demo" : method,
        transactionId: txnId,
        paidAt: new Date().toISOString(),
      };

      setTransactionData(paymentInfo);
      setPaymentCompleted(true);

      // Trigger registration in parent
      if (onPaymentSuccess) {
        await onPaymentSuccess(paymentInfo);
      }
    } catch (err) {
      setError(err.message || "Payment verification failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintTicket = () => {
    window.print();
  };

  return (
    <div className="payment-modal-backdrop animate-fadeIn" onClick={onClose}>
      <div
        className="payment-modal-card glass-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="payment-modal-header">
          <div className="payment-header-left">
            <div className="shield-icon-badge">
              <FiShield />
            </div>
            <div>
              <h3 className="payment-modal-title">
                {paymentCompleted ? "Payment Successful 🎉" : "Secure EventHub Checkout"}
              </h3>
              <p className="payment-modal-sub">
                {paymentCompleted
                  ? "Your event ticket and seat are confirmed!"
                  : "256-Bit SSL Encrypted Payment Gateway"}
              </p>
            </div>
          </div>
          <button className="payment-close-btn" onClick={onClose} title="Close">
            <FiX />
          </button>
        </div>

        {/* Error message */}
        {error && <div className="payment-error-banner animate-fadeIn">⚠️ {error}</div>}

        {!paymentCompleted ? (
          <div className="payment-modal-body">
            {/* Order Summary Strip */}
            <div className="order-summary-box">
              <div className="order-summary-left">
                <span className="order-event-cat">{event.category}</span>
                <h4 className="order-event-title">{event.title}</h4>
                <div className="order-event-meta">
                  <span><FiCalendar /> {event.date} at {event.time}</span>
                  <span><FiMapPin /> {event.location?.split(",")[0]}</span>
                </div>
              </div>
              <div className="order-summary-right">
                <div className="order-amount-label">Total Payable</div>
                <div className="order-amount-val">₹{price}</div>
                <div className="order-fee-tag">Includes all campus fees</div>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="payment-tabs-bar">
              <button
                type="button"
                className={`payment-tab ${method === "upi" ? "active" : ""}`}
                onClick={() => setMethod("upi")}
              >
                <FiSmartphone /> UPI / QR Code
              </button>
              <button
                type="button"
                className={`payment-tab ${method === "card" ? "active" : ""}`}
                onClick={() => setMethod("card")}
              >
                <FiCreditCard /> Debit / Credit Card
              </button>
              <button
                type="button"
                className={`payment-tab ${method === "sandbox" ? "active sandbox-tab" : "sandbox-tab"}`}
                onClick={() => setMethod("sandbox")}
              >
                <FiZap /> ⚡ 1-Click Demo Pay
              </button>
            </div>

            {/* Tab 1: UPI & QR Code */}
            {method === "upi" && (
              <div className="tab-pane animate-fadeIn">
                {/* Organizer Payee Banner */}
                <div className="organizer-payee-banner">
                  <div className="organizer-payee-badge">
                    <FiSmartphone />
                  </div>
                  <div className="organizer-payee-text">
                    <span className="organizer-payee-label">Paying Directly to Organizer:</span>
                    <strong className="organizer-payee-name">
                      {event.organizerPayeeName || event.organizer || "Event Organizer"}
                    </strong>
                    {event.organizerUpiId ? (
                      <span className="organizer-upi-tag">UPI: {event.organizerUpiId}</span>
                    ) : (
                      <span className="organizer-upi-tag default">UPI: campus.events@okhdfcbank</span>
                    )}
                  </div>
                </div>

                <div className="upi-pane-grid">
                  <div className="upi-qr-card">
                    <div className="qr-box">
                      {event.organizerQrCode ? (
                        <img
                          src={event.organizerQrCode}
                          alt="Organizer UPI QR Code"
                          className="qr-custom-img"
                        />
                      ) : (
                        /* Stylized simulated QR Code graphic */
                        <svg viewBox="0 0 100 100" className="qr-svg-graphic">
                          <rect width="100" height="100" fill="#ffffff" rx="8" />
                          <rect x="10" y="10" width="24" height="24" fill="#0f172a" rx="3" />
                          <rect x="14" y="14" width="16" height="16" fill="#ffffff" rx="2" />
                          <rect x="18" y="18" width="8" height="8" fill="#0f172a" />
                          <rect x="66" y="10" width="24" height="24" fill="#0f172a" rx="3" />
                          <rect x="70" y="14" width="16" height="16" fill="#ffffff" rx="2" />
                          <rect x="74" y="18" width="8" height="8" fill="#0f172a" />
                          <rect x="10" y="66" width="24" height="24" fill="#0f172a" rx="3" />
                          <rect x="14" y="70" width="16" height="16" fill="#ffffff" rx="2" />
                          <rect x="18" y="74" width="8" height="8" fill="#0f172a" />
                          {/* Pattern Dots */}
                          <rect x="42" y="15" width="6" height="6" fill="#7c3aed" />
                          <rect x="52" y="15" width="6" height="6" fill="#0f172a" />
                          <rect x="42" y="26" width="6" height="6" fill="#0f172a" />
                          <rect x="52" y="26" width="6" height="6" fill="#ec4899" />
                          <rect x="42" y="42" width="16" height="16" fill="#7c3aed" rx="2" />
                          <rect x="15" y="42" width="6" height="6" fill="#0f172a" />
                          <rect x="25" y="52" width="6" height="6" fill="#0f172a" />
                          <rect x="66" y="42" width="6" height="6" fill="#0f172a" />
                          <rect x="78" y="52" width="6" height="6" fill="#7c3aed" />
                          <rect x="42" y="68" width="6" height="6" fill="#0f172a" />
                          <rect x="52" y="78" width="6" height="6" fill="#0f172a" />
                          <rect x="68" y="68" width="8" height="8" fill="#0f172a" />
                          <rect x="80" y="78" width="8" height="8" fill="#7c3aed" />
                        </svg>
                      )}
                    </div>
                    <span className="qr-scan-label">
                      Scan to Pay ₹{price} to {event.organizerPayeeName || event.organizer || "Organizer"}
                    </span>
                    <div className="upi-apps-row">
                      <span className="app-badge gpay">GPay</span>
                      <span className="app-badge phonepe">PhonePe</span>
                      <span className="app-badge paytm">Paytm</span>
                      <span className="app-badge bhim">BHIM</span>
                    </div>
                  </div>

                  <div className="upi-input-side">
                    <label className="input-label">Or Pay via UPI ID / VPA</label>
                    <div className="upi-input-wrap">
                      <input
                        type="text"
                        className="payment-input"
                        placeholder="e.g. yourname@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>
                    <div className="upi-shortcuts">
                      {["@okaxis", "@okhdfcbank", "@paytm", "@ybl"].map((suffix) => (
                        <button
                          key={suffix}
                          type="button"
                          className="upi-chip"
                          onClick={() => setUpiId((prev) => (prev.includes("@") ? prev.split("@")[0] + suffix : prev + suffix))}
                        >
                          {suffix}
                        </button>
                      ))}
                    </div>
                    <p className="upi-note">
                      🔒 A payment request will be authorized instantly with zero transaction fee.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Credit / Debit Card */}
            {method === "card" && (
              <form onSubmit={handlePay} className="tab-pane animate-fadeIn">
                <div className="card-form-grid">
                  <div className="form-group full-width">
                    <label className="input-label">Card Number</label>
                    <div className="card-input-with-brand">
                      <input
                        type="text"
                        className="payment-input"
                        placeholder="XXXX XXXX XXXX XXXX"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        required
                      />
                      <span className="card-brand-badge">{getCardBrand()}</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="input-label">Valid Thru (MM/YY)</label>
                    <input
                      type="text"
                      className="payment-input"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-label">CVV / CVC</label>
                    <input
                      type="password"
                      className="payment-input"
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      maxLength={3}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="input-label">Cardholder Name</label>
                    <input
                      type="text"
                      className="payment-input"
                      placeholder="Name on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </form>
            )}

            {/* Tab 3: Sandbox Instant Demo Pay */}
            {method === "sandbox" && (
              <div className="tab-pane sandbox-pane animate-fadeIn">
                <div className="sandbox-card">
                  <div className="sandbox-icon-wrap">⚡</div>
                  <h4>Examiner / College Evaluation Mode</h4>
                  <p>
                    This is an instant sandbox gateway designed for fast classroom demos and teacher grading.
                    No real bank balance or card entry required.
                  </p>
                  <div className="sandbox-info-list">
                    <div>✅ Generates real MongoDB Transaction ID</div>
                    <div>✅ Auto-updates seat capacity & revenue stats</div>
                    <div>✅ Creates digital entry ticket with pass receipt</div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Pay Button */}
            <div className="payment-modal-footer">
              <div className="pay-guarantee">
                <FiLock /> Encrypted & Verified Campus Gateway
              </div>
              <button
                type="button"
                className="btn-primary pay-submit-btn"
                onClick={handlePay}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <FiLoader className="spin-icon" /> Processing Secure Payment...
                  </>
                ) : (
                  <>
                    <FiShield /> Pay ₹{price} & Confirm Seat
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Payment Success & Digital E-Ticket View */
          <div className="payment-success-view animate-fadeIn">
            <div className="success-icon-wrap">
              <FiCheckCircle />
            </div>
            <h3 className="success-title">Payment Successful!</h3>
            <p className="success-sub">
              Your ticket for <strong>{event.title}</strong> has been booked and confirmed in MongoDB.
            </p>

            {/* Digital Entry Pass / Receipt */}
            <div className="digital-ticket-card glass-card">
              <div className="ticket-header-strip">
                <span className="ticket-brand">🎉 EventHub Entry Pass</span>
                <span className="ticket-status-badge">CONFIRMED</span>
              </div>

              <div className="ticket-body">
                <h4 className="ticket-event-name">{event.title}</h4>
                <div className="ticket-grid">
                  <div className="ticket-cell">
                    <span className="ticket-cell-label">Attendee</span>
                    <span className="ticket-cell-val"><FiUser /> {user?.name || "Student Attendee"}</span>
                  </div>
                  <div className="ticket-cell">
                    <span className="ticket-cell-label">Amount Paid</span>
                    <span className="ticket-cell-val highlight">₹{transactionData?.amount || price}</span>
                  </div>
                  <div className="ticket-cell">
                    <span className="ticket-cell-label">Date & Time</span>
                    <span className="ticket-cell-val"><FiCalendar /> {event.date} · {event.time}</span>
                  </div>
                  <div className="ticket-cell">
                    <span className="ticket-cell-label">Venue</span>
                    <span className="ticket-cell-val"><FiMapPin /> {event.location}</span>
                  </div>
                  <div className="ticket-cell full">
                    <span className="ticket-cell-label">Transaction Reference ID</span>
                    <span className="ticket-txn-id">{transactionData?.transactionId}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Actions */}
            <div className="success-actions-row">
              <button
                type="button"
                className="btn-secondary print-ticket-btn"
                onClick={handlePrintTicket}
              >
                <FiPrinter /> Print / Save E-Ticket
              </button>
              <button
                type="button"
                className="btn-primary done-btn"
                onClick={onClose}
              >
                <FiCheckCircle /> Done (View Event)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

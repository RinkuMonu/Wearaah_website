import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiPackage, FiHome, FiList, FiArrowRight, FiCopy, FiCheck, FiShoppingBag, FiCreditCard } from "react-icons/fi";

/* ── Canvas confetti ─────────────────────────────────────────── */
const COLORS = ["#e4a156", "#927f68", "#d4854a", "#f5c18a", "#fef3e2", "#a0856c"];

function useConfetti(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pieces = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: Math.random() * 7 + 3,
      d: Math.random() * 2 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      tilt: Math.random() * 10 - 5,
      tiltSpeed: Math.random() * 0.1 + 0.05,
      angle: 0,
      opacity: Math.random() * 0.7 + 0.3,
    }));

    let frame;
    let t = 0;
    let done = false;

    const draw = () => {
      if (done) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t++;

      pieces.forEach((p) => {
        p.y += p.d;
        p.angle += p.tiltSpeed;
        p.x += Math.sin(p.angle) * 1.2;
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.r, p.r * 0.4, p.tilt, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      });

      if (t > 260) {
        pieces.forEach((p) => { p.opacity = Math.max(0, p.opacity - 0.009); });
        if (pieces.every((p) => p.opacity <= 0)) { done = true; return; }
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);
}

/* ── Animated SVG checkmark ──────────────────────────────────── */
const AnimatedCheck = () => (
  <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
    <style>{`
      @keyframes circleIn { to { stroke-dashoffset: 0; } }
      @keyframes checkIn  { to { stroke-dashoffset: 0; } }
    `}</style>
    <circle
      cx="40" cy="40" r="36"
      stroke="#e4a156"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="226"
      strokeDashoffset="226"
      style={{ animation: "circleIn 0.65s cubic-bezier(.65,0,.45,1) 0.2s forwards" }}
    />
    <polyline
      points="24,41 35,52 56,30"
      stroke="#e4a156"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="50"
      strokeDashoffset="50"
      style={{ animation: "checkIn 0.4s cubic-bezier(.65,0,.45,1) 0.9s forwards" }}
    />
  </svg>
);

/* ── Timeline step ───────────────────────────────────────────── */
const TimelineStep = ({ icon, label, sub, active, animDelay }) => (
  <div
    className="flex flex-col items-center gap-1.5 text-center"
    style={{ animation: `fadeUpStep 0.5s ease ${animDelay}s both`, opacity: 0 }}
  >
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-base border transition-all
        ${active
          ? "bg-amber-50 border-amber-300 shadow-sm"
          : "bg-gray-50 border-gray-200"
        }`}
    >
      {icon}
    </div>
    <p className={`text-[11px] font-semibold ${active ? "text-amber-900" : "text-gray-400"}`}>{label}</p>
    <p className={`text-[10px] ${active ? "text-amber-600" : "text-gray-300"}`}>{sub}</p>
  </div>
);

/* ── Order Item Component ── */
const OrderItem = ({ item }) => (
  <div className="flex items-center gap-3 py-2 border-b border-amber-100 last:border-0">
    <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
      <FiShoppingBag className="text-amber-600" size={20} />
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-amber-900">{item.productName}</p>
      <div className="flex items-center gap-2 text-xs text-amber-600">
        <span>Size: {item.size}</span>
        {item.color && <span>• Color: {item.color}</span>}
        <span>• Qty: {item.quantity}</span>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-amber-900">₹{item.sellingPrice * item.quantity}</p>
      <p className="text-[10px] text-amber-500 line-through">₹{item.mrp * item.quantity}</p>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const orderId = location.state?.orderId || null;
  const orderData = location.state?.orderData || null;
  const [copied, setCopied] = useState(false);

  useConfetti(canvasRef);

  const displayId = orderId?.slice(-8)?.toUpperCase() || "—";
  
  // Calculate order summary
  const orderSummary = orderData ? {
    totalAmount: orderData.totalAmount,
    finalAmount: orderData.finalAmoutAfterCoinDeliverycharges,
    walletUsed: orderData.walletUsed || 0,
    coinUsed: orderData.coinUsed || 0,
    deliveryCharge: orderData.deliveryCharge || 0,
    paymentMethod: orderData.paymentMethod,
    items: orderData.items || []
  } : null;

  const estimatedDelivery = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  })();

  const copyOrderId = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUpStep {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-9px); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.55; }
          100% { transform: scale(1.85); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .animate-float   { animation: floatY 3.6s ease-in-out infinite; }
        .animate-pulse-ring {
          position: absolute; inset: -10px;
          border-radius: 9999px;
          border: 2px solid #e4a156;
          animation: pulseRing 1.9s ease-out 0.8s infinite;
        }
        .animate-shimmer-text {
          background: linear-gradient(90deg, #92601e 0%, #e4a156 35%, #f5c18a 55%, #92601e 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        .card-in   { animation: fadeUp 0.55s ease 0.1s  both; opacity: 0; }
        .in-d1     { animation: fadeUp 0.5s  ease 0.38s both; opacity: 0; }
        .in-d2     { animation: fadeUp 0.5s  ease 0.52s both; opacity: 0; }
        .in-d3     { animation: fadeUp 0.5s  ease 0.65s both; opacity: 0; }
        .in-d4     { animation: fadeUp 0.5s  ease 0.76s both; opacity: 0; }
        .in-d5     { animation: fadeUp 0.5s  ease 0.87s both; opacity: 0; }
        .in-d6     { animation: fadeUp 0.5s  ease 0.97s both; opacity: 0; }
        .in-d7     { animation: fadeUp 0.5s  ease 1.08s both; opacity: 0; }
      `}</style>

      {/* Page */}
      <div className="relative min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex flex-col items-center justify-center px-4 py-14 overflow-hidden">

        {/* Confetti */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-300/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-orange-300/10 blur-3xl pointer-events-none" />

        {/* Card */}
        <div className="relative z-10 w-full max-w-[440px] card-in">
          <div className="bg-white/80 backdrop-blur-2xl border border-amber-200/60 rounded-3xl shadow-2xl shadow-amber-900/10 px-8 py-10 text-center">

            {/* ── Check icon ── */}
            <div className="relative inline-flex items-center justify-center mb-7 animate-float">
              <div className="animate-pulse-ring" />
              <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200/80 flex items-center justify-center shadow-lg shadow-amber-200/50">
                <AnimatedCheck />
              </div>
            </div>

            {/* ── Headline ── */}
            <h1
              className="in-d1 animate-shimmer-text text-[2.6rem] font-bold leading-tight mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Order Confirmed!
            </h1>

            <p className="in-d2 text-sm text-amber-900/60 leading-relaxed mb-6">
              Thank you for your purchase. Your order is being<br className="hidden sm:block" />
              carefully packed and will be on its way soon.
            </p>

            {/* ── Order ID ── */}
            {orderId && (
              <div className="in-d3 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-7">
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.14em]">
                  Order ID
                </span>
                <div className="w-px h-3 bg-amber-200" />
                <span className="text-xs font-mono font-bold text-amber-900 tracking-wide">
                  #{displayId}
                </span>
                <button
                  onClick={copyOrderId}
                  className="ml-0.5 flex items-center gap-1 text-[11px] font-medium text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-md transition-colors"
                >
                  {copied
                    ? <><FiCheck size={10} /> Copied</>
                    : <><FiCopy size={10} /> Copy</>
                  }
                </button>
              </div>
            )}

            {/* ── Order Items Preview ── */}
            {orderSummary && orderSummary.items.length > 0 && (
              <div className="in-d4 mb-6 text-left">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
                    Order Summary
                  </h3>
                  <span className="text-[10px] text-amber-600">{orderSummary.items.length} item(s)</span>
                </div>
                <div className="bg-amber-50/50 rounded-xl p-3 max-h-48 overflow-y-auto">
                  {orderSummary.items.map((item, idx) => (
                    <OrderItem key={idx} item={item} />
                  ))}
                </div>
              </div>
            )}

            {/* ── Payment & Amount Details ── */}
            {orderSummary && (
              <div className="in-d5 bg-amber-50/80 border border-amber-100 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FiCreditCard size={13} className="text-[#927f68] shrink-0" />
                  <span className="text-xs font-semibold text-amber-900">Payment Details</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-amber-700">Total Amount</span>
                    <span className="font-medium text-amber-900">₹{orderSummary.totalAmount}</span>
                  </div>
                  {orderSummary.deliveryCharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-amber-700">Delivery Charge</span>
                      <span className="font-medium text-amber-900">₹{orderSummary.deliveryCharge}</span>
                    </div>
                  )}
                  {orderSummary.walletUsed > 0 && (
                    <div className="flex justify-between">
                      <span className="text-amber-700">Wallet Used</span>
                      <span className="font-medium text-green-600">-₹{orderSummary.walletUsed}</span>
                    </div>
                  )}
                  {orderSummary.coinUsed > 0 && (
                    <div className="flex justify-between">
                      <span className="text-amber-700">Coins Used</span>
                      <span className="font-medium text-green-600">-₹{orderSummary.coinUsed}</span>
                    </div>
                  )}
                  <div className="border-t border-amber-200 pt-1.5 mt-1.5">
                    <div className="flex justify-between font-bold">
                      <span className="text-amber-900">Amount Paid</span>
                      <span className="text-amber-900">₹{orderSummary.finalAmount}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-amber-600 mt-1">
                      <span>Payment Method</span>
                      <span className="capitalize">{orderSummary.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Timeline ── */}
            <div className="in-d6 flex items-start justify-center mb-8">
              <TimelineStep icon="✅" label="Confirmed" sub="Just now"    active={true}  animDelay={0.9}  />
              <div className="flex-1 h-px bg-amber-300 mt-5 max-w-[36px]" />
              <TimelineStep icon="📦" label="Packing"   sub="In progress" active={true}  animDelay={1.0}  />
              <div className="flex-1 h-px bg-gray-200 mt-5 max-w-[36px]" />
              <TimelineStep icon="🚚" label="Shipped"   sub="3–5 days"   active={false} animDelay={1.1}  />
              <div className="flex-1 h-px bg-gray-200 mt-5 max-w-[36px]" />
              <TimelineStep icon="🏠" label="Delivered" sub="At your door" active={false} animDelay={1.2} />
            </div>

            {/* ── Delivery info strip ── */}
            <div className="in-d7 bg-amber-50/80 border border-amber-100 rounded-2xl p-4 mb-6 text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <FiPackage size={13} className="text-[#927f68] shrink-0" />
                <span className="text-xs font-semibold text-amber-900">Estimated delivery</span>
                <span className="ml-auto text-xs font-bold text-[#927f68]">{estimatedDelivery}</span>
              </div>
              <p className="text-[11px] text-amber-800/60 leading-relaxed">
                A confirmation has been sent to your registered email. You can track your order anytime from the orders page.
              </p>
            </div>

            {/* ── Divider ── */}
            <div className="in-d7 flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-amber-100" />
              <span className="text-[9px] text-amber-400/80 uppercase tracking-[0.18em] font-semibold">
                What's next?
              </span>
              <div className="flex-1 h-px bg-amber-100" />
            </div>

            {/* ── CTAs ── */}
            <div className="in-d7 flex flex-col gap-3">
              <button
                onClick={() => navigate("/userprofile")}
                className="w-full flex items-center justify-center gap-2 bg-[#927f68] hover:bg-[#7a6650] text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#927f68]/25 hover:-translate-y-0.5 active:translate-y-0"
              >
                <FiList size={14} />
                Track My Order
                <FiArrowRight size={13} />
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-amber-50 text-amber-900 border border-amber-200 hover:border-amber-300 text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 active:scale-[0.99]"
              >
                <FiHome size={14} />
                Continue Shopping
              </button>
            </div>

          </div>
        </div>

        {/* Tagline */}
        <p className="in-d7 relative z-10 mt-6 text-[10px] text-amber-600/50 uppercase tracking-[0.22em] font-semibold">
          Crafted with care · Delivered with love
        </p>

      </div>
    </>
  );
};

export default OrderSuccess;
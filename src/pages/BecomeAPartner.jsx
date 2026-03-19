import { useState, useEffect } from "react";

/* ── Data ─────────────────────────────────────────────────────── */
const WHY = [
  { icon: "📦", title: "Easy Product Listing",  desc: "Upload via CSV or one by one. Go live in minutes with our guided listing tool." },
  { icon: "📊", title: "Real-Time Dashboard",   desc: "Track orders, returns, revenue and ratings all from one clean interface." },
  { icon: "🚚", title: "Logistics Support",     desc: "Pre-negotiated rates with 15+ carriers. Automated label generation included." },
  { icon: "💸", title: "Fast 7-Day Payouts",    desc: "Direct to your bank account every 7 days. No minimums, no delays." },
  { icon: "📣", title: "Built-In Marketing",    desc: "Access sale events, featured slots, and sponsored product placements." },
  { icon: "🛡️", title: "Seller Protection",     desc: "Dispute resolution, fraud shield, and dedicated account manager support." },
];

const STEPS = [
  { num: 1, title: "Register Free",  desc: "Fill the form in 3 minutes", bg: "bg-orange-500", shadow: "shadow-orange-300" },
  { num: 2, title: "Submit Docs",    desc: "GST, PAN & bank details",    bg: "bg-green-500",  shadow: "shadow-green-300"  },
  { num: 3, title: "List Products",  desc: "Add your catalogue easily",  bg: "bg-violet-500", shadow: "shadow-violet-300" },
  { num: 4, title: "Start Selling",  desc: "Go live, reach millions",    bg: "bg-red-500",    shadow: "shadow-red-300"    },
];

const TESTIMONIALS = [
  { name: "Rahul Sharma", city: "Delhi",  cat: "Casual Wear", rev: "₹8.4L/mo",  growth: "+340%", init: "RS", ringColor: "ring-orange-400", textColor: "text-orange-500", bgColor: "bg-orange-50",  quote: "I went from a small Instagram shop to ₹8 lakhs a month. The logistics support alone saved me countless headaches every week." },
  { name: "Meera Patel",  city: "Surat",  cat: "Ethnic Wear", rev: "₹5.1L/mo",  growth: "+215%", init: "MP", ringColor: "ring-violet-400", textColor: "text-violet-500", bgColor: "bg-violet-50",  quote: "The seller dashboard shows me exactly what's working. My repeat customer rate hit 38% — something I never tracked before joining." },
  { name: "Karan Mehta",  city: "Mumbai", cat: "Streetwear",  rev: "₹12.6L/mo", growth: "+490%", init: "KM", ringColor: "ring-green-400",  textColor: "text-green-600",  bgColor: "bg-green-50",   quote: "Featured placements during sale events doubled my monthly revenue. Best business decision I've made in the last three years." },
];

const CATS = [
  "Men's Fashion", "Women's Fashion", "Kids Wear", "Ethnic Wear",
  "Footwear", "Accessories", "Sportswear", "Innerwear",
  "Bags & Luggage", "Jewellery", "Beauty", "Home & Living",
];

const PLATFORM_FEATURES = [
  { title: "Live Order Feed",     desc: "Track every order as it's placed, picked, and shipped",        border: "border-l-orange-500" },
  { title: "Revenue Analytics",  desc: "Daily, weekly, monthly breakdowns by product & category",      border: "border-l-green-500"  },
  { title: "Return Management",  desc: "One-click return processing with automated refund triggers",    border: "border-l-violet-500" },
  { title: "Customer Insights",  desc: "See who's buying, rating, and returning to your store",        border: "border-l-red-500"    },
  { title: "Promotions Manager", desc: "Set flash sales, bundle offers and discount codes anytime",    border: "border-l-sky-500"    },
];

/* ── Validation helpers ───────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Returns an error string or null — only after user has touched the field
function getFieldError(k, value) {
  if (k === "mobile") {
    if (!value) return null;
    if (!/^\d+$/.test(value)) return "Only digits are allowed";
    if (value[0] !== "6") return "Mobile number must start with 6";
    if (value.length < 10) return null; // still typing, no mid-type error
  }
  if (k === "email") {
    if (!value) return null;
    // only show error once they've typed an @
    if (value.includes("@") && !EMAIL_RE.test(value)) return "Enter a valid email (e.g. name@example.com)";
  }
  return null;
}

/* ── Shared sub-components ────────────────────────────────────── */
function Badge({ text, color }) {
  const map = { orange: "bg-orange-500", green: "bg-green-500", red: "bg-red-500", black: "bg-gray-900", sky: "bg-sky-500" };
  return (
    <span className={`inline-block ${map[color] ?? "bg-orange-500"} text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm tracking-widest uppercase`}>
      {text}
    </span>
  );
}

function SectionHeader({ title, sub }) {
  return (
    <div className="mb-5">
      <h2 className="text-[18px] font-bold text-gray-800 mb-1 tracking-tight">{title}</h2>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
      <div className="w-9 h-0.5 bg-orange-500 rounded mt-2" />
    </div>
  );
}

function WhyCard({ icon, title, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`bg-white rounded-md p-4 border transition-all duration-200 cursor-default ${hov ? "border-orange-400 shadow-[0_4px_14px_rgba(249,115,22,0.12)]" : "border-gray-200"}`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-[13px] font-bold text-gray-800 mb-1">{title}</div>
      <div className="text-[12px] text-gray-500 leading-relaxed">{desc}</div>
    </div>
  );
}

function CategoryPill({ label }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`rounded-full px-4 py-1.5 text-xs font-medium border transition-all duration-150 cursor-default ${hov ? "bg-orange-50 border-orange-400 text-orange-600" : "bg-gray-100 border-gray-200 text-gray-700"}`}
    >
      {label}
    </div>
  );
}

/* ── Field — defined OUTSIDE main component to prevent remount ── */
function Field({ k, label, ph, type = "text", req = true, value, submitError, onChange }) {
  const [touched, setTouched] = useState(false);

  // Inline real-time error (only shown after blur)
  const inlineErr = touched ? getFieldError(k, value) : null;

  // Submit-time error message
  const submitMsg =
    submitError
      ? k === "mobile" ? "Enter a valid 10-digit number starting with 6"
      : k === "email"  ? "Enter a valid email address"
      : "This field is required"
      : null;

  const errorMsg = submitMsg || inlineErr;
  const hasError = !!errorMsg;

  const handleChange = (e) => {
    let val = e.target.value;
    if (k === "mobile") {
      // Strip non-digits and cap at 10 chars — prevents letters/symbols entirely
      val = val.replace(/\D/g, "").slice(0, 10);
    }
    onChange(k, val);
  };

  const handleBlur = (e) => {
    setTouched(true);
    e.target.style.borderColor = hasError ? "#EF4444" : "#D1D5DB";
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = "#F97316";
  };

  // Mobile digit counter label
  const mobileHint = k === "mobile" && value.length > 0
    ? value.length === 10 && value[0] === "6"
      ? { text: "✓ Valid number", cls: "text-green-600" }
      : value[0] !== "6"
      ? null // error already shown
      : { text: `${10 - value.length} more digit${10 - value.length !== 1 ? "s" : ""} needed`, cls: "text-gray-400" }
    : null;

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-800">
        {label}{req && <span className="text-orange-500"> *</span>}
      </label>
      <input
        type={type === "tel" ? "text" : type}
        inputMode={k === "mobile" ? "numeric" : undefined}
        placeholder={ph}
        value={value}
        maxLength={k === "mobile" ? 10 : undefined}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`text-[13px] px-3 py-2.5 rounded border outline-none text-gray-800 transition-colors ${hasError ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`}
      />

      {/* Error message */}
      {errorMsg && (
        <span className="text-[10px] text-red-500">{errorMsg}</span>
      )}

      {/* Mobile counter row — only shown when no error */}
      {k === "mobile" && !errorMsg && mobileHint && (
        <div className="flex justify-between">
          <span className={`text-[10px] ${mobileHint.cls}`}>{mobileHint.text}</span>
          <span className={`text-[10px] ${value.length === 10 ? "text-green-600" : "text-gray-400"}`}>{value.length}/10</span>
        </div>
      )}

      {/* Counter row even when there's an error so user knows progress */}
      {k === "mobile" && errorMsg && value.length > 0 && (
        <div className="flex justify-end">
          <span className="text-[10px] text-gray-400">{value.length}/10</span>
        </div>
      )}
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────── */
export default function BecomeAPartner() {
  const [form, setForm] = useState({ name: "", mobile: "", email: "", business: "", gstin: "", category: "", city: "", monthly: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [activeT, setActiveT] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveT(p => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const setF = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: false }));
  };

  const submit = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.mobile || form.mobile.length !== 10 || form.mobile[0] !== "6") e.mobile = true;
    if (!EMAIL_RE.test(form.email)) e.email = true;
    if (!form.business.trim()) e.business = true;
    if (!form.category) e.category = true;
    if (!form.city.trim()) e.city = true;
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitted(true);
  };

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="bg-gray-100 min-h-screen font-sans">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-linear-to-br from-[#ffcda7] via-[#fd943e] to-[#111]">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "repeating-linear-linear(45deg,transparent,transparent 50px,rgba(249,115,22,0.06) 50px,rgba(249,115,22,0.06) 100px)" }} />
        <div className="relative z-10 max-w-300 mx-auto px-5 grid grid-cols-2 min-h-65 items-center">
          <div className="py-10 pr-6 border-r border-white/5">
            <div className="flex gap-1.5 mb-3.5">
              <Badge text="SELLER PROGRAM" color="orange" />
              <Badge text="FREE TO JOIN" color="green" />
            </div>
            <h1 className="text-[clamp(1.9rem,3.5vw,2.9rem)] font-black text-white leading-[1.1] tracking-tight mb-2.5">
              Sell to <span className="text-orange-500">2.4 Million+</span><br />Buyers. Start Today.
            </h1>
            <p className="text-[13px] text-gray-400 mb-6 leading-relaxed">
              India's fastest-growing fashion marketplace.<br />Join free, go live in 24 hours.
            </p>
            <div className="flex gap-2.5">
              <button onClick={() => scrollTo("register")} className="bg-orange-500 hover:bg-orange-600 text-white text-[14px] font-bold px-7 py-3 rounded-sm transition-colors cursor-pointer">
                Register as Seller →
              </button>
              <button onClick={() => scrollTo("why")} className="bg-transparent text-white border border-white/20 hover:border-white/40 text-[13px] font-medium px-5 py-3 rounded-sm transition-colors cursor-pointer">
                Learn More
              </button>
            </div>
          </div>
          <div className="py-8 pl-6">
            <img src="../images/become.png" alt="Become a Partner" className="w-full h-full object-cover " />
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="mx-auto px-8 py-4">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] text-gray-500 mb-3.5">
          <span className="text-orange-500 cursor-pointer hover:underline">Home</span>
          <span>›</span>
          <span className="text-gray-700 font-medium">Become a Partner</span>
        </div>

        {/* WHY US */}
        <div id="why" className="bg-white rounded-md p-5 mb-3 border border-gray-200">
          <SectionHeader title="Why Sell With Us?" sub="Everything you need to grow your fashion business online" />
          <div className="grid grid-cols-3 gap-2.5">
            {WHY.map((w, i) => <WhyCard key={i} {...w} />)}
          </div>
        </div>

        {/* PROMO STRIP */}
        <div className="relative overflow-hidden rounded-md mb-3 border border-orange-900/20 bg-linear-to-r from-[#1C1C1C] via-[#2D1A0E] to-[#1C1C1C]">
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-orange-500/5 pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between px-7 py-6">
            <div>
              <Badge text="LIMITED OFFER" color="red" />
              <h2 className="text-[26px] font-black text-white mt-2.5 mb-1.5 tracking-tight leading-tight">
                Zero Commission<br /><span className="text-orange-500">for your first 60 days!</span>
              </h2>
              <p className="text-[12px] text-gray-400">Only for sellers registering this week. Don't miss out.</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-400 mb-1.5 tracking-widest uppercase">Offer ends in</div>
              <div className="flex gap-2">
                {[["03","Days"],["14","Hrs"],["22","Min"]].map(([v,l]) => (
                  <div key={l} className="bg-orange-500/10 border border-orange-500/30 rounded px-3 py-2 text-center">
                    <div className="text-[20px] font-extrabold text-orange-500 leading-none">{v}</div>
                    <div className="text-[9px] text-gray-400 mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="bg-white rounded-md p-5 mb-3 border border-gray-200">
          <SectionHeader title="How to Get Started" sub="Be live on the platform in less than 24 hours" />
          <div className="flex items-start pt-2">
            {STEPS.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center text-center relative">
                {i < STEPS.length - 1 && <div className="absolute top-[21px] left-[58%] right-[-42%] h-0.5 bg-gray-200 z-0" />}
                <div className={`w-11 h-11 rounded-full ${s.bg} shadow-lg ${s.shadow} flex items-center justify-center text-lg font-extrabold text-white relative z-10 mb-2.5`}>{s.num}</div>
                <div className="text-[13px] font-bold text-gray-800 mb-0.5">{s.title}</div>
                <div className="text-[11px] text-gray-500 leading-snug">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PLATFORM */}
        <div className="bg-white rounded-md p-5 mb-3 border border-gray-200">
          <SectionHeader title="Powerful Seller Platform" sub="Manage your entire business from one dashboard" />
          <div className="grid grid-cols-[1fr_1.2fr] gap-6 items-start">
            <div>
              <p className="text-[13px] text-gray-500 leading-relaxed mb-3.5">Our seller platform gives you complete visibility and control. From listing products to tracking deliveries and handling returns — everything in one place.</p>
              <div className="flex flex-col gap-2">
                {PLATFORM_FEATURES.map(f => (
                  <div key={f.title} className={`flex gap-2.5 items-start px-3 py-2.5 bg-gray-50 rounded-sm border-l-[3px] ${f.border}`}>
                    <div>
                      <div className="text-[12px] font-semibold text-gray-800 mb-0.5">{f.title}</div>
                      <div className="text-[11px] text-gray-500">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-100 border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-900 px-3.5 py-2.5 flex justify-between items-center">
                <span className="text-white text-[12px] font-semibold">Seller Dashboard</span>
                <div className="flex items-center gap-1.5">
                  <Badge text="LIVE" color="green" />
                  <span className="text-[10px] text-gray-400">Updated just now</span>
                </div>
              </div>
              <div className="p-3.5">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[["₹84,320","Today's Revenue","text-orange-500"],["127","New Orders","text-green-600"],["4.8★","Seller Rating","text-amber-500"]].map(([v,l,tc]) => (
                    <div key={l} className="bg-white border border-gray-200 rounded-sm p-2 text-center">
                      <div className={`text-[17px] font-extrabold ${tc}`}>{v}</div>
                      <div className="text-[9px] text-gray-400 mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white border border-gray-200 rounded-sm p-2.5 mb-2.5">
                  <div className="text-[11px] font-semibold text-gray-800 mb-2">Weekly Sales</div>
                  <div className="flex items-end gap-1 h-12">
                    {[45,62,38,80,55,91,72].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                        <div className={`w-full rounded-t-[2px] ${i === 5 ? "bg-orange-500" : "bg-gray-200"}`} style={{ height: `${h * 0.48}px` }} />
                        <div className="text-[9px] text-gray-400">{"MTWTFSS"[i]}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-sm p-2.5">
                  <div className="text-[11px] font-semibold text-gray-800 mb-1.5">Recent Orders</div>
                  {[["#4821","Slim Fit Jeans","₹1,299","Packed"],["#4820","Oversized Tee","₹849","Shipped"],["#4819","Chinos","₹1,599","Delivered"]].map(([id,p,a,st]) => (
                    <div key={id} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                      <div>
                        <div className="text-[11px] font-semibold text-gray-800">{id} · {p}</div>
                        <div className="text-[10px] text-gray-400">{a}</div>
                      </div>
                      <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded-sm tracking-widest ${st==="Delivered"?"bg-green-500":st==="Shipped"?"bg-sky-500":"bg-orange-500"}`}>{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="bg-white rounded-md p-5 mb-3 border border-gray-200">
          <SectionHeader title="Selling Categories" sub="We support sellers across all fashion & lifestyle segments" />
          <div className="flex flex-wrap gap-2">
            {CATS.map((c, i) => <CategoryPill key={i} label={c} />)}
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div className="bg-white rounded-md p-5 mb-3 border border-gray-200">
          <SectionHeader title="Partner Success Stories" sub="Real sellers. Real numbers. Real growth." />
          <div className="grid grid-cols-3 gap-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`bg-white rounded-md p-4 border transition-all duration-300 ${activeT===i ? "border-orange-400 shadow-[0_4px_18px_rgba(249,115,22,0.12)] scale-[1.01]" : "border-gray-200 scale-100"}`}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={`w-10 h-10 rounded-full ${t.bgColor} border-2 ${t.ringColor} flex items-center justify-center text-[13px] font-bold ${t.textColor} shrink-0`}>{t.init}</div>
                  <div>
                    <div className="text-[13px] font-bold text-gray-800">{t.name}</div>
                    <div className="text-[11px] text-gray-500">{t.city} · {t.cat}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-[14px] font-extrabold text-gray-800">{t.rev}</div>
                    <span className="inline-block bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm tracking-widest">{t.growth}</span>
                  </div>
                </div>
                <p className="text-[12px] text-gray-500 leading-relaxed italic">"{t.quote}"</p>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 justify-center mt-3.5">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveT(i)} className={`h-2 rounded-full border-none cursor-pointer transition-all duration-300 ${i===activeT ? "w-5 bg-orange-500" : "w-2 bg-gray-200"}`} />
            ))}
          </div>
        </div>

        {/* REGISTRATION FORM */}
        <div id="register" className="bg-white rounded-md p-5 mb-3 border border-gray-200">
          <SectionHeader title="Register as a Seller" sub="Free to join · Start selling within 24 hours" />

          {submitted ? (
            <div className="bg-green-50 border border-green-400 rounded-md px-7 py-9 text-center">
              <div className="text-4xl mb-2.5">✅</div>
              <h3 className="text-lg font-bold text-gray-800 mb-1.5">Application Submitted!</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                Thanks, <strong className="text-gray-800">{form.name}</strong>! Our team will call you at{" "}
                <strong className="text-gray-800">{form.mobile}</strong> within <strong className="text-green-600">24 hours</strong>.
              </p>
              <div className="inline-flex gap-2 mt-3.5 bg-gray-100 px-4 py-2 rounded-sm">
                <span className="text-[12px] text-gray-500">Application ID:</span>
                <span className="text-[12px] font-bold text-orange-500">#SP{Date.now().toString().slice(-6)}</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-[1.5fr_1fr] gap-7 items-start">
              <div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Field k="name"     label="Full Name"             ph="Rahul Sharma"        value={form.name}     submitError={errors.name}     onChange={setF} />
                  <Field k="mobile"   label="Mobile Number"         ph="6XXXXXXXXX"          value={form.mobile}   submitError={errors.mobile}   onChange={setF} type="tel" />
                  <Field k="email"    label="Email Address"         ph="seller@example.com"  value={form.email}    submitError={errors.email}    onChange={setF} type="email" />
                  <Field k="business" label="Business / Brand Name" ph="Your Store Name"     value={form.business} submitError={errors.business} onChange={setF} />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  {/* Category */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-800">Category <span className="text-orange-500">*</span></label>
                    <select
                      value={form.category}
                      onChange={e => setF("category", e.target.value)}
                      onFocus={e => e.target.style.borderColor = "#F97316"}
                      onBlur={e => e.target.style.borderColor = errors.category ? "#EF4444" : "#D1D5DB"}
                      className={`text-[13px] px-3 py-2.5 rounded border outline-none bg-white cursor-pointer ${errors.category ? "border-red-400" : "border-gray-200"} ${form.category ? "text-gray-800" : "text-gray-400"}`}
                    >
                      <option value="">Select...</option>
                      {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.category && <span className="text-[10px] text-red-500">This field is required</span>}
                  </div>
                  <Field k="city"  label="City"             ph="Mumbai"          value={form.city}  submitError={errors.city}  onChange={setF} />
                  <Field k="gstin" label="GSTIN (optional)" ph="22AAAAA0000A1Z5" value={form.gstin} submitError={false}        onChange={setF} req={false} />
                </div>

                {/* Monthly turnover pills */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">Monthly Turnover</label>
                  <div className="flex gap-2 flex-wrap">
                    {["New Seller","< ₹1L","₹1–5L","₹5–25L","₹25L+"].map(opt => (
                      <button key={opt} onClick={() => setF("monthly", opt)}
                        className={`text-[12px] px-3.5 py-1.5 rounded-full border transition-all duration-150 cursor-pointer ${form.monthly===opt ? "font-bold border-orange-400 bg-orange-50 text-orange-600" : "font-normal border-gray-200 bg-white text-gray-700 hover:border-orange-300"}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={submit} className="w-full bg-orange-500 hover:bg-orange-600 text-white text-[14px] font-bold py-3 rounded cursor-pointer transition-colors tracking-wide">
                  Submit Application →
                </button>
                <p className="text-[11px] text-gray-400 mt-2 text-center">By registering, you agree to our Seller Terms & Conditions.</p>
              </div>

              {/* Side panel */}
              <div className="flex flex-col gap-2.5">
                <div className="bg-orange-50 border border-orange-200/60 rounded-md p-4">
                  <div className="text-[13px] font-bold text-gray-800 mb-2.5">🎁 Seller Welcome Pack</div>
                  {["60 days zero commission","Free GST registration help","Dedicated onboarding call","₹5,000 ad credits included","Priority listing for 30 days"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1.5">
                      <span className="text-green-500 font-bold text-[13px]">✓</span>
                      <span className="text-[12px] text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3.5">
                  <div className="text-[12px] font-semibold text-gray-800 mb-2">Need help registering?</div>
                  <div className="text-[12px] text-gray-500 mb-2.5">Seller support: Mon–Sat, 9am–7pm</div>
                  <div className="flex gap-2">
                    {[["📞","1800-XXX-XXXX","Toll Free"],["💬","Live Chat","Avg. reply: 2 min"]].map(([icon,v,sub]) => (
                      <div key={v} className="flex-1 bg-white border border-gray-200 rounded-sm p-2 text-center">
                        <div className="text-lg">{icon}</div>
                        <div className="text-[10px] font-semibold text-gray-800 mt-0.5">{v}</div>
                        <div className="text-[9px] text-gray-400">{sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA BOTTOM */}
        <div className="bg-gray-900 rounded-md px-8 py-7 mb-5 flex justify-between items-center border border-orange-900/20">
          <div>
            <div className="text-[10px] text-orange-500 font-semibold tracking-[0.12em] uppercase mb-1.5">Start Today</div>
            <h3 className="text-[22px] font-black text-white tracking-tight mb-1">
              Your products. Our platform. <span className="text-orange-500">Unlimited growth.</span>
            </h3>
            <p className="text-[12px] text-gray-400">Free to join · No monthly fees · Cancel anytime</p>
          </div>
          <button onClick={() => scrollTo("register")} className="bg-orange-500 hover:bg-orange-600 text-white text-[14px] font-bold px-8 py-3.5 rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0">
            Become a Partner →
          </button>
        </div>
      </div>
    </div>
  );
}
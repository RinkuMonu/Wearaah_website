import { useState } from "react";
import { X } from "lucide-react";
import api from "../service/axios";
import { useAuth } from "../service/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ isOpen, onClose }) {
  const { settoken, syncCartAfterLogin } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length === 1 && !/[6-9]/.test(value)) return;
    if (value.length <= 10) setPhone(value);
  };

  const isValidPhone = phone.length === 10;

  const sendOtp = async () => {
    try {
      setLoading(true);
      setError("");
      const ress = await api.post("/otp/send", { mobile: phone });
      if (ress.data?.success) {
        setStep("otp");
      } else {
        setError(ress.data?.message || "Failed to send verification code");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/register/via/otp", {
        mobile: phone,
        otp: Number(otp),
      });
      await syncCartAfterLogin();
      if (res.data?.token) {
        localStorage.setItem("token", res.data?.token);
        settoken(res.data?.token);
        localStorage.setItem("user", JSON.stringify(res.data?.user));
        navigate("/");
      }
      setStep("phone");
      setOtp("");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-99 animate-in fade-in-0 duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white shadow-2xl border border-neutral-100 overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[460px]">
            {/* Visual Column */}
            <div className="relative hidden md:block overflow-hidden bg-neutral-900">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-85 transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: "url('/images/9.webp')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-x-6 bottom-8 text-white">
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#c5a059] uppercase block mb-1">
                  Wearaah Private Circle
                </span>
                <h4 className="text-xl font-serif font-light leading-snug">
                  Experience Personalized Luxury Fashion &amp; Bespoke Styling
                </h4>
              </div>
            </div>

            {/* Form Column */}
            <div className="p-8 sm:p-10 flex flex-col justify-center relative bg-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="mb-6">
                <img
                  src="/logo/WEARAAH_Logo_4K_Transparent.png"
                  alt="Wearaah"
                  className="h-8 w-auto object-contain mb-3"
                  onError={(e) => {
                    e.currentTarget.src = "/logo/wearaah-transparent.png";
                  }}
                />
                <div className="text-[10px] font-bold tracking-[0.25em] text-[#c5a059] uppercase mb-1">
                  Client Portal
                </div>
                <h3 className="text-2xl font-serif font-normal text-neutral-900">
                  Welcome to Wearaah
                </h3>
                <p className="text-xs text-neutral-500 mt-1 font-light">
                  {step === "phone"
                    ? "Enter your mobile number to receive a one-time passcode"
                    : `Enter the 6-digit code sent to +91 ${phone}`}
                </p>
              </div>

              {step === "phone" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-700 block mb-1.5">
                      Mobile Number
                    </label>
                    <div className="flex items-center border border-neutral-300 focus-within:border-[#c5a059] transition-colors rounded-xs overflow-hidden">
                      <span className="px-3 py-3 text-xs font-semibold text-neutral-500 bg-neutral-50 border-r border-neutral-200">
                        +91
                      </span>
                      <input
                        type="tel"
                        placeholder="Enter 10-digit number"
                        value={phone}
                        onChange={handlePhoneChange}
                        maxLength={10}
                        className="w-full px-3 py-3 text-sm text-neutral-900 outline-none"
                        autoFocus
                      />
                    </div>
                    {phone.length > 0 && !isValidPhone && (
                      <p className="text-[11px] text-red-500 mt-1">
                        Please enter a valid 10-digit mobile number starting with 6–9
                      </p>
                    )}
                  </div>

                  {error && (
                    <p className="text-xs text-red-600 p-2.5 bg-red-50 border border-red-200 rounded-xs">
                      {error}
                    </p>
                  )}

                  <button
                    disabled={!isValidPhone || loading}
                    onClick={sendOtp}
                    className="w-full py-3.5 px-4 bg-[#c5a059] hover:bg-[#b38e47] text-neutral-950 font-semibold text-xs uppercase tracking-[0.2em] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                  >
                    {loading ? "Sending Passcode..." : "Send Verification Code"}
                  </button>
                </div>
              )}

              {step === "otp" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-700 block mb-1.5">
                      6-Digit Passcode
                    </label>
                    <input
                      type="text"
                      placeholder="• • • • • •"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      maxLength={6}
                      className="w-full px-4 py-3 text-center text-xl tracking-[0.4em] font-mono border border-neutral-300 focus:border-[#c5a059] transition-colors outline-none rounded-xs"
                      autoFocus
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-red-600 p-2.5 bg-red-50 border border-red-200 rounded-xs">
                      {error}
                    </p>
                  )}

                  <button
                    onClick={verifyOtp}
                    disabled={otp.length !== 6 || loading}
                    className="w-full py-3.5 px-4 bg-neutral-950 hover:bg-[#c5a059] hover:text-black text-white font-semibold text-xs uppercase tracking-[0.2em] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                  >
                    {loading ? "Verifying..." : "Verify & Access Bag"}
                  </button>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        setStep("phone");
                        setOtp("");
                        setError("");
                      }}
                      className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors underline"
                    >
                      Change Number
                    </button>
                    <button
                      onClick={sendOtp}
                      disabled={loading}
                      className="text-xs text-[#c5a059] hover:underline"
                    >
                      Resend Code
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

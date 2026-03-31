import { useState } from "react";
import { X } from "lucide-react";
import api from "../service/axios";
import { useAuth } from "../service/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ isOpen, onClose }) {
  const { settoken } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState("phone");
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
      console.log("otp send res", ress);
      if (ress.data.success) {
        setStep("otp");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {  
      setError("Please enter 6 digit OTP");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/register/via/otp", {
        mobile: phone,
        otp: Number(otp),
      });
      if (res.data?.token) {
        localStorage.setItem("token", res.data?.token);
        settoken(res.data?.token);
        localStorage.setItem("user", JSON.stringify(res.data?.user));
         navigate("/");
      }
      setStep("phone");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-99 animate-in fade-in-0 zoom-in duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-999 flex items-center justify-center p-4 h-screen">
        <div className="w-full bg-white/95 backdrop-blur-xl  shadow-2xl shadow-gray-900/10 border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-300 max-h-[95vh]">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 h-[500px] lg:h-[600px]">
            
            <div className="relative overflow-hidden bg-linear-to-br from-gray-50 to-white lg:min-h-full">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('./images/9.webp')" }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute top-8 left-8 w-24 h-24 bg-white/20 rounded-2xl blur-xl animate-pulse" />
              <div className="absolute bottom-12 right-8 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl rotate-12" />
            </div>
            <div className="p-8 flex flex-col justify-center relative">
              
              <button
                onClick={onClose}
                className="group absolute top-4 right-4 w-12 h-12  shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:scale-105 hover:shadow-xl"
              >
                <X size={20} className="text-gray-600 group-hover:text-gray-900" />
              </button>

              <div className="text-center mb-8">
                <h3 className="text-2xl lg:text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                  Welcome to Lionies
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[280px] mx-auto">
                  Login using your mobile number
                </p>
              </div>

              {step === "phone" && (
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={handlePhoneChange}
                        maxLength={10}
                        className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-md focus:border-[#927f68] focus:ring-4 focus:ring-[#927f68]/10 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                      />
                      {phone.length > 0 && !isValidPhone && (
                        <p className="text-xs text-red-500 mt-1 font-medium">Mobile must start with 6–9 and be 10 digits</p>
                      )}
                    </div>
                    {error && <p className="text-sm text-red-500 p-3 bg-red-50 border border-red-100 rounded-xl">{error}</p>}
                  </div>

                  <button
                    disabled={!isValidPhone || loading}
                    onClick={sendOtp}
                    className={`w-full py-3 px-6 text-lg font-semibold rounded-md shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                     ${isValidPhone && !loading 
                       ? "bg-[#927f68] text-white hover:shadow-xl hover:shadow-[#927f68]/25" 
                       : "bg-gray-200 text-gray-500 cursor-not-allowed"
                     }`}
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </>
              )}

              {step === "otp" && (
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        maxLength={6}
                        className="w-full px-4 py-4 text-2xl text-center tracking-[0.3em] border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 bg-linear-to-r from-gray-50 to-white font-mono"
                      />
                    </div>
                    {error && <p className="text-sm text-red-500 p-3 bg-red-50 border border-red-100 rounded-xl">{error}</p>}
                  </div>

                  <button
                    onClick={verifyOtp}
                    disabled={otp.length !== 6 || loading}
                    className="w-full py-4 px-6 rounded-xl text-lg font-bold bg-black text-white shadow-2xl hover:shadow-black/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? "Verifying..." : "Verify & Login"}
                  </button>

                  <button
                    onClick={() => {
                      setStep("phone");
                      setOtp("");
                    }}
                    className="text-sm text-gray-500 hover:text-gray-900 font-medium mt-4 transition-colors flex items-center justify-center gap-1 hover:underline mx-auto"
                  >
                    Change number
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

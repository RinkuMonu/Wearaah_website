import { useState } from "react";
import { 
  MdCreditCard, 
  MdAccountBalance,  
  MdWallet, 
  MdSmartphone, 
  MdPayments,
  MdSecurity,
  MdCheckCircle 
} from "react-icons/md";
import { SiRazorpay, SiPaypal } from "react-icons/si";

const Payment = ({ onPaymentChange }) => {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });
  // call this wherever selectedMethod changes:
  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    onPaymentChange?.({ method });
  };
  const paymentMethods = [
    { 
      id: "card", 
      title: "Credit/Debit Card", 
      icon: MdCreditCard,
      desc: "Visa, Mastercard, RuPay"
    },
    { 
      id: "upi", 
      title: "UPI", 
      icon: MdSmartphone,
      desc: "PhonePe, GPay, Paytm"
    },
    { 
      id: "wallet", 
      title: "Wallets", 
      icon: MdWallet,
      desc: "Wining Coins"
    },
    { 
      id: "netbanking", 
      title: "Net Banking", 
      icon: MdAccountBalance,
      desc: "All Major Banks"
    },
  ];

  const handleCardInput = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === "number") {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    }
    
    setCardData(prev => ({ ...prev, [name]: formattedValue }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <MdCreditCard className="w-6 h-6 text-[#927f68]" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
          <p className="text-sm text-gray-500">Complete your payment securely</p>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <label
              key={method.id}
              className={`group cursor-pointer p-5 border-2 border-gray-200 rounded-xl hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center h-full bg-white ${
                selectedMethod === method.id
                  ? "border-[#927f68] bg-linear-to-br from-[#927f68]/5 to-[#927f68]/10 ring-4 ring-[#927f68]/20 shadow-md"
                  : "hover:border-[#927f68]/50 hover:shadow-md"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => setSelectedMethod(method.id)}
                className="sr-only peer"
              />
              <div className={`p-3 bg-linear-to-br from-gray-100 to-gray-200 rounded-full mb-3 transition-all group-hover:scale-110 ${selectedMethod === method.id ? 'bg-[#927f68]/20 from-[#927f68]/20' : ''}`}>
                <Icon className={`w-7 h-7 text-gray-700 group-hover:text-[#927f68] transition-colors ${selectedMethod === method.id ? 'text-[#927f68]' : ''}`} />
              </div>
              <div className="space-y-2">
                <div className={`font-bold text-sm transition-colors ${selectedMethod === method.id ? 'text-[#927f68]' : 'text-gray-900 group-hover:text-[#927f68]'}`}>
                  {method.title}
                </div>
                <div className="text-xs text-gray-500 leading-tight">{method.desc}</div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Dynamic Payment Forms */}
      <div className="pt-6 border-t border-gray-100">
        {selectedMethod === "card" && (
          <div className="space-y-5">
            {/* Card Preview */}
            <div className="relative bg-linear-to-r from-gray-900 via-blue-900 to-purple-900 text-white p-6 rounded-2xl shadow-2xl">
              <div className="absolute top-6 right-6">
                <SiRazorpay className="w-6 h-6" />
              </div>
              <div className="space-y-4">
                <div className="text-sm text-gray-300 tracking-wider uppercase">**** **** ****</div>
                <div className="text-2xl font-mono tracking-widest">{cardData.number.replace(/\s/g, '').slice(-4) || '****'}</div>
                <div className="flex justify-between text-sm">
                  <span>{cardData.expiry || '**/**'}</span>
                  <span>{cardData.name || 'Cardholder'}</span>
                </div>
              </div>
            </div>

            {/* Card Input Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MdCreditCard className="w-4 h-4 text-[#927f68]" />
                  Card Details
                </label>
                <input
                  type="text"
                  name="number"
                  value={cardData.number}
                  onChange={handleCardInput}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#927f68]/20 focus:border-[#927f68] transition-all text-lg tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Expires</label>
                  <input
                    type="text"
                    name="expiry"
                    value={cardData.expiry}
                    onChange={handleCardInput}
                    placeholder="MM/YY"
                    maxLength="5"
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#927f68]/20 focus:border-[#927f68] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleCardInput}
                    placeholder="123"
                    maxLength="4"
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#927f68]/20 focus:border-[#927f68] transition-all"
                  />
                </div>
              </div>

              <input
                type="text"
                name="name"
                value={cardData.name}
                onChange={handleCardInput}
                placeholder="Cardholder Name"
                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#927f68]/20 focus:border-[#927f68] transition-all"
              />
            </div>
          </div>
        )}

        {selectedMethod === "upi" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <MdSmartphone className="w-4 h-4 text-[#927f68]" />
                UPI ID
              </label>
              <input
                type="text"
                placeholder="yourname@paytm / @okaxis"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#927f68]/20 focus:border-[#927f68] transition-all text-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* Security Section */}
      <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <MdSecurity className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
              <MdCheckCircle className="w-5 h-5" /> Secure Payment Guaranteed
            </p>
            <p className="text-xs text-green-700 mt-1">256-bit SSL encryption • Trusted by 1M+ customers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

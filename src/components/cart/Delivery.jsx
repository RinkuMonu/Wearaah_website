import { useState } from "react";

const Delivery = ({ onDeliveryChange }) => {
  const [selectedMethod, setSelectedMethod] = useState("standard");
  const handleChange = (value) => {
    setSelectedMethod(value);
    onDeliveryChange?.({
      method: value,
      price: value === "express" ? 99 : 0,
    });
  };
  
  const deliveryOptions = [
    {
      id: "standard",
      title: "Standard Delivery",
      desc: "5-7 business days",
      price: "FREE",
      icon: "🚚",
    },
    {
      id: "express",
      title: "Express Delivery",
      desc: "2-3 business days",
      price: "₹99",
      icon: "⚡",
    },
    {
      id: "pickup",
      title: "Store Pickup",
      desc: "Ready in 24 hours",
      price: "FREE",
      icon: "🏪",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery Method</h3>
        <p className="text-sm text-gray-500">Choose your preferred delivery option</p>
      </div>

      {/* Delivery Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {deliveryOptions.map((option) => (
          <label
            key={option.id}
            className={`group cursor-pointer p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 flex flex-col items-center text-center space-y-2 ${
              selectedMethod === option.id
                ? "border-[#927f68] bg-[#927f68]/5 ring-2 ring-[#927f68]/20 shadow-md"
                : "hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="delivery"
              value={option.id}
              checked={selectedMethod === option.id}
              onChange={() => handleChange(option.id)}
              className="sr-only peer"
            />
            <div className="text-2xl">{option.icon}</div>
            <div className="space-y-1">
              <div className="font-semibold text-gray-900 group-hover:text-[#927f68] transition-colors">
                {option.title}
              </div>
              <div className="text-xs text-gray-500">{option.desc}</div>
              <div
                className={`font-bold text-sm ${
                  selectedMethod === option.id
                    ? "text-[#927f68]"
                    : "text-gray-900"
                }`}
              >
                {option.price}
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Estimated Delivery */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Estimated delivery:</span> {(() => {
            switch (selectedMethod) {
              case "standard": return "Mar 12 - Mar 14, 2026";
              case "express": return "Mar 9 - Mar 10, 2026";
              case "pickup": return "Ready for pickup Mar 7, 2026";
              default: return "Mar 12 - Mar 14, 2026";
            }
          })()}
        </p>
      </div>
    </div>
  );
};

export default Delivery;

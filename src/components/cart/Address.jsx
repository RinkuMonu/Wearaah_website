import { useState, useRef, useLayoutEffect } from "react";
import api from "../service/axios";

const Address = ({ onAddressChange }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [useSaved, setUseSaved] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [saveAddressForNextTime, setSaveAddressForNextTime] = useState(false); 
  const autocompleteRef = useRef(null);
  console.log(savedAddresses, "saved address from address component");

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/address");
      const mappedData = (res.data.data || []).map((item) => ({
        id: item._id,
        name: item.fullName,
        phone: item.mobile,
        landmark: item.landmark,
        altPhone: item.alternateMobile,
        address: item.street,
        city: item.city,
        state: item.state,
        zip: item.pincode,
        country: item.country,
        isDefault: item.isDefault,

        full: `${item.street}, ${item.city}, ${item.state} - ${item.pincode}`,
      }));

      setSavedAddresses(mappedData);
    } catch (err) {
      console.error(err);
    }
  };

  useLayoutEffect(() => {
    fetchAddresses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // ✅ send to parent
      onAddressChange && onAddressChange(updated);

      return updated;
    });
  };

  // ✅ Select saved address
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setUseSaved(true);

    const updatedData = {
      firstName: address.name?.split(" ")[0] || "",
      lastName: address.name?.split(" ")[1] || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      landmark: address.landmark || "",
      state: address.state || "",
      zip: address.zip || "",
      country: address.country || "India",
    };
console.log("Selected address data:", updatedData);
    setFormData(updatedData);

    // ✅ send selected address also
    onAddressChange && onAddressChange({
      ...updatedData,
      saveAddress: false
    });
  };

   const handleSaveAddressToggle = (e) => {
    const isChecked = e.target.checked;
    setSaveAddressForNextTime(isChecked);
    
    // Update parent with new save preference
    onAddressChange && onAddressChange({
      ...formData,
      saveAddress: isChecked
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Delivery Address
        </h3>
        <p className="text-sm text-gray-500">Complete your delivery details</p>
      </div>

      {/* Saved Addresses */}
      {savedAddresses.length > 0 && (
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useSaved}
              onChange={(e) => setUseSaved(e.target.checked)}
              className="w-4 h-4 text-[#927f68] border-gray-300 rounded focus:ring-[#927f68]"
            />
            <span className="text-sm font-medium text-gray-900">
              Use saved address
            </span>
          </label>

          {useSaved && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto">
              {savedAddresses.map((address) => (
                <div
                  key={address.id}
                  onClick={() => handleSelectAddress(address)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedAddress?.id === address.id
                      ? "border-[#927f68] bg-[#927f68]/5 ring-2 ring-[#927f68]/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold text-sm">
                        {address.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {address.full}
                      </div>
                    </div>

                    {address.isDefault && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Address Form */}
      <div className={!useSaved ? "space-y-4" : "hidden"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927f68]/20 focus:border-[#927f68] transition-all"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927f68]/20 focus:border-[#927f68] transition-all"
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927f68]/20 focus:border-[#927f68] transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927f68]/20 focus:border-[#927f68] transition-all"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Landmark *
          </label>
          <input
            type="text"
            name="landmark"
            value={formData.landmark}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg"
            placeholder="Near temple / mall / etc"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address *
          </label>
          <div className="relative">
            <input
              ref={autocompleteRef}
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927f68]/20 focus:border-[#927f68] transition-all"
              placeholder="Start typing your address for autocomplete"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927f68]/20 focus:border-[#927f68] transition-all"
              placeholder="Jaipur"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927f68]/20 focus:border-[#927f68] transition-all"
              placeholder="Rajasthan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927f68]/20 focus:border-[#927f68] transition-all"
              placeholder="302001"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="save-address"
            type="checkbox"
            checked={saveAddressForNextTime}
            onChange={handleSaveAddressToggle}
            className="w-4 h-4 text-[#927f68] border-gray-300 rounded focus:ring-[#927f68]"
          />
          <label
            htmlFor="save-address"
            className="ml-2 block text-sm text-gray-700"
          >
            Save this address for next time
          </label>
        </div>
      </div>
    </div>
  );
};

export default Address;

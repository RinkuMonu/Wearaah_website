import React from "react";
 
export default function AddressBook({
  addresses,
  selectedAddressId,
  showAddressForm,
  editingAddressId,
  addressForm,
  onAddNew,
  onAddressInputChange,
  onSaveAddress,
  onCloseAddressForm,
  onSelectAddress,
  onEditAddress,
  onRemoveAddress,
  onSetDefault,
}) {
  return (
    <div className="rounded-3xl border border-gray-300 bg-white p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
          <p className="text-sm text-gray-600">
            Manage your shipping addresses like Myntra-style address book
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Add New Address
        </button>
      </div>

      {showAddressForm && (
        <div className="mb-6 rounded-2xl border border-gray-300 bg-gray-50 p-4">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            {editingAddressId ? "Edit Address" : "Add New Address"}
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <select
              name="label"
              value={addressForm.label || "home"}
              onChange={onAddressInputChange}
              className="rounded-xl border border-gray-300 px-4 py-3"
            >
              <option value="home">Home</option>
              <option value="office">Office</option>
              <option value="other">Other</option>
            </select>
            
            <input
              name="fullName"
              value={addressForm.fullName || ""}
              onChange={onAddressInputChange}
              placeholder="Full Name *"
              className="rounded-xl border border-gray-300 px-4 py-3"
              required
            />
            
            <input
              name="mobile"
              value={addressForm.mobile || ""}
              onChange={onAddressInputChange}
              placeholder="Mobile Number *"
              className="rounded-xl border border-gray-300 px-4 py-3"
              required
            />
            
            <input
              name="alternateMobile"
              value={addressForm.alternateMobile || ""}
              onChange={onAddressInputChange}
              placeholder="Alternate Mobile (Optional)"
              className="rounded-xl border border-gray-300 px-4 py-3"
            />
            
            <input
              name="street"
              value={addressForm.street || ""}
              onChange={onAddressInputChange}
              placeholder="Street Address / House No. *"
              className="rounded-xl border border-gray-300 px-4 py-3 md:col-span-2"
              required
            />
            
            <input
              name="landmark"
              value={addressForm.landmark || ""}
              onChange={onAddressInputChange}
              placeholder="Landmark *"
              className="rounded-xl border border-gray-300 px-4 py-3"
              required
            />
            
            <input
              name="city"
              value={addressForm.city || ""}
              onChange={onAddressInputChange}
              placeholder="City *"
              className="rounded-xl border border-gray-300 px-4 py-3"
              required
            />
            
            <input
              name="state"
              value={addressForm.state || ""}
              onChange={onAddressInputChange}
              placeholder="State *"
              className="rounded-xl border border-gray-300 px-4 py-3"
              required
            />
            
            <input
              name="pincode"
              value={addressForm.pincode || ""}
              onChange={onAddressInputChange}
              placeholder="Pincode *"
              className="rounded-xl border border-gray-300 px-4 py-3"
              required
            />
            
            <input
              name="country"
              value={addressForm.country || "India"}
              onChange={onAddressInputChange}
              placeholder="Country"
              className="rounded-xl border border-gray-300 px-4 py-3"
            />
            
            <div className="flex items-center gap-2 md:col-span-2">
              <input
                type="checkbox"
                name="isDefault"
                id="isDefault"
                checked={addressForm.isDefault || false}
                onChange={onAddressInputChange}
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              />
              <label htmlFor="isDefault" className="text-sm text-gray-700">
                Set as default address
              </label>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={onSaveAddress}
              className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              {editingAddressId ? "Update Address" : "Save Address"}
            </button>
            <button
              onClick={onCloseAddressForm}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <div
            key={address._id || address.id}
            onClick={() => onSelectAddress(address._id || address.id)}
            className={`cursor-pointer rounded-2xl border p-4 transition-all ${
              selectedAddressId === (address._id || address.id)
                ? "border-black bg-gray-50 ring-2 ring-black/10"
                : "border-gray-200 hover:border-black"
            }`}
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 capitalize">
                  {address.label || address.type}
                </span>
                {address.isDefault && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Default
                  </span>
                )}
                {selectedAddressId === (address._id || address.id) && (
                  <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                    Selected
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <p className="font-semibold text-gray-900">{address.fullName}</p>
              <p className="text-sm text-gray-700">{address.mobile}</p>
              {address.alternateMobile && (
                <p className="text-sm text-gray-500">Alt: {address.alternateMobile}</p>
              )}
              <p className="text-sm text-gray-600">{address.street}</p>
              <p className="text-sm text-gray-600">{address.landmark}</p>
              <p className="text-sm text-gray-600">
                {address.city}, {address.state} - {address.pincode}
              </p>
              <p className="text-sm text-gray-600">{address.country}</p>
            </div>

            <div className="mt-4 flex items-center gap-3 text-sm">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditAddress(address);
                }}
                className="font-semibold text-gray-800 hover:text-black"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveAddress(address._id || address.id);
                }}
                className="font-semibold text-red-500 hover:text-red-600"
              >
                Remove
              </button>
              {!address.isDefault && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetDefault(address._id || address.id);
                  }}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Set Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {addresses.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          No addresses found. Add a new address to continue.
        </div>
      )}
    </div>
  );
}
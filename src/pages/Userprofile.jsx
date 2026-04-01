  import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
  import {
    FaRegSave,
    FaTimes,
    FaCamera,
    FaRegCalendarAlt,
    FaVenusMars,
    FaGlobe,
  } from "react-icons/fa";
  import { LuUserRoundCheck, LuUserRound } from "react-icons/lu";
  import { IoIosNotificationsOutline } from "react-icons/io";
  import { CiDiscount1, CiWallet } from "react-icons/ci";
  import { TbMessageReport } from "react-icons/tb";
  import { RiLogoutCircleLine } from "react-icons/ri";
  import { MdArrowForward, MdLocationOn, MdOutlineDeleteSweep } from "react-icons/md";
  import { BsArrowClockwise } from "react-icons/bs";
  import { useAuth } from "../components/service/AuthContext";
  import api from "../components/service/axios";
  import { Link, useNavigate } from "react-router-dom";
  import { LiaUserEditSolid } from "react-icons/lia";
  import SupportAccordion from "../components/SupportConditions";
  import OrdersList from "../components/OrdersList";
  import SimilerProduct from "../components/Home/SimilerProduct";
  import TopProducts from "../components/Home/TopProducts";
  import UserOffer from "../components/UserOffer";
  import MyCoins from "../components/MyCoins";
  import AddressBook from "../components/AddressBook";

  const SIDEBAR_ITEMS = [
    { id: "Overview", label: "Overview", icon: LuUserRound },
    { id: "profile", label: "Profile", icon: LuUserRound },
    { id: "address", label: "Addresses", icon: MdLocationOn },
    { id: "Orders", label: "Orders", icon: BsArrowClockwise },
    {
      id: "offers",
      label: "Discounts & Bonuses",
      icon: IoIosNotificationsOutline,
    },
    { id: "wallet", label: "My Wallet", icon: CiWallet },
    { id: "complaint", label: "Help/Complaint", icon: TbMessageReport },
    { id: "logout", label: "Log out", icon: RiLogoutCircleLine },
  ];

  const mapUserToForm = (rawUser) => {
  const profile = rawUser?.user || {};
  return {
    name: profile.name || "",   // ✅ only name
    email: profile.email || "",
  };
};  

  // const getAvatarUrl = (avatarPath) => {
  //   if (!avatarPath) return "/image/avatar.jpg";
  //   if (/^https?:\/\//i.test(avatarPath)) return avatarPath;
  //   const baseUrl = api?.defaults?.baseURL || "http://localhost:5000";
  //   return `${baseUrl}${avatarPath}`;
  // };

  export default function UserProfilePage() {
    const { user, setLoginOpen, setUser } = useAuth();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState(mapUserToForm(user));
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("Overview");
     const [avatarFile, setAvatarFile] = useState(null);
     
    // Address state
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressForm, setAddressForm] = useState({
      label: "home",
      fullName: "",
      mobile: "",
      alternateMobile: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      lat: "",
      lng: "",
      isDefault: false,
    });

    useEffect(() => {
      if (!token) {
        setLoginOpen(true);
        navigate("/");
      }
    }, [navigate, setLoginOpen, token]);

    useEffect(() => {
      setFormData(mapUserToForm(user));
    }, [user]);

    // const avatarSrc = useMemo(() => getAvatarUrl(user?.user?.avatar), [user]);
  //     const avatarSrc = useMemo(() => {
  //   // If a new avatar file is selected, show preview
  //   if (avatarFile) {
  //     return URL.createObjectURL(avatarFile);
  //   }
  //   return getAvatarUrl(user?.user?.avatar);
  // }, [user, avatarFile]);
  //  // Cleanup object URLs to prevent memory leaks
  // useEffect(() => {
  //   return () => {
  //     if (avatarSrc && avatarSrc.startsWith('blob:')) {
  //       URL.revokeObjectURL(avatarSrc);
  //     }
  //   };
  // }, [avatarSrc]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditOrSave = async () => {
      if (!editMode) {
        setEditMode(true);
        return;
      }

      setLoading(true);
      try {
        const fd = new FormData();
        Object.keys(formData).forEach((key) => {
  if (key !== "firstName") {
    fd.append(key, formData[key]);
  }
});
        const res = await api.put("/auth/update", fd);
        setUser(res.data);
        setEditMode(false);
      } catch (err) {
        alert("Update failed");
      } finally {
        setLoading(false);
      }
    };

    const handleCancelEdit = () => {
      setFormData(mapUserToForm(user));
      setEditMode(false);
    };


    const handleAvatarUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Create FormData for avatar upload
  const fd = new FormData();
  fd.append("avatar", file);
  
  // Also include other user data to prevent data loss
  fd.append("name", formData.name);
  fd.append("email", formData.email);
  // Add any other fields you want to preserve

  try {
    setLoading(true);
    const res = await api.put("/auth/update", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    // Update user context with new data
    setUser(res.data);
    
    // Clear the avatar file preview
    setAvatarFile(null);
    
    alert("Avatar updated successfully!");
  } catch (err) {
    console.error("Avatar upload error:", err);
    alert(err.response?.data?.message || "Avatar update failed. Please try again.");
  } finally {
    setLoading(false);
  }
};


const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return "/image/avatar.jpg";
  if (/^https?:\/\//i.test(avatarPath)) return avatarPath;
  // Don't add baseURL if it's already a full URL
  if (avatarPath.startsWith('http')) return avatarPath;
  const baseUrl = api?.defaults?.baseURL || "http://localhost:5000";
  return `${baseUrl}${avatarPath}`;
};

const avatarSrc = useMemo(() => {
  // If a new avatar file is selected, show preview
  if (avatarFile) {
    return URL.createObjectURL(avatarFile);
  }
  return getAvatarUrl(user?.user?.avatar);
}, [user, avatarFile]);

// Cleanup object URLs to prevent memory leaks
useEffect(() => {
  return () => {
    if (avatarSrc && avatarSrc.startsWith('blob:')) {
      URL.revokeObjectURL(avatarSrc);
    }
  };
}, [avatarSrc]);

    // const handleAvatarUpload = async (e) => {
    //   const file = e.target.files[0];
    //   if (!file) return;

    //   const fd = new FormData();
    //   fd.append("avatar", file);

    //   try {
    //     const res = await api.put("/auth/update", fd);
    //     setUser(res.data);
    //   } catch (err) {
    //     alert("Avatar update failed");
    //   }
    // };

    const handleSidebarClick = (tabId) => {
      if (tabId === "logout") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setLoginOpen(true);
        navigate("/");
        return;
      }

      setActiveTab(tabId);
    };

    // Fetch Addresses
    const fetchAddresses = async () => {
      try {
        const res = await api.get("/address", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    useLayoutEffect(() => {
      if (token) {
        fetchAddresses();
      }
    }, [token]);

    // Input Change - Handle both text inputs and checkboxes
    const onAddressInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      
      // Handle checkbox inputs
      if (type === 'checkbox') {
        setAddressForm((prev) => ({ ...prev, [name]: checked }));
      } else {
        // Handle text inputs
        setAddressForm((prev) => ({ ...prev, [name]: value }));
      }
    };

    const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setAddressForm((prev) => ({
          ...prev,
          lat: latitude,
          lng: longitude,
        }));

        console.log("Lat:", latitude, "Lng:", longitude);
      },
      (error) => {
        console.error(error);
        alert("Unable to fetch location");
      }
    );
  };

    // Add New
    const onAddNew = () => {
      setShowAddressForm(true);
      setEditingAddressId(null);
      // Pre-fill with user data if available
      setAddressForm({
        label: "home",
        fullName: user?.user?.name || "",
        mobile:  "",
        alternateMobile: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        lat: "",
        lng: "",
        isDefault: addresses.length === 0, // Make default if no addresses exist
      });
      getCurrentLocation();
    };

    // Validate Address Form
    const validateAddressForm = () => {
      const requiredFields = ['fullName', 'mobile', 'street', 'landmark', 'city', 'state', 'pincode'];
      const missingFields = requiredFields.filter(field => {
        const value = addressForm[field];
        // Check if value exists and is a string with content after trimming
        return !value || typeof value !== 'string' || !value.trim();
      });
      
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return false;
      }
      
      // Validate mobile number (basic validation)
      const mobileStr = String(addressForm.mobile || '').replace(/\D/g, '');
      if (mobileStr.length !== 10) {
        alert('Please enter a valid 10-digit mobile number');
        return false;
      }
      
      // Validate pincode
      const pincodeStr = String(addressForm.pincode || '');
      if (!/^\d{6}$/.test(pincodeStr)) {
        alert('Please enter a valid 6-digit pincode');
        return false;
      }
      
      return true;
    };

    // Save Address (POST / PUT)
    const onSaveAddress = async () => {
      // Validate form before submission
      if (!validateAddressForm()) {
        return;
      }

      try {
        // Create payload with proper data types
        const payload = {
          label: addressForm.label || 'home',
          fullName: String(addressForm.fullName || '').trim(),
          mobile: String(addressForm.mobile || '').trim(),
          alternateMobile: addressForm.alternateMobile ? String(addressForm.alternateMobile).trim() : "",
          street: String(addressForm.street || '').trim(),
          landmark: String(addressForm.landmark || '').trim(),
          city: String(addressForm.city || '').trim(),
          state: String(addressForm.state || '').trim(),
          pincode: String(addressForm.pincode || '').trim(),
          country: addressForm.country || "India",
          coordinates: addressForm.lat && addressForm.lng ? [
            Number(addressForm.lng),
            Number(addressForm.lat),
          ] : [0, 0],
          isDefault: Boolean(addressForm.isDefault),
        };

        if (editingAddressId) {
          await api.put(
            `/address/${editingAddressId}`,
            payload,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } else {
          await api.post(
            "/address",
            payload,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }

        await fetchAddresses(); // Refresh the list
        onCloseAddressForm();
        alert(editingAddressId ? "Address updated successfully!" : "Address added successfully!");
      } catch (err) {
        console.error("Error saving address:", err);
        const errorMessage = err.response?.data?.message || "Failed to save address. Please try again.";
        alert(errorMessage);
      }
    };

    // Close Form
    const onCloseAddressForm = () => {
      setShowAddressForm(false);
      setEditingAddressId(null);
      // Reset form to default values with proper data types
      setAddressForm({
        label: "home",
        fullName: "",
        mobile: "",
        alternateMobile: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        lat: "",
        lng: "",
        isDefault: false,
      });
    };

    // Select Address
    const onSelectAddress = (id) => {
      setSelectedAddressId(id);
    };

    // Edit Address
    const onEditAddress = (address) => {
      setEditingAddressId(address._id);
      setShowAddressForm(true);

      setAddressForm({
        label: address.label || "home",
        fullName: address.fullName || "",
        mobile: address.mobile || "",
        alternateMobile: address.alternateMobile || "",
        street: address.street || "",
        landmark: address.landmark || "",
        city: address.city || "",
        state: address.state || "",
        pincode: address.pincode || "",
        country: address.country || "India",
        lat: address.coordinates?.[1] || "",
        lng: address.coordinates?.[0] || "",
        isDefault: Boolean(address.isDefault),
      });
    };

    // Delete Address
    const onRemoveAddress = async (id) => {
      if (window.confirm("Are you sure you want to delete this address?")) {
        try {
          await api.delete(`/address/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await fetchAddresses();
          alert("Address deleted successfully!");
        } catch (err) {
          console.error("Error deleting address:", err);
          alert(err.response?.data?.message || "Failed to delete address. Please try again.");
        }
      }
    };

    // Set Default
    const onSetDefault = async (id) => {
      try {
        await api.patch(
          `/address/set-default/${id}`,
        
        );
        await fetchAddresses();
        alert("Default address updated successfully!");
      } catch (err) {
        console.error("Error setting default address:", err);
        alert(err.response?.data?.message || "Failed to set default address. Please try again.");
      }
    };

    const overviewActions = [
      {
        id: "overview-profile",
        label: "Profile",
        value: null,
        Icon: LuUserRound,
        iconClass: "text-blue-600",
        borderClass: "border-blue-200",
        labelClass: "text-black",
        actionType: "tab",
        actionValue: "profile",
      },
      {
        id: "overview-orders",
        label: "My Orders",
        value: user?.totalOrder || 0,
        Icon: null,
        valueClass: "text-blue-600",
        borderClass: "border-blue-200",
        labelClass: "text-black",
        actionType: "tab",
        actionValue: "Orders",
      },
      {
        id: "overview-wishlist",
        label: "Wishlist Items",
        value: user?.totalWishList || 0,
        Icon: null,
        valueClass: "text-emerald-600",
        borderClass: "border-emerald-200",
        labelClass: "text-emerald-700",
        actionType: "route",
        actionValue: "/wishlist",
      },
      {
        id: "overview-edit-profile",
        label: "Edit Profile",
        value: null,
        Icon: LiaUserEditSolid,
        iconClass: "text-purple-600",
        borderClass: "border-purple-200",
        labelClass: "text-purple-600",
        actionType: "tab",
        actionValue: "profile",
      },
      {
        id: "overview-wallet",
        label: "My Wallet",
        value: null,
        Icon: LiaUserEditSolid,
        iconClass: "text-black",
        borderClass: "border-purple-200",
        labelClass: "text-black",
        actionType: "tab",
        actionValue: "wallet",
      },
      {
        id: "overview-offers",
        label: "Discounts & Bonuses",
        value: null,
        Icon: CiDiscount1,
        iconClass: "text-black",
        borderClass: "border-purple-200",
        labelClass: "text-black",
        actionType: "tab",
        actionValue: "offers",
      },
    ];

    return (
      <div className="min-h-screen px-3 py-6 sm:px-6 lg:px-8">
        <div>
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <div className="w-full lg:sticky lg:top-24 lg:w-72 lg:self-start">
              <div className="flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
                {SIDEBAR_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSidebarClick(item.id)}
                    className={`group flex shrink-0 items-center gap-2 rounded-2xl p-2 px-3 transition-all lg:mb-3 lg:w-full ${
                      activeTab === item.id
                        ? "text-blue-400"
                        : "text-black hover:rounded-br-[40px] hover:rounded-tl-[40px] hover:bg-gray-50 hover:text-blue-600"
                    }`}
                  >
                    <item.icon className="text-xl" />
                    <span className="whitespace-nowrap text-sm lg:text-lg">{item.label}</span>
                  </button>
                ))}
                <button className="flex shrink-0 items-center gap-3 rounded-2xl rounded-br-[40px] rounded-tl-[40px] bg-red-50 p-3 text-red-500 hover:bg-red-100 lg:w-full lg:p-4">
                  <MdOutlineDeleteSweep className="text-lg" />
                  <span className="whitespace-nowrap">Delete Account</span>
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-8">
              {activeTab === "profile" && (
                <>
                  <div>
                    <h1 className="flex items-center gap-2 text-2xl text-gray-900 lg:text-3xl">
                      <LuUserRoundCheck className="text-2xl" />
                      Personal Data
                    </h1>
                    <p className="mt-2 text-gray-600">
                      Enter personal data so you do not fill it manually when placing order
                    </p>
                  </div>

                  <div className="rounded-3xl border border-gray-300 bg-white p-4 sm:p-6">
                    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-start">
                      <div className="flex flex-col items-start">
                        <div className="relative">
                          <img
                            src={avatarSrc}
                            alt="Profile"
                            className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl"
                          />
                          <label className="absolute -right-2 bottom-4 rounded-full border-2 border-gray-200 bg-white p-2 shadow-lg hover:shadow-xl">
                            <FaCamera className="text-gray-500" />
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleAvatarUpload}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <button
                          onClick={handleEditOrSave}
                          disabled={loading}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-400 px-6 py-3 font-semibold text-black disabled:opacity-50 sm:w-fit sm:px-8"
                        >
                          <FaRegSave />
                          {loading
                            ? "Saving..."
                            : editMode
                            ? "Save Changes"
                            : "Edit Profile"}
                        </button>

                        {editMode && (
                          <button
                            onClick={handleCancelEdit}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50 sm:w-fit sm:px-8"
                          >
                            <FaTimes />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                      <div className="space-y-6 lg:col-span-3">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                              <LuUserRound className="text-black" />
                               Name
                            </label>
                            <input
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              disabled={!editMode}
                              className="w-full rounded-xl border border-gray-300 px-4 py-3"
                            />
                          </div>
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                              <LuUserRound className="text-black" />
                              Email
                            </label>
                            <input
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              disabled={!editMode}
                              className="w-full rounded-xl border border-gray-300 px-4 py-3"
                            />
                          </div>
                        </div>

                        {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                              <FaRegCalendarAlt className="text-black" />
                              Date of Birth
                            </label>
                            <input
                              type="date"
                              name="dob"
                              value={formData.dob}
                              onChange={handleInputChange}
                              disabled={!editMode}
                              className="w-full rounded-xl border border-gray-300 px-4 py-3"
                            />
                          </div>
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                              <FaVenusMars className="text-black" />
                              Gender
                            </label>
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              disabled={!editMode}
                              className="w-full rounded-xl border border-gray-300 px-4 py-3"
                            >
                              <option value="">Select Gender</option>
                              <option value="female">Female</option>
                              <option value="male">Male</option>
                            </select>
                          </div>
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                              <FaGlobe className="text-black" />
                              Country
                            </label>
                            <select
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              disabled={!editMode}
                              className="w-full rounded-xl border border-gray-300 px-4 py-3"
                            >
                              <option value="">Select Country</option>
                              <option value="India">India</option>
                            </select>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "Overview" && (
                <>
                  <div className="rounded-3xl border border-gray-300 bg-white p-4 sm:p-6">
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
                      <div className="relative shrink-0">
                        <img
                          src={avatarSrc}
                          alt={user?.user?.name || "Lionies User"}
                          className="h-24 w-24 rounded-3xl border-4 border-white object-cover shadow-md ring-2 ring-gray-200/50"
                        />
                      </div>

                      <div className="flex w-full flex-col justify-between gap-3 sm:flex-row sm:gap-4">
                        <div>
                          <h1 className="mb-2 truncate text-2xl font-bold text-gray-900 sm:text-3xl">
                            {user?.user?.name || "Lionies User"}
                          </h1>
                          <p className="mb-0 text-md text-gray-600">
                            {user?.user?.email || "user@example.com"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {user?.user?.mobile || "+91 98765 43210"}
                          </p>
                        </div>

                        <div className="flex flex-col items-start gap-2 sm:items-end">
                          <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-2">
                            <div className="h-3 w-3 animate-pulse rounded-full bg-green-400" />
                            <span className="text-[10px] font-medium text-green-600">
                              Active Account
                            </span>
                          </div>
                          <span className="ml-4 text-sm text-gray-500">
                            Member since{" "}
                            {user?.user?.createdAt
                              ? new Date(user.user.createdAt).toLocaleDateString("en-IN")
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {overviewActions.map((item) => {
                      const Content = (
                        <div
                          className={`group flex items-center justify-between gap-3 rounded-2xl rounded-br-[40px] rounded-tl-[40px] border p-4 text-center transition-all hover:border-blue-100 sm:p-6 ${item.borderClass}`}
                        >
                          <div className="flex items-center gap-3">
                            {item.Icon ? (
                              <item.Icon
                                className={`text-2xl ${item.iconClass} group-hover:text-blue-600`}
                              />
                            ) : (
                              <div
                                className={`mb-1 rounded-xl border px-3 py-1 text-xl font-bold ${item.valueClass}`}
                              >
                                {item.value}
                              </div>
                            )}
                            <div
                              className={`text-sm font-medium ${item.labelClass} group-hover:text-blue-600`}
                            >
                              {item.label}
                            </div>
                          </div>
                          <span className="rounded-xl border p-3 group-hover:text-blue-600">
                            <MdArrowForward />
                          </span>
                        </div>
                      );

                      if (item.actionType === "route") {
                        return (
                          <Link key={item.id} to={item.actionValue}>
                            {Content}
                          </Link>
                        );
                      }

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveTab(item.actionValue)}
                          className="w-full text-left"
                        >
                          {Content}
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                    <SupportAccordion />
                  </div>
                </>
              )}

              {activeTab === "Orders" && <OrdersList />}
              {activeTab === "address" && (
                <AddressBook
                  addresses={addresses}
                  selectedAddressId={selectedAddressId}
                  showAddressForm={showAddressForm}
                  editingAddressId={editingAddressId}
                  addressForm={addressForm}
                  onAddNew={onAddNew}
                  onAddressInputChange={onAddressInputChange}
                  onSaveAddress={onSaveAddress}
                  onCloseAddressForm={onCloseAddressForm}
                  onSelectAddress={onSelectAddress}
                  onEditAddress={onEditAddress}
                  onRemoveAddress={onRemoveAddress}
                  onSetDefault={onSetDefault}
                />
              )}
              {activeTab === "offers" && <UserOffer />}
              {activeTab === "wallet" && <MyCoins />}
              {activeTab === "complaint" && <SupportAccordion />}
            </div>
          </div>
        </div>
        <SimilerProduct />
        <TopProducts />
      </div>
    );
  }
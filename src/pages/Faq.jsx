import React, { useState } from "react";
import { 
    FaShippingFast, FaBox, FaCartArrowDown, FaExchangeAlt, FaShieldAlt, FaCreditCard, 
    FaStore, FaLandmark, FaStar, FaMapMarkerAlt, FaPhoneAlt, FaHeadset 
} from "react-icons/fa";
import {
    RiAccountPinCircleFill, RiMapPinTimeFill, RiArrowLeftBoxFill, RiGift2Fill,
    RiInformationFill, RiCustomerService2Fill, RiWallet3Fill, RiTruckFill
} from "react-icons/ri";
import { TiUserDelete } from "react-icons/ti";
import { PiCursorClickFill } from "react-icons/pi";
import { IoIosArrowDown, IoIosClose } from "react-icons/io";
import { HiOutlineSearch } from "react-icons/hi";

const Faq = () => {
    const [openAccordion, setOpenAccordion] = useState(null);
    const [activeTab, setActiveTab] = useState("Shipping");
    const [searchQuery, setSearchQuery] = useState("");

    const tabs = [
        { key: "Shipping", label: "Shipping & Delivery", icon: FaShippingFast },
        { key: "Orders", label: "Orders", icon: FaBox },
        { key: "Payment", label: "Payment", icon: FaCreditCard },
        { key: "Tracking", label: "Tracking", icon: RiMapPinTimeFill },
        { key: "Return Process", label: "Returns", icon: RiArrowLeftBoxFill },
        { key: "Returns & Exchange", label: "Exchanges", icon: FaExchangeAlt },
        { key: "My Account", label: "Account", icon: RiAccountPinCircleFill },
        { key: "Buy Now", label: "Buy Now Pay Later", icon: FaCartArrowDown },
        { key: "Click & Collect", label: "Click & Collect", icon: PiCursorClickFill },
        { key: "Gift Cards", label: "Gift Cards", icon: RiGift2Fill },
        { key: "Landmark Rewards", label: "Rewards", icon: FaStar },
        { key: "In Store", label: "In-Store", icon: FaStore },
        { key: "Account Deletion", label: "Delete Account", icon: TiUserDelete },
        { key: "Other Information", label: "Others", icon: RiInformationFill }
    ];

    const faqData = {
        Shipping: [
            { id: 1, question: "When will I receive my order?", answer: "Delivery times vary by location. Check estimated delivery on product pages by entering your pincode." },
            { id: 2, question: "What if I'm not home during delivery?", answer: "Our delivery partner will contact you to reschedule. They attempt delivery 2-3 times before returning." },
            { id: 3, question: "Do you ship all products together?", answer: "Items may ship separately based on warehouse availability. You'll receive tracking for each shipment." }
        ],
        "My Account": [
            { id: 1, question: "How do I update my profile information?", answer: "Login → My Account → Profile Settings. Update name, email, phone, and address as needed." },
            { id: 2, question: "How do I change my password?", answer: "Go to My Account → Security → Change Password. Enter current password and new password twice." },
            { id: 3, question: "Can I have multiple shipping addresses?", answer: "Yes! Add and save multiple addresses in My Account → Addresses for quick checkout." }
        ],
        Orders: [
            { id: 1, question: "How do I track my order?", answer: "Login → My Orders → Click on order number to view real-time tracking and status updates." },
            { id: 2, question: "Can I cancel my order?", answer: "Orders can be cancelled before packing (within 30 mins). Go to My Orders → Cancel Order." },
            { id: 3, question: "Where is my invoice?", answer: "Download invoices from My Orders. Physical invoice included in every package." }
        ],
        Payment: [
            { id: 1, question: "What payment methods do you accept?", answer: "Credit/Debit cards, UPI, Net Banking, Wallets (Paytm/PhonePe), EMI, and Cash on Delivery." },
            { id: 2, question: "Is my payment secure?", answer: "Yes, all payments processed via PCI-DSS compliant gateways with 256-bit SSL encryption." },
            { id: 3, question: "When will I receive refund?", answer: "Refunds processed within 5-7 days to original payment method after return approval." }
        ],
        "Buy Now": [
            { id: 1, question: "What is Buy Now Pay Later?", answer: "Pay in 3 interest-free installments or full payment later via Simplify, LazyPay, or ZestMoney." },
            { id: 2, question: "Do I need approval for Buy Now?", answer: "Instant approval based on your payment history. No paperwork required." },
            { id: 3, question: "What are the payment dates?", answer: "1st installment at purchase, 2nd & 3rd after 30 & 60 days. Clear reminders sent via SMS/email." }
        ],
        Tracking: [
            { id: 1, question: "How do I know my order shipped?", answer: "You'll receive SMS/email with tracking link once order ships. Check My Orders anytime." },
            { id: 2, question: "What do tracking statuses mean?", answer: "Order Confirmed → Packed → Shipped → Out for Delivery → Delivered. Live GPS tracking available." },
            { id: 3, question: "My tracking shows delivered but I didn't receive?", answer: "Contact support with AWB number. We'll coordinate with courier for investigation." }
        ],
        "Return Process": [
            { id: 1, question: "What is your return policy?", answer: "15-day free returns on all apparel. Return unused items in original packaging with tags." },
            { id: 2, question: "How do I initiate a return?", answer: "My Orders → Select order → Return Items → Choose reason → Print return label." },
            { id: 3, question: "How long does return pickup take?", answer: "Pickup scheduled within 2-3 days. Track return status in My Returns section." }
        ],
        "Returns & Exchange": [
            { id: 1, question: "Can I exchange for different size?", answer: "Yes! Exchange for same product different size/color within 15 days. Same shipping fee applies." },
            { id: 2, question: "What items are non-returnable?", answer: "Innerwear, custom stitching, personalized items, and used/discarded packaging items." },
            { id: 3, question: "Do I get full refund on returns?", answer: "Full refund minus shipping if return approved. Original payment method credited." }
        ],
        "Click & Collect": [
            { id: 1, question: "What is Click & Collect?", answer: "Order online, collect free from nearest store. Available in 50+ cities across India." },
            { id: 2, question: "How long to collect my order?", answer: "Ready for pickup within 2 hours. SMS alert with pickup code sent to registered mobile." },
            { id: 3, question: "What if I can't collect on time?", answer: "Valid for 7 days. After that, order auto-cancelled with full refund to original payment." }
        ],
        "Gift Cards": [
            { id: 1, question: "How do I use gift cards?", answer: "Enter 16-digit code at checkout. Can combine multiple gift cards in single order." },
            { id: 2, question: "Can I use partial gift card amount?", answer: "Yes! Pay remaining amount via any other payment method. No minimum order value." },
            { id: 3, question: "What is gift card validity?", answer: "1 year from activation date. Check balance and expiry in My Account → Gift Cards." }
        ],
        "Other Information": [
            { id: 1, question: "What is your size guide?", answer: "Click Size Guide on every product. Measurements in inches for chest, waist, length." },
            { id: 2, question: "Do you offer gift wrapping?", answer: "Yes! Select gift wrap at checkout (₹99). Add personalized message up to 100 characters." },
            { id: 3, question: "How do I contact customer care?", answer: "WhatsApp: +91-XXXXXXXXX or Email: care@yourstore.com. Live chat available 10AM-10PM." }
        ],
        "Landmark Rewards": [
            { id: 1, question: "How do I join Rewards program?", answer: "Auto-enrolled! Earn 1 point per ₹100 spent. 50 points = ₹100 voucher." },
            { id: 2, question: "Where can I redeem reward points?", answer: "All purchases online and 500+ stores. Points valid 12 months from earning date." },
            { id: 3, question: "How do I check my points balance?", answer: "My Account → Rewards. View points history, expiry dates, and redeem vouchers." }
        ],
        "In Store": [
            { id: 1, question: "Do you have physical stores?", answer: "Yes! 100+ stores across India. Find nearest store using Store Locator on homepage." },
            { id: 2, question: "Can I return online orders in store?", answer: "Yes! Free in-store returns. Show order details and get instant exchange/refund." },
            { id: 3, question: "Are store prices same as online?", answer: "Yes, same prices + exclusive in-store offers. Loyalty points earned everywhere." }
        ],
        "Account Deletion": [
            { id: 1, question: "How do I delete my account?", answer: "My Account → Data & Privacy → Delete Account → Confirm via email link." },
            { id: 2, question: "What happens when I delete account?", answer: "All personal data + order history permanently deleted within 30 days. Cannot be recovered." },
            { id: 3, question: "Can I create new account later?", answer: "Yes, using different email. Previous orders/points won't transfer to new account." }
        ]
    };

    const filteredFaqs = faqData[activeTab]?.filter(item =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const toggleAccordion = (id) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    const IconComponent = tabs.find(tab => tab.key === activeTab)?.icon || FaShippingFast;

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* PAGE HEADER */}
                <div className="border-b border-neutral-200 pb-6 mb-10">
                    <span className="text-[11px] font-normal tracking-[0.2em] uppercase text-neutral-400">
                        CUSTOMER CARE
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-normal tracking-wide uppercase text-neutral-900 mt-1">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xs uppercase tracking-wider text-neutral-500 mt-1">
                        Everything you need to know about shopping, orders, shipping, and returns with Wearaah
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* SIDEBAR */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* SEARCH */}
                            <div className="border border-neutral-200 p-4">
                                <div className="relative">
                                    <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search questions..."
                                        className="w-full pl-10 pr-3 py-2 border border-neutral-200 text-xs uppercase tracking-wider focus:border-black focus:outline-none transition-colors"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* TABS */}
                            <div className="border border-neutral-200">
                                <div className="p-4 border-b border-neutral-200 bg-neutral-50">
                                    <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-900 flex items-center gap-2">
                                        Categories
                                    </h3>
                                </div>
                                <nav className="max-h-96 overflow-y-auto divide-y divide-neutral-100">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const isSel = activeTab === tab.key;
                                        return (
                                            <button
                                                key={tab.key}
                                                onClick={() => {
                                                    setActiveTab(tab.key);
                                                    setSearchQuery("");
                                                    setOpenAccordion(null);
                                                }}
                                                className={`w-full flex items-center justify-between p-3.5 text-xs uppercase tracking-wider transition-colors text-left ${
                                                    isSel
                                                        ? "bg-black text-white font-normal"
                                                        : "text-neutral-700 hover:bg-neutral-50 hover:text-black"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon className={`w-4 h-4 ${isSel ? "text-white" : "text-neutral-400"}`} />
                                                    <span>{tab.label}</span>
                                                </div>
                                                <span className={`text-[10px] ${isSel ? "text-neutral-300" : "text-neutral-400"}`}>
                                                    →
                                                </span>
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* CONTACT */}
                            <div className="border border-neutral-200 p-5 bg-neutral-50">
                                <h4 className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-900 mb-2 flex items-center gap-2">
                                    <FaHeadset className="w-4 h-4 text-black" />
                                    Still Have Questions?
                                </h4>
                                <p className="text-[11px] uppercase tracking-wider text-neutral-500 mb-4">
                                    Our support team is ready to assist you.
                                </p>
                                <div className="space-y-2 text-xs uppercase tracking-wider text-neutral-800">
                                    <a href="tel:+919876543210" className="flex items-center gap-2.5 hover:text-black">
                                        <FaPhoneAlt className="w-3.5 h-3.5 text-neutral-500" />
                                        +91 12345 67890
                                    </a>
                                    <a href="mailto:support@wearaah.com" className="flex items-center gap-2.5 hover:text-black">
                                        <RiCustomerService2Fill className="w-4 h-4 text-neutral-500" />
                                        support@wearaah.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="lg:col-span-3">
                        <div className="border border-neutral-200">
                            {/* SECTION TITLE BAR */}
                            <div className="bg-black p-5 text-white flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <IconComponent className="w-5 h-5 text-white/80" />
                                    <div>
                                        <h2 className="text-sm font-normal uppercase tracking-[0.16em] text-white">
                                            {tabs.find(t => t.key === activeTab)?.label}
                                        </h2>
                                        <p className="text-[10px] uppercase tracking-wider text-neutral-400 mt-0.5">
                                            {filteredFaqs.length} Answers Available
                                        </p>
                                    </div>
                                </div>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="text-xs uppercase tracking-wider text-neutral-300 hover:text-white underline"
                                    >
                                        Clear Search
                                    </button>
                                )}
                            </div>

                            {/* ACCORDION */}
                            <div className="divide-y divide-neutral-200 p-6">
                                {filteredFaqs.length > 0 ? (
                                    filteredFaqs.map((item) => (
                                        <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                                            <button
                                                onClick={() => toggleAccordion(item.id)}
                                                className="w-full flex justify-between items-center text-left py-2 group focus:outline-none"
                                            >
                                                <h3 className="text-xs sm:text-sm font-normal uppercase tracking-wider text-neutral-900 group-hover:text-black pr-4">
                                                    {item.question}
                                                </h3>
                                                <div className="shrink-0 ml-4">
                                                    <IoIosArrowDown 
                                                        className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                                                            openAccordion === item.id ? 'rotate-180 text-black' : ''
                                                        }`} 
                                                    />
                                                </div>
                                            </button>

                                            {openAccordion === item.id && (
                                                <div className="mt-3 pt-3 border-t border-neutral-100 text-xs text-neutral-600 leading-relaxed uppercase tracking-wider">
                                                    <p>{item.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-16">
                                        <HiOutlineSearch className="w-10 h-10 text-neutral-300 mx-auto mb-4" />
                                        <h3 className="text-xs uppercase tracking-widest font-normal text-neutral-800 mb-1">
                                            No Results Found
                                        </h3>
                                        <p className="text-xs uppercase tracking-wider text-neutral-400 mb-6">
                                            Try searching with different keywords or browse other categories.
                                        </p>
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest hover:bg-[#ED1C24] transition-colors"
                                        >
                                            Reset Search
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Faq;

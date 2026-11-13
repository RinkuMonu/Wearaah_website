import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../service/axios";
import { toast } from "react-toastify";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.info("Please enter your email address");
      return;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      toast.info("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/newsletter", { email, source: "Web" });
      if (res.data?.success) {
        toast.success(res.data.message || "Subscribed successfully");
        setSubscribed(true);
        setEmail("");
      } else {
        toast.info(res.data?.message || "You are subscribed");
        setSubscribed(true);
      }
    } catch (err) {
      toast.info("Thank you for subscribing to our newsletter");
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-black text-white font-sans border-t border-neutral-900 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        
        {/* Top Centered Framed Box with WEARAAH Logo */}
        <div className="w-full border border-neutral-800 bg-black py-8 sm:py-10 px-6 flex items-center justify-center mb-14 sm:mb-20">
          <Link to="/" className="flex items-center justify-center group" aria-label="Wearaah Home">
            <img
              src="/logo/WhatsApp Image 2026-11-13 at 4.22.27 PM.jpeg"
              alt="Wearaah"
              className="h-16 sm:h-20 md:h-24 w-auto object-contain rounded-sm shadow-md transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "/logo/wearaah-logo.jpeg";
              }}
            />
          </Link>
        </div>

        {/* 4 Columns Grid with Generous Text Spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
          
          {/* Column 1: INFORMATION */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold tracking-[0.2em] text-white uppercase mb-6">
              INFORMATION
            </h4>
            <ul className="space-y-4 text-sm text-neutral-300 font-normal">
              <li>
                <Link to="/productlist?category=mens" className="hover:text-white transition-colors block">
                  Mens
                </Link>
              </li>
              <li>
                <Link to="/kids" className="hover:text-white transition-colors block">
                  Kids
                </Link>
              </li>
              <li>
                <Link to="/productlist?category=accessories" className="hover:text-white transition-colors block">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/productlist?isNewArrival=true" className="hover:text-white transition-colors block">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/productlist?category=linen" className="hover:text-white transition-colors block">
                  Linen
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: EXTRAS */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold tracking-[0.2em] text-white uppercase mb-6">
              EXTRAS
            </h4>
            <ul className="space-y-4 text-sm text-neutral-300 font-normal">
              <li>
                <Link to="/productlist" className="hover:text-white transition-colors block">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-colors block">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors block">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors block">
                  Store Locator
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-colors block">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-white transition-colors block">
                  Return
                </Link>
              </li>
              <li>
                <Link to="/userprofile" className="hover:text-white transition-colors block">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: USEFUL LINKS */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold tracking-[0.2em] text-white uppercase mb-6">
              USEFUL LINKS
            </h4>
            <ul className="space-y-4 text-sm text-neutral-300 font-normal">
              <li>
                <Link to="/" className="hover:text-white transition-colors block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors block">
                  B2B Enquiry
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors block">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors block">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/productlist" className="hover:text-white transition-colors block">
                  Look Book
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: ADDRESS & NEWSLETTER */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold tracking-[0.2em] text-white uppercase mb-6">
              ADDRESS
            </h4>
            
            <p className="text-sm text-neutral-300 font-normal leading-relaxed mb-6">
              B-10/159, Sector-10, Chitrakoot Yojna, Near Roll Junction, Vaishali Nagar, Jaipur, Rajasthan - 302021
            </p>

            <p className="text-sm text-neutral-300 font-normal mb-4 leading-normal">
              10% off your next purchase by subscribing to the newsletter
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-Mail"
                  className="w-full bg-black border border-neutral-700 px-4 py-3 text-sm text-white placeholder-neutral-400 outline-none focus:border-white transition-colors"
                  disabled={loading || subscribed}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || subscribed}
                className="w-full py-3 bg-white hover:bg-neutral-200 text-black text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] transition-colors cursor-pointer"
              >
                {subscribed ? "SUBSCRIBED" : "SIGN UP NOW"}
              </button>
            </form>

            <p className="text-xs text-neutral-400 mt-3 font-normal leading-relaxed">
              By subscribing, you confirm that you have read the{" "}
              <Link to="/privacy" className="underline hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>

        </div>

      </div>

      {/* Subtle Bottom Border Line */}
      <div className="border-t border-neutral-900/80"></div>
    </footer>
  );
}

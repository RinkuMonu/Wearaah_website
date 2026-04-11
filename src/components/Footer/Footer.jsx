import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegCopyright } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { FiPhone, FiMail } from "react-icons/fi";
import { FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { fatchSubCategory } from "../../features/subCategory/subCategorySlice";
import api from "../service/axios";
import { toast } from "react-toastify";

export default function Footer() {
  const dispatch = useDispatch();
  const { subcategories } = useSelector((state) => state.subCategory);
  const [email, setEmail] = useState("");
  const [btn, setBtn] = useState(false);

  const sendNewsLetter = async () => {
    try {
      setBtn(true);
      if (!email.trim()) {
        toast.info("Email is required");
        return;
      }
      let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!regex.test(email)) {
        toast.info("InValid Email");
        return;
      }
      const res = await api.post("/newsletter", { email, source: "Web" });
      console.log(res);

      if (res.data.success) {
        toast.success(res.data.message);
        setEmail("");
      } else {
        toast.warning(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setBtn(false);
    }
  };

  useEffect(() => {
    dispatch(fatchSubCategory());
  }, [dispatch]);

  return (
    <>
      {/* ================= WHITE FOOTER ================= */}
      <footer className="bg-[#faf7f3] text-[#212121] py-5 border-y border-gray-200">
        <div className="max-w-7xl mx-auto pb-6 px-6">
          {/* Category Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mt-12 text-sm text-gray-600">
            {/* Column 1 → All Categories */}
            <div>
              <h4 className="font-semibold mb-4 text-black text-lg">
                Categories
              </h4>
              <ul className="space-y-2">
                {subcategories.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={`/productlist?subCategoryId=${item._id}&subCategory=${item.slug}`}
                      className="hover:text-black text-base"
                    >
                      {item?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {subcategories?.slice(0, 4).map((sub, index) => {
              const attributes = sub.attributes || {};
              const firstAttrKey = Object.keys(attributes)[0];
              const values = attributes[firstAttrKey]?.values || [];

              return (
                <div key={index}>
                  {/* Subcategory Title */}
                  <h4 className="font-semibold mb-4 text-black text-lg">
                    {sub.name}
                  </h4>

                  {/* Attribute Values */}
                  <ul className="space-y-2">
                    {values.map((val, i) => (
                      <li key={i}>
                        <Link
                          to={`/productlist?category=${sub?.categoryId?.slug}&ctd=${sub?.categoryId?._id}&subCategoryId=${sub._id}&subCategory=${sub.slug}&${firstAttrKey}=${val}`}
                          className="hover:text-black text-base"
                        >
                          {val}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </footer>
      <footer className="">
        <div className="relative  px-4  bg-[url('/image/footer-img2.jpeg')] bg-cover bg-center w-full overflow-hidden">
          <div className="absolute inset-0 rounded-lg bg-black/70"></div>
          <div className="absolute top-70 left-10 md:block hidden">
            <img
              src="/image/Mens-logo.PNG"
              alt="Model"
              className="w-50 object-cover "
            />
          </div>
          <div className="relative z-10 px-8 md:px-16 pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 text-[#f5efdd]">
              <div className="lg:col-span-1">
                <h4 className="mb-4 font-semibold">Contact Us</h4>
                <ul className="space-y-4 text-sm text-[#f5efdd]">
                  <li className="flex items-center gap-3">
                    <FiPhone className="text-lg" />
                    <a
                      href="tel:+00123456789"
                      className="hover:text-white transition"
                    >
                      +00 12 34 56 789
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <FiMail className="text-lg" />
                    <a
                      href="mailto:contact@lionies.com"
                      className="hover:text-white transition"
                    >
                      contact@lionies.com
                    </a>
                  </li>
                </ul>
                {/* SOCIAL LINKS */}
                <h4 className="my-4 font-semibold">Social Links</h4>
                <div className="flex gap-4 mt-6 text-[#f5efdd]">
                  <a href="#" className="hover:text-white transition">
                    <FaInstagram />
                  </a>
                  <a href="#" className="hover:text-white transition">
                    <FaLinkedinIn />
                  </a>
                  <a href="#" className="hover:text-white transition">
                    <FaXTwitter />
                  </a>
                </div>
              </div>
              <div className="lg:col-span-1">
                <h4 className="mb-4 font-semibold">Quick Links</h4>
                <ul className="space-y-3 text-sm">
                  <Link to="/">
                    <li className="pb-3">Home</li>
                  </Link>
                  <Link to="/">
                    <li className="pb-3">FAQs</li>
                  </Link>
                  <Link to="/">
                    <li className="pb-3">Contact</li>
                  </Link>
                  <Link to="/">
                    <li className="pb-3">Products</li>
                  </Link>
                </ul>
              </div>
              {/* SHOP */}
              <div className="lg:col-span-1">
                <h4 className="mb-4 font-semibold">Resources</h4>
                <ul className="space-y-3 text-sm">
                  <Link to="/">
                    <li className="pb-3">Home</li>
                  </Link>
                  <Link to="/faq">
                    <li className="pb-3">FAQs</li>
                  </Link>
                  <Link to="/">
                    <li className="pb-3">Contact</li>
                  </Link>
                  <Link to="/productlist">
                    <li className="pb-3">Products</li>
                  </Link>
                </ul>
              </div>
              <div className="lg:col-span-2 space-y-6">
                {/* Newsletter */}
                <div className="p-4 rounded-lg">
                  <h3 className="text-2xl font-serif mb-4">
                    Join Our News Letter
                  </h3>
                  <p className="text-sm text-[#f5efdd]/80 mb-6 max-w-md">
                    Subscribe to our newsletter and receive exclusive offers
                  </p>
                  <div className="flex items-center border-b border-white/40 pb-2 max-w-md">
                    <input
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="bg-transparent w-full outline-none placeholder-white/40"
                      required
                    />
                    <button onClick={sendNewsLetter} disabled={btn}>
                      <FaArrowRight />
                    </button>
                  </div>
                </div>
                {/* Image */}
                <img
                  src="/images/all.webp"
                  alt="Model"
                  className="w-full object-cover"
                />
              </div>
            </div>
            {/* DIVIDER */}
            <div className="border-t border-white/20 mb-10"></div>
            {/* BOTTOM BAR */}
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-[#f5efdd] gap-4">
              <span>
                © {new Date().getFullYear()} Graphy. All rights reserved.
              </span>
              <div className="flex gap-6">
                <Link to="/refund">Refund Policy</Link>
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms & Conditions</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

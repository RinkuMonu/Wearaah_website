import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiTruck,
  FiGift,
  FiHeart,
  FiMapPin,
  FiRotateCw,
  FiMenu,
} from "react-icons/fi";

import { LuLogIn, LuUser } from "react-icons/lu";
import { X } from "lucide-react";
import CartTrigger from "./CartTrigger";
import CartOffCanvas from "./CartOffCanvas";
import LoginModal from "./Login";
import { useAuth } from "../service/AuthContext";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../features/Category/categorySlice";
import { fatchSubCategory } from "../../features/subCategory/subCategorySlice";
import { fatchBrands } from "../../features/Brands/brandSlice";

const MENU_LINKS = [
  { to: "/", label: "Home" },
  { to: "/kids", label: "Kids" },
  { to: "/productlist", label: "Mens" },
  // { to: "/new-arrivals", label: "New Arrivals" },
  { to: "/brands", label: "Brands" },
];

export default function Header() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);
  const { subcategories } = useSelector((state) => state.subCategory);
  const { brands } = useSelector((state) => state.brands);

  

  const { loginOpen, setLoginOpen, user } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [showAllMenu, setShowAllMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [allCategory, setAllCategory] = useState();

  const lastScrollYRef = useRef(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      if (currentScrollY <= 300) {
        setIsSticky(false);
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
        setIsSticky(false);
      } else {
        setIsVisible(true);
        setIsSticky(true);
      }

      lastScrollYRef.current = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenus = useCallback(() => {
    setMobileMenuOpen(false);
    setMobileNavOpen(false);
  }, []);

  const handleImageError = useCallback((e) => {
    if (e.currentTarget.src.includes("placeholder.png")) return;

    e.currentTarget.src = "../images/placeholder.png";
  }, []);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fatchSubCategory());
    dispatch(fatchBrands());
  }, [dispatch]);

  useEffect(() => {
    if (categories?.categories) {
      setAllCategory(categories.categories);
    }
  }, [categories]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div
        className={`hidden lg:flex items-center justify-between px-6 py-2.5 bg-black text-white text-xs transition-all duration-300 
        ${isSticky ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}
      >
        <div className="flex items-center space-x-6">
          <span className="flex items-center gap-1">
            <FiTruck /> Free Shipping
          </span>
          <span className="flex items-center gap-1">
            <FiRotateCw /> Return To Store
          </span>
          <span className="flex items-center gap-1">
            <FiGift /> Online Gift Card
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <span className="flex items-center gap-1">
            <FiMapPin /> Delivering To
          </span>
          <Link to="#" className="hover:text-gray-300 transition-colors">
            Download Our Apps
          </Link>
          <Link to="#" className="hover:text-gray-300 transition-colors">
            Store Locator
          </Link>
          <Link to="#" className="hover:text-gray-300 transition-colors">
            Help
          </Link>
        </div>
      </div>

      <header
        className={`w-full left-0 right-0 z-50 transition-all duration-300 shadow-md
        ${isSticky ? "fixed top-0" : "relative"} 
        ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div
          className={`bg-white/95 backdrop-blur-sm ${isSticky ? "py-2 px-4 sm:px-6" : "py-4 px-6"}`}
        >
          <div className="flex items-center justify-start gap-10">
            <Link
              to="/"
              className="bg-[#d6b28a] text-white font-black text-xl sm:text-2xl px-4 py-2 rounded-md hover:scale-105 transition-all lowercase whitespace-nowrap"
            >
              LIONIES
            </Link>

            <div className="hidden md:flex w-full items-center gap-2 text-sm font-medium ">
              {MENU_LINKS.map(({ to, label }) => (
                <div key={to} className=" group">
                  <Link
                    to={to}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all group-hover:text-[#d6b28a]"
                  >
                    <span>{label}</span>
                    {to !== "/" && to !== "/kids" && <MdKeyboardArrowDown />}
                  </Link>

                  {/* {to === "/new-arrivals" && (
                    <div className="absolute top-full left-0 w-[95vw] bg-white shadow-2xl border border-[#cccc] p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-999 mt-2 mx-4">
                      <div className="flex items-center justify-between gap-4 mb-6">
                        <h3 className="font-bold text-lg text-gray-900">
                          New in Store
                        </h3>
                        <Link
                          to="/new-arrivals"
                          className="text-sm text-[#d6b28a] hover:underline font-medium"
                        >
                          View all →
                        </Link>
                      </div>
                      <div className="grid grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-4 w-full">
                        {[
                          { img: "21.webp", label: "Blouses" },
                          { img: "22.webp", label: "Cardigans" },
                          { img: "23.jpg", label: "Jackets" },
                          { img: "24.webp", label: "Trousers" },
                          { img: "25.webp", label: "Lingerie" },
                          { img: "26.jpg", label: "Sale" },
                          { img: "printed.webp", label: "Accessories" },
                          { img: "21.webp", label: "Shorts" },
                          { img: "22.webp", label: "Tops" },
                        ].map(({ img, label }, i) => (
                          <Link
                            key={i}
                            to={`/new-arrivals/${label.toLowerCase().replace(/\s+/g, "-")}`}
                            className="group/item flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-all"
                          >
                            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden shadow-md group-hover/item:scale-105 transition-transform">
                              <img
                                src={`/images/${img}`}
                                alt={label}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-800 text-center">
                              {label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )} */}

                  {to === "/productlist" && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-7xl bg-white shadow-2xl border border-[#cccc] p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-999 mt-2">
                      <div className="flex items-center justify-between gap-4 mb-8 max-w-7xl mx-auto">
                        <h3 className="font-bold text-xl text-gray-900">
                          Shop Mens Collection
                        </h3>
                        <Link
                          to="/productlist"
                          className="text-sm text-[#d6b28a] hover:underline font-medium"
                        >
                          View all →
                        </Link>
                      </div>

                      <div className="relative flex justify-between items-start max-w-7xl mx-auto">
                        <div className="w-[60%]  border-t border-gray-200 py-10 h-[-webkit-fill-available]">
                          <div className="grid grid-cols-5 divide-x divide-gray-300 h-[inherit]">
                            <div className="space-y-4 px-6">
                              {allCategory
                                ?.filter((item) => item?.isActive)
                                ?.sort(
                                  (a, b) => a.displayOrder - b.displayOrder,
                                ) // sort by displayOrder
                                ?.map((data, index) => {
                                  return (
                                    <Link
                                      key={data?._id}
                                      to={{
                                        pathname: "/productlist",
                                        search: `?gender=Men&category=${data.slug}&ctd=${data._id}`,
                                      }}
                                      className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded"
                                    >
                                      <img
                                        src={`${BASE_URL}${data?.smallimage}`}
                                        alt={data?.name}
                                        className="w-10 h-10 object-cover rounded"
                                      />

                                      <span className="font-medium">
                                        {data?.name}
                                      </span>
                                    </Link>
                                  );
                                })}
                              {/* <Link
                                to="/blouses"
                                className="block hover:underline font-medium"
                              >
                                Blouses
                              </Link>
                              <Link
                                to="/tops"
                                className="block hover:underline font-medium"
                              >
                                Tops
                              </Link> */}
                            </div>
                            {/* <div className="space-y-4 px-6">
                              <Link
                                to="/jackets"
                                className="block hover:underline font-medium"
                              >
                                Jackets
                              </Link>
                              <Link
                                to="/sweaters"
                                className="block hover:underline font-medium"
                              >
                                Sweaters
                              </Link>
                              <Link
                                to="/cardigans"
                                className="block hover:underline font-medium"
                              >
                                Cardigans
                              </Link>
                            </div>
                            <div className="space-y-4 px-6">
                              <Link
                                to="/jeans"
                                className="block hover:underline font-medium"
                              >
                                Jeans and trousers
                              </Link>
                              <Link
                                to="/skirts"
                                className="block hover:underline font-medium"
                              >
                                Skirts
                              </Link>
                              <Link
                                to="/shorts"
                                className="block hover:underline font-medium"
                              >
                                Shorts
                              </Link>
                            </div>
                            <div className="space-y-4 px-6">
                              <Link
                                to="/lingerie"
                                className="block hover:underline font-medium"
                              >
                                Lingerie
                              </Link>
                              <Link
                                to="/bras"
                                className="block hover:underline font-medium"
                              >
                                Bras
                              </Link>
                              <Link
                                to="/bottoms"
                                className="block hover:underline font-medium"
                              >
                                Bottoms
                              </Link>
                            </div>
                            <div className="space-y-4 px-6">
                              <Link
                                to="/accessories"
                                className="block hover:underline font-medium"
                              >
                                Accessories
                              </Link>
                              <Link
                                to="/shop-all"
                                className="block hover:underline font-medium"
                              >
                                Shop all
                              </Link>
                            </div> */}
                          </div>
                        </div>
                        <div className="w-[40%] h-[420px] overflow-hidden shadow-2xl">
                          <div className="relative h-full">
                            <img
                              src="/images/26.jpg"
                              alt="Shop Now"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                              <h4 className="font-bold text-xl mb-4 leading-tight">
                                A color of New structures
                              </h4>
                              <Link
                                to="/mens/shop-all"
                                className="bg-white text-[#d6b28a] px-8 py-3 rounded-lg font-bold text-sm hover:scale-105 transition-all inline-block shadow-lg"
                              >
                                Shop now →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {to === "/brands" && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-6xl bg-white shadow-2xl border border-gray-200 p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-999 mt-2">
                      <div className="flex items-start justify-between gap-8 mb-8">
                        <div>
                          <h3 className="font-bold text-2xl text-gray-900 mb-2">
                            Top  Brands
                          </h3>
                        </div>
                      </div>

                      <div className="flex gap-8 max-w-6xl mx-auto">
                        <div className="flex-1 max-w-4xl">
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {brands?.slice(0, 10)?.map((brand) => (
                              <Link
                                to={`/productlist?brand=${brand.slug}&brandId=${brand._id}`}
                                className="group/item  bg-gray-100"
                              >
                                <div className="w-full p-6 gap-2">
                                  <img
                                    src={`${BASE_URL}${brand.logo}`}
                                    alt={brand.name}
                                    className="w-20 h-20 object-contain rounded-lg"
                                  />
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        <div className="w-80 shrink-0 hidden lg:block">
                          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 h-fit sticky top-8 text-sm space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-orange-100/50 rounded-xl">
                              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                              <span className="font-medium text-gray-800">
                                Free Delivery over ₹500
                              </span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-orange-100/50 rounded-xl">
                              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                              <span className="font-medium text-gray-800">
                                Matched Guarantee
                              </span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-orange-100/50 rounded-xl">
                              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                              <span className="font-medium text-gray-800">
                                Customer Support?
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 ml-auto w-[-webkit-fill-available]">
              <div className="flex-1 w-100 hidden lg:block">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-full bg-gray-50/50 px-4 py-2.5 text-sm outline-none border border-gray-200 focus:border-[#d6b28a] focus:ring-2 focus:ring-[#d6b28a]/20 transition-all"
                />
              </div>

              <div className="lg:hidden flex items-center gap-3 flex-1">
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 bg-gray-50 px-3 py-2 text-sm outline-none border border-gray-200 focus:border-[#d6b28a] focus:ring-2 focus:ring-[#d6b28a]/20 rounded-lg"
                />
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiMenu size={20} />
                </button>
              </div>

              <div className="items-center gap-3 hidden lg:flex">
                <Link
                  to="/wishlist"
                  className="flex flex-col items-center p-2 rounded-lg transition-all group"
                >
                  <FiHeart
                    size={18}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span className="hidden sm:block mt-1 text-xs font-medium">
                    Wishlist
                  </span>
                </Link>

                <CartTrigger onOpen={() => setCartOpen(true)} />

                {user?.user ? (
                  <Link
                    to="userprofile"
                    className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg transition-all group"
                  >
                    <LuUser
                      size={18}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="hidden sm:block mt-1 text-xs font-medium">
                      Profile
                    </span>
                  </Link>
                ) : (
                  <button
                    onClick={() => setLoginOpen(true)}
                    className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg transition-all group"
                  >
                    <LuLogIn
                      size={18}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="hidden sm:block mt-1 text-xs font-medium">
                      Login
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <hr className="border-[#fef1f1] h-1" />
        <div
          className={`bg-white/80 backdrop-blur-sm  transition-all duration-300 relative z-[-1] ${isSticky ? "-mt-1" : ""}`}
        >
          <div className="relative overflow-y-hidden Xsidebar">
            <div
              className="absolute right-0 hidden lg:block"
              style={{
                width: " 1px",
                boxShadow: "-14px 16px 40px 30px #fffcfc",
                height: "-webkit-fill-available",
              }}
            />
            <div className="flex items-center justify-start gap-6 px-4 sm:px-6">
              <button
                onClick={() => {
                  setShowAllMenu(true);
                }}
                className="flex flex-col items-center gap-2 p-4 hover:scale-105 z-20 pointer-events-auto cursor-pointer transition-all group relative shrink-0"
                style={{ zIndex: 20 }}
              >
                <div className="w-16 h-16 lg:w-[100px] lg:h-[100px] bg-linear-to-br from-gray-100 to-gray-200  rounded-full overflow-hidden group-hover:scale-110 transition-all shadow-lg hover:shadow-xl hover:border-yellow-300">
                  <img
                    src="../images/9.webp"
                    alt="ALL"
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-800 px-1 whitespace-nowrap">
                  ALL
                </span>
              </button>
              {subcategories
                ?.filter((item) => item?.isActive)
                ?.sort((a, b) => a.displayOrder - b.displayOrder)
                .slice(0, 10)
                ?.map((category) => (
                  <Link
                    key={category.name}
                    to={`/productlist?subCategory=${category.slug}&subCategoryId=${category._id}`}
                    className="flex flex-col items-center gap-2 p-4 hover:scale-105 z-20 pointer-events-auto cursor-pointer transition-all group relative shrink-0"
                    style={{ zIndex: 20 }}
                  >
                    <div className="w-16 h-16 lg:w-[100px] lg:h-[100px] bg-linear-to-br from-gray-100 to-gray-200 rounded-full overflow-hidden group-hover:scale-110 transition-all shadow-lg hover:shadow-xl hover:border-2 hover:border-yellow-300">
                      <img
                        src={`${BASE_URL}${category.smallimage}`}
                        alt={category.name}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-800 px-1 whitespace-nowrap">
                      {category.name}
                    </span>
                  </Link>
                ))}

              {/* {pareantcategory?.length > 0
                ? pareantcategory.map((item) => (
                  <Link
                    key={item._id}
                    to={`/${item.name.replace(/\s+/g, "-").toLowerCase()}`}
                    className="flex flex-col items-center gap-2 p-2 hover:scale-105 transition-all group shrink-0 min-w-[72px]"
                  >
                    <div className="w-16 h-16 lg:w-[100px] lg:h-[100px] bg-linear-to-br from-gray-100 to-gray-200  rounded-full overflow-hidden group-hover:scale-110 transition-all shadow-lg hover:shadow-xl hover:border-yellow-300">
                      <img
                        src={
                          item?.smallimage
                            ? `http://localhost:5000${item.smallimage}`
                            : "../images/23.jpg"
                        }
                        alt={item?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[12px] capitalize font-semibold text-gray-800 text-center max-w-[80px]">
                      {item?.name}
                    </span>
                  </Link>
                ))
                : Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-2 p-4 animate-pulse shrink-0"
                    >
                      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-200 rounded-full" />
                      <div className="w-16 h-4 bg-gray-200 rounded" />
                    </div>
                  ))
              } */}
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-9999 bg-black/50"
            onClick={closeMobileMenus}
          />
          <div className="fixed right-4 top-24 sm:top-28 z-10000 w-[-webkit-fill-available] max-w-[94vw] bg-white shadow-2xl rounded-2xl p-6 border max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Quick Actions</h3>
              <button onClick={closeMobileMenus}>
                <X size={24} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <Link
                to="/wishlist"
                className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all"
                onClick={closeMobileMenus}
              >
                <FiHeart size={20} className="text-gray-700" />
                <div>
                  <div className="font-medium text-gray-900">Wishlist</div>
                  <div className="text-xs text-gray-500">Your saved items</div>
                </div>
              </Link>

              <div
                className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
                onClick={() => {
                  setCartOpen(true);
                  closeMobileMenus();
                }}
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6.5A2 2 0 007.4 21h9.2a2 2 0 001.9-2.5L17 13m0 0h2M3 3h2m0 0h2m0 0h2"
                  />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">Cart</div>
                  <div className="text-xs text-gray-500">
                    View shopping cart
                  </div>
                </div>
              </div>

              {user?.user ? (
                <Link
                  to="userprofile"
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all"
                  onClick={closeMobileMenus}
                >
                  <LuUser size={20} className="text-gray-700" />
                  <div>
                    <div className="font-medium text-gray-900">Profile</div>
                    <div className="text-xs text-gray-500">
                      Account settings
                    </div>
                  </div>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setLoginOpen(true);
                    closeMobileMenus();
                  }}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all w-full text-left"
                >
                  <LuLogIn size={20} className="text-gray-700" />
                  <div>
                    <div className="font-medium text-gray-900">Login</div>
                    <div className="text-xs text-gray-500">
                      Sign in to your account
                    </div>
                  </div>
                </button>
              )}
            </div>

            <div>
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="w-full flex items-center justify-between p-4 border-y border-gray-200 mb-4"
              >
                <span className="font-semibold text-gray-900">Navigation</span>
                <MdKeyboardArrowDown
                  className={`transition-transform ${mobileNavOpen ? "rotate-180" : ""}`}
                  size={20}
                />
              </button>

              {mobileNavOpen && (
                <div className="space-y-2 ml-4">
                  <Link
                    to="/"
                    className="block p-3 hover:bg-gray-50 rounded-lg transition-all"
                    onClick={() => {
                      closeMobileMenus();
                    }}
                  >
                    Home
                  </Link>

                  <div>
                    <button
                      onClick={() =>
                        setOpenAccordion(
                          openAccordion === "mens" ? null : "mens",
                        )
                      }
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all text-left font-medium"
                    >
                      Mens
                      <MdKeyboardArrowDown
                        className={`transition-transform ${openAccordion === "mens" ? "rotate-180" : ""}`}
                        size={20}
                      />
                    </button>
                    {openAccordion === "mens" && (
                      <div className="ml-4 mt-2 space-y-2 bg-gray-50 p-3 rounded-lg">
                        {allCategory?.slice(0, 5)?.map((item) => (
                          <Link
                            key={item?._id}
                            to={`/productlist?category=${item.slug}&ctd=${item._id}`}
                            className="block p-2 hover:bg-white rounded transition-all text-sm"
                            onClick={closeMobileMenus}
                          >
                            {item?.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* <div>
                    <button
                      onClick={() =>
                        setOpenAccordion(
                          openAccordion === "new-arrivals"
                            ? null
                            : "new-arrivals",
                        )
                      }
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all text-left font-medium"
                    >
                      New Arrivals
                      <MdKeyboardArrowDown
                        className={`transition-transform ${openAccordion === "new-arrivals" ? "rotate-180" : ""}`}
                        size={20}
                      />
                    </button>
                    {openAccordion === "new-arrivals" && (
                      <div className="ml-4 mt-2 space-y-2 bg-gray-50 p-3 rounded-lg">
                        <Link
                          to="/new-arrivals/blouses"
                          className="block p-2 hover:bg-white rounded transition-all text-sm"
                          onClick={closeMobileMenus}
                        >
                          Blouses
                        </Link>
                        <Link
                          to="/new-arrivals/cardigans"
                          className="block p-2 hover:bg-white rounded transition-all text-sm"
                          onClick={closeMobileMenus}
                        >
                          Cardigans
                        </Link>
                        <Link
                          to="/new-arrivals/jackets"
                          className="block p-2 hover:bg-white rounded transition-all text-sm"
                          onClick={closeMobileMenus}
                        >
                          Jackets
                        </Link>
                        <Link
                          to="/new-arrivals/trousers"
                          className="block p-2 hover:bg-white rounded transition-all text-sm"
                          onClick={closeMobileMenus}
                        >
                          Trousers
                        </Link>
                        <Link
                          to="/new-arrivals/lingerie"
                          className="block p-2 hover:bg-white rounded transition-all text-sm"
                          onClick={closeMobileMenus}
                        >
                          Lingerie
                        </Link>
                      </div>
                    )}
                  </div> */}

                  <div>
                    <button
                      onClick={() =>
                        setOpenAccordion(
                          openAccordion === "brands" ? null : "brands",
                        )
                      }
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all text-left font-medium"
                    >
                      Brands
                      <MdKeyboardArrowDown
                        className={`transition-transform ${openAccordion === "brands" ? "rotate-180" : ""}`}
                        size={20}
                      />
                    </button>
                    {openAccordion === "brands" && (
                      <div className="ml-4 mt-2 space-y-2 bg-gray-50 p-3 rounded-lg max-h-48 overflow-y-auto">
                        {brands?.slice(0, 10)?.map((item) => (
                          <Link
                            key={item?._id}
                            to={`/brands/${item.slug}`}
                            className="block p-2 hover:bg-white rounded transition-all text-sm lg:flex items-center gap-2"
                            onClick={closeMobileMenus}
                          >
                            <span className="w-5 h-5 bg-gray-300 rounded-sm shrink-0"></span>
                            {item?.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div
        className={`fixed inset-0 z-60 ${showAllMenu ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity ${
            showAllMenu ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setShowAllMenu(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full w-full sm:w-[420px] bg-white
              transform transition-transform duration-300 overflow-y-auto
              ${showAllMenu ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-white z-10">
            <Link
              to="/"
              className="bg-[#d6b28a] text-white font-black text-2xl px-4 py-2 lowercase"
            >
              LIONIES
            </Link>
            <X
              size={22}
              className="cursor-pointer"
              onClick={() => setShowAllMenu(false)}
            />
          </div>

          <div className="px-4 py-4 border-b bg-gray-50 sticky top-[72px] z-10">
            <h2 className="text-xl font-bold text-gray-900">ALL</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 px-4 py-6">
            {subcategories?.map((item) => (
              <Link
                key={item._id}
                to={`/productlist?subCategoryId=${item._id}&subCategory=${item.slug}`}
                onClick={() => setShowAllMenu(false)}
                className="text-center text-xs font-medium hover:bg-gray-50 p-3 transition-all hover:scale-105 rounded-md"
              >
                <img
                  src={`${BASE_URL}${item.smallimage}`}
                  alt={item.name}
                  className="h-14 w-14 mx-auto rounded-lg object-cover mb-2"
                />
                <span className="block font-semibold">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <CartOffCanvas isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

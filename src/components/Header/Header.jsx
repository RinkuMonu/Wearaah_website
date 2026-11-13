import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiTruck,
  FiGift,
  FiHeart,
  FiRotateCw,
  FiMenu,
  FiSearch,
  FiX,
  FiChevronRight,
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
import api from "../service/axios";
import { selectWishlistItems } from "../../features/Wishlist/wishlistSlice";

const MENU_LINKS = [
  { to: "/mens", label: "MENS", id: "mens" },
  { to: "/kids", label: "KIDS", id: "kids" },
  { to: "/productlist?category=accessories", label: "ACCESSORIES", id: "accessories" },
  { to: "/productlist?isNewArrival=true", label: "NEW ARRIVALS", id: "new-arrivals" },
  { to: "/productlist?category=linen", label: "LINEN", id: "linen" },
];

export default function Header() {
  const BASE_URL = import.meta.env.VITE_BASE_URL || "";
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const { subcategories } = useSelector((state) => state.subCategory);
  const { brands } = useSelector((state) => state.brands);
  const wishlistItems = useSelector(selectWishlistItems);

  const { loginOpen, setLoginOpen, user } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [showAllMenu, setShowAllMenu] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState(null);
  const [allCategory, setAllCategory] = useState([]);

  const lastScrollYRef = useRef(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isSticky, setIsSticky] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  const fetchSuggestions = useCallback(async (query) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSearchLoading(true);
    try {
      const res = await api.get(
        `/variant/autosuggest?q=${encodeURIComponent(query)}`
      );
      setSuggestions(res.data?.data || []);
      setShowSuggestions(true);
    } catch (err) {
      setSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 250);
  };

  const handleSearchSubmit = (queryToUse) => {
    const term = queryToUse || searchQuery;
    if (term.trim()) {
      navigate(`/productSearch?search=${encodeURIComponent(term.trim())}`);
      setShowSuggestions(false);
      setMobileSearchOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  useEffect(() => {
    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      if (currentScrollY <= 150) {
        setIsSticky(false);
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 250) {
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

  const handleImageError = useCallback((e) => {
    if (e.currentTarget.src.includes("placeholder.png")) return;
    e.currentTarget.src = "/images/placeholder.png";
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

  useEffect(() => {
    if (mobileDrawerOpen || showAllMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen, showAllMenu]);

  return (
    <>
      {/* ─── 1. TOP ANNOUNCEMENT BAR ─── */}
      <div
        className={`bg-black text-white text-[11px] sm:text-[12px] font-medium tracking-[0.16em] uppercase py-2.5 transition-all duration-300 ${
          isSticky ? "hidden" : "block"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 text-center flex items-center justify-center gap-2">
          <span className="text-[#08266B] font-black text-xs sm:text-sm">&gt;</span>
          <span className="text-white/95">
            BUY JEANS ONLY 2599
          </span>
          <span className="text-[#08266B] font-black text-xs sm:text-sm">&lt;</span>
        </div>
      </div>

      {/* ─── 2. MAIN HEADER ─── */}
      <header
        className={`w-full left-0 right-0 z-40 transition-all duration-300 bg-white border-b border-neutral-200/70 ${
          isSticky ? "fixed top-0 shadow-xs" : "relative"
        } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 relative flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Mobile Menu & Desktop Navigation (Positioned to the side) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 text-neutral-900 hover:text-[#08266B] focus:outline-none"
              aria-label="Open navigation menu"
            >
              <FiMenu size={22} strokeWidth={1.5} />
            </button>

            <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7 text-[12px] xl:text-[13px] tracking-[0.14em] font-semibold uppercase text-neutral-900">
              {MENU_LINKS.map(({ to, label, id }) => {
                const isMens = id === "mens";
                const isKids = id === "kids";
                return (
                  <div key={label} className="group py-6">
                    <Link
                      to={to}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "instant" });
                      }}
                      className="py-1 hover:text-[#08266B] transition-colors duration-200 flex items-center gap-1 group-hover:text-[#08266B] relative font-semibold cursor-pointer select-none"
                    >
                      <span>{label}</span>
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#08266B] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                    </Link>

                    {/* Mega Menu: MENS (Exact Screenshot 1) */}
                    {isMens && (
                      <div className="fixed top-[64px] sm:top-[80px] left-0 right-0 w-full bg-white shadow-xl border-t border-neutral-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="w-full max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16 py-8 flex items-start gap-12 lg:gap-16">
                          {/* Left Heading */}
                          <div className="w-36 sm:w-44 shrink-0 pt-1">
                            <h3 className="text-sm uppercase tracking-[0.16em] font-semibold text-neutral-900">
                              CLOTHING
                            </h3>
                          </div>

                          {/* 4 Columns of Categories */}
                          <div className="flex-1 grid grid-cols-4 gap-x-10 lg:gap-x-14 pt-1">
                            {/* Column 1 */}
                            <div className="space-y-5">
                              <Link to="/mens" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                All Products
                              </Link>
                              <Link to="/productlist?search=T-Shirt" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                T-Shirts
                              </Link>
                              <Link to="/productlist?search=Sweater" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                Sweaters
                              </Link>
                            </div>

                            {/* Column 2 */}
                            <div className="space-y-5">
                              <Link to="/productlist?search=Jeans" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                Jeans
                              </Link>
                              <Link to="/productlist?search=Pants" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                Pants
                              </Link>
                              <Link to="/productlist?search=Sweatshirt" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                Sweatshirts
                              </Link>
                            </div>

                            {/* Column 3 */}
                            <div className="space-y-5">
                              <Link to="/productlist?search=Shorts" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                Shorts
                              </Link>
                              <Link to="/productlist?search=Cargo" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                Cargo
                              </Link>
                              <Link to="/productlist?search=Flat+Knits" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                Flat Knits
                              </Link>
                            </div>

                            {/* Column 4 */}
                            <div className="space-y-5">
                              <Link to="/productlist?search=Shirt" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                Shirts
                              </Link>
                              <Link to="/productlist?search=Trouser" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                Trousers
                              </Link>
                              <Link to="/productlist?search=Jacket" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                Jackets
                              </Link>
                            </div>
                          </div>

                          {/* Right Model Photo */}
                          <div className="w-64 sm:w-72 shrink-0 aspect-[3/4] overflow-hidden bg-neutral-100 shadow-sm">
                            <img
                              src="/images/15.jpg"
                              alt="Men's Fashion"
                              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mega Menu: KIDS (Exact Screenshot 2) */}
                    {isKids && (
                      <div className="fixed top-[64px] sm:top-[80px] left-0 right-0 w-full bg-white shadow-xl border-t border-neutral-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="w-full max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16 py-8 flex items-start gap-12 lg:gap-16">
                          {/* Left Heading */}
                          <div className="w-36 sm:w-44 shrink-0 pt-1">
                            <h3 className="text-sm uppercase tracking-[0.16em] font-semibold text-neutral-900">
                              CLOTHING
                            </h3>
                          </div>

                          {/* 4 Columns of Categories */}
                          <div className="flex-1 grid grid-cols-4 gap-x-10 lg:gap-x-14 pt-1">
                            {/* Column 1 */}
                            <div className="space-y-5">
                              <Link to="/kids" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                All Products
                              </Link>
                              <Link to="/productlist?search=Kids+Jeans" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                Jeans
                              </Link>
                              <Link to="/productlist?search=Kids+Shorts" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                Shorts
                              </Link>
                            </div>

                            {/* Column 2 */}
                            <div className="space-y-5">
                              <Link to="/productlist?search=Kids+Jacket" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                Jackets
                              </Link>
                              <Link to="/productlist?search=Kids+Sweatshirt" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                Sweat Shirts
                              </Link>
                              <Link to="/productlist?search=Kids+Trouser" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                Trouser
                              </Link>
                            </div>

                            {/* Column 3 */}
                            <div className="space-y-5">
                              <Link to="/productlist?search=Kids+Shirt" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                Shirts
                              </Link>
                              <Link to="/productlist?search=Kids+Cargo" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                Cargo
                              </Link>
                              <Link to="/productlist?search=Kids+Track+Pants" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                Track Pants
                              </Link>
                            </div>

                            {/* Column 4 */}
                            <div className="space-y-5">
                              <Link to="/productlist?search=Kids+T-Shirt" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                T-Shirts
                              </Link>
                              <Link to="/productlist?search=Kids+Joggers" className="block text-[13px] sm:text-sm text-neutral-800 hover:text-[#08266B] font-normal transition-colors">
                                Joggers
                              </Link>
                            </div>
                          </div>

                          {/* Right Model Photo */}
                          <div className="w-64 sm:w-72 shrink-0 aspect-[3/4] overflow-hidden bg-neutral-100 shadow-sm">
                            <img
                              src="/images/Kids/kids-boy.jpg"
                              alt="Kids Boy Fashion"
                              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.currentTarget.src = "/images/Kids/KB1.jpg";
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Center: Brand Logo - WEARAAH (Precisely Centered like reference) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto">
            <Link to="/" className="py-1 flex items-center justify-center group" aria-label="Wearaah Home">
              <img
                src="/logo/wearaah-transparent.png"
                alt="Wearaah"
                className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "/logo/WEARAAH_Logo_4K_Transparent.png";
                }}
              />
            </Link>
          </div>

          {/* Right: Minimalist Outline Utility Icons */}
          <div className="flex items-center justify-end space-x-4 sm:space-x-6 text-neutral-900">
            {/* Search Toggle Icon */}
            <button
              onClick={() => setDesktopSearchOpen(!desktopSearchOpen)}
              className="p-1.5 hover:text-[#08266B] transition-colors cursor-pointer"
              aria-label="Search"
            >
              <FiSearch size={20} strokeWidth={1.5} />
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-1.5 hover:text-[#08266B] transition-colors"
              aria-label="Wishlist"
            >
              <FiHeart size={20} strokeWidth={1.5} />
              {wishlistItems?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#08266B] text-white text-[10px] font-semibold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center shadow-xs">
                  {wishlistItems.length > 99 ? "99+" : wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Icon */}
            <CartTrigger onOpen={() => setCartOpen(true)} />

            {/* User Profile Icon */}
            {user?.user ? (
              <Link
                to="/userprofile"
                className="p-1.5 hover:text-[#08266B] transition-colors"
                aria-label="User profile"
              >
                <LuUser size={20} strokeWidth={1.5} />
              </Link>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="p-1.5 hover:text-[#08266B] transition-colors cursor-pointer"
                aria-label="Sign In"
              >
                <LuUser size={20} strokeWidth={1.5} />
              </button>
            )}
          </div>

        </div>

        {/* Desktop Search Bar Dropdown */}
          {desktopSearchOpen && (
            <div className="border-t border-neutral-100 py-3 bg-white" ref={searchRef}>
              <div className="max-w-2xl mx-auto px-4 relative">
                <div className="relative flex items-center">
                  <FiSearch className="absolute left-3.5 text-neutral-400" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearchSubmit();
                    }}
                    placeholder="Search for Jeans, Shirts, Blazers, Trousers..."
                    className="w-full pl-10 pr-9 py-2 bg-neutral-50 text-xs sm:text-sm border border-neutral-200 outline-none focus:border-black font-normal transition-all"
                    autoFocus
                  />
                  <button
                    onClick={() => setDesktopSearchOpen(false)}
                    className="absolute right-3 text-neutral-400 hover:text-black"
                  >
                    <FiX size={16} />
                  </button>
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-4 right-4 mt-1 bg-white border border-neutral-200 shadow-lg z-50 max-h-60 overflow-y-auto">
                    {suggestions.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(item);
                          handleSearchSubmit(item);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-xs text-neutral-800 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Search Bar Dropdown */}
          {mobileSearchOpen && (
            <div className="md:hidden py-2 border-t border-neutral-100">
              <div className="relative flex items-center">
                <FiSearch className="absolute left-3 text-neutral-400" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchSubmit();
                  }}
                  placeholder="Search Jeans, Shirts, Blazers..."
                  className="w-full pl-9 pr-9 py-2 bg-neutral-100 text-xs outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setMobileSearchOpen(false)}
                  className="absolute right-3 text-neutral-500"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>
          )}

      </header>

      {/* ─── 3. MOBILE SLIDE-OVER NAVIGATION DRAWER ─── */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col">
            
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <Link to="/" onClick={() => setMobileDrawerOpen(false)} className="flex items-center">
                <img
                  src="/logo/WEARAAH_Logo_4K_Transparent.png"
                  alt="Wearaah"
                  className="h-8 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/logo/wearaah-transparent.png";
                  }}
                />
              </Link>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-100"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
              {user?.user ? (
                <Link
                  to="/userprofile"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-2.5 text-xs font-semibold text-neutral-800"
                >
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                    {user?.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="truncate">
                    <p className="truncate font-semibold">{user?.user?.name || "My Account"}</p>
                    <span className="text-[10px] text-neutral-400 font-normal">View Profile</span>
                  </div>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setLoginOpen(true);
                  }}
                  className="w-full py-2.5 px-4 bg-[#08266B] hover:bg-black text-white text-xs font-black uppercase tracking-wider text-center transition-colors font-display"
                >
                  Sign In / Register
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <div>
                <button
                  onClick={() =>
                    setMobileExpandedSection(mobileExpandedSection === "mens" ? null : "mens")
                  }
                  className="w-full flex items-center justify-between p-3 text-sm font-bold text-neutral-900 hover:bg-neutral-50 rounded-lg uppercase tracking-wider text-left font-display"
                >
                  <span>MENS</span>
                  <MdKeyboardArrowDown
                    className={`transition-transform duration-200 ${
                      mobileExpandedSection === "mens" ? "rotate-180 text-[#08266B]" : "text-neutral-400"
                    }`}
                    size={20}
                  />
                </button>
                {mobileExpandedSection === "mens" && (
                  <div className="ml-3 pl-3 border-l-2 border-[#08266B] space-y-1 py-1">
                    <Link
                      to="/mens"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="block p-2 text-xs font-bold text-[#08266B] uppercase tracking-wider"
                    >
                      View All Men's →
                    </Link>
                    <Link
                      to="/productlist?isNewArrival=true"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="block p-2 text-xs text-neutral-600 hover:text-black"
                    >
                      New Arrivals
                    </Link>
                    <Link
                      to="/productlist?subCategoryId=69c23c0df1295fef10514873&subCategory=jeans"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="block p-2 text-xs text-neutral-600 hover:text-black"
                    >
                      Jeans
                    </Link>
                    <Link
                      to="/productlist?category=shirts"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="block p-2 text-xs text-neutral-600 hover:text-black"
                    >
                      Shirts
                    </Link>
                    <Link
                      to="/productlist?category=formal-wear&ctd=69c50b8293df3e7bd375833a"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="block p-2 text-xs text-neutral-600 hover:text-black"
                    >
                      Formal Wear
                    </Link>
                    <Link
                      to="/productlist?category=blazers"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="block p-2 text-xs text-neutral-600 hover:text-black"
                    >
                      Blazer and Coat
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/kids"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center justify-between p-3 text-sm font-bold text-neutral-900 hover:bg-neutral-50 rounded-lg uppercase tracking-wider font-display"
              >
                <span>KIDS</span>
                <FiChevronRight className="text-neutral-400" />
              </Link>

              <Link
                to="/productlist?category=accessories"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center justify-between p-3 text-sm font-bold text-neutral-900 hover:bg-neutral-50 rounded-lg uppercase tracking-wider font-display"
              >
                <span>ACCESSORIES</span>
                <FiChevronRight className="text-neutral-400" />
              </Link>

              <Link
                to="/productlist?isNewArrival=true"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center justify-between p-3 text-sm font-bold text-neutral-900 hover:bg-neutral-50 rounded-lg uppercase tracking-wider font-display"
              >
                <span>NEW ARRIVALS</span>
                <FiChevronRight className="text-neutral-400" />
              </Link>

              <Link
                to="/productlist?category=linen"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center justify-between p-3 text-sm font-bold text-neutral-900 hover:bg-neutral-50 rounded-lg uppercase tracking-wider font-display"
              >
                <span>LINEN</span>
                <FiChevronRight className="text-neutral-400" />
              </Link>

              <div className="pt-4 border-t border-neutral-100 mt-4 space-y-1">
                <Link
                  to="/wishlist"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 p-3 text-xs font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg"
                >
                  <FiHeart size={16} />
                  <span>My Wishlist ({wishlistItems?.length || 0})</span>
                </Link>
                <Link
                  to="/faq"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 p-3 text-xs font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg"
                >
                  <FiGift size={16} />
                  <span>Help & Customer Care</span>
                </Link>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-100 text-center text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
              Wearaah Men's Denim & Contemporary Fashion
            </div>

          </div>
        </div>
      )}

      {/* ─── 5. "ALL CATEGORIES" SLIDE-OVER MODAL ─── */}
      {showAllMenu && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setShowAllMenu(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <img
                  src="/logo/WEARAAH_Logo_4K_Transparent.png"
                  alt="Wearaah"
                  className="h-8 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/logo/wearaah-transparent.png";
                  }}
                />
                <span className="text-neutral-300">|</span>
                <h3 className="font-display text-base text-neutral-900 font-black uppercase">All Categories</h3>
              </div>
              <button
                onClick={() => setShowAllMenu(false)}
                className="p-1.5 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {subcategories?.map((item) => (
                  <Link
                    key={item._id}
                    to={`/productlist?subCategoryId=${item._id}&subCategory=${item.slug}`}
                    onClick={() => setShowAllMenu(false)}
                    className="flex flex-col items-center text-center p-3.5 rounded-xl border border-neutral-200 hover:border-[#08266B] hover:shadow-md transition-all group bg-neutral-50/50 hover:bg-white"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-100 mb-2.5 shadow-xs">
                      <img
                        src={item?.smallimage ? `${BASE_URL}${item.smallimage}` : "/images/placeholder.png"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={handleImageError}
                      />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-neutral-900 group-hover:text-[#08266B] truncate w-full font-display">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Global Cart Off-Canvas & Login Modal */}
      <CartOffCanvas isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

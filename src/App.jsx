import { Routes, Route } from "react-router-dom";
import Layout from "./layout.jsx";
import Home from "./pages/Home";
import "./index.css";
import PrivacyPolicy from "./pages/Privacy.jsx";
import TermsConditions from "./pages/Terms.jsx";
import RefundPolicy from "./pages/Refund.jsx";
import LoginModal from "./components/Header/Login.jsx";
import UserProfilePage from "./pages/Userprofile.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import ProductListingPage from "./components/ProductListingPage.jsx";
import CheckoutPage from "./components/Checkout.jsx";
import { AddProductWithVariant } from "./components/admin/addProduct.jsx";
import ProductDetailPage from "./pages/Productdetail.jsx";
import PartnerPage from "./pages/Partner.jsx";
import Faq from "./pages/Faq.jsx";
import Kids from "./pages/Kids.jsx";
import MensPage from "./pages/MensPage.jsx";
import BecomeAPartner from "./pages/BecomeAPartner.jsx";
import ScrollToTop from "./components/Scrolltop.jsx";
import BecomeARider from "./pages/BecomeARider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderSuccess from "./components/OrderSuccess.jsx";
import ReviewPage from "./components/Reviewpage.jsx";
import SearchProductPage from "./components/SearchProductPage.jsx";

// Keep QueryClient singleton outside component to avoid cache loss on re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScrollToTop />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<LoginModal isOpen={true} onClose={() => window.history.back()} />} />
          <Route path="userprofile" element={<UserProfilePage />} />
          <Route path="reviews" element={<ReviewPage />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="productlist" element={<ProductListingPage />} />
          <Route path="productSearch" element={<SearchProductPage />} />
          <Route path="productdetail" element={<ProductDetailPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsConditions />} />
          <Route path="refund" element={<RefundPolicy />} />
          <Route path="add" element={<AddProductWithVariant />} />
          <Route path="partner" element={<PartnerPage />} />
          <Route path="faq" element={<Faq />} />
          <Route path="kids" element={<Kids />} />
          <Route path="pages/kids" element={<Kids />} />
          <Route path="mens" element={<MensPage />} />
          <Route path="pages/mens" element={<MensPage />} />
          <Route path="becomeapartner" element={<BecomeAPartner />} />
          <Route path="becomearider" element={<BecomeARider />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route
            path="*"
            element={
              <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
                <span className="text-xs uppercase tracking-widest text-[#c5a059] font-semibold mb-2">Error 404</span>
                <h1 className="text-6xl md:text-8xl font-serif text-neutral-900 font-bold mb-4">404</h1>
                <p className="text-lg text-neutral-500 max-w-md mb-8">
                  The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <a
                  href="/"
                  className="inline-flex items-center px-8 py-3 bg-[#121212] text-white text-xs uppercase tracking-wider font-semibold rounded-none hover:bg-[#c5a059] transition-colors duration-300"
                >
                  Return to Home
                </a>
              </div>
            }
          />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;

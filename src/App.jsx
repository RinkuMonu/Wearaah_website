import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "./layout.jsx";
import Home from "./pages/Home";
import "./index.css";
import PrivacyPolicy from "./pages/Privacy.jsx";
import TermsConditions from "./pages/Terms.jsx";
import RefundPolicy from "./pages/Refund.jsx";
// import CartOffCanvas from "./components/Header/CartOffCanvas.jsx";
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
import BecomeAPartner from "./pages/BecomeAPartner.jsx";
import ScrollToTop from "./components/Scrolltop.jsx";
import BecomeARider from "./pages/BecomeARider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from 'react-toastify';
import OrderSuccess from "./components/OrderSuccess.jsx";
import ReviewPage from "./components/Reviewpage.jsx";
function App() {
  const queryClient = new QueryClient();
  return (
    <>
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
        theme="dark" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            {/* <Route path="cart" element={<CartOffCanvas />} /> */}
            <Route path="login" element={<LoginModal />} />
            <Route path="userprofile" element={<UserProfilePage />} />
            <Route path="/reviews" element={<ReviewPage />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="cart" element={<LoginModal />} />
            <Route path="productlist" element={<ProductListingPage />} />
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
            <Route path="becomeapartner" element={<BecomeAPartner />} />
            <Route path="becomearider" element={<BecomeARider />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route
              path="*"
              element={
                <div className="text-center py-20">
                  <h1 className="text-6xl font-bold text-gray-400">404</h1>
                  <p className="text-xl text-gray-500">Page Not Found</p>
                </div>
              }
            />
          </Route>
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;

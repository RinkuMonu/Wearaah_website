import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";

export default function Layout() {
  const location = useLocation();
  
  // Check if the current route should hide header/footer based on state or path
  const shouldHideHeaderFooter = 
    location.pathname === '/order-success' || 
    location.state?.hideLayout === true;
  
  return (
    <Provider store={store}>
      <div className="min-h-screen flex flex-col">
        {!shouldHideHeaderFooter && <Header />}
        <main className="flex-1">
          <Outlet />
        </main>
        {!shouldHideHeaderFooter && <Footer />}
      </div>
    </Provider>
  );
}
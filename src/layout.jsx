import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";

export default function Layout() {
  return (
    <Provider store={store}>
    <div className="min-h-screen flex flex-col">
      {/* Sticky Header */}
      <Header />

      {/* Scrollable Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
    </Provider>
  );
}



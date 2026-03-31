import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./components/service/AuthContext.jsx";
import { store } from "./store.js";
import { Provider } from "react-redux";
import 'react-toastify/dist/ReactToastify.css';
createRoot(document.getElementById("root")).render(
  <StrictMode>
  <Provider store={store}>

    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </Provider>
  </StrictMode>,
);

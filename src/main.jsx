import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import ToastWrapper from "./ToastWrapper.jsx";
import StoreWrapper from "./components/StoreWrapper.jsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { StrictMode } from "react";

const clientId = "AaG8SvBkw84gADg9acITGalTeUzpYR6RXReOjhiLZM1wYJlEOlPgXfxJc7gl83EIazdHz9bhxTKg0PcH";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider options={{ "client-id": clientId, locale: "ar_KW" }}>
        <BrowserRouter>
          <ToastWrapper>
            <StoreWrapper>
              <App />
            </StoreWrapper>
          </ToastWrapper>
        </BrowserRouter>
      </PayPalScriptProvider>
    </Provider>
  </StrictMode>,
);

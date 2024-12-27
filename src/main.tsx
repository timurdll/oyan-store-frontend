import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "normalize.css";
import "@styles/index.scss";
import "./i18n";
import { Provider } from "react-redux";
import store, { persistor } from "@redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";

// Создаем store перед рендерингом

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <App />
    </PersistGate>
  </Provider>
);

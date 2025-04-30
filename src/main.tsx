import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store, { persistor } from "@redux/store";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import "@styles/index.scss";
import "./i18n";

// Ожидаем загрузки ресурсов i18n перед рендерингом
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Функция для рендеринга приложения, которая будет вызвана после инициализации i18n
const renderApp = () => {
  root.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
};

// Выполнить рендеринг с небольшой задержкой для инициализации i18n
// Это поможет избежать проблем при первой загрузке
setTimeout(renderApp, 50);

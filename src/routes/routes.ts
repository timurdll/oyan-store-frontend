import AddProduct from "@pages/AddProduct";
import AdminPanel from "@pages/AdminPanel";
import BasketPage from "@pages/Basket";
import EditProduct from "@pages/EditProduct";
import Home from "@pages/Home";
import ProductPage from "@pages/Product";
import Profile from "@pages/Profile";
import CheckOut from "@pages/Checkout";
import Orders from "@pages/Orders";
import AdminOrders from "@components/AdminPanel/AdminOrders";
import OrderSuccessPage from "@pages/OrderSuccessPage";
import AboutUsPage from "@pages/AboutUs";
import StockManagement from "@components/AdminPanel/StockManagment";
import TypesManager from "@components/AdminPanel/TypesManager";
import CharacteristicsTranslationsPage from "@components/AdminPanel/CharacteristicsTranslationsPage";
import ProductListPage from "@pages/ProductListPage";

export const publicRoutes = [
  { path: "*", Component: Home },
  { path: "product/:slug", Component: ProductPage },
  { path: "about-us", Component: AboutUsPage },
  {
    path: "products",
    Component: ProductListPage,
  },
];

export const userRoutes = [
  {
    path: "profile",
    Component: Profile,
  },
  {
    path: "checkout",
    Component: CheckOut,
  },
  {
    path: "orders",
    Component: Orders,
  },
  {
    path: "basket",
    Component: BasketPage,
  },
  {
    path: "order-success",
    Component: OrderSuccessPage,
  },
];

export const adminRoutes = [
  {
    path: "admin",
    Component: AdminPanel,
  },
  {
    path: "admin/add-product",
    Component: AddProduct,
  },
  {
    path: "admin/edit/:id",
    Component: EditProduct,
  },
  {
    path: "admin/orders",
    Component: AdminOrders,
  },
  {
    path: "admin/stock",
    Component: StockManagement,
  },
  {
    path: "admin/types",
    Component: TypesManager,
  },
  {
    path: "admin/characteristics-translations",
    Component: CharacteristicsTranslationsPage,
  },
];

import styles from "@styles/mobile-menu.module.scss";
import BasketIcon from "@assets/images/mage_bag-a.svg?react";
import OrderIcon from "@assets/images/mage_box-3d.svg?react";
import UserIcon from "@assets/images/mage_user.svg?react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { openAuthModal } from "@redux/slices/authModalSlice";
import { useGetBasketQuery } from "@redux/services";
import { useGetUserOrdersQuery } from "@redux/services/ordersApi";
import NotificationsMenu from "./UI/NotificationsMenu";

const MobileMenu: React.FC = () => {
  const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn);
  const user = useSelector((state: any) => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch basket data only if the user is logged in
  const { data: basket } = useGetBasketQuery(undefined, { skip: !isLoggedIn });
  // Fetch user orders only if the user is logged in
  const { data: orders } = useGetUserOrdersQuery(undefined, {
    skip: !isLoggedIn,
  });
  // Calculate total quantity of items in the basket
  const totalItems = basket
    ? basket.reduce((acc: number, item: any) => acc + item.quantity, 0)
    : 0;

  const handleClick = (action: () => void) => {
    if (!isLoggedIn) {
      dispatch(openAuthModal()); // Open authentication modal
    } else {
      action();
    }
  };

  return (
    <div className={styles.mobile_menu}>
      <ul className={styles.content}>
        <li>
          <NotificationsMenu />
          <b>Уведомления</b>
        </li>
        <li onClick={() => handleClick(() => navigate("/basket"))}>
          <div className={styles.icon}>
            {isLoggedIn && totalItems > 0 && (
              <span className={styles.itemCount}>{totalItems}</span>
            )}
            <BasketIcon />
          </div>
          <b>Корзина</b>
        </li>
        <li onClick={() => handleClick(() => navigate("/orders"))}>
          <div className={styles.icon}>
            <OrderIcon />
            {isLoggedIn && orders?.length > 0 && (
              <span className={styles.itemCount}>{orders.length}</span>
            )}
          </div>
          <b>Заказы</b>
        </li>

        <li
          onClick={() =>
            handleClick(() =>
              navigate(user?.role === "admin" ? "/admin" : "/profile")
            )
          }
        >
          <UserIcon />
          <b>Профиль</b>
        </li>
      </ul>
    </div>
  );
};

export default MobileMenu;

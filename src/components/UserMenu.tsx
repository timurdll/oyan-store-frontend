import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "@styles/user-menu.module.scss";
import BasketIcon from "@assets/images/mage_bag-a.svg?react";
import OrderIcon from "@assets/images/mage_box-3d.svg?react";
import UserIcon from "@assets/images/mage_user.svg?react";
import { useGetBasketQuery } from "@redux/services";
import { useGetUserOrdersQuery } from "@redux/services/ordersApi";
import { openAuthModal } from "@redux/slices/authModalSlice";
import NotificationsMenu from "./UI/NotificationsMenu";
import { useTranslation } from "react-i18next";

interface UserMenuProps {
  className?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ className }) => {
  const user = useSelector((state: any) => state.user.currentUser);
  const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn);
  const isAdmin = user?.role === "admin";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  // const { data: user, isLoading, isError } = useGetUserByIdQuery(userId);
  // bonuses: user.bonuses,
  // holdingBonuses: user.holdingBonuses,

  // Fetch basket data only if the user is logged in
  const {
    data: basket,
    isLoading: isBasketLoading,
    isError: isBasketError,
  } = useGetBasketQuery({}, { skip: !isLoggedIn });

  // Fetch user orders only if the user is logged in
  const {
    data: orders,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useGetUserOrdersQuery(undefined, { skip: !isLoggedIn });

  // Calculate total quantity of items in the basket
  const totalItems = basket
    ? basket.reduce((acc: number, item: any) => acc + item.quantity, 0)
    : 0;

  // Generic click handler for all actions
  const handleClick = (action: () => void) => {
    if (!isLoggedIn) {
      dispatch(openAuthModal()); // Open authentication modal
    } else {
      action();
    }
  };

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      dispatch(openAuthModal());
    } else {
      navigate(
        isAdmin ? `/${i18n.language}/admin` : `/${i18n.language}/profile`
      );
    }
  };

  return (
    <ul className={`${styles.menu} ${className || ""}`}>
      <li data-tooltip="Уведомления">
        <NotificationsMenu />
      </li>
      <li
        data-tooltip="Корзина"
        onClick={() => handleClick(() => navigate(`/${i18n.language}/basket`))}
      >
        <BasketIcon style={{ cursor: "pointer" }} />
        {/* Display basket item count */}
        {!isLoggedIn ? null : isBasketLoading ? (
          <span className={styles.loader}>...</span>
        ) : isBasketError ? (
          <span className={styles.error}>!</span>
        ) : (
          totalItems > 0 && (
            <span className={styles.itemCount}>{totalItems}</span>
          )
        )}
      </li>
      <li
        data-tooltip="Заказы"
        onClick={() => handleClick(() => navigate(`/${i18n.language}/orders`))}
      >
        <OrderIcon style={{ cursor: "pointer" }} />
        {/* Display orders count */}
        {!isLoggedIn ? null : isOrdersLoading ? (
          <span className={styles.loader}>...</span>
        ) : isOrdersError ? (
          <span className={styles.error}>!</span>
        ) : (
          orders?.length > 0 && (
            <span className={styles.itemCount}>{orders.length}</span>
          )
        )}
      </li>
      <li
        data-tooltip={isAdmin ? "Админ панель" : "Профиль"}
        onClick={handleProfileClick}
      >
        <UserIcon style={{ cursor: "pointer" }} />
      </li>
    </ul>
  );
};

export default UserMenu;

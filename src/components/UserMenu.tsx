import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "@styles/user-menu.module.scss";
import FavouriteIcon from "@assets/images/star.svg?react";
import BasketIcon from "@assets/images/cart.svg?react";
import OrderIcon from "@assets/images/box.svg?react";
import UserIcon from "@assets/images/user.svg?react";
import { useGetBasketQuery } from "@redux/services";
import { useGetUserOrdersQuery } from "@redux/services/ordersApi";
import { openAuthModal } from "@redux/slices/authModalSlice";

const UserMenu: React.FC = () => {
  const user = useSelector((state: any) => state.user.currentUser);
  const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { data: user, isLoading, isError } = useGetUserByIdQuery(userId);
  // bonuses: user.bonuses,
  // holdingBonuses: user.holdingBonuses,

  // Fetch basket data only if the user is logged in
  const {
    data: basket,
    isLoading: isBasketLoading,
    isError: isBasketError,
  } = useGetBasketQuery(undefined, { skip: !isLoggedIn });

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

  return (
    <ul className={styles.menu}>
      <li
        data-tooltip="Избранное"
        onClick={() => handleClick(() => navigate("/favorites"))}
      >
        <FavouriteIcon
          style={{ fill: "var(--text-color)", cursor: "pointer" }}
        />
      </li>
      <li
        data-tooltip="Корзина"
        onClick={() => handleClick(() => navigate("/basket"))}
      >
        <BasketIcon style={{ fill: "var(--text-color)", cursor: "pointer" }} />
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
        onClick={() => handleClick(() => navigate("/orders"))}
      >
        <OrderIcon style={{ fill: "var(--text-color)", cursor: "pointer" }} />
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
        data-tooltip="Профиль"
        onClick={() =>
          handleClick(() =>
            navigate(user?.role === "admin" ? "/admin" : "/profile")
          )
        }
      >
        <UserIcon style={{ fill: "var(--text-color)", cursor: "pointer" }} />
      </li>
    </ul>
  );
};

export default UserMenu;

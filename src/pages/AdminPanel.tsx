import styles from "@styles/admin-panel.module.scss";
import ProductList from "@components/Products";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@redux/slices/userSlice";
import { RootState } from "@redux/store";

const AdminPanel = () => {
  const [selectedType] = useState<number | null>(null);
  const { i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAdmin = useSelector(
    (state: RootState) => state.user.currentUser?.role === "admin"
  );

  // Используем либо параметр lang из URL, либо текущий язык из i18n
  const currentLang = lang || i18n.language;

  // Проверяем права доступа при монтировании компонента
  useEffect(() => {
    if (!isAdmin) {
      navigate(`/${currentLang}/`);
    }
  }, [isAdmin, navigate, currentLang]);

  const handleLogout = () => {
    // Очищаем состояние Redux
    dispatch(logout());
    // Перенаправляем на главную страницу
    navigate(`/${currentLang}/`);
  };

  // Если пользователь не админ, перенаправляем на главную
  if (!isAdmin) {
    return null;
  }

  return (
    <div className={styles.admin_panel}>
      <div className={styles.header}>
        <div className={styles.header_content}>
          <div>
            <h1>Панель администратора</h1>
            <p>Управляйте вашим магазином</p>
          </div>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Выйти
          </Button>
        </div>
      </div>

      <div className={styles.quick_actions}>
        <Link
          to={`/${currentLang}/admin/add-product`}
          className={styles.action_card}
        >
          <div className={styles.icon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={styles.content}>
            <h3>Добавить продукт</h3>
            <p>Создать новый товар в каталоге</p>
          </div>
        </Link>

        <Link
          to={`/${currentLang}/admin/orders`}
          className={styles.action_card}
        >
          <div className={styles.icon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={styles.content}>
            <h3>Управление заказами</h3>
            <p>Просмотр и обработка заказов</p>
          </div>
        </Link>

        <Link to={`/${currentLang}/admin/stock`} className={styles.action_card}>
          <div className={styles.icon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={styles.content}>
            <h3>Управление остатками</h3>
            <p>Контроль запасов товаров</p>
          </div>
        </Link>

        <Link to={`/${currentLang}/admin/types`} className={styles.action_card}>
          <div className={styles.icon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 21V7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V14C20 14.5304 19.7893 15.0391 19.4142 15.4142C19.0391 15.7893 18.5304 16 18 16H8L4 21Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={styles.content}>
            <h3>Управление типами</h3>
            <p>Типы товаров и переводы</p>
          </div>
        </Link>

        <Link
          to={`/${currentLang}/admin/characteristics-translations`}
          className={styles.action_card}
        >
          <div className={styles.icon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-3.4 2.98-5.02 0-1.29-.8-2.51-2.34-2.51-1.54 0-2.34 1.22-2.34 2.51l-1.34.01c0-1.18.36-2.28 1.02-3.08C9.04 3.64 10.06 3 11.34 3c1.28 0 2.3.64 3 1.44.66.8 1.02 1.9 1.02 3.08 0 2.22-1.46 4.01-3.37 6.15l1.52 1.5h2.84L17 15.07h-4.13zM21 17h-2l-2-2h-4l-2 2H9v2h12v-2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={styles.content}>
            <h3>Переводы характеристик</h3>
            <p>Управление переводами характеристик товаров</p>
          </div>
        </Link>
      </div>

      <div className={styles.products_section}>
        <div className={styles.section_header}>
          <h2>Товары</h2>
          <div className={styles.filters}>
            {/* Здесь можно добавить фильтры */}
          </div>
        </div>
        <ProductList selectedType={selectedType} />
      </div>
    </div>
  );
};

export default AdminPanel;

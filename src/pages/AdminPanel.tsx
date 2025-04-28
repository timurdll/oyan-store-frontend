import styles from "@styles/admin-panel.module.scss";
import ProductList from "@components/Products";
import { Link } from "react-router-dom";
import { useState } from "react";

const AdminPanel = () => {
  const [selectedType] = useState<number | null>(null);

  return (
    <div className={styles.admin_panel}>
      <div className={styles.header}>
        <h1>Панель администратора</h1>
        <p>Управляйте вашим магазином</p>
      </div>

      <div className={styles.quick_actions}>
        <Link to="/admin/add-product" className={styles.action_card}>
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

        <Link to="/admin/orders" className={styles.action_card}>
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

        <Link to="/admin/stock" className={styles.action_card}>
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

import styles from "@styles/admin-panel.module.scss";
import ProductList from "@components/Products";
import { Link } from "react-router-dom";
import { useState } from "react";

const AdminPanel = () => {
  const [selectedType] = useState<number | null>(null);

  return (
    <div className={styles.admin_panel}>
      {/* Pass selectedType to ProductList */}
      <ProductList selectedType={selectedType} />
      <Link to={"/admin/add-product"}>Добавить продукт</Link>
      <Link to={"/admin/orders"}>Управление заказами</Link>
      <Link to={"/admin/stock"}>Управление остатками</Link>
    </div>
  );
};

export default AdminPanel;

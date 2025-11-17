import React, { useState } from "react";
import styles from "@styles/stockManagement.module.scss";
import { useFetchProductsQuery, useUpdateStockMutation } from "@redux/services";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@components/UI/Alert";
import { useTranslation } from "react-i18next";

const StockManagement: React.FC = () => {
  const { i18n } = useTranslation();
  const { data, error, isLoading } = useFetchProductsQuery({
    language: i18n.language.toUpperCase(),
  });

  // API returns an object like { products: [...], pagination, minPrice, maxPrice }
  const products = data?.products ?? [];
  const [updateStock] = useUpdateStockMutation();
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [loadingProductId, setLoadingProductId] = useState<number | null>(null);

  const handleStockChange = async (id: number, stock: number) => {
    if (stock < 0) {
      setAlert({
        message: "Количество не может быть отрицательным",
        type: "error",
      });
      return;
    }

    setLoadingProductId(id);
    try {
      await updateStock({ id, stock }).unwrap();
      setAlert({ message: "Количество успешно обновлено", type: "success" });
    } catch (err) {
      console.error("Ошибка обновления количества:", err);
      setAlert({ message: "Не удалось обновить количество", type: "error" });
    } finally {
      setLoadingProductId(null);
    }
  };

  const closeAlert = () => setAlert(null);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Ошибка загрузки товаров</div>;
  }

  return (
    <div className={styles.container}>
      {alert && (
        <Alert message={alert.message} type={alert.type} onClose={closeAlert} />
      )}
      <h1>Управление количеством товаров</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Название</th>
            <th>Количество</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product: any) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.stock}</td>
              <td>
                <input
                  type="number"
                  defaultValue={product.stock}
                  onBlur={(e) =>
                    handleStockChange(product.id, parseInt(e.target.value, 10))
                  }
                  disabled={loadingProductId === product.id}
                />
                {loadingProductId === product.id && (
                  <CircularProgress size={20} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockManagement;

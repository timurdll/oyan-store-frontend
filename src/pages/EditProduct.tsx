import { useEffect, useState } from "react";
import {
  useFetchProductByIdQuery,
  useFetchTypeByIdQuery,
  useFetchCharacteristicByIdQuery,
} from "@redux/services";
import { useParams, useNavigate } from "react-router-dom";
import EditProductForm from "@components/AdminPanel/ProductEditForm";
import { useTranslation } from "react-i18next";
import styles from "@styles/product-edit-form.module.scss";
import { CircularProgress } from "@mui/material";

const EditProduct = () => {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productData, setProductData] = useState({
    product: null,
    type: null,
    availableCharacteristics: null,
  });

  const {
    data: product,
    isLoading: isProductLoading,
    error: productError,
  } = useFetchProductByIdQuery({ id, language: i18n.language.toUpperCase() });

  const {
    data: type,
    isLoading: isTypeLoading,
    error: typeError,
  } = useFetchTypeByIdQuery(
    { id: product?.typeId || 0, language: i18n.language.toUpperCase() },
    { skip: !product || !product.typeId }
  );

  const {
    data: availableCharacteristics,
    isLoading: isCharLoading,
    error: charError,
  } = useFetchCharacteristicByIdQuery(product?.typeId || 0, {
    skip: !product || !product.typeId,
  });

  useEffect(() => {
    if (isProductLoading || isTypeLoading || isCharLoading) {
      setLoading(true);
      return;
    }

    if (productError || typeError || charError) {
      const errorMessage =
        "Ошибка при загрузке данных. Пожалуйста, попробуйте позже.";
      setError(errorMessage);
      setLoading(false);
      return;
    }

    if (product && type && availableCharacteristics) {
      setProductData({
        product,
        type,
        availableCharacteristics,
      });
      setError(null);
      setLoading(false);
    }
  }, [
    product,
    isProductLoading,
    productError,
    type,
    isTypeLoading,
    typeError,
    availableCharacteristics,
    isCharLoading,
    charError,
  ]);

  if (loading) {
    return (
      <div className={styles.loadingSpinner}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>Ошибка</h3>
        <p>{error}</p>
        <button
          onClick={() => navigate(-1)}
          className={styles.submitButton}
          style={{ marginTop: "16px" }}
        >
          Вернуться назад
        </button>
      </div>
    );
  }

  if (!productData.product) {
    return (
      <div className={styles.errorContainer}>
        <h3>Продукт не найден</h3>
        <p>Запрашиваемый продукт не существует или был удален.</p>
        <button
          onClick={() => navigate(-1)}
          className={styles.submitButton}
          style={{ marginTop: "16px" }}
        >
          Вернуться назад
        </button>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.sectionTitle}>Редактирование продукта</h2>
      <EditProductForm
        product={productData.product}
        availableCharacteristics={productData.availableCharacteristics || []}
      />
    </div>
  );
};

export default EditProduct;

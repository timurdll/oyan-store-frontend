import { useEffect, useState } from "react";
import {
  useFetchProductByIdQuery,
  useFetchTypeByIdQuery,
  useFetchCharacteristicByIdQuery,
} from "@redux/services";
import { useParams } from "react-router-dom";
import EditProductForm from "@components/AdminPanel/ProductEditForm";
import { useTranslation } from "react-i18next";

const EditProduct = () => {
  const { id } = useParams();
  const { i18n } = useTranslation();

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
      setError("Ошибка при загрузке данных");
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
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!productData.product) {
    return <div>Продукт не найден</div>;
  }

  return (
    <div>
      <EditProductForm
        product={productData.product}
        availableCharacteristics={productData.availableCharacteristics || []} // Pass an empty array if null
      />
    </div>
  );
};

export default EditProduct;

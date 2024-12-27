import { useEffect, useState } from "react";
import {
  useFetchProductByIdQuery,
  useFetchTypeByIdQuery,
  useFetchCharacteristicByIdQuery,
} from "@redux/services";
import { useParams } from "react-router-dom";
import EditProductForm from "@components/AdminPanel/ProductEditForm";

const EditProduct = () => {
  const { id } = useParams();

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
  } = useFetchProductByIdQuery(id);

  const {
    data: type,
    isLoading: isTypeLoading,
    error: typeError,
  } = useFetchTypeByIdQuery(product?.typeId, { skip: !product });

  const {
    data: availableCharacteristics,
    isLoading: isCharLoading,
    error: charError,
  } = useFetchCharacteristicByIdQuery(product?.typeId, { skip: !product });

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

import { Formik, Form, Field, ErrorMessage } from "formik";
import ProductTypeSelector from "./ProductTypeSelector";
import DropzoneField from "../UI/DropzoneField";
import ProductInfoFields from "./ProductInfoFields";
import {
  useFetchTypesQuery,
  useAddProductMutation,
  useAddTypeMutation,
  useFetchCharacteristicByIdQuery,
} from "@redux/services";
import { useState } from "react";
import { ProductSchema } from "./ProductSchema";
import styles from "@styles/product-add-form.module.scss";
import CreatableFieldArray from "./CreatableFieldSelector";

interface CharacteristicForm {
  name: string;
  description: string;
}

const ProductAddForm = () => {
  const { data: types, isLoading, isError } = useFetchTypesQuery({});
  const [addProduct] = useAddProductMutation();
  const [addType] = useAddTypeMutation();
  const [newTypeName, setNewTypeName] = useState("");
  const [isAddingType, setIsAddingType] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const { data: characteristics } = useFetchCharacteristicByIdQuery(
    selectedTypeId || "",
    { skip: !selectedTypeId }
  );

  const formattedCharacteristics =
    characteristics?.map((char: string) => ({ value: char, label: char })) ||
    [];

  const handleTypeChange = (typeId: string) => {
    setSelectedTypeId(typeId);
  };

  if (isLoading) return <div>Loading product types...</div>;
  if (isError) return <div>Error fetching product types.</div>;

  return (
    <Formik
      initialValues={{
        name: "",
        price: "",
        typeId: "",
        stock: "", // Добавлено поле stock
        coverImage: null,
        images: [],
        productInfo: { title: "", description: "" },
        characteristics: [
          { name: "", description: "" },
        ] as CharacteristicForm[],
      }}
      validationSchema={ProductSchema}
      onSubmit={async (values, { resetForm }) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("price", values.price.toString());
        formData.append("typeId", values.typeId);

        // Преобразование stock в число перед отправкой
        formData.append("stock", values.stock);

        // Append cover image
        if (values.coverImage) {
          formData.append("cover_image", values.coverImage as Blob);
        }

        // Append additional images
        values.images.forEach((img) => formData.append("images", img));

        // Append product info (title and description)
        if (values.productInfo) {
          formData.append("productInfo[title]", values.productInfo.title);
          formData.append(
            "productInfo[description]",
            values.productInfo.description
          );
        }

        // Append characteristics
        values.characteristics.forEach((char, index) => {
          formData.append(`characteristics[${index}][name]`, char.name);
          formData.append(
            `characteristics[${index}][description]`,
            char.description
          );
        });
        console.log(values);

        try {
          // Call the addProduct mutation with formData
          await addProduct(formData).unwrap();
          alert("Товар успешно добавлен!");
          resetForm();
        } catch (error) {
          console.error("Ошибка при добавлении продукта:", error);
        }
      }}
    >
      {({ setFieldValue }) => (
        <Form className={styles.formContainer}>
          <div className={styles.field}>
            <label htmlFor="name">Название продукта</label>
            <Field name="name" type="text" />
            <ErrorMessage
              name="name"
              component="div"
              className={styles.errorMessage}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="price">Цена</label>
            <Field name="price" type="number" />
            <ErrorMessage
              name="price"
              component="div"
              className={styles.errorMessage}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="stock">Количество на складе</label>
            <Field name="stock" type="number" />
            <ErrorMessage
              name="stock"
              component="div"
              className={styles.errorMessage}
            />
          </div>

          <ProductTypeSelector
            types={types}
            isAddingType={isAddingType}
            setIsAddingType={setIsAddingType}
            newTypeName={newTypeName}
            setNewTypeName={setNewTypeName}
            handleAddType={async () => {
              try {
                await addType({ name: newTypeName }).unwrap();
                setNewTypeName("");
                setIsAddingType(false);
              } catch {
                alert("Ошибка при добавлении типа");
              }
            }}
            setFieldValue={setFieldValue}
            onTypeChange={handleTypeChange}
          />

          <div className={styles.dropzone}>
            <div>
              <span>Обложка продукта</span>
              <DropzoneField
                fieldName="coverImage"
                setFieldValue={setFieldValue}
              />
            </div>
            <div>
              <span>Дополнительные изображения (3)</span>
              <DropzoneField
                fieldName="images"
                setFieldValue={setFieldValue}
                multiple
              />
            </div>
          </div>
          <ProductInfoFields />
          <CreatableFieldArray
            availableCharacteristics={formattedCharacteristics}
          />

          <button type="submit" className={styles.submitButton}>
            Добавить продукт
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ProductAddForm;

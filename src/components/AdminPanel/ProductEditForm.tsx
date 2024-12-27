import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "@styles/product-edit-form.module.scss";
import { useUpdateProductMutation } from "@redux/services";
import CreatableFieldArray from "./CreatableFieldSelector";
import { Product } from "types/types";

interface CharacteristicForm {
  name: string;
  description: string;
}

interface EditProductFormProps {
  product: Product;
  availableCharacteristics: CharacteristicForm[];
}

const EditProductForm: React.FC<EditProductFormProps> = ({
  product,
  availableCharacteristics,
}) => {
  const [updateProduct] = useUpdateProductMutation();

  const validationSchema = Yup.object({
    name: Yup.string().required("Название обязательно"),
    price: Yup.number().required("Цена обязательна"),
    productInfo: Yup.object({
      title: Yup.string().required("Заголовок обязателен"),
      description: Yup.string().required("Описание обязательно"),
    }),
    characteristics: Yup.array().of(
      Yup.object({
        name: Yup.string().required("Название характеристики обязательно"),
        description: Yup.string().required("Описание обязательно"),
      })
    ),
  });

  const initialCharacteristics = product.productCharacteristics.map((char) => ({
    name: char.characteristic?.name || "",
    description: char.description || "",
  }));

  return (
    <Formik
      initialValues={{
        name: product.name || "",
        price: product.price || 0,
        typeId: product.typeId || 0,
        productInfo: {
          title: product.productInfo?.title || "",
          description: product.productInfo?.description || "",
        },
        characteristics: initialCharacteristics,
      }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("price", values.price.toString());
        formData.append("typeId", values.typeId.toString());

        formData.append("productInfo[title]", values.productInfo.title);
        formData.append(
          "productInfo[description]",
          values.productInfo.description
        );

        values.characteristics.forEach((char, index) => {
          formData.append(`characteristics[${index}][name]`, char.name);
          formData.append(
            `characteristics[${index}][description]`,
            char.description
          );
        });

        try {
          await updateProduct({ id: product.id, formData }).unwrap();
          alert("Продукт успешно обновлен!");
        } catch (error) {
          console.error("Ошибка при обновлении продукта:", error);
        }
      }}
    >
      {() => (
        <Form className={styles.formContainer}>
          <div className={styles.field}>
            <label htmlFor="name">Название</label>
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

          <div className={styles.productInfo}>
            <label htmlFor="productInfo.title">Заголовок</label>
            <Field name="productInfo.title" type="text" />
            <ErrorMessage
              name="productInfo.title"
              component="div"
              className={styles.errorMessage}
            />
            <label htmlFor="productInfo.description">Описание</label>
            <Field name="productInfo.description" as="textarea" />
            <ErrorMessage
              name="productInfo.description"
              component="div"
              className={styles.errorMessage}
            />
          </div>

          <CreatableFieldArray
            availableCharacteristics={availableCharacteristics.map((char) => ({
              value: char.name,
              label: char.name,
            }))}
          />

          <button type="submit" className={styles.submitButton}>
            Обновить продукт
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default EditProductForm;

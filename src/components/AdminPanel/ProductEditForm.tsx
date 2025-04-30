import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "@styles/product-edit-form.module.scss";
import { useUpdateProductMutation } from "@redux/services";
import CreatableFieldArray from "./CreatableFieldSelector";
import { Product } from "types/types";
import Dropzone from "react-dropzone";
import ProductTranslationManager from "./ProductTranslationManager";
import { Box } from "@mui/material";

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
    // Marketplace ссылки не обязательны, но можно добавить проверку URL если нужно
    halyqLink: Yup.string(),
    kaspiLink: Yup.string(),
    satuLink: Yup.string(),
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
        cover_image: null,
        images: [],
        // Новые поля для маркетплейс ссылок
        halyqLink: product.halyqLink || "",
        kaspiLink: product.kaspiLink || "",
        satuLink: product.satuLink || "",
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

        // Добавляем новые поля, если они заполнены
        if (values.halyqLink) {
          formData.append("halyqLink", values.halyqLink);
        }
        if (values.kaspiLink) {
          formData.append("kaspiLink", values.kaspiLink);
        }
        if (values.satuLink) {
          formData.append("satuLink", values.satuLink);
        }

        if (values.cover_image) {
          formData.append("cover_image", values.cover_image);
        }

        if (values.images.length > 0) {
          values.images.forEach((file) => {
            formData.append("images", file);
          });
        }

        try {
          await updateProduct({ id: product.id, formData }).unwrap();
          alert("Продукт успешно обновлен!");
        } catch (error) {
          console.error("Ошибка при обновлении продукта:", error);
        }
      }}
    >
      {({ setFieldValue }) => (
        <Form className={styles.formContainer}>
          <div className={styles.field}>
            <label htmlFor="name">Название</label>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Field
                name="name"
                type="text"
                className={styles.fieldWithAction}
              />
              <ProductTranslationManager
                productId={product.id}
                productName={product.name}
                productInfo={
                  product.productInfo
                    ? {
                        id: product.productInfo.id,
                        title: product.productInfo.title,
                        description: product.productInfo.description,
                      }
                    : undefined
                }
              />
            </Box>
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

          {/* Новые поля для ссылок на маркетплейсы */}
          <div className={styles.field}>
            <label htmlFor="halyqLink">Ссылка на Халык</label>
            <Field name="halyqLink" type="text" placeholder="https://..." />
            <ErrorMessage
              name="halyqLink"
              component="div"
              className={styles.errorMessage}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="kaspiLink">Ссылка на Каспи</label>
            <Field name="kaspiLink" type="text" placeholder="https://..." />
            <ErrorMessage
              name="kaspiLink"
              component="div"
              className={styles.errorMessage}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="satuLink">Ссылка на Сату</label>
            <Field name="satuLink" type="text" placeholder="https://..." />
            <ErrorMessage
              name="satuLink"
              component="div"
              className={styles.errorMessage}
            />
          </div>

          <div className={styles.uploadSection}>
            <label>Обложка продукта</label>
            <Dropzone
              onDrop={(acceptedFiles) =>
                setFieldValue("cover_image", acceptedFiles[0])
              }
            >
              {({ getRootProps, getInputProps }) => (
                <div className={styles.dropzone} {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Перетащите файл или нажмите для выбора</p>
                </div>
              )}
            </Dropzone>
          </div>

          <div className={styles.uploadSection}>
            <label>Изображения продукта</label>
            <Dropzone
              onDrop={(acceptedFiles) => setFieldValue("images", acceptedFiles)}
              multiple
            >
              {({ getRootProps, getInputProps }) => (
                <div className={styles.dropzone} {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Перетащите файлы или нажмите для выбора</p>
                </div>
              )}
            </Dropzone>
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

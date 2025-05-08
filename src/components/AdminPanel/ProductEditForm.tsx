import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "@styles/product-edit-form.module.scss";
import { useUpdateProductMutation } from "@redux/services";
import CreatableFieldArray from "./CreatableFieldSelector";
import { Product } from "types/types";
import Dropzone from "react-dropzone";
import ProductTranslationManager from "./ProductTranslationManager";
import { Box, CircularProgress, Snackbar, Alert } from "@mui/material";
import { useState } from "react";

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
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const validationSchema = Yup.object({
    name: Yup.string().required("Название обязательно"),
    price: Yup.number()
      .required("Цена обязательна")
      .min(0, "Цена не может быть отрицательной"),
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
    halyqLink: Yup.string().url("Введите корректный URL"),
    kaspiLink: Yup.string().url("Введите корректный URL"),
    satuLink: Yup.string().url("Введите корректный URL"),
  });

  const initialCharacteristics = product.productCharacteristics.map((char) => ({
    name: char.characteristic?.name || "",
    description: char.description || "",
  }));

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const getErrorMessage = (error: any): string => {
    if (error?.data?.message) {
      return error.data.message;
    }
    if (error?.data?.error) {
      return error.data.error;
    }
    if (error?.message) {
      return error.message;
    }
    return "Произошла ошибка при обновлении продукта. Пожалуйста, попробуйте позже.";
  };

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
        halyqLink: product.halyqLink || "",
        kaspiLink: product.kaspiLink || "",
        satuLink: product.satuLink || "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          const formData = new FormData();

          // Добавляем основные поля
          formData.append("name", values.name);
          formData.append("price", values.price.toString());
          formData.append("typeId", values.typeId.toString());

          // Добавляем информацию о продукте
          if (values.productInfo) {
            formData.append("productInfo[title]", values.productInfo.title);
            formData.append(
              "productInfo[description]",
              values.productInfo.description
            );
          }

          // Добавляем характеристики
          if (values.characteristics && values.characteristics.length > 0) {
            values.characteristics.forEach((char, index) => {
              formData.append(`characteristics[${index}][name]`, char.name);
              formData.append(
                `characteristics[${index}][description]`,
                char.description
              );
            });
          }

          // Добавляем ссылки на маркетплейсы
          if (values.halyqLink) {
            formData.append("halyqLink", values.halyqLink);
          }
          if (values.kaspiLink) {
            formData.append("kaspiLink", values.kaspiLink);
          }
          if (values.satuLink) {
            formData.append("satuLink", values.satuLink);
          }

          // Добавляем изображения
          if (values.cover_image) {
            formData.append("cover_image", values.cover_image);
          }

          if (values.images && values.images.length > 0) {
            values.images.forEach((file) => {
              formData.append("images", file);
            });
          }

          // Проверяем наличие ID продукта
          if (!product.id) {
            throw new Error("ID продукта не найден");
          }

          const response = await updateProduct({
            id: product.id,
            formData,
          }).unwrap();

          setNotification({
            open: true,
            message: "Продукт успешно обновлен!",
            severity: "success",
          });
        } catch (error: any) {
          console.error("Ошибка при обновлении продукта:", error);

          // Обработка ошибок валидации
          if (error?.data?.errors) {
            const validationErrors = error.data.errors;
            setErrors(validationErrors);
            setNotification({
              open: true,
              message: "Пожалуйста, исправьте ошибки в форме",
              severity: "error",
            });
          } else {
            setNotification({
              open: true,
              message: getErrorMessage(error),
              severity: "error",
            });
          }
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ setFieldValue, isSubmitting, errors, touched }) => (
        <Form className={styles.formContainer}>
          <div className={styles.field}>
            <label htmlFor="name">Название</label>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Field
                name="name"
                type="text"
                className={styles.fieldWithAction}
                placeholder="Введите название продукта"
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
            <Field
              name="price"
              type="number"
              placeholder="Введите цену продукта"
            />
            <ErrorMessage
              name="price"
              component="div"
              className={styles.errorMessage}
            />
          </div>

          <div className={styles.productInfo}>
            <h3 className={styles.sectionTitle}>Информация о продукте</h3>
            <div className={styles.field}>
              <label htmlFor="productInfo.title">Заголовок</label>
              <Field
                name="productInfo.title"
                type="text"
                placeholder="Введите заголовок"
              />
              <ErrorMessage
                name="productInfo.title"
                component="div"
                className={styles.errorMessage}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="productInfo.description">Описание</label>
              <Field
                name="productInfo.description"
                as="textarea"
                placeholder="Введите описание продукта"
              />
              <ErrorMessage
                name="productInfo.description"
                component="div"
                className={styles.errorMessage}
              />
            </div>
          </div>

          <div className={styles.marketplaceLinks}>
            <h3 className={styles.sectionTitle}>Ссылки на маркетплейсы</h3>
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
          </div>

          <div className={styles.uploadSection}>
            <h3 className={styles.sectionTitle}>Изображения</h3>
            <div className={styles.field}>
              <label>Обложка продукта</label>
              <Dropzone
                onDrop={(acceptedFiles) =>
                  setFieldValue("cover_image", acceptedFiles[0])
                }
                accept={{
                  "image/*": [".jpeg", ".jpg", ".png", ".webp"],
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className={styles.dropzone} {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Перетащите файл или нажмите для выбора</p>
                  </div>
                )}
              </Dropzone>
            </div>

            <div className={styles.field}>
              <label>Дополнительные изображения</label>
              <Dropzone
                onDrop={(acceptedFiles) =>
                  setFieldValue("images", acceptedFiles)
                }
                multiple
                accept={{
                  "image/*": [".jpeg", ".jpg", ".png", ".webp"],
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className={styles.dropzone} {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Перетащите файлы или нажмите для выбора</p>
                  </div>
                )}
              </Dropzone>
            </div>
          </div>

          <CreatableFieldArray
            availableCharacteristics={availableCharacteristics.map((char) => ({
              value: char.name,
              label: char.name,
            }))}
          />

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Обновить продукт"
            )}
          </button>

          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={handleCloseNotification}
              severity={notification.severity}
              sx={{ width: "100%" }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </Form>
      )}
    </Formik>
  );
};

export default EditProductForm;

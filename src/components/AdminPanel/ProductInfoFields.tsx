import { Field, ErrorMessage } from "formik";
import styles from "@styles/product-info.module.scss";

const ProductInfoFields = () => (
  <div className={styles.infoContainer}>
    <h3 className={styles.heading}>Информация о продукте</h3>

    <div className={styles.fieldGroup}>
      <label htmlFor="productInfo.title" className={styles.label}>
        Заголовок
      </label>
      <Field
        name="productInfo.title"
        type="text"
        className={styles.input}
        placeholder="Введите заголовок"
      />
      <ErrorMessage
        name="productInfo.title"
        component="div"
        className={styles.errorMessage}
      />
    </div>

    <div className={styles.fieldGroup}>
      <label htmlFor="productInfo.description" className={styles.label}>
        Описание
      </label>
      <Field
        as="textarea"
        name="productInfo.description"
        className={`${styles.input} ${styles.textarea}`}
        placeholder="Введите описание"
      />
      <ErrorMessage
        name="productInfo.description"
        component="div"
        className={styles.errorMessage}
      />
    </div>
  </div>
);

export default ProductInfoFields;

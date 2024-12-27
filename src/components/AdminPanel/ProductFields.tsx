import { Field, ErrorMessage } from "formik";
import styles from "@styles/product-edit-form.module.scss";

const ProductFields = () => (
  <>
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
  </>
);

export default ProductFields;

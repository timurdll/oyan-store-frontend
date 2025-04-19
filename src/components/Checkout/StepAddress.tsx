import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "@styles/steps.module.scss";
import Button from "@components/UI/Button";

interface StepAddressProps {
  initialValues: {
    city: string;
    street: string;
    houseNumber: string;
    entrance: string;
    apartment: string;
  };
  onSubmit: (values: {
    city: string;
    street: string;
    houseNumber: string;
    entrance: string;
    apartment: string;
  }) => void;
  nextStep: () => void;
  completed: boolean;
}

const StepAddress: React.FC<StepAddressProps> = ({
  initialValues,
  completed,
  onSubmit,
  nextStep,
}) => {
  const validationSchema = Yup.object({
    city: Yup.string().required("Город обязателен для заполнения"),
    street: Yup.string().required("Улица обязательна для заполнения"),
    houseNumber: Yup.string().required("Дом обязателен для заполнения"),
    entrance: Yup.string(),
    apartment: Yup.string(),
  });

  const handleFormSubmit = (values: {
    city: string;
    street: string;
    houseNumber: string;
    entrance: string;
    apartment: string;
  }) => {
    onSubmit(values);
    nextStep();
  };

  return (
    <div className={styles.step}>
      <div className={styles.info}>
        <span className={styles.number}>2</span>
        <span className={styles.text}>Ваш адрес:</span>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {() => (
          <Form className={styles.inputs}>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label htmlFor="city">Город:</label>
                <Field type="text" id="city" name="city" />
                <ErrorMessage
                  name="city"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div className={styles.fieldGroup}>
                <div className={styles.field}>
                  <label htmlFor="street">Улица:</label>
                  <Field type="text" id="street" name="street" />
                  <ErrorMessage
                    name="street"
                    component="div"
                    className={styles.error}
                  />
                </div>
                <div className={`${styles.field} ${styles.field_house}`}>
                  <label htmlFor="houseNumber">Дом:</label>
                  <Field type="text" id="houseNumber" name="houseNumber" />
                  <ErrorMessage
                    name="houseNumber"
                    component="div"
                    className={styles.error}
                  />
                </div>
                <div className={`${styles.field} ${styles.field_entrance}`}>
                  <label htmlFor="entrance">Подъезд:</label>
                  <Field type="text" id="entrance" name="entrance" />
                  <ErrorMessage
                    name="entrance"
                    component="div"
                    className={styles.error}
                  />
                </div>
                <div className={`${styles.field} ${styles.field_apartment}`}>
                  <label htmlFor="apartment">Квартира:</label>
                  <Field type="text" id="apartment" name="apartment" />
                  <ErrorMessage
                    name="apartment"
                    component="div"
                    className={styles.error}
                  />
                </div>
              </div>
            </div>
            {!completed && (
              <div className={styles.button}>
                <Button label="Далее" variant="primaryLarge" type="submit" />
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StepAddress;

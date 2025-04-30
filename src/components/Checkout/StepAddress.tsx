import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "@styles/steps.module.scss";
import Button from "@components/UI/Button";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    city: Yup.string().required(
      t("checkout.steps.address.validation.cityRequired")
    ),
    street: Yup.string().required(
      t("checkout.steps.address.validation.streetRequired")
    ),
    houseNumber: Yup.string().required(
      t("checkout.steps.address.validation.houseRequired")
    ),
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
        <span className={styles.text}>
          {t("checkout.steps.address.title")}:
        </span>
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
                <label htmlFor="city">
                  {t("checkout.steps.address.city")}:
                </label>
                <Field type="text" id="city" name="city" />
                <ErrorMessage
                  name="city"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div className={styles.fieldGroup}>
                <div className={styles.field}>
                  <label htmlFor="street">
                    {t("checkout.steps.address.street")}:
                  </label>
                  <Field type="text" id="street" name="street" />
                  <ErrorMessage
                    name="street"
                    component="div"
                    className={styles.error}
                  />
                </div>
                <div className={`${styles.field} ${styles.field_house}`}>
                  <label htmlFor="houseNumber">
                    {t("checkout.steps.address.house")}:
                  </label>
                  <Field type="text" id="houseNumber" name="houseNumber" />
                  <ErrorMessage
                    name="houseNumber"
                    component="div"
                    className={styles.error}
                  />
                </div>
                <div className={`${styles.field} ${styles.field_entrance}`}>
                  <label htmlFor="entrance">
                    {t("checkout.steps.address.entrance")}:
                  </label>
                  <Field type="text" id="entrance" name="entrance" />
                  <ErrorMessage
                    name="entrance"
                    component="div"
                    className={styles.error}
                  />
                </div>
                <div className={`${styles.field} ${styles.field_apartment}`}>
                  <label htmlFor="apartment">
                    {t("checkout.steps.address.apartment")}:
                  </label>
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
                <Button
                  label={t("checkout.steps.address.next")}
                  variant="primaryLarge"
                  type="submit"
                />
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StepAddress;

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "@styles/steps.module.scss";
import Button from "@components/UI/Button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

interface StepPaymentProps {
  initialValues: {
    paymentMethod: string;
  };
  onSubmit: (data: any) => void;
  completed: boolean;
  isLoading?: boolean;
}

const StepPayment: React.FC<StepPaymentProps> = ({
  initialValues,
  completed,
  onSubmit,
  isLoading = false,
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    paymentMethod: Yup.string().required(
      t("checkout.steps.payment.validation.methodRequired")
    ),
  });

  const handleFormSubmit = async (values: { paymentMethod: string }) => {
    try {
      await onSubmit(values);
      navigate(`/${i18n.language}/order-success`);
    } catch (error) {
      console.error("Error during payment:", error);
    }
  };

  return (
    <div className={styles.step}>
      <div className={styles.info}>
        <span className={styles.number}>3</span>
        <span className={styles.text}>
          {t("checkout.steps.payment.title")}:
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
                <label>{t("checkout.steps.payment.selectMethod")}:</label>
                <div className={styles.radioGroup}>
                  <label>
                    <Field
                      type="radio"
                      name="paymentMethod"
                      value="kaspi"
                      className={styles.radio}
                    />
                    {t("checkout.steps.payment.methods.kaspi")}
                  </label>
                </div>
                <ErrorMessage
                  name="paymentMethod"
                  component="div"
                  className={styles.error}
                />
              </div>
            </div>
            {!completed && (
              <div className={styles.button}>
                <Button
                  label={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      t("checkout.steps.payment.submit")
                    )
                  }
                  variant="primaryLarge"
                  type="submit"
                  disabled={isLoading}
                />
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StepPayment;

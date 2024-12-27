import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "@styles/steps.module.scss";
import Button from "@components/UI/Button";
import { formatPhoneNumber } from "@components/Functions/phoneUtils"; // Импорт функции форматирования

interface StepUserDataProps {
  initialValues: {
    phoneNumber: string;
    fullName: string;
    email: string;
  };
  onSubmit: (values: {
    phoneNumber: string;
    fullName: string;
    email: string;
  }) => void;
  nextStep: () => void;
  completed: boolean;
}

const StepUserData: React.FC<StepUserDataProps> = ({
  initialValues,
  onSubmit,
  nextStep,
  completed,
}) => {
  const validationSchema = Yup.object({
    phoneNumber: Yup.string()
      .matches(
        /^(\+7\s\d{3}\s\d{3}-\d{2}-\d{2})$/,
        "Введите корректный номер телефона (+7 XXX XXX-XX-XX)"
      )
      .required("Обязательное поле"),
    fullName: Yup.string()
      .min(3, "Минимальная длина 3 символа")
      .required("Обязательное поле"),
    email: Yup.string()
      .email("Введите корректный email")
      .required("Обязательное поле"),
  });

  const handleFormSubmit = (values: {
    phoneNumber: string;
    fullName: string;
    email: string;
  }) => {
    onSubmit(values);
    nextStep();
  };

  return (
    <div className={styles.step}>
      <div className={styles.info}>
        <span className={styles.number}>1</span>
        <span className={styles.text}>Ваши данные:</span>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className={styles.inputs}>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label htmlFor="phoneNumber">Ваш номер телефона:</label>
                <Field
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={values.phoneNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue(
                      "phoneNumber",
                      formatPhoneNumber(e.target.value)
                    )
                  }
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="fullName">ФИО:</label>
                <Field type="text" id="fullName" name="fullName" />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">Электронная почта:</label>
                <Field type="email" id="email" name="email" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={styles.error}
                />
              </div>
            </div>
            {!completed && (
              <div className={styles.button}>
                <Button type="submit" label="Далее" variant="filled" />
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StepUserData;

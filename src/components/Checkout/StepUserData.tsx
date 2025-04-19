import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "@styles/steps.module.scss";
import Button from "@components/UI/Button";
import { formatPhoneNumber } from "@components/Functions/phoneUtils";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { jwtDecode } from "jwt-decode";
import { useGetUserByIdQuery } from "@redux/services/userApi";

interface StepUserDataProps {
  initialValues: {
    phoneNumber: string;
    fullName: string;
    email: string;
    companyName?: string;
    bin?: string;
    companyAddress?: string;
    companyPhone?: string;
    postalCode?: string;
    iik?: string;
    bik?: string;
    bankName?: string;
  };
  onSubmit: (values: {
    phoneNumber: string;
    fullName: string;
    email: string;
    companyName?: string;
    bin?: string;
    companyAddress?: string;
    companyPhone?: string;
    postalCode?: string;
    iik?: string;
    bik?: string;
    bankName?: string;
  }) => void;
  nextStep: () => void;
  completed: boolean;
  isLegalEntity: boolean;
}

const StepUserData: React.FC<StepUserDataProps> = ({
  onSubmit,
  nextStep,
  completed,
  isLegalEntity,
}) => {
  const { token } = useSelector((state: RootState) => state.user);
  const decoded = token ? jwtDecode<{ userId: string }>(token) : null;
  const userId = decoded?.userId || null;

  const { data: userData, isLoading } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });

  const initialValues = {
    phoneNumber: userData?.phoneNumber || "",
    fullName: `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim(),
    email: userData?.email || "",
    companyName: "",
    bin: "",
    companyAddress: "",
    companyPhone: "",
    postalCode: "",
    iik: "",
    bik: "",
    bankName: "",
  };

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
    ...(isLegalEntity && {
      companyName: Yup.string().required("Название компании обязательно"),
      bin: Yup.string()
        .matches(/^\d{12}$/, "БИН должен содержать 12 цифр")
        .required("БИН обязателен"),
      companyAddress: Yup.string().required("Юридический адрес обязателен"),
      companyPhone: Yup.string().matches(
        /^(\+7\s\d{3}\s\d{3}-\d{2}-\d{2})$/,
        "Введите корректный номер телефона (+7 XXX XXX-XX-XX)"
      ),
      postalCode: Yup.string().matches(
        /^\d{6}$/,
        "Почтовый индекс должен содержать 6 цифр"
      ),
      iik: Yup.string()
        .matches(/^[A-Z]{2}\d{20}$/, "ИИК должен содержать 2 буквы и 20 цифр")
        .required("ИИК обязателен"),
      bik: Yup.string()
        .matches(/^[A-Z]{5}[A-Z0-9]{3}$/, "БИК должен содержать 8 символов")
        .required("БИК обязателен"),
      bankName: Yup.string().required("Название банка обязательно"),
    }),
  });

  const handleFormSubmit = (values: {
    phoneNumber: string;
    fullName: string;
    email: string;
    companyName?: string;
    bin?: string;
    companyAddress?: string;
    companyPhone?: string;
    postalCode?: string;
    iik?: string;
    bik?: string;
    bankName?: string;
  }) => {
    onSubmit(values);
    nextStep();
  };

  if (isLoading) {
    return <div>Загрузка данных...</div>;
  }

  return (
    <div className={styles.step}>
      <div className={styles.info}>
        <span className={styles.number}>1</span>
        <span className={styles.text}>Ваши данные:</span>
      </div>
      <Formik
        initialValues={initialValues}
        enableReinitialize
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

              {isLegalEntity && (
                <div className={styles.legalFields}>
                  <div className={styles.field}>
                    <label htmlFor="companyName">Название компании:</label>
                    <Field type="text" id="companyName" name="companyName" />
                    <ErrorMessage
                      name="companyName"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="bin">БИН:</label>
                    <Field type="text" id="bin" name="bin" />
                    <ErrorMessage
                      name="bin"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="companyAddress">Юридический адрес:</label>
                    <Field
                      type="text"
                      id="companyAddress"
                      name="companyAddress"
                    />
                    <ErrorMessage
                      name="companyAddress"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="companyPhone">Телефон компании:</label>
                    <Field
                      type="text"
                      id="companyPhone"
                      name="companyPhone"
                      value={values.companyPhone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFieldValue(
                          "companyPhone",
                          formatPhoneNumber(e.target.value)
                        )
                      }
                    />
                    <ErrorMessage
                      name="companyPhone"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="postalCode">Почтовый индекс:</label>
                    <Field type="text" id="postalCode" name="postalCode" />
                    <ErrorMessage
                      name="postalCode"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="iik">ИИК:</label>
                    <Field type="text" id="iik" name="iik" />
                    <ErrorMessage
                      name="iik"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="bik">БИК:</label>
                    <Field type="text" id="bik" name="bik" />
                    <ErrorMessage
                      name="bik"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="bankName">Название банка:</label>
                    <Field type="text" id="bankName" name="bankName" />
                    <ErrorMessage
                      name="bankName"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                </div>
              )}
            </div>
            {!completed && (
              <div className={styles.button}>
                <Button type="submit" label="Далее" variant="primaryLarge" />
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StepUserData;

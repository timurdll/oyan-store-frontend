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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
        t("checkout.steps.userData.validation.phoneFormat")
      )
      .required(t("checkout.steps.userData.validation.required")),
    fullName: Yup.string()
      .min(3, t("checkout.steps.userData.validation.minLength"))
      .required(t("checkout.steps.userData.validation.required")),
    email: Yup.string()
      .email(t("checkout.steps.userData.validation.email"))
      .required(t("checkout.steps.userData.validation.required")),
    ...(isLegalEntity && {
      companyName: Yup.string().required(
        t("checkout.steps.userData.validation.required")
      ),
      bin: Yup.string()
        .matches(/^\d{12}$/, t("checkout.steps.userData.validation.bin"))
        .required(t("checkout.steps.userData.validation.required")),
      companyAddress: Yup.string().required(
        t("checkout.steps.userData.validation.required")
      ),
      companyPhone: Yup.string().matches(
        /^(\+7\s\d{3}\s\d{3}-\d{2}-\d{2})$/,
        t("checkout.steps.userData.validation.phoneFormat")
      ),
      postalCode: Yup.string().matches(
        /^\d{6}$/,
        t("checkout.steps.userData.validation.postalCode")
      ),
      iik: Yup.string()
        .matches(
          /^[A-Z]{2}\d{20}$/,
          t("checkout.steps.userData.validation.iik")
        )
        .required(t("checkout.steps.userData.validation.required")),
      bik: Yup.string()
        .matches(
          /^[A-Z]{5}[A-Z0-9]{3}$/,
          t("checkout.steps.userData.validation.bik")
        )
        .required(t("checkout.steps.userData.validation.required")),
      bankName: Yup.string().required(
        t("checkout.steps.userData.validation.required")
      ),
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
    return <div>{t("checkout.steps.userData.loading")}</div>;
  }

  return (
    <div className={styles.step}>
      <div className={styles.info}>
        <span className={styles.number}>1</span>
        <span className={styles.text}>
          {t("checkout.steps.userData.title")}:
        </span>
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
                <label htmlFor="phoneNumber">
                  {t("checkout.steps.userData.phoneNumber")}:
                </label>
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
                <label htmlFor="fullName">
                  {t("checkout.steps.userData.fullName")}:
                </label>
                <Field type="text" id="fullName" name="fullName" />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">
                  {t("checkout.steps.userData.email")}:
                </label>
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
                    <label htmlFor="companyName">
                      {t("checkout.steps.userData.legal.companyName")}:
                    </label>
                    <Field type="text" id="companyName" name="companyName" />
                    <ErrorMessage
                      name="companyName"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="bin">
                      {t("checkout.steps.userData.legal.bin")}:
                    </label>
                    <Field type="text" id="bin" name="bin" />
                    <ErrorMessage
                      name="bin"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="companyAddress">
                      {t("checkout.steps.userData.legal.companyAddress")}:
                    </label>
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
                    <label htmlFor="companyPhone">
                      {t("checkout.steps.userData.legal.companyPhone")}:
                    </label>
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
                    <label htmlFor="postalCode">
                      {t("checkout.steps.userData.legal.postalCode")}:
                    </label>
                    <Field type="text" id="postalCode" name="postalCode" />
                    <ErrorMessage
                      name="postalCode"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="iik">
                      {t("checkout.steps.userData.legal.iik")}:
                    </label>
                    <Field type="text" id="iik" name="iik" />
                    <ErrorMessage
                      name="iik"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="bik">
                      {t("checkout.steps.userData.legal.bik")}:
                    </label>
                    <Field type="text" id="bik" name="bik" />
                    <ErrorMessage
                      name="bik"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="bankName">
                      {t("checkout.steps.userData.legal.bankName")}:
                    </label>
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

export default StepUserData;

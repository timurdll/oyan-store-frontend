import React, { useState } from "react";
import { useFetchTypesQuery } from "@redux/services/typeApi";
import { Skeleton } from "@mui/material";
import styles from "@styles/navbar.module.scss";
import { useTranslation } from "react-i18next";

interface Type {
  id: number;
  name: string;
}

const Navbar: React.FC<{ onTypeSelect: (typeId: number | null) => void }> = ({
  onTypeSelect,
}) => {
  const { t, i18n } = useTranslation();
  const {
    data: types,
    isLoading,
    error,
  } = useFetchTypesQuery({ language: i18n.language.toUpperCase() });
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

  const handleTypeSelect = (typeId: number | null) => {
    setSelectedTypeId(typeId);
    onTypeSelect(typeId);
  };

  if (isLoading)
    return (
      <nav className={styles.buttons}>
        <Skeleton
          variant="rectangular"
          width={120}
          height={22}
          sx={{
            borderRadius: "20px",
            fontSize: "14px",
            padding: "9px 12px",
            cursor: "pointer",
            minWidth: "120px",
          }}
        />
        <Skeleton
          variant="rectangular"
          width={120}
          height={22}
          sx={{
            borderRadius: "20px",
            padding: "9px 12px",
            cursor: "pointer",
            minWidth: "120px",
          }}
        />
        <Skeleton
          variant="rectangular"
          width={120}
          height={22}
          sx={{
            borderRadius: "20px",
            padding: "9px 12px",
            cursor: "pointer",
            minWidth: "120px",
          }}
        />
        <Skeleton
          variant="rectangular"
          width={120}
          height={22}
          sx={{
            borderRadius: "20px",
            padding: "9px 12px",
            cursor: "pointer",
            minWidth: "120px",
          }}
        />
        <Skeleton
          variant="rectangular"
          width={120}
          height={22}
          sx={{
            borderRadius: "20px",
            padding: "9px 12px",
            cursor: "pointer",
            minWidth: "120px",
          }}
        />
        <Skeleton
          variant="rectangular"
          width={120}
          height={22}
          sx={{
            borderRadius: "20px",
            padding: "9px 12px",
            cursor: "pointer",
            minWidth: "120px",
          }}
        />
      </nav>
    );
  if (error) return <div>{t("navbar.error")}</div>;

  return (
    <nav className={styles.buttons}>
      <button
        className={`${styles.categoryButton} ${
          selectedTypeId === null ? styles.active : ""
        }`}
        onClick={() => handleTypeSelect(null)}
      >
        {t("navigation.catalog")}
      </button>
      {types?.map((type: Type) => (
        <button
          key={type.id}
          className={`${styles.categoryButton} ${
            selectedTypeId === type.id ? styles.active : ""
          }`}
          onClick={() => handleTypeSelect(type.id)}
        >
          {type.name}
        </button>
      ))}
    </nav>
  );
};

export default Navbar;

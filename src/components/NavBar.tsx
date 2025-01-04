import React, { useState } from "react";
import { useFetchTypesQuery } from "@redux/services";
import { Skeleton } from "@mui/material";
import styles from "@styles/navbar.module.scss";

interface Type {
  id: number;
  name: string;
}

const Navbar: React.FC<{ onTypeSelect: (typeId: number | null) => void }> = ({
  onTypeSelect,
}) => {
  const { data: types, isLoading, error } = useFetchTypesQuery({});
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

  const handleTypeSelect = (typeId: number | null) => {
    setSelectedTypeId(typeId); // Устанавливаем выбранный id
    onTypeSelect(typeId); // Передаем в родительский компонент
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
  if (error) return <div>Error loading types</div>;

  return (
    <nav className={styles.buttons}>
      <button
        className={`${styles.categoryButton} ${
          selectedTypeId === null ? styles.active : ""
        }`}
        onClick={() => handleTypeSelect(null)}
      >
        Каталог товаров
      </button>
      {types?.map((type: Type) => (
        <button
          key={type.id}
          className={`${styles.categoryButton} ${
            selectedTypeId === type.id ? styles.active : ""
          }`}
          onClick={() => handleTypeSelect(type.id)} // Ensure id is a number
        >
          {type.name}
        </button>
      ))}
    </nav>
  );
};

export default Navbar;

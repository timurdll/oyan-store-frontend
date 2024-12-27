import React, { useState } from "react";
import { useFetchTypesQuery } from "@redux/services";
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

  if (isLoading) return <div>Loading types...</div>;
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

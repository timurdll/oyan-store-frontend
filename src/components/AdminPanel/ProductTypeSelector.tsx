import { Field } from "formik";
import React from "react";
import styles from "@styles/type-selector.module.scss";

interface ProductTypeSelectorProps {
  types: Array<{ id: string; name: string }> | undefined;
  isAddingType: boolean;
  setIsAddingType: React.Dispatch<React.SetStateAction<boolean>>;
  newTypeName: string;
  setNewTypeName: React.Dispatch<React.SetStateAction<string>>;
  handleAddType: () => Promise<void>;
  setFieldValue: (field: string, value: any) => void;
  onTypeChange: (typeId: string) => void;
}

const ProductTypeSelector: React.FC<ProductTypeSelectorProps> = ({
  types,
  isAddingType,
  setIsAddingType,
  newTypeName,
  setNewTypeName,
  handleAddType,
  setFieldValue,
  onTypeChange,
}) => {
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTypeId = e.target.value;
    setFieldValue("typeId", selectedTypeId);
    onTypeChange(selectedTypeId);
  };

  return (
    <div className={styles["type-selector__container"]}>
      <label htmlFor="type" className={styles["type-selector__label"]}>
        Тип продукт
      </label>
      <div className={styles["type-selector__select"]}>
        <Field as="select" name="typeId" onChange={handleTypeChange}>
          <option value="">Выбрать тип</option>
          {types?.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </Field>
        {!isAddingType ? (
          <button
            type="button"
            className={styles["type-selector__button"]}
            onClick={() => setIsAddingType(true)}
          >
            Добавить новый тип
          </button>
        ) : (
          <div className={styles["type-selector__input-container"]}>
            <input
              type="text"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              placeholder="Название нового типа"
              className={styles["type-selector__input"]}
            />
            <button
              type="button"
              className={styles["type-selector__save-button"]}
              onClick={handleAddType}
            >
              Сохранить тип
            </button>
            <button
              type="button"
              className={styles["type-selector__cancel-button"]}
              onClick={() => setIsAddingType(false)}
            >
              Отмена
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTypeSelector;

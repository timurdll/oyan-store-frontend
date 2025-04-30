import React, { useState } from "react";
import {
  useFetchTypesQuery,
  useAddTypeMutation,
  useUpdateTypeMutation,
  useDeleteTypeMutation,
} from "@redux/services/typeApi";
import { useUpdateTypeTranslationMutation } from "@redux/services/translationsApi";
import styles from "@styles/admin-panel.module.scss";
import CharacteristicTranslationManager from "./CharacteristicTranslationManager";

interface Characteristic {
  id: number;
  name: string;
}

interface Type {
  id: number;
  name: string;
  characteristics: Characteristic[];
  translations?: Array<{
    id: number;
    language: string;
    name: string;
  }>;
}

const TypesManager: React.FC = () => {
  const { data: types, isLoading } = useFetchTypesQuery(undefined);
  const [addType] = useAddTypeMutation();
  const [updateType] = useUpdateTypeMutation();
  const [deleteType] = useDeleteTypeMutation();
  const [updateTypeTranslation] = useUpdateTypeTranslationMutation();

  const [newTypeName, setNewTypeName] = useState("");
  const [editingTypeId, setEditingTypeId] = useState<number | null>(null);
  const [editTypeName, setEditTypeName] = useState("");
  const [translationKk, setTranslationKk] = useState("");

  const handleCreateType = async () => {
    if (!newTypeName.trim()) return;

    try {
      const newType = await addType({ name: newTypeName }).unwrap();

      // Добавляем перевод для казахского языка, если он заполнен
      if (translationKk.trim()) {
        await updateTypeTranslation({
          id: newType.id,
          language: "KK",
          name: translationKk,
        }).unwrap();
      }

      // Сброс полей формы
      setNewTypeName("");
      setTranslationKk("");
    } catch (error) {
      console.error("Ошибка при создании типа:", error);
    }
  };

  const handleUpdateType = async () => {
    if (!editingTypeId || !editTypeName.trim()) return;

    try {
      await updateType({ id: editingTypeId, name: editTypeName }).unwrap();

      // Обновляем перевод для казахского языка, если он заполнен
      if (translationKk.trim()) {
        await updateTypeTranslation({
          id: editingTypeId,
          language: "KK",
          name: translationKk,
        }).unwrap();
      }

      // Сброс состояния редактирования
      setEditingTypeId(null);
      setEditTypeName("");
      setTranslationKk("");
    } catch (error) {
      console.error("Ошибка при обновлении типа:", error);
    }
  };

  const handleEditClick = (type: Type) => {
    setEditingTypeId(type.id);
    setEditTypeName(type.name);

    // Установка перевода если есть
    if (type.translations && type.translations.length > 0) {
      const kkTranslation = type.translations.find(
        (t: any) => t.language === "KK"
      );
      setTranslationKk(kkTranslation?.name || "");
    } else {
      setTranslationKk("");
    }
  };

  const handleDeleteType = async (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этот тип?")) {
      try {
        await deleteType(id).unwrap();
      } catch (error) {
        console.error("Ошибка при удалении типа:", error);
      }
    }
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className={styles.typesManager}>
      <h2>Управление типами товаров</h2>

      <div className={styles.addTypeForm}>
        <h3>Добавить новый тип</h3>
        <div className={styles.formGroup}>
          <label>Название (рус)</label>
          <input
            type="text"
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            placeholder="Название типа"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Название (каз)</label>
          <input
            type="text"
            value={translationKk}
            onChange={(e) => setTranslationKk(e.target.value)}
            placeholder="Аударма"
          />
        </div>

        <button onClick={handleCreateType} className={styles.addButton}>
          Добавить тип
        </button>
      </div>

      <div className={styles.typesList}>
        <h3>Существующие типы</h3>
        <ul>
          {types?.map((type: Type) => (
            <li key={type.id} className={styles.typeItem}>
              {editingTypeId === type.id ? (
                <div className={styles.editTypeForm}>
                  <div className={styles.formGroup}>
                    <label>Название (рус)</label>
                    <input
                      type="text"
                      value={editTypeName}
                      onChange={(e) => setEditTypeName(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Название (каз)</label>
                    <input
                      type="text"
                      value={translationKk}
                      onChange={(e) => setTranslationKk(e.target.value)}
                    />
                  </div>

                  <div className={styles.buttonGroup}>
                    <button
                      onClick={handleUpdateType}
                      className={styles.saveButton}
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => setEditingTypeId(null)}
                      className={styles.cancelButton}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.typeInfo}>
                  <span className={styles.typeName}>
                    {type.name}
                    {type.translations && type.translations.length > 0 && (
                      <span className={styles.typeTranslations}>
                        {type.translations.map((t) => (
                          <span key={t.id} className={styles.translation}>
                            [{t.language.toLowerCase()}: {t.name}]
                          </span>
                        ))}
                      </span>
                    )}
                  </span>
                  <div className={styles.typeActions}>
                    <button
                      onClick={() => handleEditClick(type)}
                      className={styles.editButton}
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => handleDeleteType(type.id)}
                      className={styles.deleteButton}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              )}

              {/* Отображение характеристик типа */}
              {type.characteristics && type.characteristics.length > 0 && (
                <div className={styles.characteristicsList}>
                  <h4>Характеристики:</h4>
                  <ul>
                    {type.characteristics.map((char) => (
                      <li key={char.id} className={styles.characteristicItem}>
                        <span>{char.name}</span>
                        <div className={styles.characteristicActions}>
                          <CharacteristicTranslationManager
                            characteristicId={char.id}
                            characteristicName={char.name}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TypesManager;

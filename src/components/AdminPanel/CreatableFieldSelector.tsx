import { FieldArray, ErrorMessage, useFormikContext, Field } from "formik";
import CreatableSelect from "react-select/creatable";
import styles from "@styles/characteristics-field-array.module.scss";

interface CharacteristicsFieldArrayProps {
  availableCharacteristics?: { value: string; label: string }[];
}

const CreatableFieldArray = ({
  availableCharacteristics = [],
}: CharacteristicsFieldArrayProps) => {
  const { setFieldValue, values } = useFormikContext<any>();

  // Преобразуем доступные характеристики в правильный формат, если они не в формате { value, label }
  const formattedAvailableCharacteristics = availableCharacteristics.map(
    (char) => (typeof char === "string" ? { value: char, label: char } : char)
  );

  const selectedCharacteristics = values.characteristics.map(
    (char: { name: string }) => char.name
  );

  const handleNameChange = (index: number, selectedOption: any) => {
    if (!selectedOption) return;

    const newValue = selectedOption.value;

    // Добавляем новую характеристику в доступные, если это новая опция
    if ((selectedOption as any).__isNew__) {
      const newOption = { value: newValue, label: newValue };
      formattedAvailableCharacteristics.push(newOption);
    }

    setFieldValue(`characteristics[${index}].name`, newValue);
  };

  const getFilteredOptions = (index: number) => {
    const currentName = values.characteristics[index]?.name;
    return formattedAvailableCharacteristics.filter(
      (option) =>
        !selectedCharacteristics.includes(option.value) ||
        option.value === currentName
    );
  };

  return (
    <div className={styles.characteristicsSection}>
      <h3>Характеристики</h3>
      <FieldArray name="characteristics">
        {({ push, remove }) => (
          <div>
            {values.characteristics.map((_: any, index: number) => {
              const currentName = values.characteristics[index]?.name;
              const filteredOptions = getFilteredOptions(index);

              return (
                <div key={index} className={styles.field}>
                  <label htmlFor={`characteristics[${index}].name`}>
                    Название характеристики
                  </label>
                  <CreatableSelect
                    options={filteredOptions}
                    name={`characteristics[${index}].name`}
                    onChange={(selectedOption) =>
                      handleNameChange(index, selectedOption)
                    }
                    value={
                      currentName
                        ? { value: currentName, label: currentName }
                        : null
                    }
                    placeholder="Выбрать или добавить"
                    isClearable
                  />
                  <ErrorMessage
                    name={`characteristics[${index}].name`}
                    component="div"
                    className={styles.errorMessage}
                  />

                  <label htmlFor={`characteristics[${index}].description`}>
                    Описание
                  </label>
                  <Field
                    name={`characteristics[${index}].description`}
                    type="text"
                  />
                  <ErrorMessage
                    name={`characteristics[${index}].description`}
                    component="div"
                    className={styles.errorMessage}
                  />

                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => remove(index)}
                  >
                    Удалить
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              className={styles.addButton}
              onClick={() => push({ name: "", description: "" })}
            >
              Добавить характеристику
            </button>
          </div>
        )}
      </FieldArray>
    </div>
  );
};

export default CreatableFieldArray;

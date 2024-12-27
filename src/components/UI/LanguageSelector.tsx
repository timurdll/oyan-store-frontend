import { useTranslation } from "react-i18next";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const options = [
    { value: "ru", label: "RU" },
    { value: "kk", label: "KZ" },
    { value: "en", label: "EN" },
  ];

  const animatedComponents = makeAnimated();

  const handleLanguageChange = (selectedOption: any) => {
    i18n.changeLanguage(selectedOption.value);
  };

  return (
    <Select
      options={options}
      onChange={handleLanguageChange}
      components={animatedComponents}
      defaultValue={options.find((option) => option.value === i18n.language)}
      isSearchable={false}
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: "transparent",
          border: "none",
          boxShadow: "none",
          cursor: "pointer",
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: 450,
          marginTop: "4px",
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          width: "90px",
          right: -26,
          boxShadow: "none",
          backgroundColor: "var(--container-color)",
          borderRadius: "10px",
          overflow: "hidden",
        }),
        option: (baseStyles, state) => ({
          ...baseStyles,
          color: state.isSelected
            ? "var(--primary-color)"
            : "var(--text-color)",
          backgroundColor: "transparent",
          cursor: "pointer",
          fontWeight: "normal",
        }),
        singleValue: (baseStyles) => ({
          ...baseStyles,
          color: "var(--text-color)",
        }),
        dropdownIndicator: () => ({
          display: "none",
        }),
        indicatorSeparator: () => ({
          display: "none",
        }),
      }}
    />
  );
};

export default LanguageSelector;

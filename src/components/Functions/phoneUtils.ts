// src/utils/phoneUtils.ts
export const formatPhoneNumber = (value: string): string => {
  // Удаляем все символы, кроме цифр
  const digits = value.replace(/\D/g, "");

  // Убедимся, что номер начинается с "+7"
  let formatted = "+7 ";

  if (digits.length > 1) {
    formatted += digits.slice(1, 4); // Код города
  }
  if (digits.length > 4) {
    formatted += ` ${digits.slice(4, 7)}`; // Первые 3 цифры номера
  }
  if (digits.length > 7) {
    formatted += `-${digits.slice(7, 9)}`; // Следующие 2 цифры
  }
  if (digits.length > 9) {
    formatted += `-${digits.slice(9, 11)}`; // Последние 2 цифры
  }

  return formatted;
};

import slugify from "slugify";

export const createSlug = (text: string): string => {
  // Убираем пробелы в начале и конце строки
  const trimmedText = text.trim();

  // Преобразуем текст в slug
  return slugify(trimmedText, {
    lower: true, // Приведение текста к нижнему регистру
    strict: true, // Удаление специальных символов
    locale: "en", // Обработка локали (например, для казахского или русского текста)
  });
};

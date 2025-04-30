import slugify from "slugify";

export const createSlug = (text: string, originalName?: string): string => {
  // Используем оригинальное (русское) название, если оно предоставлено
  const nameToUse = originalName || text;

  // Убираем пробелы в начале и конце строки
  const trimmedText = nameToUse.trim();

  // Преобразуем текст в slug
  return slugify(trimmedText, {
    lower: true, // Приведение текста к нижнему регистру
    strict: true, // Удаление специальных символов
    locale: "ru", // Обработка русской локали
  });
};

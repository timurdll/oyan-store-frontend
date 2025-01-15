import * as Yup from "yup";

export const ProductSchema = Yup.object().shape({
  name: Yup.string().required("Введите название продукта"),
  price: Yup.number()
    .required("Введите цену продукта")
    .min(0, "Цена не может быть отрицательной"),
  typeId: Yup.string().required("Выберите тип продукта"),
  stock: Yup.number()
    .transform((originalValue) =>
      originalValue ? parseInt(originalValue, 10) : 0
    )
    .required("Введите количество товара")
    .min(0, "Количество не может быть отрицательным"),
  coverImage: Yup.mixed().required("Добавьте обложку продукта"),
  images: Yup.array().of(Yup.mixed()),
  productInfo: Yup.object().shape({
    title: Yup.string(),
    description: Yup.string(),
  }),
  characteristics: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Введите название характеристики"),
      description: Yup.string().required("Введите описание характеристики"),
    })
  ),
});

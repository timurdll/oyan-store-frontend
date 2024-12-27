import * as Yup from "yup";

export const ProductSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive"),
  typeId: Yup.string().required("Select or create a type"),
  coverImage: Yup.mixed().required("Cover image is required"),
  images: Yup.array().of(Yup.mixed()),
  productInfo: Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
  }),
  characteristics: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Characteristic name is required"),
      description: Yup.string().required(
        "Characteristic description is required"
      ),
    })
  ),
});

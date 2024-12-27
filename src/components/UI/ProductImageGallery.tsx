import { motion } from "framer-motion";
import styles from "@styles/product-page.module.scss";

const ProductImageGallery: React.FC<{
  product: any;
  openModal: (index: number) => void;
}> = ({ product, openModal }) => (
  <div className={styles.additionalImages}>
    {product.images.map((image: string, index: number) => (
      <motion.img
        key={index}
        src={`http://localhost:3000${image}`}
        alt={`Product image ${index + 1}`}
        className={styles.additionalImage}
        onClick={() => openModal(index)}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      />
    ))}
  </div>
);

export default ProductImageGallery;

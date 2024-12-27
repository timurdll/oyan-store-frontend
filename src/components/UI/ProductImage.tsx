import { motion } from "framer-motion";
import styles from "@styles/product-page.module.scss";

const ProductImage: React.FC<{
  product: any;
  openModal: (index: number) => void;
}> = ({ product, openModal }) => (
  <motion.img
    className={styles.image}
    src={`http://localhost:3000${product.cover_image}`}
    alt={product.name}
    onClick={() => openModal(0)}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  />
);

export default ProductImage;

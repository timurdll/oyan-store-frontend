import React from "react";
import { motion } from "framer-motion";
import styles from "@styles/about-us-page.module.scss";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.5 },
  }),
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  index,
}) => (
  <motion.div
    className={styles.card}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
    custom={index}
    variants={cardVariants}
    initial="hidden"
    animate="visible"
  >
    <Icon className={styles.icon} />
    <h2>{title}</h2>
    <p>{description}</p>
  </motion.div>
);

export default FeatureCard;

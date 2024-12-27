import React from "react";
import { motion } from "framer-motion";
import styles from "@styles/about-us-page.module.scss";

interface AnimatedDescriptionProps {
  text: string;
}

const AnimatedDescription: React.FC<AnimatedDescriptionProps> = ({ text }) => (
  <motion.p
    className={styles.description}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    {text}
  </motion.p>
);

export default AnimatedDescription;

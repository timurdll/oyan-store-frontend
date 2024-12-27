import React from "react";
import { motion } from "framer-motion";
import styles from "@styles/about-us-page.module.scss";

interface AnimatedHeaderProps {
  text: string;
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({ text }) => (
  <motion.h1
    className={styles.title}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    {text}
  </motion.h1>
);

export default AnimatedHeader;

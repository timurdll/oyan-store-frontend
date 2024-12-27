import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import styles from "@styles/about-us-page.module.scss";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.5 },
  }),
};

interface StatCardProps {
  end: number;
  info: string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ end, info, index }) => (
  <motion.div
    className={styles.card}
    custom={index}
    variants={cardVariants}
    initial="hidden"
    animate="visible"
  >
    <span className={styles.number}>
      <CountUp end={end} duration={3} suffix="+" />
    </span>
    <span className={styles.info}>{info}</span>
  </motion.div>
);

export default StatCard;

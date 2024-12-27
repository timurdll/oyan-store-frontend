import React from "react";
import { FaCheckCircle, FaHandsHelping, FaDollarSign } from "react-icons/fa";
import styles from "@styles/about-us-page.module.scss";
import AnimatedHeader from "@components/UI/AnimatedHeader";
import AnimatedDescription from "@components/UI/AnimatedDescription";
import StatCard from "@components/UI/StatCard";
import FeatureCard from "@components/UI/FeatureCard";
import { motion } from "framer-motion";

const AboutUsPage: React.FC = () => {
  const stats = [
    { end: 1800, info: "Проданных товаров по всему Казахстану" },
    { end: 850, info: "Услуг было предоставлено" },
    { end: 150, info: "Единиц техники было сдано в аренду" },
  ];

  const features = [
    {
      icon: FaCheckCircle,
      title: "Качество продукции",
      description: "Мы работаем только с лучшими мировыми производителями.",
    },
    {
      icon: FaHandsHelping,
      title: "Поддержка клиентов",
      description: "Наша команда всегда готова помочь вам на каждом этапе.",
    },
    {
      icon: FaDollarSign,
      title: "Доступные цены",
      description: "Лучшие предложения на рынке по выгодным ценам.",
    },
  ];

  return (
    <div className={styles.container}>
      <AnimatedHeader text="Добро пожаловать в Oyan Store" />
      <AnimatedDescription
        text={
          "Oyan Store — ваш надёжный партнер в мире современных технологий. Мы предоставляем качественную технику, лучшую поддержку и доступные цены для клиентов по всему Казахстану."
        }
      />
      <div className={styles.stats}>
        {stats.map((item, index) => (
          <StatCard key={index} end={item.end} info={item.info} index={index} />
        ))}
      </div>

      <div className={styles.features}>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Почему выбирают нас?
        </motion.h2>
        <div className={styles.cards}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;

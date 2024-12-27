import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "@styles/checkout-page.module.scss";
import {
  useCreateOrderMutation,
  useGetBasketQuery,
  useClearBasketMutation,
} from "@redux/services";
import Receipt from "@components/UI/Receipt";
import StepUserData from "@components/Checkout/StepUserData";
import StepAddress from "@components/Checkout/StepAddress";
import StepPayment from "@components/Checkout/StepPayment";
import OrderSuccessModal from "@components/OrderSuccessModal";
import { useNavigate } from "react-router-dom";

const CheckOut = () => {
  const stepRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const { data: basketProducts = [] } = useGetBasketQuery();
  const [createOrder] = useCreateOrderMutation();
  const [clearBasket] = useClearBasketMutation();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([false, false, false]);

  const navigate = useNavigate();

  // User information states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Address information states
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [entrance, setEntrance] = useState("");
  const [apartment, setApartment] = useState("");

  // Payment information states
  const [paymentMethod, setPaymentMethod] = useState<string[]>([]);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const smoothScroll = (targetY: number, duration: number) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    const scrollStep = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easing =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

      window.scrollTo(0, startY + distance * easing);

      if (elapsedTime < duration) {
        requestAnimationFrame(scrollStep);
      }
    };

    requestAnimationFrame(scrollStep);
  };

  useEffect(() => {
    if (currentStep > 1) {
      const stepElement = stepRefs[currentStep - 1]?.current;
      if (stepElement) {
        const elementTop =
          stepElement.getBoundingClientRect().top + window.scrollY;
        smoothScroll(elementTop - 130, 1300);
      }
    }
  }, [currentStep]);

  const totalSum: number =
    basketProducts?.reduce((sum: number, item) => {
      return sum + item.product.price * item.quantity;
    }, 0) ?? 0;

  const nextStep = () => {
    setCompletedSteps((prev) =>
      prev.map((completed, index) =>
        index === currentStep - 1 ? true : completed
      )
    );
    setCurrentStep((prev) => prev + 1);
  };

  const handleSubmitUserData = (values: {
    phoneNumber: string;
    fullName: string;
    email: string;
  }) => {
    setPhoneNumber(values.phoneNumber);
    setFullName(values.fullName);
    setEmail(values.email);
  };

  const handleSubmitAddressData = (values: {
    city: string;
    street: string;
    houseNumber: string;
    entrance: string;
    apartment: string;
  }) => {
    setCity(values.city);
    setStreet(values.street);
    setHouseNumber(values.houseNumber);
    setEntrance(values.entrance);
    setApartment(values.apartment);
  };

  const handleOrderSubmit = async () => {
    const orderData = {
      phoneNumber,
      fullName,
      email,
      address: {
        city,
        street,
        houseNumber,
        entrance,
        apartment,
      },
      paymentData: {
        paymentMethod,
      },
      product: basketProducts.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
      })),
      totalAmount: totalSum,
    };

    try {
      await createOrder(orderData).unwrap();
      navigate("/order-success");
      clearBasket({}); // Clear the basket after the order is successfully created
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className={styles.container}>
      <h1>Оформление заказа</h1>
      <div className={styles.order}>
        <div className={styles.form}>
          {currentStep >= 1 && (
            <motion.div
              ref={stepRefs[0]}
              key="step1"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={stepVariants}
            >
              <StepUserData
                initialValues={{ phoneNumber, fullName, email }}
                nextStep={nextStep}
                completed={completedSteps[0]}
                onSubmit={handleSubmitUserData}
              />
            </motion.div>
          )}

          {currentStep >= 2 && (
            <motion.div
              ref={stepRefs[1]}
              key="step2"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={stepVariants}
            >
              <StepAddress
                initialValues={{
                  city,
                  street,
                  houseNumber,
                  entrance,
                  apartment,
                }}
                nextStep={nextStep}
                completed={completedSteps[1]}
                onSubmit={handleSubmitAddressData}
              />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              ref={stepRefs[2]}
              key="step3"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={stepVariants}
            >
              <StepPayment
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                handleOrderSubmit={handleOrderSubmit}
                completed={completedSteps[2]}
              />
            </motion.div>
          )}
        </div>
        <Receipt
          basketProducts={basketProducts}
          totalSum={totalSum}
          showCheckoutButton={false}
        />
      </div>
      <OrderSuccessModal
        isOpen={orderSuccess}
        onClose={() => setOrderSuccess(false)}
      />
    </div>
  );
};

export default CheckOut;

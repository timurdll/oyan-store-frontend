// import React from "react";
// import styles from "@styles/preorder-modal.module.scss";
// import Button from "./Button";
// import Modal from "./Modal";
// import { useCreatePreOrderMutation } from "@redux/services";

// type PreorderModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   product: { name: string; id: number };
// };

// const PreorderModal: React.FC<PreorderModalProps> = ({
//   isOpen,
//   onClose,
//   product,
// }) => {
//   const [createPreOrder] = useCreatePreOrderMutation();
//   const handlePreorderSubmit = async () => {
//     try {
//       await createPreOrder(product.id).unwrap();
//       alert("Pre-order создан успешно!");
//     } catch (error) {
//       console.error("Ошибка при создании pre-order:", error);
//       alert("Не удалось создать pre-order.");
//     }
//     onClose();
//   };

//   return (
//     <Modal title="Предзаказ" isOpen={isOpen} onClose={onClose}>
//       <div className={styles.modal}>
//         <p>Вы хотите оформить предзаказ на продукт "{product.name}"?</p>
//         <Button
//           label="Подтвердить"
//           onClick={handlePreorderSubmit}
//           variant="filled"
//         />
//         <Button label="Отменить" onClick={onClose} variant="outlined" />
//       </div>
//     </Modal>
//   );
// };

// export default PreorderModal;

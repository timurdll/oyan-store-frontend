// components/AlertComponent.tsx
import React from "react";
import Alert from "@components/UI/Alert";

interface AlertComponentProps {
  alert: { message: string; type: "success" | "error" } | null;
  onClose: () => void;
}

const AlertComponent: React.FC<AlertComponentProps> = ({ alert, onClose }) => {
  if (!alert) return null;

  return <Alert message={alert.message} type={alert.type} onClose={onClose} />;
};

export default AlertComponent;

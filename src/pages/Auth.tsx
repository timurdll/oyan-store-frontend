import React, { useState } from "react";
import styles from "@styles/auth.module.scss";
// import google from "@assets/images/google.svg";
import logo from "@assets/images/tumbler.svg";
import closeIcon from "@assets/images/close.svg";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@redux/slices/userSlice";
import {
  closeAuthModal,
  resetSessionExpired,
} from "@redux/slices/authModalSlice";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  useCheckEmailMutation,
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@redux/services";

const Auth: React.FC = () => {
  const { isOpen: isVisible, sessionExpired } = useSelector(
    (state: any) => state.authModal
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // RTK Query mutation hooks
  const [loginUser] = useLoginUserMutation();
  const [registerUser] = useRegisterUserMutation();
  const [checkEmail] = useCheckEmailMutation();

  const onClose = () => {
    dispatch(closeAuthModal());
  };

  const onSubmitEmail = async () => {
    try {
      const response = await checkEmail({ email }).unwrap();
      if (response.exists) {
        setStep(2); // If the email exists, go to password step
      } else {
        setIsRegistering(true); // If the email doesn't exist, start registration process
        setStep(2);
      }
    } catch (error) {
      console.log("Error checking email:", error);
      setIsRegistering(true);
      setStep(2);
    }
  };

  const onSubmitPassword = async () => {
    try {
      const response = await loginUser({ username: email, password }).unwrap();
      const decoded = jwtDecode<{ id: string; email: string; role: string }>(
        response.access_token
      );

      // Dispatch login action to store user data and token
      dispatch(
        login({
          user: {
            id: parseInt(decoded.id),
            email: decoded.email,
            role: decoded.role,
            password: "",
            ratings: [], // Assuming an empty array for ratings
            favorites: [], // Assuming an empty array for favorites
          },
          token: response.access_token,
        })
      );

      localStorage.setItem("token", response.access_token);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        navigate("/profile");
      }, 2000);
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  const onRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await registerUser({
        username: email,
        password,
        role: "user",
      }).unwrap();
      const decoded = jwtDecode<{ id: string; email: string; role: string }>(
        response.access_token
      );

      dispatch(
        login({
          user: {
            id: parseInt(decoded.id),
            email: decoded.email,
            role: decoded.role,
            password: "",
            ratings: [], // Assuming an empty array for ratings
            favorites: [], // Assuming an empty array for favorites
          },
          token: response.access_token,
        })
      );

      localStorage.setItem("token", response.access_token);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        navigate("/profile");
      }, 2000);
    } catch (error) {
      console.log("Registration error:", error);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.registerContainer}>
        <div className={styles.rightPanel}>
          <div className={styles.modalHeader}>
            <img src={logo} alt="Oyan Logo" className={styles.logo} />
            <button className={styles.closeButton} onClick={onClose}>
              <img src={closeIcon} alt="X" />
            </button>
          </div>

          {/* Если сессия истекла */}
          {sessionExpired ? (
            <>
              <h2>Сессия истекла</h2>
              <p className={styles.sessionExpiredMessage}>
                Ваша сессия истекла в целях безопасности. Пожалуйста, войдите
                снова.
              </p>
              <button
                onClick={() => {
                  dispatch(resetSessionExpired()); // Сброс значения sessionExpired
                  setStep(1); // Опционально: сброс шага на начальный
                  setEmail(""); // Очистка полей
                  setPassword("");
                  setConfirmPassword("");
                  setIsRegistering(false);
                }}
                className={styles.primaryButton}
              >
                Войти снова
              </button>
            </>
          ) : (
            <>
              <h2>Войти или зарегистрироваться</h2>
              {showSuccess ? (
                <div className={styles.successMessage}>
                  Вход выполнен успешно!
                </div>
              ) : step === 1 ? (
                <>
                  <input
                    type="text"
                    id="email"
                    placeholder="Введите вашу почту"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.inputField}
                  />
                  <button
                    onClick={onSubmitEmail}
                    className={styles.primaryButton}
                  >
                    Продолжить
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="password"
                    id="password"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.inputField}
                  />
                  {isRegistering && (
                    <input
                      type="password"
                      id="confirmPassword"
                      placeholder="Подтвердите пароль"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={styles.inputField}
                    />
                  )}
                  <button
                    onClick={isRegistering ? onRegister : onSubmitPassword}
                    className={styles.primaryButton}
                  >
                    {isRegistering ? "Зарегистрироваться" : "Войти"}
                  </button>
                </>
              )}
              {/* <div className={styles.orText}>Или</div>
              <button className={styles.googleButton}>
                <img src={google} alt="google" />
                <span>Войти с помощью Google</span>
              </button> */}
              <p className={styles.termsText}>
                Сохраняйте в тайне свое имя пользователя и пароль! Продолжая, вы
                принимаете{" "}
                <a href="#">условия использования магазина Oyan store</a>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;

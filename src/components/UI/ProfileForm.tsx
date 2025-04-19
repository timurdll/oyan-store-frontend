import React, { useEffect, useCallback } from "react";
import {
  useGetUserByIdQuery,
  useUpdateProfileMutation,
} from "@redux/services/userApi";
import styles from "@styles/profile-form.module.scss";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@redux/slices/userSlice";
import Button from "./Button";
import { formatPhoneNumber } from "@components/Functions/phoneUtils"; // Импорт новой функции

interface ProfileFormProps {
  userId: string;
  formData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    profileImage?: string;
    dateOfBirth?: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      phoneNumber: string;
      profileImage?: string;
      dateOfBirth?: string;
    }>
  >;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  userId,
  formData,
  setFormData,
}) => {
  const { data: user, isLoading, isError } = useGetUserByIdQuery(userId);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: formatPhoneNumber(user.phoneNumber || ""),
        profileImage: user.profileImage || "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
      });
    }
  }, [user, setFormData]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (name === "phoneNumber") {
        setFormData((prev) => ({
          ...prev,
          [name]: formatPhoneNumber(value),
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    },
    [setFormData]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  }, [dispatch, navigate]);

  const handleUpdateProfile = useCallback(async () => {
    try {
      await updateProfile({ id: userId, profileData: formData }).unwrap();
      alert("Профиль успешно обновлен!");
    } catch (err: any) {
      console.error("Ошибка при обновлении профиля:", err);
      alert(err.data?.message || "Не удалось обновить профиль.");
    }
  }, [formData, updateProfile, userId]);

  if (isLoading) {
    return <p>Загрузка данных пользователя...</p>;
  }

  if (isError) {
    return <p>Ошибка загрузки данных пользователя. Попробуйте позже.</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileForm}>
        <label className={styles.field}>
          Имя:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </label>
        <label className={styles.field}>
          Фамилия:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </label>
        <label className={styles.field}>
          Телефон:
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber || ""}
            onChange={handleInputChange}
            placeholder="+7 XXX XXX-XX-XX"
          />
        </label>
        <label className={styles.field}>
          Дата рождения:
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth || ""}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div className={styles.buttons}>
        <Button
          label={isUpdating ? "Сохранение..." : "Сохранить изменения"}
          onClick={handleUpdateProfile}
          variant="primaryLarge"
        />
        <Button
          label="Выйти из профиля"
          onClick={handleLogout}
          variant="link"
        />
      </div>
    </div>
  );
};

export default ProfileForm;

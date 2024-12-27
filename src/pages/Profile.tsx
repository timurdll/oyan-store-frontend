import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import styles from "@styles/profile.module.scss";
import { jwtDecode } from "jwt-decode";
import AvatarUploader from "@components/UI/AvatarUploader";
import ProfileForm from "@components/UI/ProfileForm";

const Profile: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.user);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    profileImage?: string;
    dateOfBirth?: string;
    phoneNumber: string;
  }>({
    firstName: "",
    lastName: "",
    profileImage: "",
    dateOfBirth: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode<{ userId: string }>(token);
      setUserId(decoded.userId);
    }
  }, [token]);

  if (!userId) {
    return <div>Ошибка: не удалось загрузить данные пользователя.</div>;
  }

  return (
    <>
      <div className={styles.profile}>
        <div className={styles.settings}>
          <div className={styles.userInfo}>
            <AvatarUploader userId={userId} />
            <h2>
              {formData.firstName || "Имя"} {formData.lastName || "Фамилия"}
            </h2>
          </div>
          <ProfileForm
            userId={userId}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      </div>
    </>
  );
};

export default Profile;

import React, { useState, useEffect } from "react";
import {
  useUploadAvatarMutation,
  useGetUserByIdQuery,
} from "@redux/services/userApi";
import styles from "@styles/avatar-uploader.module.scss";

interface AvatarUploaderProps {
  userId: string;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ userId }) => {
  const { data: user } = useGetUserByIdQuery(userId);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadAvatar] = useUploadAvatarMutation();

  useEffect(() => {
    if (user && user.profileImage) {
      setAvatarPreview(user.profileImage);
    }
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      try {
        const response = await uploadAvatar({
          id: userId,
          avatar: file,
        }).unwrap();
        if (response && response.profileImage) {
          setAvatarPreview(response.profileImage);
        }
      } catch (error) {
        console.error("Ошибка загрузки аватара:", error);
        alert("Не удалось обновить аватар. Попробуйте снова.");
      }
    }
  };

  return (
    <div className={styles.avatarContainer}>
      <label className={styles.avatarLabel}>
        <input
          type="file"
          onChange={handleAvatarChange}
          className={styles.avatarInput}
        />
        <div className={styles.avatarPreview}>
          {avatarPreview ? (
            <img
              src={`${
                import.meta.env.VITE_API_URL
              }/uploads/avatars${avatarPreview}`}
              alt="Аватар пользователя"
              className={styles.avatarImage}
            />
          ) : (
            <div className={styles.defaultAvatar}></div>
          )}
        </div>
      </label>
    </div>
  );
};

export default AvatarUploader;

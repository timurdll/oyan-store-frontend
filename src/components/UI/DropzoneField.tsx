import React, { useState } from "react";
import Dropzone from "react-dropzone";
import styles from "@styles/dropzone.module.scss";
import file from "@assets/images/file.svg";

// Define the type for the props
interface DropzoneFieldProps {
  fieldName: string;
  setFieldValue: (field: string, value: any) => void;
  multiple?: boolean;
}

const DropzoneField: React.FC<DropzoneFieldProps> = ({
  fieldName,
  setFieldValue,
  multiple = false,
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setFieldValue(fieldName, multiple ? acceptedFiles : acceptedFiles[0]);
  };

  return (
    <div>
      <Dropzone onDrop={handleDrop} multiple={multiple}>
        {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
          <div
            {...getRootProps()}
            className={`${styles.dropzone} ${
              isDragActive ? styles.active : isDragReject ? styles.reject : ""
            }`}
          >
            <input {...getInputProps()} name={fieldName} />
            <p
              className={`${styles.text} ${
                isDragReject ? styles.errorText : styles.defaultText
              }`}
            >
              {isDragActive
                ? `Перетащите ${
                    multiple ? "изображения" : "изображение"
                  } сюда...`
                : `Перетащите ${
                    multiple ? "изображения" : "изображение"
                  } сюда, или нажмите для выбора`}
            </p>
            <img src={file} alt="file" className={styles.icon} />
            {isDragReject && (
              <p className={styles.errorMessage}>
                Тип файла не поддерживается!
              </p>
            )}

            {files.length > 0 && (
              <div className={styles.filesPreview}>
                <ul>
                  {files.map((file, index) => (
                    <li key={index} className={styles.fileItem}>
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className={styles.previewImage}
                        />
                      ) : (
                        <div className={styles.previewIcon}>
                          <span>{file.name.slice(0, 1)}</span>{" "}
                          {/* Show first letter as icon */}
                        </div>
                      )}
                      <span>{file.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export default DropzoneField;

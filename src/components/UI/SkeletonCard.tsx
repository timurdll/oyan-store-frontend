import React from "react";
import Skeleton from "@mui/material/Skeleton";
import useMediaQuery from "@mui/material/useMediaQuery";

export const SkeletonCard: React.FC = () => {
  // Используем медиазапрос для мобильных
  const isMobile = useMediaQuery("(max-width:768px)");
  const imageHeight = isMobile ? 120 : 140;
  const imageRadius = 8;

  return (
    <div
      style={{
        border: "2px solid #f4f4f4",
        borderRadius: "30px",
        overflow: "hidden",
        width: "250px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "26px",
        textAlign: "center", // Center align all text inside the card
      }}
    >
      {/* Skeleton for Image */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={imageHeight}
        animation="wave"
        style={{ borderRadius: imageRadius, marginBottom: "15px" }}
      />

      {/* Skeleton for Info */}
      <div style={{ marginBottom: "15px" }}>
        <Skeleton
          variant="text"
          width="70%"
          height={20}
          animation="wave"
          style={{ margin: "0 auto 10px" }} // Center skeleton block
        />
        <Skeleton
          variant="text"
          width="50%"
          height={18}
          animation="wave"
          style={{ margin: "0 auto 10px" }} // Center skeleton block
        />
        <Skeleton
          variant="text"
          width="60%"
          height={16}
          animation="wave"
          style={{ margin: "0 auto" }} // Center skeleton block
        />
      </div>

      {/* Skeleton for Buttons */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <Skeleton
          variant="rectangular"
          width="45%"
          height={36}
          animation="wave"
          style={{ borderRadius: "8px" }}
        />
      </div>
    </div>
  );
};

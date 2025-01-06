import Slider from "react-slick";
import { useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import x14 from "@assets/images/x14.png?url";
import x15 from "@assets/images/x15.png?url";
import ktab from "@assets/images/ktab.png?url";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@styles/customArrows.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function SampleNextArrow(props: any) {
  const { onClick } = props;
  return (
    <div className="custom-next-arrow" onClick={onClick}>
      <FaChevronRight />
    </div>
  );
}

function SamplePrevArrow(props: any) {
  const { onClick } = props;
  return (
    <div className="custom-prev-arrow" onClick={onClick}>
      <FaChevronLeft />
    </div>
  );
}

function Fade() {
  const [loadedImages, setLoadedImages] = useState({
    x14: false,
    x15: false,
    ktab: false,
  });

  const handleImageLoad = (key: string) => {
    setLoadedImages((prev) => ({ ...prev, [key]: true }));
  };

  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div className="slider-item">
          {!loadedImages.x14 && (
            <Skeleton
              variant="rectangular"
              animation="pulse"
              width="100%"
              sx={{
                borderRadius: "15px",

                height: "calc(100vw * 0.396)", // Автоматический расчет высоты на основе ширины экрана
              }}
            />
          )}
          <img
            src={x14}
            alt="Slide 1"
            onLoad={() => handleImageLoad("x14")}
            style={{ display: loadedImages.x14 ? "block" : "none" }}
          />
        </div>
        <div className="slider-item">
          {!loadedImages.x15 && (
            <Skeleton
              variant="rectangular"
              animation="pulse"
              width="100%"
              sx={{
                borderRadius: "15px",

                height: "calc(100vw * 0.396)", // Автоматический расчет высоты на основе ширины экрана
              }}
            />
          )}
          <img
            src={x15}
            alt="Slide 2"
            onLoad={() => handleImageLoad("x15")}
            style={{ display: loadedImages.x15 ? "block" : "none" }}
          />
        </div>
        <div className="slider-item">
          {!loadedImages.ktab && (
            <Skeleton
              variant="rectangular"
              animation="pulse"
              width="100%"
              sx={{
                borderRadius: "15px",
                height: "calc(100vw * 0.396)", // Автоматический расчет высоты на основе ширины экрана
              }}
            />
          )}
          <img
            src={ktab}
            alt="Slide 3"
            onLoad={() => handleImageLoad("ktab")}
            style={{ display: loadedImages.ktab ? "block" : "none" }}
          />
        </div>
      </Slider>
    </div>
  );
}

export default Fade;

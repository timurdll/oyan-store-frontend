import { useMediaQuery } from "react-responsive";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./BannerSlider.css";
import { Skeleton } from "@mui/material";
import { useState, useEffect } from "react";

// десктопные картинки
import x14l from "@assets/images/x14d.png?url";
import x15l from "@assets/images/x15d.png?url";
import ktab from "@assets/images/ktabd.png?url";
import vixiv from "@assets/images/vixivd.png?url";

// мобильные картинки
import x14m from "@assets/images/x14-m.png?url";
import x15m from "@assets/images/x15-m.png?url";
import ktabm from "@assets/images/ktab-m.png?url";
import vixivm from "@assets/images/vixiv-m.png?url";

// Компоненты для кастомных стрелок
const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="slick-arrow slick-prev"
      aria-label="Previous"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.5 15L7.5 10L12.5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="slick-arrow slick-next"
      aria-label="Next"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.5 15L12.5 10L7.5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

const BannerSlider = () => {
  const [isLoading, setIsLoading] = useState(true);
  // детектим ширину экрана ≤768px
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    // Имитируем загрузку изображений
    const loadImages = async () => {
      const imagePromises = isMobile
        ? [x14m, x15m, ktabm, vixivm]
        : [x14l, x15l, ktab, vixiv];

      try {
        await Promise.all(
          imagePromises.map((src) => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.src = src;
              img.onload = resolve;
              img.onerror = reject;
            });
          })
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [isMobile]);

  // выбираем нужный массив
  const slides = isMobile
    ? [
        { src: vixivm, alt: "Banner Desktop 4" },
        { src: x14m, alt: "Banner Mobile 1" },
        { src: x15m, alt: "Banner Mobile 2" },
        { src: ktabm, alt: "Banner Mobile 3" },
      ]
    : [
        { src: vixiv, alt: "Banner Mobile 4" },
        { src: x14l, alt: "Banner Desktop 1" },
        { src: x15l, alt: "Banner Desktop 2" },
        { src: ktab, alt: "Banner Desktop 3" },
      ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: !isMobile,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    pauseOnHover: true,
    centerMode: false,
    centerPadding: "0px",
    swipeToSlide: true,
    touchThreshold: 15,
    cssEase: "ease-out",
    fade: true,
    waitForAnimate: true,
    swipe: true,
    touchMove: true,
    edgeFriction: 0.35,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
          swipeToSlide: true,
          touchThreshold: 5,
          speed: 500,
          fade: true,
          waitForAnimate: true,
          swipe: true,
          touchMove: true,
          edgeFriction: 0.35,
        },
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="banner-slider">
        <div className="slider-item">
          <Skeleton
            variant="rectangular"
            width="100%"
            height={isMobile ? "180px" : "400px"}
            sx={{
              borderRadius: "20px",
              backgroundColor: "#f4f4f4",
              transform: "none",
              border: "2px solid #e8e8e8",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          {[...Array(4)].map((_, index) => (
            <Skeleton
              key={index}
              variant="circular"
              width={10}
              height={10}
              sx={{
                backgroundColor:
                  index === 0 ? "var(--primary-color)" : "#e8e8e8",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="banner-slider">
      <Slider {...settings}>
        {slides.map((slide, idx) => (
          <div key={idx} className="slider-item">
            <img src={slide.src} alt={slide.alt} className="banner-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;

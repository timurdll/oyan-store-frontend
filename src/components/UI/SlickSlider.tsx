import { useMediaQuery } from "react-responsive";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./BannerSlider.css";
import { Skeleton } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styles from "@styles/card.module.scss";

// десктопные картинки (WebP)
import x14lWebp from "@assets/images/x14d.webp?url";
import x15lWebp from "@assets/images/x15d.webp?url";
import ktabWebp from "@assets/images/ktabd.webp?url";
import vixivWebp from "@assets/images/vixivd.webp?url";

// мобильные картинки (WebP)
import x14mWebp from "@assets/images/x14-m.webp?url";
import x15mWebp from "@assets/images/x15-m.webp?url";
import ktabmWebp from "@assets/images/ktab-m.webp?url";
import vixivmWebp from "@assets/images/vixiv-m.webp?url";

// казахские версии баннеров (десктоп WebP)
import x14lkkWebp from "@assets/images/x14d-kk.webp?url";
import x15lkkWebp from "@assets/images/x15d-kk.webp?url";
import ktabkkWebp from "@assets/images/ktab-kk.webp?url";
import vixivkkWebp from "@assets/images/vixivd-kk.webp?url";

// казахские версии баннеров (мобильные WebP)
import x14mkkWebp from "@assets/images/x14-m-kk.webp?url";
import x15mkkWebp from "@assets/images/x15-m-kk.webp?url";
import ktabmkkWebp from "@assets/images/ktab-m-kk.webp?url";
import vixivmkkWebp from "@assets/images/vixiv-m-kk.webp?url";

// десктопные картинки (PNG fallback)
import x14l from "@assets/images/x14d.png?url";
import x15l from "@assets/images/x15d.png?url";
import ktab from "@assets/images/ktabd.png?url";
import vixiv from "@assets/images/vixivd.png?url";

// мобильные картинки (PNG fallback)
import x14m from "@assets/images/x14-m.png?url";
import x15m from "@assets/images/x15-m.png?url";
import ktabm from "@assets/images/ktab-m.png?url";
import vixivm from "@assets/images/vixiv-m.png?url";

// казахские версии баннеров (десктоп PNG)
import x14lkk from "@assets/images/x14d-kk.png?url";
import x15lkk from "@assets/images/x15d-kk.png?url";
import ktabkk from "@assets/images/ktab-kk.png?url";
import vixivkk from "@assets/images/vixivd-kk.png?url";

// казахские версии баннеров (мобильные PNG)
import x14mkk from "@assets/images/x14-m-kk.png?url";
import x15mkk from "@assets/images/x15-m-kk.png?url";
import ktabmkk from "@assets/images/ktab-m-kk.png?url";
import vixivmkk from "@assets/images/vixiv-m-kk.png?url";

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

const SlideItem = ({ slide, supportsWebP, priority }: { slide: any, supportsWebP: boolean, priority: boolean }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="slider-item" style={{ position: 'relative' }}>
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${slide.width}/${slide.height}`
      }}>
        {!loaded && (
          <Skeleton
            variant="rectangular"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: "20px",
              backgroundColor: "#f4f4f4",
              transform: "none",
              border: "2px solid #e8e8e8",
            }}
          />
        )}
        <picture style={{
          display: 'block',
          width: '100%',
          height: '100%',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}>
          {supportsWebP && (
            <source srcSet={slide.src} type="image/webp" />
          )}
          <img
            src={slide.src}
            alt={slide.alt}
            className="banner-image"
            width={slide.width}
            height={slide.height}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            fetchPriority={priority ? "high" : "low"}
            onLoad={() => setLoaded(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </picture>
      </div>
    </div>
  );
};

const BannerSlider = () => {
  const { i18n } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Проверка поддержки WebP
  const [supportsWebP, setSupportsWebP] = useState(false);

  useEffect(() => {
    const checkWebPSupport = async () => {
      const webpImage = new Image();
      webpImage.onload = () => setSupportsWebP(true);
      webpImage.onerror = () => setSupportsWebP(false);
      webpImage.src =
        "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=";
    };
    checkWebPSupport();
  }, []);

  // Мемоизируем массивы изображений для оптимизации
  const imageSets = useMemo(() => {
    const getImageSrc = (webp: string, png: string) =>
      supportsWebP ? webp : png;

    const mobileImages =
      i18n.language === "kk"
        ? [
          getImageSrc(vixivmkkWebp, vixivmkk),
          getImageSrc(x14mkkWebp, x14mkk),
          getImageSrc(x15mkkWebp, x15mkk),
          getImageSrc(ktabmkkWebp, ktabmkk),
        ]
        : [
          getImageSrc(vixivmWebp, vixivm),
          getImageSrc(x14mWebp, x14m),
          getImageSrc(x15mWebp, x15m),
          getImageSrc(ktabmWebp, ktabm),
        ];

    const desktopImages =
      i18n.language === "kk"
        ? [
          getImageSrc(vixivkkWebp, vixivkk),
          getImageSrc(x14lkkWebp, x14lkk),
          getImageSrc(x15lkkWebp, x15lkk),
          getImageSrc(ktabkkWebp, ktabkk),
        ]
        : [
          getImageSrc(vixivWebp, vixiv),
          getImageSrc(x14lWebp, x14l),
          getImageSrc(x15lWebp, x15l),
          getImageSrc(ktabWebp, ktab),
        ];

    return { mobileImages, desktopImages };
  }, [i18n.language, supportsWebP]);

  // Мемоизируем слайды для оптимизации
  const slides = useMemo(() => {
    const currentImages = isMobile
      ? imageSets.mobileImages
      : imageSets.desktopImages;
    const isKazakh = i18n.language === "kk";

    return currentImages.map((src, index) => ({
      src,
      alt: `Banner ${isMobile ? "Mobile" : "Desktop"} ${index + 1}${isKazakh ? " KK" : ""
        }`,
      width: isMobile ? 1436 : 4440,
      height: isMobile ? 1436 : 1760,
    }));
  }, [isMobile, imageSets, i18n.language]);

  // Оптимизированные настройки слайдера
  const settings = useMemo(
    () => ({
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
    }),
    [isMobile]
  );

  return (
    <>
      <div className={styles["preload-banners"]} />
      <div className="banner-slider">
        <Slider {...settings}>
          {slides.map((slide, idx) => (
            <SlideItem
              key={`${slide.src}-${idx}`}
              slide={slide}
              supportsWebP={supportsWebP}
              priority={idx === 0}
            />
          ))}
        </Slider>
      </div>
    </>
  );
};

export default BannerSlider;

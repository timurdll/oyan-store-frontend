import { useMediaQuery } from "react-responsive";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./BannerSlider.css";

// десктопные картинки
import x14l from "@assets/images/x14l.png?url";
import x15l from "@assets/images/x15l.png?url";
import ktabl from "@assets/images/k-tab.png?url";
import vixiv from "@assets/images/vixiv.png?url";

// мобильные картинки
import x14m from "@assets/images/x14-m.png?url";
import x15m from "@assets/images/x15-m.png?url";
import ktabm from "@assets/images/ktab-m.png?url";
import vixivm from "@assets/images/vixiv-m.png?url";
const BannerSlider = () => {
  // детектим ширину экрана ≤768px
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // выбираем нужный массив
  const slides = isMobile
    ? [
        { src: x14m, alt: "Banner Mobile 1" },
        { src: x15m, alt: "Banner Mobile 2" },
        { src: ktabm, alt: "Banner Mobile 3" },
        { src: vixivm, alt: "Banner Desktop 4" },
      ]
    : [
        { src: x14l, alt: "Banner Desktop 1" },
        { src: x15l, alt: "Banner Desktop 2" },
        { src: ktabl, alt: "Banner Desktop 3" },
        { src: vixiv, alt: "Banner Mobile 4" },
      ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: !isMobile,
    pauseOnHover: true,
    centerMode: false,
    centerPadding: "0px",
    swipeToSlide: true,
    touchThreshold: 10,
    cssEase: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    fade: true,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
          swipeToSlide: true,
          touchThreshold: 10,
          speed: 1000,
          fade: true,
        },
      },
    ],
  };

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

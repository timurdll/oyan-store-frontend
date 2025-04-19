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
import x14m from "@assets/images/x14-mobile.png?url";
import x15m from "@assets/images/x15-mobile.png?url";
import ktabm from "@assets/images/k-tab-mobile.png?url";
import vixivm from "@assets/images/vixiv-mobile.png?url";
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
    speed: 800,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: !isMobile, // стрелки только на десктопе
    pauseOnHover: true,
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

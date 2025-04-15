import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./BannerSlider.css"; // Подключите свои стили, если нужно
import x14 from "@assets/images/x14l.png?url";
import x15 from "@assets/images/x15l.png?url";
import ktab from "@assets/images/k-tab.png?url";

const BannerSlider = () => {
  const settings = {
    dots: true, // Точки-индикаторы
    infinite: true, // Бесконечная прокрутка
    speed: 800, // Скорость перехода в мс
    autoplay: true, // Автопрокрутка
    autoplaySpeed: 5000, // Интервал автопрокрутки в мс
    slidesToShow: 1, // Показывать 1 слайд за раз
    slidesToScroll: 1, // Прокручивать 1 слайд за раз
    arrows: true, // Стрелки навигации
    pauseOnHover: true, // Останавливать автопрокрутку при наведении
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false, // На мобильных отключаем стрелки
        },
      },
    ],
  };

  return (
    <div className="banner-slider">
      <Slider {...settings}>
        <div className="slider-item">
          <img src={x14} alt="Banner 1" className="banner-image" />
        </div>
        <div className="slider-item">
          <img src={x15} alt="Banner 2" className="banner-image" />
        </div>
        <div className="slider-item">
          <img src={ktab} alt="Banner 3" className="banner-image" />
        </div>
      </Slider>
    </div>
  );
};

export default BannerSlider;

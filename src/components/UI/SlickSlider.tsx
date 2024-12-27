import Slider from "react-slick";
import oyan from "@assets/images/x14lBan.svg?url";
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
          <img src={oyan} alt="Slide 1" />
        </div>
        <div className="slider-item">
          <img src={oyan} alt="Slide 2" />
        </div>
        <div className="slider-item">
          <img src={oyan} alt="Slide 3" />
        </div>
      </Slider>
    </div>
  );
}

export default Fade;

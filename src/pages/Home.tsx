import { useState } from "react";
import ProductList from "@components/Products";
import Navbar from "@components/NavBar";
import BannerSlider from "@components/UI/SlickSlider";
// import Fade from "@components/UI/SlickSlider";

const Home = () => {
  const [selectedType, setSelectedType] = useState<number | null>(null); // Change string | null to number | null

  return (
    <>
      <BannerSlider />
      <Navbar onTypeSelect={setSelectedType} />
      <ProductList selectedType={selectedType} />
    </>
  );
};

export default Home;

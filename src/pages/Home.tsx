import { useState } from "react";
import ProductList from "@components/Products";
import Navbar from "@components/NavBar";
import Fade from "@components/UI/SlickSlider";

const Home = () => {
  const [selectedType, setSelectedType] = useState<number | null>(null); // Change string | null to number | null

  return (
    <div>
      <Fade />
      <Navbar onTypeSelect={setSelectedType} />
      <ProductList selectedType={selectedType} />
    </div>
  );
};

export default Home;

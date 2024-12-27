import Footer from "@components/Footer";
import Header from "@components/Header";
import useIsMobile from "@components/Hooks/UseIsMobile";
import MobileMenu from "@components/MobileMenu";
import Auth from "@pages/Auth";
import AppRouter from "@routes/AppRouter";
import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

function App() {
  const isMobile = useIsMobile();

  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <BrowserRouter>
        <div className="app-container">
          <Header />
          <main className="content">
            <AppRouter />
          </main>
          {isMobile ? <MobileMenu /> : <></>}
          <Auth />
          <Footer />
        </div>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;

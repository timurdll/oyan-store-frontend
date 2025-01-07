import Footer from "@components/Footer";
import Header from "@components/Header";
import useIsMobile from "@components/Hooks/UseIsMobile";
import MobileMenu from "@components/MobileMenu";
import Loader from "@components/UI/Loader";
import Auth from "@pages/Auth";
import AppRouter from "@routes/AppRouter";
import ScrollToTopWrapper from "@routes/ScrollToTopWrapper";
import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

function App() {
  const isMobile = useIsMobile();

  return (
    <Suspense
      fallback={
        <div>
          <Loader />
        </div>
      }
    >
      <BrowserRouter>
        <ScrollToTopWrapper>
          <div className="app-container">
            {/* <Header /> */}
            <main className="content">
              <AppRouter />
            </main>
            {isMobile ? <MobileMenu /> : <></>}
            <Auth />
            <Footer />
          </div>
        </ScrollToTopWrapper>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ScrollToTopWrapperProps {
  children: React.ReactNode; // Explicitly typing children as React.ReactNode
}

const ScrollToTopWrapper: React.FC<ScrollToTopWrapperProps> = ({
  children,
}) => {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log("Manually scrolling to top:", pathname);
    window.history.scrollRestoration = "manual"; // Disable scroll restoration
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return <>{children}</>;
};

export default ScrollToTopWrapper;

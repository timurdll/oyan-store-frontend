import { Route, Routes, Navigate } from "react-router-dom";
import { publicRoutes, userRoutes, adminRoutes } from "./routes";
import { useSelector } from "react-redux";
import ScrollToTopWrapper from "./ScrollToTopWrapper";

const AppRouter: React.FC = () => {
  const user = useSelector((state: any) => state.user.currentUser);

  return (
    <ScrollToTopWrapper>
      <Routes>
        {publicRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

        {user ? (
          <>
            {userRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}

            {user.role === "admin" &&
              adminRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </ScrollToTopWrapper>
  );
};

export default AppRouter;

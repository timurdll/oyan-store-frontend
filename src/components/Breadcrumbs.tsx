import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Breadcrumbs = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const label = t(`breadcrumbs.${segment}`) || segment;

    return {
      path,
      label,
      isLast: index === pathSegments.length - 1,
    };
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `https://oyan-store.kz${crumb.path}`,
    })),
  };

  return (
    <>
      <nav className="breadcrumbs" aria-label="breadcrumb">
        <ol>
          <li>
            <Link to={`/${i18n.language}`}>{t("breadcrumbs.home")}</Link>
          </li>
          {breadcrumbs.map((crumb, index) => (
            <li key={index}>
              {crumb.isLast ? (
                <span>{crumb.label}</span>
              ) : (
                <Link to={crumb.path}>{crumb.label}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </>
  );
};

export default Breadcrumbs;

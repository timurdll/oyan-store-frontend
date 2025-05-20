import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "@styles/breadcrumbs.module.scss";

const Breadcrumbs = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const pathSegments = location.pathname
    .split("/")
    .filter((seg) => seg && seg !== lang);

  const breadcrumbs = pathSegments.map((segment, idx) => {
    const path = `/${lang}/${pathSegments.slice(0, idx + 1).join("/")}`;
    const label = t(`breadcrumbs.${segment}`) || segment;
    return {
      path,
      label,
      isLast: idx === pathSegments.length - 1,
    };
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("breadcrumbs.home"),
        item: `https://oyan-store.kz/${lang}`,
      },
      ...breadcrumbs.map((crumb, idx) => ({
        "@type": "ListItem",
        position: idx + 2,
        name: crumb.label,
        item: `https://oyan-store.kz${crumb.path}`,
      })),
    ],
  };

  return (
    <>
      <nav className={styles.breadcrumbs} aria-label="breadcrumb">
        <ol>
          <li>
            <Link to={`/${lang}`}>{t("breadcrumbs.home")}</Link>
          </li>
          {breadcrumbs.map((crumb, idx) => (
            <li key={idx}>
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

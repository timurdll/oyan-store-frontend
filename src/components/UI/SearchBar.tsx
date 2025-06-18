import { useState, useEffect, useMemo } from "react";
import styles from "@styles/searchbar.module.scss";
import searchIcon from "@assets/images/mingcute_search-line.svg";
import { useFetchProductsQuery } from "@redux/services";
import { Product } from "types/types";
import { useNavigate } from "react-router-dom";
import { createSlug } from "@components/Functions/createSlug";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  isSearchOpen?: boolean;
}

interface ProductWithOriginal extends Product {
  originalName?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ isSearchOpen }) => {
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ProductWithOriginal[]>([]);
  const { t, i18n } = useTranslation();
  const { data: products } = useFetchProductsQuery({
    language: i18n.language.toUpperCase(),
  });
  const navigate = useNavigate();

  // Мемоизированная фильтрация
  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    return (
      products?.products?.filter(
        (product: ProductWithOriginal) =>
          typeof product.name === "string" &&
          product.name.toLowerCase().includes(query.toLowerCase())
      ) || []
    );
  }, [query, products]);

  useEffect(() => {
    if (isSearchOpen) {
      setSearchResults(filteredProducts);
    } else {
      setQuery("");
      setSearchResults([]);
    }
  }, [filteredProducts, isSearchOpen]);

  const handleNavigate = (product: ProductWithOriginal) => {
    const slug = createSlug(product.name, product.originalName);
    navigate(`/${i18n.language}/product/${slug}`);
    setQuery("");
  };

  return (
    <div
      className={`${styles.search_container} ${
        isSearchOpen ? styles.active : ""
      }`}
    >
      <div className={styles.search_bar}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchBar.placeholder")}
          className={styles.input}
        />
        <button className={styles.button}>
          <img src={searchIcon} alt={t("searchBar.searchButton")} />
        </button>
      </div>
      {query && searchResults.length > 0 && (
        <div className={styles.search_results}>
          {searchResults.map((product) => (
            <div
              key={product.id}
              className={styles.search_result_item}
              onClick={() => handleNavigate(product)}
            >
              {product.name}
            </div>
          ))}
        </div>
      )}
      {query && searchResults.length === 0 && (
        <div className={styles.no_results}>{t("searchBar.noResults")}</div>
      )}
    </div>
  );
};

export default SearchBar;

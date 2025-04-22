import { useState, useEffect } from "react";
import styles from "@styles/searchbar.module.scss";
import searchIcon from "@assets/images/mingcute_search-line.svg";
import { useFetchProductsQuery } from "@redux/services";
import { Product } from "types/types";
import { useNavigate } from "react-router-dom";
import { createSlug } from "@components/Functions/createSlug";

interface SearchBarProps {
  isSearchOpen?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ isSearchOpen }) => {
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const { data: products } = useFetchProductsQuery({});
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim()) {
      const filteredProducts = products?.filter((product: Product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredProducts || []);
    } else {
      setSearchResults([]);
    }
  }, [query, products]);

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery("");
      setSearchResults([]);
    }
  }, [isSearchOpen]);

  const handleNavigate = (productName: string) => {
    const slug = createSlug(productName);
    navigate(`/product/${slug}`);
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
          placeholder="Я ищу..."
          className={styles.input}
        />
        <button className={styles.button}>
          <img src={searchIcon} alt="Search" />
        </button>
      </div>
      {query && searchResults.length > 0 && (
        <div className={styles.search_results}>
          {searchResults.map((product) => (
            <div
              key={product.id}
              className={styles.search_result_item}
              onClick={() => handleNavigate(product.name)}
            >
              {product.name}
            </div>
          ))}
        </div>
      )}
      {query && searchResults.length === 0 && (
        <div className={styles.no_results}>Нет результатов</div>
      )}
    </div>
  );
};

export default SearchBar;

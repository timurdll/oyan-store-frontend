import React, { useState, useRef, useCallback, useEffect } from "react";
import { Card } from "@components/Card";
import { SkeletonCard } from "@components/UI/SkeletonCard";
import NavBar from "@components/NavBar";
import styles from "./ProductListPage.module.scss";
import { useFetchProductsQuery, useFetchTypesQuery } from "@redux/services";
import { useTranslation } from "react-i18next";
import Slider from "@mui/material/Slider";
import CircularProgress from "@mui/material/CircularProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const PAGE_SIZE = 10;

const ProductListPage: React.FC = () => {
  const { i18n } = useTranslation();
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [offset, setOffset] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement | null>(null);
  const [pendingFilter, setPendingFilter] = useState(false);
  const [isBottomLoading, setIsBottomLoading] = useState(false);
  const [rangeValues, setRangeValues] = useState<number[]>([0, 100000]); // Default range values with type annotation
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 100000,
  }); // State to hold the actual min/max price range of all products
  const [isPriceRangeLoaded, setIsPriceRangeLoaded] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [initialPriceRange, setInitialPriceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const isMobile = useMediaQuery("(max-width:600px)");

  // Получаем типы для NavBar
  const { data: types } = useFetchTypesQuery({
    language: i18n.language.toUpperCase(),
  });

  // Получаем товары с фильтрами и пагинацией
  const { data, isLoading, isFetching, error } = useFetchProductsQuery({
    language: i18n.language.toUpperCase(),
    typeId: selectedType ?? undefined,
    minPrice: minPrice !== "" ? Number(minPrice) : undefined,
    maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
    sortBy: "price",
    sortOrder,
    limit: PAGE_SIZE,
    offset,
  });

  // Сброс offset и товаров при смене фильтров
  useEffect(() => {
    setOffset(0);
    setHasMore(true);
  }, [selectedType, minPrice, maxPrice, i18n.language]);

  // Добавляем новые товары при получении данных
  useEffect(() => {
    if (data?.products) {
      setProducts((prev) => {
        if (offset === 0) {
          setPendingFilter(false);
          return data.products;
        }
        const existingIds = new Set(prev.map((p) => p.id));
        const newProducts = data.products.filter(
          (p: any) => !existingIds.has(p.id)
        );
        return [...prev, ...newProducts];
      });
      setHasMore(data.pagination?.hasMore ?? false);
      setIsBottomLoading(false);
    }
  }, [data, offset]);

  // Infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isFetching && !isLoading) {
        setIsBottomLoading(true);
        setOffset((prev) => prev + PAGE_SIZE);
      }
    },
    [hasMore, isFetching, isLoading]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver]);

  // Получаем initialPriceRange только при первом ответе с бэка или при смене типа/языка
  useEffect(() => {
    if (data?.minPrice !== undefined && data?.maxPrice !== undefined) {
      setInitialPriceRange({ min: data.minPrice, max: data.maxPrice });
      setRangeValues([data.minPrice, data.maxPrice]);
    }
  }, [data?.minPrice, data?.maxPrice]);

  const applyPriceFilter = () => {
    // This button will now apply the filter based on current slider values
    setMinPrice(rangeValues[0].toString());
    setMaxPrice(rangeValues[1].toString());
    setOffset(0);
    setPendingFilter(true);
  };

  const handleReset = () => {
    if (!initialPriceRange) return;
    setRangeValues([initialPriceRange.min, initialPriceRange.max]);
    setMinPrice(initialPriceRange.min.toString());
    setMaxPrice(initialPriceRange.max.toString());
    setOffset(0);
    setProducts([]);
    setHasMore(true);
    setPendingFilter(true);
  };

  return (
    <>
      <NavBar onTypeSelect={setSelectedType} />
      <div className={styles.products}>
        <div className={styles.filters} style={{ minHeight: 138 }}>
          <label>Цена:</label>
          <Slider
            value={rangeValues}
            min={initialPriceRange?.min ?? 0}
            max={initialPriceRange?.max ?? 100000}
            step={1}
            onChange={(_, newValue) => setRangeValues(newValue as number[])}
            valueLabelDisplay={"auto"}
            disableSwap
            sx={{
              width: isMobile ? 220 : 120,
              minWidth: isMobile ? 180 : 90,
              marginLeft: 2,
              marginRight: 2,
              "& .MuiSlider-valueLabel": {
                background: "#1869ff",
                color: "#fff",
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: 13,
                padding: "2px 8px",
                top: -28,
                boxShadow: "0 2px 8px rgba(24,105,255,0.15)",
              },
              "& .MuiSlider-thumb": {
                border: "2px solid #1869ff",
                background: "#fff",
              },
              "& .MuiSlider-track": {
                background: "#1869ff",
              },
              "& .MuiSlider-rail": {
                background: "#e0e0e0",
              },
            }}
          />
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            variant="standard"
            disableUnderline
            sx={{
              color: "#1869ff",
              fontWeight: 400,
              fontSize: 15,
              minWidth: 90,
              background: "transparent",
              boxShadow: "none",
              border: "none",
              margin: 0,
              padding: 0,
              "& .MuiSelect-icon": {
                color: "#7fb6ff",
                fontSize: 20,
                right: 4,
              },
              "@media (max-width:600px)": {
                width: "100%",
                minWidth: 0,
                maxWidth: "100%",
                fontSize: 16,
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: 1.5,
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(24,105,255,0.07)",
                  mt: 0.5,
                  minWidth: 120,
                  color: "#1869ff",
                  fontWeight: 400,
                  fontSize: 15,
                },
              },
            }}
          >
            <MenuItem value="asc">По возрастанию цены</MenuItem>
            <MenuItem value="desc">По убыванию цены</MenuItem>
          </Select>
          <div className={styles.filterButtons}>
            <button className="apply" onClick={applyPriceFilter}>
              Применить
            </button>
            <button className="reset" onClick={handleReset}>
              Сбросить
            </button>
          </div>
        </div>
        <div
          className={styles.products_container}
          style={{ position: "relative" }}
        >
          {products.map((product, idx) => (
            <Card
              key={product.id || idx}
              product={{
                ...product,
              }}
            />
          ))}
          {(isLoading || isFetching || pendingFilter) && offset === 0 && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(255,255,255,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <CircularProgress color="primary" />
            </div>
          )}
        </div>
        {isBottomLoading && hasMore && (
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              margin: "24px 0",
              minHeight: 270,
              transition: "min-height 0.3s",
            }}
          >
            {Array.from({ length: Math.min(PAGE_SIZE, 4) }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        )}
        <div ref={loader} style={{ height: 40 }} />
      </div>
    </>
  );
};

export default ProductListPage;

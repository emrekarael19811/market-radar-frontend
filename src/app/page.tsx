"use client";

import { useState, useEffect } from "react";
import { Search, Layers, BadgePercent, CheckCircle2, Store, Sparkles } from "lucide-react";
import styles from "./page.module.css";
import { supabase, Product } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";

const CATEGORIES = ["Tümü", "Temel Gıda", "Kahvaltılık", "Atıştırmalık", "İçecek", "Temizlik", "Bakım"];
const SORT_OPTIONS = [
  { value: "default", label: "Varsayılan" },
  { value: "price_asc", label: "En Ucuz Önce" },
  { value: "price_desc", label: "En Pahalı Önce" },
  { value: "name_asc", label: "A → Z" },
];

// Regular expression building removed because Supabase's `ilike` does not support regex character classes.
// For advanced text search, Supabase .textSearch() is recommended, but for now we'll use standard ilike.

function getMinPrice(product: Product): number {
  const prices = Object.values(product.prices || {}).filter((p) => p > 0);
  return prices.length > 0 ? Math.min(...prices) : Infinity;
}

function sortProducts(products: Product[], sort: string): Product[] {
  const copy = [...products];
  if (sort === "price_asc") return copy.sort((a, b) => getMinPrice(a) - getMinPrice(b));
  if (sort === "price_desc") return copy.sort((a, b) => getMinPrice(b) - getMinPrice(a));
  if (sort === "name_asc") return copy.sort((a, b) => a.name.localeCompare(b.name, "tr"));
  return copy;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Tümü");
  const [sort, setSort] = useState("default");
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    async function fetchInitialProducts() {
      setLoading(true);
      setError(null);

      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      const total = count ?? 0;
      setTotalProducts(total);
      const start = total > 24 ? Math.floor(Math.random() * (total - 24)) : 0;

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .range(start, start + 23);

      if (error) {
        setError("Ürünler yüklenirken bir hata oluştu.");
      } else if (data) {
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setProducts(shuffled as Product[]);
      }
      setLoading(false);
    }
    fetchInitialProducts();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    let query = supabase
      .from("products")
      .select("*")
      .ilike("name", `%${searchTerm}%`)
      .limit(40);

    if (category !== "Tümü") {
      query = query.ilike("category", `%${category}%`);
    }

    const { data, error } = await query;

    if (error) {
      setError("Arama sırasında bir hata oluştu.");
    } else if (data) {
      setProducts(data as Product[]);
    }
    setLoading(false);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    if (hasSearched) {
      setSearchTerm("");
      setHasSearched(false);
    }
  };

  const displayedProducts = sortProducts(products, sort);

  return (
    <main className={styles.main}>
      {/* Arka Plan Glow Efektleri */}
      <div className={styles.glowBlob1}></div>
      <div className={styles.glowBlob2}></div>

      <CartDrawer />

      <div className={styles.header}>
        {/* Radar Scanner Logosu */}
        <div className={styles.radarWrapper}>
          <div className={styles.radarRing}></div>
          <div className={styles.radarRing2}></div>
          <div className={styles.radarRing3}></div>
          <div className={styles.radarScanner}></div>
          <Store size={36} className={styles.radarIcon} />
        </div>
        
        <h1 className={styles.title}>MarketRadar</h1>
        <p className={styles.subtitle}>
          Migros, ŞOK, A101 ve CarrefourSA fiyatlarını anında karşılaştır.
        </p>

        {/* Database Dashboard Stats Bar */}
        <div className={styles.statsBar}>
          <div className={styles.statsItem}>
            <span className={styles.statsIconWrapper}><Layers size={18} /></span>
            <div className={styles.statsText}>
              <span className={styles.statsValue}>
                {totalProducts > 0 ? totalProducts.toLocaleString('tr-TR') : '10.290+'}
              </span>
              <span className={styles.statsLabel}>Toplam Ürün</span>
            </div>
          </div>
          <div className={styles.statsItem}>
            <span className={styles.statsIconWrapper}><BadgePercent size={18} /></span>
            <div className={styles.statsText}>
              <span className={styles.statsValue}>%35'e Varan</span>
              <span className={styles.statsLabel}>Tasarruf Oranı</span>
            </div>
          </div>
          <div className={styles.statsItem}>
            <span className={styles.statsIconWrapper}><CheckCircle2 size={18} /></span>
            <div className={styles.statsText}>
              <span className={styles.statsValue}>Canlı ve Aktif</span>
              <span className={styles.statsLabel}>4 Market Entegre</span>
            </div>
          </div>
        </div>
      </div>

      <form className={styles.searchContainer} onSubmit={handleSearch}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Örn: sut, yumurta, kahve..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className={styles.searchButton}>
          <Search size={24} />
          <span>Ara</span>
        </button>
      </form>

      <div className={styles.controls}>
        <div className={styles.categories}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.catButton} ${category === cat ? styles.catActive : ""}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          className={styles.sortSelect}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <h2 className={styles.sectionTitle}>
          {hasSearched ? `"${searchTerm}" Arama Sonuçları` : "Öne Çıkan Ürünler"}
          {!loading && <span className={styles.resultCount}>{displayedProducts.length} ürün</span>}
        </h2>

        {loading ? (
          <div className={styles.loading}>Fiyatlar yükleniyor...</div>
        ) : error ? (
          <div className={styles.noResults}>{error}</div>
        ) : displayedProducts.length > 0 ? (
          <div className={styles.grid}>
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            &quot;{searchTerm}&quot; için hiçbir ürün bulunamadı.
          </div>
        )}
      </div>
    </main>
  );
}

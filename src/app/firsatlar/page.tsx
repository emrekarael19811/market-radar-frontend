"use client";

import { useState, useEffect, useMemo } from "react";
import { Flame, Clock, Store, SlidersHorizontal } from "lucide-react";
import { supabase, Campaign } from "@/lib/supabase";
import CampaignCard from "@/components/CampaignCard";
import styles from "./page.module.css";

const MARKET_FILTERS = [
  { value: "all",  label: "Tüm Marketler" },
  { value: "bim",  label: "BİM" },
  { value: "a101", label: "A101" },
  { value: "sok",  label: "ŞOK" },
];

const PERIOD_FILTERS = [
  { value: "all",      label: "Tümü",           icon: <Store size={14} /> },
  { value: "current",  label: "Bu Hafta",        icon: <Flame size={14} /> },
  { value: "upcoming", label: "Gelecek Hafta",   icon: <Clock size={14} /> },
];

const SORT_OPTIONS = [
  { value: "discount_desc", label: "En Yüksek İndirim" },
  { value: "price_asc",     label: "En Düşük Fiyat" },
  { value: "price_desc",    label: "En Yüksek Fiyat" },
  { value: "name_asc",      label: "A → Z" },
];

export default function FirsatlarPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [marketFilter, setMarketFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("current");
  const [sort, setSort] = useState("discount_desc");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("discount_percent", { ascending: false })
        .limit(500);

      if (error) {
        setError("Fırsatlar yüklenirken hata oluştu.");
      } else {
        setCampaigns((data as Campaign[]) ?? []);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = [...campaigns];

    if (marketFilter !== "all") list = list.filter((c) => c.market === marketFilter);
    if (periodFilter !== "all") list = list.filter((c) => c.period === periodFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || (c.brand ?? "").toLowerCase().includes(q));
    }

    if (sort === "discount_desc") list.sort((a, b) => (b.discount_percent ?? 0) - (a.discount_percent ?? 0));
    else if (sort === "price_asc")  list.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "name_asc")   list.sort((a, b) => a.name.localeCompare(b.name, "tr"));

    return list;
  }, [campaigns, marketFilter, periodFilter, sort, search]);

  // İstatistikler
  const stats = useMemo(() => {
    const total = filtered.length;
    const withDiscount = filtered.filter((c) => (c.discount_percent ?? 0) > 0).length;
    const maxDiscount = filtered.reduce((max, c) => Math.max(max, c.discount_percent ?? 0), 0);
    return { total, withDiscount, maxDiscount };
  }, [filtered]);

  return (
    <main className={styles.main}>
      <div className={styles.glowBlob1}></div>
      <div className={styles.glowBlob2}></div>

      {/* Başlık */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Flame size={32} className={styles.titleIcon} />
          <div>
            <h1 className={styles.title}>Fırsatlar</h1>
            <p className={styles.subtitle}>BİM, A101 ve ŞOK haftalık aktüel kampanyaları</p>
          </div>
        </div>

        {/* İstatistik Şeridi */}
        {!loading && (
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.total.toLocaleString("tr-TR")}</span>
              <span className={styles.statLabel}>Kampanya</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.withDiscount.toLocaleString("tr-TR")}</span>
              <span className={styles.statLabel}>İndirimli</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statValue} style={{ color: "#f43f5e" }}>
                {stats.maxDiscount > 0 ? `%${stats.maxDiscount}` : "—"}
              </span>
              <span className={styles.statLabel}>En Yüksek İndirim</span>
            </div>
          </div>
        )}
      </div>

      {/* Filtreler */}
      <div className={`glass-panel ${styles.filterPanel}`}>
        {/* Dönem (Bu hafta / Gelecek hafta) */}
        <div className={styles.filterRow}>
          {PERIOD_FILTERS.map((f) => (
            <button
              key={f.value}
              className={`${styles.filterBtn} ${periodFilter === f.value ? styles.filterActive : ""}`}
              onClick={() => setPeriodFilter(f.value)}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>

        {/* Market */}
        <div className={styles.filterRow}>
          {MARKET_FILTERS.map((f) => (
            <button
              key={f.value}
              className={`${styles.filterBtn} ${marketFilter === f.value ? styles.filterActive : ""}`}
              onClick={() => setMarketFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Arama + Sıralama */}
        <div className={styles.searchSortRow}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Ürün veya marka ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className={styles.sortWrapper}>
            <SlidersHorizontal size={15} className={styles.sortIcon} />
            <select
              className={styles.sortSelect}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* İçerik */}
      {loading ? (
        <div className={styles.loading}>Kampanyalar yükleniyor...</div>
      ) : error ? (
        <div className={styles.noResults}>{error}</div>
      ) : filtered.length === 0 ? (
        <div className={styles.noResults}>Bu filtreye uygun kampanya bulunamadı.</div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      )}
    </main>
  );
}

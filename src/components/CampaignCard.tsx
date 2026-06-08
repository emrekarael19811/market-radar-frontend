"use client";

import React from "react";
import styles from "./CampaignCard.module.css";
import { Campaign } from "@/lib/supabase";
import { ExternalLink, Tag } from "lucide-react";

const MARKET_LABELS: Record<string, { label: string; color: string }> = {
  bim:  { label: "BİM",  color: "#e53935" },
  a101: { label: "A101", color: "#00b8e6" },
  sok:  { label: "ŞOK",  color: "#ffcc00" },
};

interface Props {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: Props) {
  const market = MARKET_LABELS[campaign.market] ?? { label: campaign.market.toUpperCase(), color: "#6366f1" };
  const hasDiscount = campaign.old_price && campaign.old_price > campaign.price;

  return (
    <div className={`glass ${styles.card} animate-fade-in`}>
      {/* İndirim Rozeti */}
      {campaign.discount_percent && campaign.discount_percent > 0 && (
        <div className={styles.discountBadge}>
          %{campaign.discount_percent}
        </div>
      )}

      {/* Market Rozeti */}
      <div
        className={styles.marketBadge}
        style={{ background: `${market.color}22`, color: market.color, border: `1px solid ${market.color}44` }}
      >
        {market.label}
      </div>

      {/* Ürün Adı */}
      <div className={styles.name}>{campaign.name}</div>

      {/* Marka */}
      {campaign.brand && (
        <div className={styles.brand}>{campaign.brand}</div>
      )}

      {/* Fiyatlar */}
      <div className={styles.priceRow}>
        {hasDiscount && (
          <span className={styles.oldPrice}>
            {campaign.old_price!.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
          </span>
        )}
        <span className={styles.newPrice}>
          {campaign.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
        </span>
      </div>

      {/* Katalog Etiketi */}
      {campaign.catalog_label && (
        <div className={styles.catalogLabel}>
          <Tag size={11} />
          {campaign.catalog_label}
        </div>
      )}

      {/* Ürün Linki */}
      {campaign.product_url && (
        <a
          href={campaign.product_url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          <ExternalLink size={13} />
          Ürüne Git
        </a>
      )}
    </div>
  );
}

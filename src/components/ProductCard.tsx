import React from 'react';
import styles from './ProductCard.module.css';
import { Product } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { 
  Plus, 
  Flame, 
  Apple, 
  Egg, 
  Cookie, 
  Coffee, 
  Sparkles, 
  User, 
  ShoppingBag 
} from 'lucide-react';

interface Props {
  product: Product;
}

const MARKET_NAMES: Record<string, string> = {
  migros: 'Migros',
  sok: 'ŞOK',
  a101: 'A101',
  carrefoursa: 'CarrefourSA',
};

// Her market için CSS sınıf eklentileri
const MARKET_ROW_CLASS: Record<string, string> = {
  migros:     'rowMigros',
  sok:        'rowSok',
  a101:       'rowA101',
  carrefoursa:'rowCarrefoursa',
};

const MARKET_LABEL_CLASS: Record<string, string> = {
  migros:     'labelMigros',
  sok:        'labelSok',
  a101:       'labelA101',
  carrefoursa:'labelCarrefoursa',
};

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('gıda') || cat.includes('temel')) return <Apple size={14} />;
  if (cat.includes('kahvaltı')) return <Egg size={14} />;
  if (cat.includes('atıştırmalık') || cat.includes('bisküvi') || cat.includes('çikolata')) return <Cookie size={14} />;
  if (cat.includes('içecek') || cat.includes('kahve') || cat.includes('çay') || cat.includes('sut') || cat.includes('süt')) return <Coffee size={14} />;
  if (cat.includes('temizlik') || cat.includes('deterjan')) return <Sparkles size={14} />;
  if (cat.includes('bakım') || cat.includes('kozmetik') || cat.includes('şampuan')) return <User size={14} />;
  return <ShoppingBag size={14} />;
};

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  // En ucuz fiyatı bul
  const SUPPORTED_MARKETS = ["migros", "sok", "a101", "carrefoursa"];
  const prices = Object.entries(product.prices || {}).filter(
    ([market, price]) => price > 0 && SUPPORTED_MARKETS.includes(market)
  );
  if (prices.length === 0) return null;

  const minPrice = Math.min(...prices.map(([_, price]) => price));

  return (
    <div className={`glass ${styles.card} animate-fade-in`}>
      {prices.length > 1 && (
        <div className={styles.bestBadge}>
          <Flame size={14} />
          En Ucuz
        </div>
      )}
      
      <div className={styles.categoryBadge}>
        {getCategoryIcon(product.category)}
        <span>{product.category}</span>
      </div>

      <h3 className={styles.productName}>{product.name}</h3>
      
      <div className={styles.pricesContainer}>
        {prices.map(([market, price]) => {
          const isBest = price === minPrice;
          const rowClass = MARKET_ROW_CLASS[market] ? styles[MARKET_ROW_CLASS[market]] : '';
          const labelClass = MARKET_LABEL_CLASS[market] ? styles[MARKET_LABEL_CLASS[market]] : '';
          return (
            <div
              key={market}
              className={`${styles.priceRow} ${rowClass} ${isBest ? styles.bestPriceRow : ''}`}
            >
              <div className={styles.marketLabel}>
                <span className={`${styles.marketDot} ${styles[market] || ''}`}></span>
                <span className={labelClass}>
                  {MARKET_NAMES[market] || market.toUpperCase()}
                </span>
              </div>
              <div className={styles.priceContainerWrap}>
                <div className={`${styles.priceValue} ${isBest ? styles.bestPrice : ''}`}>
                  {price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                </div>
                <button 
                  className={styles.addButton}
                  onClick={() => addToCart(product, market, price)}
                  title="Listeye Ekle"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

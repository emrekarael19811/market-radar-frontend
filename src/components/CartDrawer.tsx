import React from 'react';
import styles from './CartDrawer.module.css';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, X, Trash2, Plus, Minus, Trophy } from 'lucide-react';

const MARKET_NAMES: Record<string, string> = {
  migros: 'Migros',
  sok: 'ŞOK',
  a101: 'A101',
  carrefoursa: 'CarrefourSA'
};

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const SUPPORTED_MARKETS = ["migros", "sok", "a101", "carrefoursa"];
  
  // Her market için toplam tutar ve mevcut ürün sayısı hesapla
  const marketTotals = SUPPORTED_MARKETS.reduce((acc, m) => {
    acc[m] = { total: 0, count: 0 };
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  items.forEach((item) => {
    SUPPORTED_MARKETS.forEach((m) => {
      const price = (item.product.prices as Record<string, number | undefined>)?.[m] || 0;
      if (price > 0) {
        marketTotals[m].total += price * item.quantity;
        marketTotals[m].count += 1;
      }
    });
  });

  // En ucuz marketi bul (öncelikle en çok ürünü barındıran, eşitlik durumunda en ucuzu seç)
  let cheapestMarket = "";
  let minTotal = Infinity;
  let maxCount = 0;

  SUPPORTED_MARKETS.forEach((m) => {
    const data = marketTotals[m];
    if (data.count > maxCount) {
      maxCount = data.count;
      cheapestMarket = m;
      minTotal = data.total;
    } else if (data.count === maxCount && data.count > 0) {
      if (data.total < minTotal) {
        cheapestMarket = m;
        minTotal = data.total;
      }
    }
  });

  return (
    <>
      <button className={styles.fab} onClick={() => setIsCartOpen(true)}>
        <ShoppingCart size={24} />
        {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
      </button>

      {isCartOpen && (
        <div className={styles.overlay} onClick={() => setIsCartOpen(false)}></div>
      )}

      <div className={`${styles.drawer} ${isCartOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2>Alışveriş Listeniz</h2>
          <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <ShoppingCart size={48} opacity={0.2} />
              <p>Listeniz henüz boş.</p>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div key={`${item.product.id}-${item.market}`} className={styles.cartItem}>
                  <div className={styles.itemInfo}>
                    <h4>{item.product.name}</h4>
                    <span className={`${styles.marketDot} ${styles[item.market] || ''}`}></span>
                    <span className={styles.marketName}>{MARKET_NAMES[item.market] || item.market}</span>
                  </div>
                  <div className={styles.itemControls}>
                    <div className={styles.quantityControl}>
                      <button onClick={() => updateQuantity(item.product.id, item.market, -1)}>
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.market, 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className={styles.price}>
                      {(item.price * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                    </div>
                    <button className={styles.deleteBtn} onClick={() => removeFromCart(item.product.id, item.market)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            {/* Market Bazlı Karşılaştırma Analizi */}
            <div className={styles.comparisonCard}>
              <h4 className={styles.comparisonTitle}>
                <Trophy size={16} style={{ marginRight: '6px', color: '#fbbf24' }} />
                Market Karşılaştırması
              </h4>
              <div className={styles.comparisonList}>
                {Object.entries(marketTotals).map(([m, data]) => {
                  const isCheapest = m === cheapestMarket && data.total > 0;
                  return (
                    <div key={m} className={`${styles.comparisonRow} ${isCheapest ? styles.cheapestRow : ''}`}>
                      <div className={styles.comparisonMarket}>
                        <span className={`${styles.marketDot} ${styles[m] || ''}`}></span>
                        <span className={styles.comparisonMarketName}>{MARKET_NAMES[m]}</span>
                        <span className={styles.itemCount}>({data.count}/{items.length} ürün)</span>
                      </div>
                      <div className={styles.comparisonValue}>
                        {data.total > 0 ? (
                          <span className={`${styles.comparisonPrice} ${isCheapest ? styles.cheapestPriceText : ''}`}>
                            {data.total.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                          </span>
                        ) : (
                          <span className={styles.noStock}>Stok Yok</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.totalRow}>
              <span>Seçilen Sepet Toplamı:</span>
              <span className={styles.totalAmount}>
                {totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
              </span>
            </div>
            
            <button className={styles.clearBtn} onClick={clearCart}>
              Listeyi Temizle
            </button>
          </div>
        )}
      </div>
    </>
  );
}

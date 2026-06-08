'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scan, Flame, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const { items } = useCart();
  const cartCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>

        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Scan size={18} color="white" />
            <div className={styles.logoPulse} />
          </div>
          <span className={styles.logoText}>Market<span className={styles.logoAccent}>Radar</span></span>
        </Link>

        {/* Linkler */}
        <div className={styles.links}>
          <Link
            href="/"
            className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}
          >
            Ürünler
          </Link>
          <Link
            href="/firsatlar"
            className={`${styles.link} ${pathname === '/firsatlar' ? styles.active : ''}`}
          >
            <Flame size={14} />
            Fırsatlar
          </Link>
        </div>

        {/* Sepet */}
        <div className={styles.cartWrap}>
          <ShoppingCart size={20} className={styles.cartIcon} />
          {cartCount > 0 && (
            <span className={styles.cartBadge}>{cartCount}</span>
          )}
        </div>

      </div>
    </nav>
  );
}

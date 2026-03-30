import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          smart<span>.serve</span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/services" className={styles.link}>
            Services
          </Link>
          <Link href="/gallery" className={styles.link}>
            Gallery
          </Link>
          <Link href="/cart" className={styles.link}>
            Cart
          </Link>
          <Link href="/account" className={styles.accountBtn}>
            Account
          </Link>
        </div>
      </div>
    </nav>
  );
}

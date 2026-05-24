import Image from "next/image";
import styles from "./footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Image
            src="/logo_principal1.png"
            alt="Serfi IA"
            width={24}
            height={24}
          />
          <span>Serfi IA</span>
        </div>

        <p className={styles.copy}>
          © {year} Serfinanzas. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

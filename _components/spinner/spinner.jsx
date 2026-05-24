import styles from "./spinner.module.css";

export default function Spinner({ size = "md", label = "Cargando" }) {
  return (
    <div
      className={`${styles.wrapper} ${styles[size]}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className={styles.ring} aria-hidden="true" />
    </div>
  );
}

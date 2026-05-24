import styles from './statCard.module.css';

export default function StatCard({ label, value, suffix = '', hint = null, highlight = false }) {
  return (
    <article className={`${styles.card} ${highlight ? styles.highlight : ''}`}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>
        {value ?? '—'}{suffix}
      </p>
      {hint && <p className={styles.hint}>{hint}</p>}
    </article>
  );
}

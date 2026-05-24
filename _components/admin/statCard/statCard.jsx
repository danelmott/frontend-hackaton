import styles from './statCard.module.css';

export default function StatCard({ label, value, suffix = '' }) {
  return (
    <article className={styles.card}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>
        {value ?? '—'}{suffix}
      </p>
    </article>
  );
}

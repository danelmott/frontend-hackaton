import styles from './productDemand.module.css';

export default function ProductDemand({ items = [] }) {
  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Demanda por producto</h2>
      <div className={styles.list}>
        {items.map((item) => (
          <div key={item.productId} className={styles.row}>
            <div className={styles.meta}>
              <span className={styles.name}>{item.name}</span>
              <span className={styles.count}>{item.count}</span>
            </div>
            <div className={styles.track}>
              <div
                className={styles.bar}
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

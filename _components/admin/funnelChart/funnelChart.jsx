import styles from './funnelChart.module.css';

export default function FunnelChart({ funnel }) {
  if (!funnel) return null;

  const steps = [
    { label: 'Registrados', value: funnel.registered },
    { label: 'Perfil iniciado', value: funnel.profileStarted },
    { label: 'Perfil completo', value: funnel.profileComplete },
    { label: 'Interés en producto', value: funnel.withProductInterest },
    { label: 'Leads calientes', value: funnel.hotLeads },
  ];

  const max = steps[0]?.value || 1;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Embudo Serfi</h2>
      <div className={styles.steps}>
        {steps.map((step) => (
          <div key={step.label} className={styles.step}>
            <div className={styles.meta}>
              <span>{step.label}</span>
              <span>{step.value}</span>
            </div>
            <div className={styles.track}>
              <div
                className={styles.bar}
                style={{ width: `${max ? (step.value / max) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import styles from './funnelChart.module.css';

const CONVERSION_LABELS = {
  registeredToStarted: 'Registrado → Perfil iniciado',
  startedToComplete: 'Iniciado → Completo',
  completeToInterest: 'Completo → Interés',
  interestToHot: 'Interés → Lead caliente',
};

export default function FunnelChart({ funnel, conversionRates }) {
  if (!funnel) return null;

  const steps = [
    { label: 'Registrados', value: funnel.registered, conversionKey: null },
    { label: 'Perfil iniciado', value: funnel.profileStarted, conversionKey: 'registeredToStarted' },
    { label: 'Perfil completo', value: funnel.profileComplete, conversionKey: 'startedToComplete' },
    { label: 'Interés en producto', value: funnel.withProductInterest, conversionKey: 'completeToInterest' },
    { label: 'Leads calientes', value: funnel.hotLeads, conversionKey: 'interestToHot' },
  ];

  const max = steps[0]?.value || 1;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Embudo Serfi</h2>
      <p className={styles.subtitle}>
        % de conversión entre fases — identifica dónde se pierden leads
      </p>
      <div className={styles.steps}>
        {steps.map((step) => {
          const rate = step.conversionKey ? conversionRates?.[step.conversionKey] : null;
          return (
            <div key={step.label} className={styles.step}>
              {rate != null && (
                <p className={styles.conversion}>
                  {CONVERSION_LABELS[step.conversionKey]}: <strong>{rate}%</strong>
                </p>
              )}
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
          );
        })}
      </div>
    </section>
  );
}

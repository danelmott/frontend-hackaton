'use client';

import { useEffect } from 'react';
import useAdminUserDetail from '@/_services/admin/useAdminUserDetail';
import { formatCop } from '@/_components/admin/utils/format';
import { Icon } from '@/_components/icon/icon';
import styles from './leadDetailDrawer.module.css';

const CLASSIFICATION_STYLES = {
  saludable: styles.saludable,
  aceptable: styles.aceptable,
  riesgoso: styles.riesgoso,
  sobreendeudado: styles.sobreendeudado,
};

const URGENCY_STYLES = {
  listo: styles.urgencyListo,
  evaluando: styles.urgencyEvaluando,
  explorando: styles.urgencyExplorando,
};

function DataRow({ label, value }) {
  return (
    <div className={styles.dataRow}>
      <span className={styles.dataLabel}>{label}</span>
      <span className={styles.dataValue}>{value}</span>
    </div>
  );
}

export default function LeadDetailDrawer({ userId, onClose }) {
  const { user, loading, error } = useAdminUserDetail(userId);

  useEffect(() => {
    if (!userId) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [userId, onClose]);

  if (!userId) return null;

  const profile = user?.profile;
  const debt = user?.debtCapacity;
  const nextAction = user?.nextAction;
  const primary = user?.primaryEligibility;
  const urgency = user?.lead?.urgencyLevel ?? 'explorando';
  const isNegativeQuota = (debt?.availableQuota ?? 0) < 0;

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <aside className={styles.drawer} role="dialog" aria-label="Detalle del lead">
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <span className={styles.eyebrow}>Perfil del lead</span>
            <h2 className={styles.title}>{user?.email ?? 'Cargando...'}</h2>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            <Icon name="close" size="sm" />
          </button>
        </header>

        {loading && (
          <div className={styles.stateWrap}>
            <p className={styles.state}>Cargando perfil...</p>
          </div>
        )}
        {error && (
          <div className={styles.stateWrap}>
            <p className={styles.stateError}>{error}</p>
          </div>
        )}

        {!loading && !error && user && (
          <div className={styles.body}>
            {nextAction && (
              <div className={`${styles.actionBlock} ${styles[`action_${nextAction.priority}`] ?? ''}`}>
                <span className={styles.actionEyebrow}>Próxima acción</span>
                <p className={styles.actionTitle}>{nextAction.label}</p>
                <p className={styles.actionDetail}>{nextAction.detail}</p>
              </div>
            )}

            {user.inconsistencies?.length > 0 && (
              <div className={styles.alertList}>
                {user.inconsistencies.map((flag) => (
                  <p key={flag.type} className={styles.alert}>
                    <Icon name="warning" size="sm" />
                    {flag.message}
                  </p>
                ))}
              </div>
            )}

            <div className={styles.statusStrip}>
              <span className={`${styles.chip} ${URGENCY_STYLES[urgency] ?? ''}`}>
                {urgency}
              </span>
              <span className={styles.chipMuted}>{user.phase?.label ?? '—'}</span>
            </div>

            <div className={styles.metricsRow}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Score</span>
                <span className={styles.metricValue}>{profile?.financialHealthScore ?? '—'}</span>
              </div>
              <div className={styles.metricDivider} />
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Endeudamiento</span>
                <span className={`${styles.metricValue} ${debt?.classification ? CLASSIFICATION_STYLES[debt.classification] : ''}`}>
                  {debt?.debtRatio != null ? `${debt.debtRatio}%` : '—'}
                </span>
              </div>
              <div className={styles.metricDivider} />
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Cuota disp.</span>
                <span className={`${styles.metricValue} ${isNegativeQuota ? styles.negative : ''}`}>
                  {debt?.availableQuota != null ? formatCop(debt.availableQuota) : '—'}
                </span>
              </div>
            </div>

            <section className={styles.block}>
              <h3 className={styles.blockTitle}>Datos capturados</h3>
              <div className={styles.dataList}>
                <DataRow label="Tipo de ingreso" value={profile?.employmentType ?? '—'} />
                <DataRow label="Ingreso neto" value={formatCop(profile?.monthlyIncome)} />
                <DataRow label="Antigüedad" value={profile?.employmentSeniority ?? '—'} />
                <DataRow label="Deudas actuales" value={formatCop(profile?.monthlyDebtPayments)} />
                <DataRow label="Ahorros" value={formatCop(profile?.currentSavings)} />
                <DataRow label="Edad" value={profile?.age ? `${profile.age} años` : '—'} />
              </div>
            </section>

            {debt?.formulas && (
              <section className={styles.block}>
                <h3 className={styles.blockTitle}>Capacidad de endeudamiento</h3>
                <div className={styles.calcList}>
                  <div className={styles.calcItem}>
                    <div className={styles.calcHeader}>
                      <span className={styles.calcName}>Nivel de endeudamiento</span>
                      <span className={`${styles.calcBadge} ${CLASSIFICATION_STYLES[debt.classification] ?? ''}`}>
                        {debt.classificationLabel}
                      </span>
                    </div>
                    <p className={styles.calcResult}>{debt.debtRatio}%</p>
                    <p className={styles.calcFormula}>{debt.formulas.debtRatio}</p>
                  </div>
                  <div className={styles.calcItem}>
                    <div className={styles.calcHeader}>
                      <span className={styles.calcName}>Cuota disponible</span>
                    </div>
                    <p className={`${styles.calcResult} ${isNegativeQuota ? styles.negative : ''}`}>
                      {formatCop(debt.availableQuota)}<span className={styles.calcUnit}>/mes</span>
                    </p>
                    <p className={styles.calcFormula}>{debt.formulas.availableQuota}</p>
                  </div>
                </div>
              </section>
            )}

            {primary && (
              <section className={styles.block}>
                <h3 className={styles.blockTitle}>Elegibilidad</h3>
                <p className={styles.productName}>{primary.name}</p>
                <div className={styles.eligibilityMeta}>
                  <span className={primary.eligible ? styles.eligibleYes : styles.eligibleNo}>
                    {primary.eligible ? 'Elegible' : 'No elegible'}
                  </span>
                  {primary.potentialPlacement > 0 && (
                    <span className={styles.placement}>
                      Colocación {formatCop(primary.potentialPlacement)}
                    </span>
                  )}
                </div>
                <p className={styles.reason}>{primary.reason}</p>
              </section>
            )}

            <section className={styles.block}>
              <h3 className={styles.blockTitle}>Producto de interés</h3>
              <p className={styles.productHighlight}>
                {user.lead?.topProduct ?? profile?.targetProduct ?? 'Sin definir'}
              </p>
            </section>

            {user.missingPhase1Fields?.length > 0 && (
              <section className={styles.block}>
                <h3 className={styles.blockTitle}>Datos faltantes</h3>
                <div className={styles.tagList}>
                  {user.missingPhase1Fields.map((field) => (
                    <span key={field} className={styles.tag}>{field}</span>
                  ))}
                </div>
              </section>
            )}

            {user.productInterests?.length > 0 && (
              <section className={styles.block}>
                <h3 className={styles.blockTitle}>Intereses registrados</h3>
                <ul className={styles.interestList}>
                  {user.productInterests.map((item) => (
                    <li key={item.id}>
                      <span>{item.productName}</span>
                      <span className={styles.interestCount}>{item.count}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

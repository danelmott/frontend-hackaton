'use client';

import { useMemo, useState } from 'react';
import LeadDetailDrawer from '@/_components/admin/leadDetailDrawer/leadDetailDrawer';
import { formatCop } from '@/_components/admin/utils/format';
import styles from './hotLeadsTable.module.css';

const URGENCY_OPTIONS = [
  { value: '', label: 'Todas las urgencias' },
  { value: 'listo', label: 'Listo' },
  { value: 'evaluando', label: 'Evaluando' },
  { value: 'explorando', label: 'Explorando' },
];

const ELIGIBLE_OPTIONS = [
  { value: '', label: 'Toda elegibilidad' },
  { value: 'true', label: 'Elegibles' },
  { value: 'false', label: 'No elegibles' },
];

export default function HotLeadsTable({ leads = [] }) {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [eligibleFilter, setEligibleFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');

  const productOptions = useMemo(() => {
    const ids = [...new Set(leads.map((l) => l.topProductId).filter(Boolean))];
    return [
      { value: '', label: 'Todos los productos' },
      ...ids.map((id) => ({
        value: id,
        label: leads.find((l) => l.topProductId === id)?.topProduct ?? id,
      })),
    ];
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (urgencyFilter && lead.urgencyLevel !== urgencyFilter) return false;
      if (eligibleFilter === 'true' && lead.eligible !== true) return false;
      if (eligibleFilter === 'false' && lead.eligible !== false) return false;
      if (productFilter && lead.topProductId !== productFilter) return false;
      return true;
    });
  }, [leads, urgencyFilter, eligibleFilter, productFilter]);

  return (
    <>
      <section className={styles.section}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Leads calientes</h2>
            <p className={styles.subtitle}>
              Ordenados por prioridad: elegibles + alta urgencia primero
            </p>
          </div>
          <span className={styles.count}>{filteredLeads.length} leads</span>
        </div>

        <div className={styles.filters}>
          <select
            className={styles.select}
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
          >
            {URGENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            className={styles.select}
            value={eligibleFilter}
            onChange={(e) => setEligibleFilter(e.target.value)}
          >
            {ELIGIBLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            className={styles.select}
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
          >
            {productOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {filteredLeads.length === 0 ? (
          <p className={styles.empty}>No hay leads que coincidan con los filtros.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Prioridad</th>
                  <th>Usuario</th>
                  <th>Producto</th>
                  <th>Ingresos</th>
                  <th>Endeudamiento</th>
                  <th>Urgencia</th>
                  <th>Próxima acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.userId}
                    className={`${styles.row} ${lead.inconsistencies?.length ? styles.inconsistent : ''}`}
                    onClick={() => setSelectedUserId(lead.userId)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedUserId(lead.userId);
                      }
                    }}
                  >
                    <td>
                      <span className={`${styles.priority} ${lead.nextAction?.priority === 'high' ? styles.priorityHigh : ''}`}>
                        {lead.nextAction?.priority === 'high' ? '●' : lead.priorityScore}
                      </span>
                    </td>
                    <td>
                      <span className={styles.email}>{lead.email}</span>
                      {lead.inconsistencies?.length > 0 && (
                        <span className={styles.flag} title={lead.inconsistencies[0].message}>
                          ⚠
                        </span>
                      )}
                    </td>
                    <td>{lead.topProduct ?? '—'}</td>
                    <td>{formatCop(lead.monthlyIncome)}</td>
                    <td>
                      {lead.debtCapacity?.debtRatio != null
                        ? `${lead.debtCapacity.debtRatio}%`
                        : '—'}
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles[lead.urgencyLevel] ?? ''}`}>
                        {lead.urgencyLevel}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.action} ${styles[`action_${lead.nextAction?.priority}`] ?? ''}`}>
                        {lead.nextAction?.label ?? '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedUserId && (
        <LeadDetailDrawer
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </>
  );
}

'use client';

import { useCallback } from 'react';
import useAdminDashboard from '@/_services/admin/useAdminDashboard';
import useAdminLeadNotificationsSSE from '@/_services/admin/useAdminLeadNotificationsSSE';
import StatCard from '@/_components/admin/statCard/statCard';
import ProductDemand from '@/_components/admin/productDemand/productDemand';
import FunnelChart from '@/_components/admin/funnelChart/funnelChart';
import HotLeadsTable from '@/_components/admin/hotLeadsTable/hotLeadsTable';
import { formatCop } from '@/_components/admin/utils/format';
import styles from './page.module.css';

export default function AdminPage() {
  const { data, loading, error, refresh } = useAdminDashboard();

  const handleHotLead = useCallback(() => {
    refresh(true);
  }, [refresh]);

  useAdminLeadNotificationsSSE({ enabled: Boolean(data), onHotLead: handleHotLead });

  if (loading) {
    return <p className={styles.state}>Cargando métricas...</p>;
  }

  if (error) {
    return <p className={styles.stateError}>{error}</p>;
  }

  return (
    <div className={styles.page}>
      <section className={styles.kpis}>
        <StatCard
          label="Llamar hoy"
          value={data.callTodayCount}
          highlight={data.callTodayCount > 0}
          hint="Leads elegibles en estado 'listo'. Priorizar estas llamadas."
        />
        <StatCard
          label="Colocación potencial"
          value={formatCop(data.potentialPlacement)}
          hint={`${data.potentialPlacementLeadCount ?? 0} leads elegibles. Suma estimada de montos colocables.`}
        />
        <StatCard
          label="Tiempo promedio perfil"
          value={data.avgProfileCompletionDays ?? '—'}
          suffix={data.avgProfileCompletionDays != null ? ' días' : ''}
          hint="Días desde registro hasta completar Fase 1. Si sube, simplificar captura."
        />
        <StatCard
          label="Leads calientes"
          value={data.hotLeadsCount}
          hint="Usuarios evaluando o listos con interés en producto."
        />
        <StatCard
          label="Perfiles completos"
          value={data.profilesComplete}
          suffix={` / ${data.totalUsers}`}
          hint={`${data.profileCompletionRate}% del total. Meta: subir conversión en el embudo.`}
        />
        <StatCard
          label="Activos 7 días"
          value={data.activeUsers7d}
          hint="Perfiles actualizados recientemente. Retomar si están estancados."
        />
      </section>

      <section className={styles.grid}>
        <ProductDemand items={data.productDemand} />
        <FunnelChart funnel={data.funnel} conversionRates={data.conversionRates} />
      </section>

      <HotLeadsTable leads={data.hotLeads} />
    </div>
  );
}

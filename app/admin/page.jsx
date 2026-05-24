'use client';

import useAdminDashboard from '@/_services/admin/useAdminDashboard';
import StatCard from '@/_components/admin/statCard/statCard';
import ProductDemand from '@/_components/admin/productDemand/productDemand';
import FunnelChart from '@/_components/admin/funnelChart/funnelChart';
import HotLeadsTable from '@/_components/admin/hotLeadsTable/hotLeadsTable';
import styles from './page.module.css';

export default function AdminPage() {
  const { data, loading, error } = useAdminDashboard();

  if (loading) {
    return <p className={styles.state}>Cargando métricas...</p>;
  }

  if (error) {
    return <p className={styles.stateError}>{error}</p>;
  }

  return (
    <div className={styles.page}>
      <section className={styles.kpis}>
        <StatCard label="Usuarios" value={data.totalUsers} />
        <StatCard label="Perfiles iniciados" value={data.profilesStarted} />
        <StatCard label="Leads calientes" value={data.hotLeadsCount} />
        <StatCard
          label="Score promedio"
          value={data.avgHealthScore ?? '—'}
        />
        <StatCard
          label="Completitud perfiles"
          value={data.profileCompletionRate}
          suffix="%"
        />
        <StatCard label="Activos 7 días" value={data.activeUsers7d} />
      </section>

      <section className={styles.grid}>
        <ProductDemand items={data.productDemand} />
        <FunnelChart funnel={data.funnel} />
      </section>

      <HotLeadsTable leads={data.hotLeads} />
    </div>
  );
}

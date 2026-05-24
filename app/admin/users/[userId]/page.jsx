'use client';

import Link from 'next/link';
import { use } from 'react';
import useAdminUserDetail from '@/_services/admin/useAdminUserDetail';
import styles from './page.module.css';

function formatCop(value) {
  if (value == null) return '—';
  return `$${Number(value).toLocaleString('es-CO')}`;
}

export default function AdminUserPage({ params }) {
  const { userId } = use(params);
  const { user, loading, error } = useAdminUserDetail(userId);

  if (loading) return <p className={styles.state}>Cargando usuario...</p>;
  if (error) return <p className={styles.stateError}>{error}</p>;
  if (!user) return <p className={styles.state}>Usuario no encontrado.</p>;

  const profile = user.profile;

  return (
    <div className={styles.page}>
      <Link href="/admin" className={styles.back}>← Volver al dashboard</Link>

      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>{user.email}</h2>
          <p className={styles.subtitle}>{user.chatsCount} chats · Score {profile?.financialHealthScore ?? '—'}</p>
        </div>
        <span className={styles.badge}>{profile?.urgencyLevel ?? 'explorando'}</span>
      </header>

      <section className={styles.grid}>
        <article className={styles.card}>
          <h3>Perfil financiero</h3>
          <ul>
            <li><span>Objetivo</span><strong>{profile?.objective ?? '—'}</strong></li>
            <li><span>Ingresos</span><strong>{formatCop(profile?.monthlyIncome)}</strong></li>
            <li><span>Ahorro</span><strong>{formatCop(profile?.currentSavings)}</strong></li>
            <li><span>Gastos fijos</span><strong>{formatCop(profile?.fixedExpenses)}</strong></li>
            <li><span>Plazo meta</span><strong>{profile?.goalTimeframe ?? '—'}</strong></li>
            <li><span>Empleo</span><strong>{profile?.employmentType ?? '—'}</strong></li>
          </ul>
        </article>

        <article className={styles.card}>
          <h3>Elegibilidad (KB oficial)</h3>
          <ul className={styles.eligibilityList}>
            {user.eligibilities.map((item) => (
              <li key={item.productId}>
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.reason}</p>
                </div>
                <span className={item.eligible ? styles.yes : styles.no}>
                  {item.eligible ? 'Sí' : 'No'}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <article className={styles.card}>
        <h3>Intereses en productos</h3>
        {user.productInterests.length === 0 ? (
          <p className={styles.empty}>Sin intereses registrados.</p>
        ) : (
          <ul className={styles.interestList}>
            {user.productInterests.map((interest) => (
              <li key={interest.id}>
                <span>{interest.productName}</span>
                <span>{interest.count} consultas</span>
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  );
}

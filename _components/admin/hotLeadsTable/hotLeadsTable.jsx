import Link from 'next/link';
import styles from './hotLeadsTable.module.css';

function formatCop(value) {
  if (value == null) return '—';
  return `$${Number(value).toLocaleString('es-CO')}`;
}

export default function HotLeadsTable({ leads = [] }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Leads calientes</h2>

      {leads.length === 0 ? (
        <p className={styles.empty}>Aún no hay leads con perfil o interés registrado.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Producto</th>
                <th>Ingresos</th>
                <th>Ahorro</th>
                <th>Urgencia</th>
                <th>Elegible</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.userId}>
                  <td>
                    <Link href={`/admin/users/${lead.userId}`} className={styles.link}>
                      {lead.email}
                    </Link>
                  </td>
                  <td>{lead.topProduct ?? '—'}</td>
                  <td>{formatCop(lead.monthlyIncome)}</td>
                  <td>{formatCop(lead.currentSavings)}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[lead.urgencyLevel] ?? ''}`}>
                      {lead.urgencyLevel}
                    </span>
                  </td>
                  <td>{lead.eligible === true ? 'Sí' : lead.eligible === false ? 'No' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

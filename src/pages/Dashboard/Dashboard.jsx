import styles from './Dashboard.module.css';

const kpis = [
  {
    label: 'Total factures',
    value: '128',
    trend: '+12 ce mois',
    trendUp: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    label: 'Montant total',
    value: '84 320 €',
    trend: '+8% vs mois dernier',
    trendUp: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    label: 'Payées',
    value: '97',
    trend: '75% du total',
    trendUp: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
  {
    label: 'En retard',
    value: '11',
    trend: '3 cette semaine',
    trendUp: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
];

const recentInvoices = [
  { id: 'FAC-2024-089', client: 'Société Dupont', date: '18 juin 2025', amount: '3 200 €', status: 'payée' },
  { id: 'FAC-2024-088', client: 'Atelier Martin', date: '15 juin 2025', amount: '780 €', status: 'en attente' },
  { id: 'FAC-2024-087', client: 'BTP Lefèvre', date: '12 juin 2025', amount: '12 450 €', status: 'en retard' },
  { id: 'FAC-2024-086', client: 'Cabinet Renard', date: '10 juin 2025', amount: '1 900 €', status: 'payée' },
  { id: 'FAC-2024-085', client: 'Imprimerie Blanc', date: '7 juin 2025', amount: '560 €', status: 'en attente' },
];

const statusConfig = {
  'payée':     { label: 'Payée',      className: 'statusPaid' },
  'en attente':{ label: 'En attente', className: 'statusPending' },
  'en retard': { label: 'En retard',  className: 'statusLate' },
};

function Dashboard({ onImport }) {
  return (
    <div className={styles.page}>

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Vue d'ensemble</h1>
          <p className={styles.pageSubtitle}>Bienvenue, Mohamed. Voici l'état de vos factures.</p>
        </div>
        <button className={styles.importBtn} onClick={onImport}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Importer une facture
        </button>
      </div>

      <div className={styles.kpiGrid}>
        {kpis.map((kpi) => (
          <div key={kpi.label} className={styles.kpiCard}>
            <div className={styles.kpiTop}>
              <span className={styles.kpiLabel}>{kpi.label}</span>
              <span className={styles.kpiIcon}>{kpi.icon}</span>
            </div>
            <p className={styles.kpiValue}>{kpi.value}</p>
            <p className={`${styles.kpiTrend} ${kpi.trendUp ? styles.trendUp : styles.trendDown}`}>
              {kpi.trendUp ? '↑' : '↓'} {kpi.trend}
            </p>
          </div>
        ))}
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Factures récentes</h2>
          <button className={styles.viewAllBtn}>Voir toutes les factures →</button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Référence</th>
              <th className={styles.th}>Client</th>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Montant</th>
              <th className={styles.th}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {recentInvoices.map((inv) => {
              const s = statusConfig[inv.status];
              return (
                <tr key={inv.id} className={styles.tr}>
                  <td className={`${styles.td} ${styles.tdRef}`}>{inv.id}</td>
                  <td className={styles.td}>{inv.client}</td>
                  <td className={`${styles.td} ${styles.tdMuted}`}>{inv.date}</td>
                  <td className={`${styles.td} ${styles.tdAmount}`}>{inv.amount}</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles[s.className]}`}>{s.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Dashboard;
import { useState } from 'react';
import styles from './Factures.module.css';

const allInvoices = [
  { id: 'FAC-2024-089', client: 'Société Dupont',    date: '18 juin 2025', amount: '3 200 €',  status: 'payée' },
  { id: 'FAC-2024-088', client: 'Atelier Martin',    date: '15 juin 2025', amount: '780 €',    status: 'en attente' },
  { id: 'FAC-2024-087', client: 'BTP Lefèvre',       date: '12 juin 2025', amount: '12 450 €', status: 'en retard' },
  { id: 'FAC-2024-086', client: 'Cabinet Renard',    date: '10 juin 2025', amount: '1 900 €',  status: 'payée' },
  { id: 'FAC-2024-085', client: 'Imprimerie Blanc',  date: '7 juin 2025',  amount: '560 €',    status: 'en attente' },
  { id: 'FAC-2024-084', client: 'Société Dupont',    date: '3 juin 2025',  amount: '4 100 €',  status: 'payée' },
  { id: 'FAC-2024-083', client: 'Transport Morel',   date: '28 mai 2025',  amount: '2 750 €',  status: 'en retard' },
  { id: 'FAC-2024-082', client: 'Cabinet Renard',    date: '24 mai 2025',  amount: '890 €',    status: 'payée' },
  { id: 'FAC-2024-081', client: 'BTP Lefèvre',       date: '20 mai 2025',  amount: '6 300 €',  status: 'en attente' },
  { id: 'FAC-2024-080', client: 'Atelier Martin',    date: '15 mai 2025',  amount: '1 200 €',  status: 'payée' },
];

const statusConfig = {
  'payée':      { label: 'Payée',       className: 'statusPaid' },
  'en attente': { label: 'En attente',  className: 'statusPending' },
  'en retard':  { label: 'En retard',   className: 'statusLate' },
};

const tabs = [
  { key: 'all',         label: 'Toutes' },
  { key: 'payée',       label: 'Payées' },
  { key: 'en attente',  label: 'En attente' },
  { key: 'en retard',   label: 'En retard' },
];

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

function Factures() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = allInvoices.filter((inv) => {
    const matchesTab = activeTab === 'all' || inv.status === activeTab;
    const matchesSearch =
      inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className={styles.page}>

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Factures</h1>
          <p className={styles.pageSubtitle}>{allInvoices.length} factures au total</p>
        </div>
        <button className={styles.importBtn}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Importer une facture
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span className={`${styles.tabCount} ${activeTab === tab.key ? styles.tabCountActive : ''}`}>
                {tab.key === 'all'
                  ? allInvoices.length
                  : allInvoices.filter(i => i.status === tab.key).length}
              </span>
            </button>
          ))}
        </div>

        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}><SearchIcon /></span>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Rechercher par client ou référence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Référence</th>
              <th className={styles.th}>Client</th>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Montant</th>
              <th className={styles.th}>Statut</th>
              <th className={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>Aucune facture trouvée.</td>
              </tr>
            ) : (
              filtered.map((inv) => {
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
                    <td className={styles.td}>
                      <button className={styles.actionBtn}>Voir →</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Factures;
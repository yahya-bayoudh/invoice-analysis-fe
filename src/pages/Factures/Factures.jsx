import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import styles from './Factures.module.css';
import { useNavigate } from 'react-router-dom';

const statusConfig = {
  done: { label: 'Payée', className: 'statusPaid' },
  pending: { label: 'En attente', className: 'statusPending' },
  error: { label: 'En retard', className: 'statusLate' },
};

const normalizeStatus = (status) => {
  const value = status?.toString().trim().toLowerCase();

  switch (value) {
    case 'done':
      return 'done';
    case 'pending':
      return 'pending';
    case 'error':
      return 'error';
    default:
      return undefined;
  }
};

const tabs = [
  { key: 'all', label: 'Toutes' },
  { key: 'done', label: 'Payées' },
  { key: 'pending', label: 'En attente' },
  { key: 'error', label: 'En retard' },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

function Factures({ onImport }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const pageSize = 8;

  useEffect(() => {
    let mounted = true;

    const loadInvoices = async () => {
      try {
        setLoading(true);
        const userId = user?.id || user?._id || user?.email;
        const response = await axios.get('http://localhost:3000/invoices', {
          params: {
            page,
            limit: pageSize,
            status: activeTab === 'all' ? undefined : activeTab,
            userId,
          },
        });

        if (mounted) {
          const payload = (response.data?.data || []).map((invoice) => ({
            ...invoice,
            status: normalizeStatus(invoice.status) || invoice.status,
          }));

          setInvoices(payload);
          setTotalPages(response.data?.totalPages || 1);
          setTotalItems(response.data?.total || 0);
          setError('');
        }
      } catch (err) {
        if (mounted) {
          setError('Impossible de charger les factures depuis l’API.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadInvoices();

    return () => {
      mounted = false;
    };
  }, [activeTab, page, user]);

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const normalizedStatus = normalizeStatus(invoice.status) || invoice.status;
      const matchesTab = activeTab === 'all' || normalizedStatus === activeTab;
      const clientName = invoice.supplier?.name || invoice.user?.username || '';
      const ref = invoice.number || '';
      const haystack = `${clientName} ${ref}`.toLowerCase();
      const matchesSearch = !normalizedSearch || haystack.includes(normalizedSearch);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, invoices, search]);

  return (
    <div className={styles.page}>

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Factures</h1>
          <p className={styles.pageSubtitle}>{totalItems} factures au total</p>
        </div>
        <button className={styles.importBtn} onClick={onImport}>
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
              onClick={() => {
                setActiveTab(tab.key);
                setPage(1);
              }}
            >
              {tab.label}
              <span className={`${styles.tabCount} ${activeTab === tab.key ? styles.tabCountActive : ''}`}>
                {tab.key === 'all'
                  ? totalItems
                  : invoices.filter((invoice) => (normalizeStatus(invoice.status) || invoice.status) === tab.key).length}
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

      {loading && <p className={styles.pageSubtitle}>Chargement des factures…</p>}
      {!loading && error && <p className={styles.pageSubtitle}>{error}</p>}

      {!loading && !error && (
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
                filtered.map((invoice) => {
                  const normalizedStatus = normalizeStatus(invoice.status) || invoice.status;
                  const status = statusConfig[normalizedStatus] || statusConfig.pending;
                  return (
                    <tr key={invoice._id || invoice.number} className={styles.tr}>
                      <td className={`${styles.td} ${styles.tdRef}`}>{invoice.number || '—'}</td>
                      <td className={styles.td}>{invoice.supplier?.name || invoice.user?.username || '—'}</td>
                      <td className={`${styles.td} ${styles.tdMuted}`}>{formatDate(invoice.date)}</td>
                      <td className={`${styles.td} ${styles.tdAmount}`}>{formatCurrency(invoice.totalPrice)}</td>
                      <td className={styles.td}>
                        <span className={`${styles.badge} ${styles[status.className]}`}>{status.label}</span>
                      </td>
                      <td className={styles.td}>
                        <button className={styles.actionBtn} onClick={() => navigate(`/factures/${invoice._id}`)}>
                          Voir →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          <div className={styles.paginationBar}>
            <button
              className={styles.actionBtn}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
            >
              Précédent
            </button>
            <span className={styles.pageSubtitle}>Page {page} / {totalPages}</span>
            <button
              className={styles.actionBtn}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages}
            >
              Suivant
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Factures;
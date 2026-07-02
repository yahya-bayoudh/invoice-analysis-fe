import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';

const statusConfig = {
  done: { label: 'Payée', className: 'statusPaid' },
  pending: { label: 'En attente', className: 'statusPending' },
  error: { label: 'En retard', className: 'statusLate' },
};

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

function Dashboard({ onImport }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadInvoices = async () => {
      try {
        setLoading(true);
        const userId = user?.id || user?._id || user?.email;
        if (!userId) {
          setInvoices([]);
          setError('');
          return;
        }

        const response = await axios.get('http://localhost:3000/invoices', {
          params: {
            userId,
          },
        });
        if (mounted) {
          const payload = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response.data?.data)
              ? response.data.data
              : [];

          setInvoices(payload);
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
  }, [user]);

  const summary = useMemo(() => {
    const totalInvoices = invoices.length;
    const totalAmount = invoices.reduce((sum, invoice) => sum + (Number(invoice.totalPrice) || 0), 0);
    const paidCount = invoices.filter((invoice) => invoice.status === 'done').length;
    const pendingCount = invoices.filter((invoice) => invoice.status === 'pending').length;
    const lateCount = invoices.filter((invoice) => invoice.status === 'error').length;
    const paidPercentage = totalInvoices ? Math.round((paidCount / totalInvoices) * 100) : 0;
    const latePercentage = totalInvoices ? Math.round((lateCount / totalInvoices) * 100) : 0;
    const recentInvoices = [...invoices]
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, 5);

    return {
      totalInvoices,
      totalAmount,
      paidCount,
      pendingCount,
      lateCount,
      paidPercentage,
      latePercentage,
      recentInvoices,
    };
  }, [invoices]);

  const kpis = [
    {
      label: 'Total factures',
      value: summary.totalInvoices.toString(),
      trend: summary.totalInvoices ? `${summary.paidCount} payées` : 'Aucune facture',
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
      value: formatCurrency(summary.totalAmount),
      trend: summary.totalInvoices ? `${summary.totalInvoices} factures au total` : 'En attente de données',
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
      value: summary.paidCount.toString(),
      trend: `${summary.paidPercentage}% du total`,
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
      value: summary.lateCount.toString(),
      trend: `${summary.latePercentage}% du total`,
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

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Vue d'ensemble</h1>
          <p className={styles.pageSubtitle}>
            Bienvenue, {user?.username || 'Utilisateur'}. Voici l'état de vos factures.
          </p>
        </div>
        <button className={styles.importBtn} onClick={onImport}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Importer une facture
        </button>
      </div>

      {loading && <p className={styles.pageSubtitle}>Chargement des données…</p>}
      {!loading && error && <p className={styles.pageSubtitle}>{error}</p>}

      {!loading && !error && (
        <>
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
              <button className={styles.viewAllBtn} onClick={() => navigate('/factures')}>
                Voir toutes les factures →
              </button>
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
                {summary.recentInvoices.length > 0 ? (
                  summary.recentInvoices.map((invoice) => {
                    const status = statusConfig[invoice.status] || statusConfig.pending;
                    return (
                      <tr key={invoice._id || invoice.number} className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdRef}`}>{invoice.number || '—'}</td>
                        <td className={styles.td}>{invoice.supplier?.name || '—'}</td>
                        <td className={`${styles.td} ${styles.tdMuted}`}>{formatDate(invoice.date)}</td>
                        <td className={`${styles.td} ${styles.tdAmount}`}>{formatCurrency(invoice.totalPrice)}</td>
                        <td className={styles.td}>
                          <span className={`${styles.badge} ${styles[status.className]}`}>{status.label}</span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className={styles.tr}>
                    <td className={styles.td} colSpan="5">Aucune facture disponible.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import styles from './Recommandations.module.css';

const categoryConfig = {
  'Trésorerie':  { className: 'catTresorerie' },
  'Fiscalité':   { className: 'catFiscalite' },
  'Optimisation':{ className: 'catOptimisation' },
  'Risque':      { className: 'catRisque' },
};

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

function RecommandationCard({ rec }) {
  const cat = categoryConfig[rec.category] || { className: 'catOptimisation' };
  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <span className={`${styles.category} ${styles[cat.className]}`}>{rec.category}</span>
        <span className={styles.priority}>{rec.priority}</span>
      </div>
      <h3 className={styles.cardTitle}>{rec.title}</h3>
      <p className={styles.cardBody}>{rec.body}</p>
      <div className={styles.cardAction}>
        <button className={styles.actionBtn}>{rec.action}</button>
      </div>
    </div>
  );
}

function Recommandations() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [recs, setRecs] = useState(null);
  const [error, setError] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [invoiceLoading, setInvoiceLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadInvoices = async () => {
      if (!user) {
        setInvoices([]);
        setInvoiceLoading(false);
        return;
      }

      try {
        setInvoiceLoading(true);
        const userId = user?.id || user?._id || user?.email;
        const response = await axios.get('http://localhost:3000/invoices', {
          params: { userId },
        });
        const payload = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
            ? response.data.data
            : [];
        if (mounted) {
          setInvoices(payload);
        }
      } catch {
        if (mounted) {
          setError('Impossible de charger les factures pour générer des recommandations.');
        }
      } finally {
        if (mounted) setInvoiceLoading(false);
      }
    };

    const loadRecommendations = async () => {
      if (!user) {
        setRecs(null);
        return;
      }

      try {
        const userId = user?.id || user?._id || user?.email;
        const response = await axios.get('http://localhost:3000/recommendations', {
          params: { userId },
        });
        const payload = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
            ? response.data.data
            : [];
        if (mounted) {
          setRecs(payload.map((rec) => ({ ...rec, body: rec.description })));
        }
      } catch {
        if (mounted) {
          setError('Impossible de charger les recommandations sauvegardées.');
        }
      }
    };

    loadInvoices();
    loadRecommendations();
    return () => { mounted = false; };
  }, [user]);

  const summary = useMemo(() => {
    const totalInvoices = invoices.length;
    const totalAmount = invoices.reduce((sum, invoice) => sum + (Number(invoice.totalPrice) || 0), 0);
    const paidCount = invoices.filter((invoice) => invoice.status === 'done').length;
    const pendingCount = invoices.filter((invoice) => invoice.status === 'pending').length;
    const lateCount = invoices.filter((invoice) => invoice.status === 'error').length;
    const paidPercentage = totalInvoices ? Math.round((paidCount / totalInvoices) * 100) : 0;
    const latePercentage = totalInvoices ? Math.round((lateCount / totalInvoices) * 100) : 0;

    return {
      totalInvoices,
      totalAmount,
      paidCount,
      pendingCount,
      lateCount,
      paidPercentage,
      latePercentage,
    };
  }, [invoices]);

  const categoryData = useMemo(() => {
    const totals = {
      Smartphone: 0,
      Chargeur: 0,
      Écouteurs: 0,
      Tablette: 0,
      'Ordinateur portable': 0,
      Écran: 0,
      Souris: 0,
      Clavier: 0,
      Autre: 0,
    };

    invoices.forEach((invoice) => {
      const category = invoice.category?.toLowerCase();
      const label = {
        smartphone: 'Smartphone',
        charger: 'Chargeur',
        headphones: 'Écouteurs',
        tablet: 'Tablette',
        laptop: 'Ordinateur portable',
        monitor: 'Écran',
        mouse: 'Souris',
        keyboard: 'Clavier',
      }[category] || 'Autre';

      totals[label] += Number(invoice.totalPrice) || 0;
    });

    return Object.entries(totals).map(([label, total]) => ({ label, total }));
  }, [invoices]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value || 0);

  const fetchRecs = async () => {
    setLoading(true);
    setError(null);
    setRecs(null);

    if (!user) {
      setError('Vous devez être connecté pour générer des recommandations.');
      setLoading(false);
      return;
    }

    if (!invoices.length) {
      setError('Aucune facture disponible pour générer des recommandations.');
      setLoading(false);
      return;
    }

    try {
      const userId = user?.id || user?._id || user?.email;
      const response = await axios.post('http://localhost:3000/recommendations/generate', {
        userId,
        summary,
        chartData: categoryData,
      });

      const created = Array.isArray(response.data) ? response.data : [];
      setRecs(created.map((rec) => ({
        ...rec,
        body: rec.description,
      })));
    } catch {
      setError('Impossible de générer les recommandations. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Recommandations</h1>
          <p className={styles.pageSubtitle}>Conseils personnalisés générés par IA selon vos données.</p>
        </div>
        <button className={styles.generateBtn} onClick={fetchRecs} disabled={loading}>
          {loading ? (
            <span className={styles.spinner} />
          ) : (
            <SparkleIcon />
          )}
          {loading ? 'Analyse en cours…' : 'Générer des recommandations'}
        </button>
      </div>

      {(!recs || (Array.isArray(recs) && recs.length === 0)) && !loading && !error && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}><SparkleIcon /></span>
          <p className={styles.emptyTitle}>Aucune recommandation générée</p>
          <p className={styles.emptyDesc}>Cliquez sur "Générer des recommandations" pour obtenir des conseils personnalisés basés sur vos factures.</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>{error}</div>
      )}

      {Array.isArray(recs) && recs.length > 0 && (
        <div className={styles.grid}>
          {recs.map((rec, i) => (
            <RecommandationCard key={i} rec={rec} />
          ))}
        </div>
      )}

      {Array.isArray(recs) && recs.length > 0 && (
        <button className={styles.refreshBtn} onClick={fetchRecs} disabled={loading}>
          <RefreshIcon /> Régénérer
        </button>
      )}

    </div>
  );
}

export default Recommandations;
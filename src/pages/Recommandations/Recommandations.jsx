import { useState } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [recs, setRecs] = useState(null);
  const [error, setError] = useState(null);

  const mockContext = `
    Données factures FacturAI :
    - Total factures : 128
    - Montant total : 84 320 €
    - Payées : 97 (75%)
    - En attente : 20
    - En retard : 11
    - Clients principaux : Société Dupont, BTP Lefèvre, Cabinet Renard
    - Facture la plus élevée en retard : BTP Lefèvre 12 450 €
  `;

  const fetchRecs = async () => {
    setLoading(true);
    setError(null);
    setRecs(null);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: `Tu es un conseiller financier expert en gestion de factures pour PME françaises.
Analyse les données fournies et génère exactement 4 recommandations concrètes et actionnables.
Réponds UNIQUEMENT en JSON valide, sans texte avant ou après, sans balises markdown.
Format exact :
[
  {
    "category": "Trésorerie" | "Fiscalité" | "Optimisation" | "Risque",
    "priority": "Urgent" | "Important" | "Conseil",
    "title": "titre court max 8 mots",
    "body": "explication claire en 2 phrases maximum",
    "action": "texte du bouton d'action court"
  }
]`,
          messages: [
            {
              role: 'user',
              content: `Voici les données de mon entreprise :\n${mockContext}\nGénère 4 recommandations.`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content?.find(b => b.type === 'text')?.text || '';
      const cleaned = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setRecs(parsed);
    } catch {
      setError('Impossible de charger les recommandations. Veuillez réessayer.');
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

      {!recs && !loading && !error && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}><SparkleIcon /></span>
          <p className={styles.emptyTitle}>Aucune recommandation générée</p>
          <p className={styles.emptyDesc}>Cliquez sur "Générer des recommandations" pour obtenir des conseils personnalisés basés sur vos factures.</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>{error}</div>
      )}

      {recs && (
        <div className={styles.grid}>
          {recs.map((rec, i) => (
            <RecommandationCard key={i} rec={rec} />
          ))}
        </div>
      )}

      {recs && (
        <button className={styles.refreshBtn} onClick={fetchRecs} disabled={loading}>
          <RefreshIcon /> Régénérer
        </button>
      )}

    </div>
  );
}

export default Recommandations;
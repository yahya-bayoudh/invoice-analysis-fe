import { useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const pageTitles = {
  '/dashboard': "Vue d'ensemble",
  '/factures': 'Factures',
  '/recommandations': 'Recommandations',
  '/parametres': 'Paramètres',
};

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const ChevronIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

function Header({ pendingCount = 0 }) {
  const location = useLocation();
  const currentLabel = pageTitles[location.pathname] || 'Page';

  return (
    <header className={styles.header}>
      <div className={styles.breadcrumb}>
        <span className={styles.breadcrumbRoot}>Accueil</span>
        <span className={styles.breadcrumbSep}><ChevronIcon /></span>
        <span className={styles.breadcrumbCurrent}>{currentLabel}</span>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn} aria-label="Rechercher">
          <SearchIcon />
        </button>
        <button className={styles.iconBtn} aria-label="Notifications">
          <BellIcon />
          {pendingCount > 0 && (
            <span className={styles.badge}>{pendingCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const pageTitles = {
  '/dashboard': "Vue d'ensemble",
  '/factures': 'Factures',
  '/recommandations': 'Recommandations',
  '/parametres': 'Paramètres',
};

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

const notifications = [
  { id: 1, text: 'Facture BTP Lefèvre en retard', time: 'Il y a 2h', unread: true },
  { id: 2, text: 'Nouvelle facture importée avec succès', time: 'Il y a 5h', unread: true },
  { id: 3, text: 'Recommandation IA disponible', time: 'Hier', unread: true },
];

function Header({ pendingCount = 0 }) {
  const location = useLocation();
  const currentLabel = pageTitles[location.pathname] || 'Page';
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.breadcrumb}>
        <span className={styles.breadcrumbRoot}>Accueil</span>
        <span className={styles.breadcrumbSep}><ChevronIcon /></span>
        <span className={styles.breadcrumbCurrent}>{currentLabel}</span>
      </div>

      <div className={styles.actions}>
        <div className={styles.notifWrap}>
          <button
            className={styles.iconBtn}
            aria-label="Notifications"
            onClick={() => setNotifOpen(o => !o)}
          >
            <BellIcon />
            {pendingCount > 0 && <span className={styles.badge}>{pendingCount}</span>}
          </button>

          {notifOpen && (
            <>
              <div className={styles.backdrop} onClick={() => setNotifOpen(false)} />
              <div className={styles.notifPanel}>
                <div className={styles.notifHeader}>
                  <span className={styles.notifTitle}>Notifications</span>
                  <button className={styles.notifClear} onClick={() => setNotifOpen(false)}>
                    Tout marquer lu
                  </button>
                </div>
                {notifications.map(n => (
                  <div key={n.id} className={`${styles.notifItem} ${n.unread ? styles.notifUnread : ''}`}>
                    <div className={styles.notifDot} />
                    <div className={styles.notifContent}>
                      <p className={styles.notifText}>{n.text}</p>
                      <p className={styles.notifTime}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
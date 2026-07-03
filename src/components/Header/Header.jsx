import { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const pageTitles = {
  '/dashboard': "Vue d'ensemble",
  '/factures': 'Factures',
  '/recommandations': 'Recommandations',
  '/parametres': 'Paramètres',
};

const mockNotifications = [
  { id: 1, text: 'Facture #INV-001 en retard de paiement.', time: 'Il y a 2h', unread: true },
  { id: 2, text: 'Nouvelle facture importée avec succès.', time: 'Il y a 5h', unread: true },
  { id: 3, text: 'Facture #INV-003 marquée comme payée.', time: 'Hier', unread: false },
];

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
  const [notifOpen, setNotifOpen] = useState(false);
  const bellRef = useRef(null);

  return (
    <header className={styles.header}>
      <div className={styles.breadcrumb}>
        <span className={styles.breadcrumbRoot}>Accueil</span>
        <span className={styles.breadcrumbSep}><ChevronIcon /></span>
        <span className={styles.breadcrumbCurrent}>{currentLabel}</span>
      </div>
      <div className={styles.actions}>
        <div className={styles.notifWrapper} ref={bellRef}>
          <button
            className={`${styles.iconBtn} ${notifOpen ? styles.iconBtnActive : ''}`}
            aria-label="Notifications"
            aria-expanded={notifOpen}
            onClick={() => setNotifOpen((prev) => !prev)}
          >
            <BellIcon />
            {pendingCount > 0 && (
              <span className={styles.badge}>{pendingCount}</span>
            )}
          </button>
          {notifOpen && (
            <>
              <div className={styles.notifBackdrop} onClick={() => setNotifOpen(false)} />
              <div className={styles.notifDropdown}>
                <div className={styles.notifHeader}>
                  <span className={styles.notifTitle}>Notifications</span>
                  <span className={styles.notifCount}>{mockNotifications.filter(n => n.unread).length} nouvelles</span>
                </div>
                <div className={styles.notifList}>
                  {mockNotifications.map((n) => (
                    <div key={n.id} className={`${styles.notifItem} ${n.unread ? styles.notifUnread : ''}`}>
                      <p className={styles.notifText}>{n.text}</p>
                      <span className={styles.notifTime}>{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
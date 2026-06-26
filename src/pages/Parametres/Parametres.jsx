import { useState } from 'react';
import styles from './Parametres.module.css';

const Toggle = ({ on, onChange }) => (
  <button
    className={`${styles.toggle} ${on ? styles.toggleOn : ''}`}
    onClick={() => onChange(!on)}
    aria-pressed={on}
  >
    <span className={styles.toggleThumb} />
  </button>
);

function Parametres() {
  const [notifFactures, setNotifFactures] = useState(true);
  const [notifIA, setNotifIA] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  return (
    <div className={styles.page}>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Paramètres</h1>
        <p className={styles.pageSubtitle}>Gérez votre compte, vos préférences et vos notifications.</p>
      </div>

      {/* Profil */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </span>
          <h2 className={styles.sectionTitle}>Profil</h2>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.row}>
            <div className={styles.rowLabel}>
              <p className={styles.rowName}>Nom complet</p>
              <p className={styles.rowDesc}>Mohamed Ali</p>
            </div>
            <button className={styles.editBtn}>Modifier</button>
          </div>
          <div className={styles.row}>
            <div className={styles.rowLabel}>
              <p className={styles.rowName}>Adresse e-mail</p>
              <p className={styles.rowDesc}>m.ali@facturai.com</p>
            </div>
            <button className={styles.editBtn}>Modifier</button>
          </div>
          <div className={styles.row}>
            <div className={styles.rowLabel}>
              <p className={styles.rowName}>Rôle</p>
              <p className={styles.rowDesc}>
                <span className={styles.tag}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Administrateur
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </span>
          <h2 className={styles.sectionTitle}>Notifications</h2>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.row}>
            <div className={styles.rowLabel}>
              <p className={styles.rowName}>Nouvelles factures</p>
              <p className={styles.rowDesc}>Recevoir une alerte à chaque nouvelle facture importée</p>
            </div>
            <Toggle on={notifFactures} onChange={setNotifFactures} />
          </div>
          <div className={styles.row}>
            <div className={styles.rowLabel}>
              <p className={styles.rowName}>Recommandations IA</p>
              <p className={styles.rowDesc}>Être notifié des nouvelles suggestions d'optimisation</p>
            </div>
            <Toggle on={notifIA} onChange={setNotifIA} />
          </div>
        </div>
      </div>

      {/* Sécurité */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </span>
          <h2 className={styles.sectionTitle}>Sécurité</h2>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.row}>
            <div className={styles.rowLabel}>
              <p className={styles.rowName}>Mot de passe</p>
              <p className={styles.rowDesc}>Dernière modification il y a 3 mois</p>
            </div>
            <button className={styles.editBtn}>Changer</button>
          </div>
          <div className={styles.row}>
            <div className={styles.rowLabel}>
              <p className={styles.rowName}>Double authentification</p>
              <p className={styles.rowDesc}>Renforcez la sécurité de votre compte</p>
            </div>
            <Toggle on={twoFA} onChange={setTwoFA} />
          </div>
        </div>
      </div>

    </div>
  );
}

export default Parametres;
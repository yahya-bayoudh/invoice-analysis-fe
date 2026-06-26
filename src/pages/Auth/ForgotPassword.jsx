import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Auth.module.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: replace with real API call
    setSubmitted(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>FacturAI</span>
        </div>

        <div className={styles.cardHeader}>
          <h1 className={styles.title}>Mot de passe oublié</h1>
          <p className={styles.subtitle}>Entrez votre e-mail pour recevoir un lien de réinitialisation.</p>
        </div>

        {submitted ? (
          <div className={styles.success}>
            Un e-mail de réinitialisation a été envoyé à <strong>{email}</strong>.
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Adresse e-mail</label>
              <input
                className={styles.input}
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button className={styles.submitBtn} type="submit">
              Envoyer le lien
            </button>
          </form>
        )}

        <p className={styles.footer}>
          <Link to="/login" className={styles.footerLink}>← Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
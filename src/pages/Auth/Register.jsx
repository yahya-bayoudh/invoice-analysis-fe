import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = register(name, email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>FacturAI</span>
        </div>

        <div className={styles.cardHeader}>
          <h1 className={styles.title}>Créer un compte</h1>
          <p className={styles.subtitle}>Rejoignez FacturAI et gérez vos factures facilement.</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Nom complet</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Mohamed Ali"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

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

          <div className={styles.field}>
            <label className={styles.label}>Mot de passe</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Minimum 6 caractères"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Créer mon compte'}
          </button>
        </form>

        <p className={styles.footer}>
          Déjà un compte ?{' '}
          <Link to="/login" className={styles.footerLink}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
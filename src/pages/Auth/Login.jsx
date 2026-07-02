import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login(email, password);
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
          <h1 className={styles.title}>Connexion</h1>
          <p className={styles.subtitle}>Bienvenue, connectez-vous à votre compte.</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

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

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Mot de passe</label>
              <Link to="/forgot-password" className={styles.forgotLink}>Mot de passe oublié ?</Link>
            </div>
            <input
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Se connecter'}
          </button>
        </form>

        <p className={styles.footer}>
          Pas encore de compte ?{' '}
          <Link to="/register" className={styles.footerLink}>Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
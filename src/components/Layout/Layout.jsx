import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import styles from './Layout.module.css';

function Layout({ children, pendingCount, onImport }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Header pendingCount={pendingCount} onImport={onImport} />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;  
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Factures from './pages/Factures/Factures';
import Parametres from './pages/Parametres/Parametres';
import Recommandations from './pages/Recommandations/Recommandations';

function App() {
  return (
    <Layout pendingCount={3}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/factures" element={<Factures />} />
        <Route path="/recommandations" element={<Recommandations />} />
        <Route path="/parametres" element={<Parametres />} />
        
      </Routes>
    </Layout>
  );
}

export default App;
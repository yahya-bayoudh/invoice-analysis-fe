import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Factures from './pages/Factures/Factures';
import Parametres from './pages/Parametres/Parametres';
import Recommandations from './pages/Recommandations/Recommandations';
import ImportModal from './components/ImportModal/ImportModal';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
<Route path="/factures/:id" element={<div style={{padding:'2rem'}}>Détail facture — bientôt disponible.</div>} />

function App() {
  const [showImport, setShowImport] = useState(false);

  const handleCloseImport = () => {
    setShowImport(false);
  };

  const handleImportSuccess = () => {
    window.location.reload();
  };

  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout pendingCount={3} onImport={() => setShowImport(true)}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard onImport={() => setShowImport(true)} />} />
                <Route path="/factures" element={<Factures onImport={() => setShowImport(true)} />} />
                <Route path="/recommandations" element={<Recommandations />} />
                <Route path="/parametres" element={<Parametres />} />
              </Routes>
              {showImport && <ImportModal onClose={handleCloseImport} onImportSuccess={handleImportSuccess} />}
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;
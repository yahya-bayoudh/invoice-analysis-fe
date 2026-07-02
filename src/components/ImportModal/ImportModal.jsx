import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import styles from './ImportModal.module.css';

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const CameraIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/>
  </svg>
);

const mapStatusToBackend = (value) => {
  switch (value?.toLowerCase()) {
    case 'payée':
    case 'done':
      return 'done';
    case 'en retard':
    case 'error':
      return 'error';
    case 'en attente':
    case 'pending':
    default:
      return 'pending';
  }
};

const parseAmount = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'number') return value;

  const cleaned = String(value).replace(/[^\d,.-]/g, '').replace(/,/g, '.');
  const parsed = Number.parseFloat(cleaned);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const normalizeExtractedData = (parsed = {}) => ({
  reference: parsed.reference || parsed.numero || '',
  supplierName: parsed.client || parsed.supplierName || parsed.fournisseur || '',
  date: parsed.date || '',
  totalPrice: parsed.montant ?? parsed.totalPrice ?? parsed.total ?? '',
  status: parsed.statut || parsed.status || 'en attente',
});

function ImportModal({ onClose, onImportSuccess }) {
  const [tab, setTab] = useState('file');
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [fields, setFields] = useState(null);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const { user } = useAuth();

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const analyzeFile = async (fileObj) => {
    setAnalyzing(true);
    setError(null);
    setFields(null);

    try {
      const formData = new FormData();
      formData.append('file', fileObj);
      formData.append(
        'prompt',
        'Analyse cette facture et réponds UNIQUEMENT en JSON valide sans texte autour. Format exact : {"reference":"","client":"","date":"","montant":"","statut":"payée|en attente|en retard"}. Si une valeur est introuvable, utilise une chaîne vide.'
      );

      const response = await axios.post('http://localhost:3000/ai/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const parsed = response.data?.data || {};
      setFields(normalizeExtractedData(parsed));
    } catch {
      setError("Impossible d'analyser le fichier. Vérifiez qu'il s'agit bien d'une facture.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    analyzeFile(f);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      setError("Accès à la caméra refusé. Vérifiez les permissions de votre navigateur.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setCameraActive(false);
  };

  const capturePhoto = () => {
    setCapturing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const f = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
      setFile(f);
      stopCamera();
      analyzeFile(f);
      setCapturing(false);
    }, 'image/jpeg', 0.92);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const handleSubmit = async () => {
    if (!fields) return;

    try {
      const userId = user?.id || user?._id || user?.email;
      if (!userId) {
        setError('Vous devez être connecté pour importer une facture.');
        return;
      }

      await axios.post('http://localhost:3000/invoices/from-analysis', {
        number: fields.reference || '',
        supplierName: fields.supplierName || '',
        date: fields.date || '',
        totalPrice: parseAmount(fields.totalPrice),
        status: mapStatusToBackend(fields.status),
        user: userId,
      });

      if (onImportSuccess) {
        onImportSuccess();
        return;
      }

      handleClose();
    } catch {
      setError("Impossible d'enregistrer la facture. Vérifiez les données extraites.");
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Importer une facture</h2>
          <button className={styles.closeBtn} onClick={handleClose}><CloseIcon /></button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'file' ? styles.tabActive : ''}`}
            onClick={() => { setTab('file'); stopCamera(); setFile(null); setFields(null); setError(null); }}
          >
            <UploadIcon />
            Fichier
          </button>
          <button
            className={`${styles.tab} ${tab === 'camera' ? styles.tabActive : ''}`}
            onClick={() => { setTab('camera'); setFile(null); setFields(null); setError(null); }}
          >
            <CameraIcon />
            Caméra
          </button>
        </div>

        <div className={styles.body}>

          {/* FILE TAB */}
          {tab === 'file' && !file && (
            <div
              className={`${styles.dropzone} ${dragging ? styles.dropzoneActive : ''}`}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <span className={styles.dropIcon}><UploadIcon /></span>
              <p className={styles.dropTitle}>Glissez votre fichier ici</p>
              <p className={styles.dropSub}>ou cliquez pour sélectionner — PDF, JPG, PNG</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/*"
                style={{ display: 'none' }}
                onChange={e => handleFile(e.target.files[0])}
              />
            </div>
          )}

          {/* CAMERA TAB */}
          {tab === 'camera' && !file && (
            <div className={styles.cameraWrap}>
              {!cameraActive ? (
                <div className={styles.cameraPrompt}>
                  <span className={styles.dropIcon}><CameraIcon /></span>
                  <p className={styles.dropTitle}>Photographier une facture</p>
                  <p className={styles.dropSub}>Pointez votre caméra vers la facture papier</p>
                  <button className={styles.startCameraBtn} onClick={startCamera}>Activer la caméra</button>
                </div>
              ) : (
                <div className={styles.cameraLive}>
                  <video ref={videoRef} autoPlay playsInline className={styles.video} />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  <div className={styles.cameraControls}>
                    <button className={styles.captureBtn} onClick={capturePhoto} disabled={capturing}>
                      {capturing ? 'Capture…' : 'Capturer'}
                    </button>
                    <button className={styles.cancelCameraBtn} onClick={stopCamera}>Annuler</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ANALYZING */}
          {file && analyzing && (
            <div className={styles.analyzing}>
              <span className={styles.spinner} />
              <p className={styles.analyzingText}>
                <SparkleIcon /> Analyse IA en cours…
              </p>
              <p className={styles.analyzingFile}>{file.name}</p>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className={styles.error}>{error}</div>
          )}

          {/* FORM FIELDS */}
          {fields && !analyzing && (
            <div className={styles.form}>
              <div className={styles.aiNotice}>
                <SparkleIcon /> Données extraites automatiquement — vérifiez avant de confirmer.
              </div>
              {[
                { key: 'reference', label: 'Référence' },
                { key: 'supplierName', label: 'Client' },
                { key: 'date', label: 'Date' },
                { key: 'totalPrice', label: 'Montant' },
              ].map(({ key, label }) => (
                <div key={key} className={styles.field}>
                  <label className={styles.label}>{label}</label>
                  <input
                    className={styles.input}
                    value={fields[key] || ''}
                    onChange={e => setFields(f => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <div className={styles.field}>
                <label className={styles.label}>Statut</label>
                <select
                  className={styles.input}
                  value={fields.status || 'en attente'}
                  onChange={e => setFields(f => ({ ...f, status: e.target.value }))}
                >
                  <option value="payée">Payée</option>
                  <option value="en attente">En attente</option>
                  <option value="en retard">En retard</option>
                </select>
              </div>
            </div>
          )}

        </div>

        {fields && !analyzing && (
          <div className={styles.modalFooter}>
            <button className={styles.cancelBtn} onClick={handleClose}>Annuler</button>
            <button className={styles.confirmBtn} onClick={handleSubmit}>Confirmer l'import</button>
          </div>
        )}

      </div>
    </div>
  );
}

export default ImportModal;
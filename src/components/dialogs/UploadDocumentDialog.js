import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './DialogStyles.css';

const UploadDocumentDialog = ({ onClose, onUpload }) => {
  const [document, setDocument] = useState({
    name: '',
    description: '',
    file: null
  });
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setDocument({
        ...document,
        name: file.name,
        file: file
      });
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!document.file) return;

    try {
      setUploading(true);
      setError('');

      // Upload file to Firebase Storage
      const storage = getStorage();
      const timestamp = Date.now();
      const storageRef = ref(storage, `documents/${timestamp}_${document.file.name}`);
      
      const snapshot = await uploadBytes(storageRef, document.file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Call onUpload with document metadata
      onUpload({
        id: timestamp.toString(),
        name: document.name,
        description: document.description,
        uploadDate: new Date().toISOString(),
        fileUrl: downloadURL,
        fileName: document.file.name,
        fileType: document.file.type,
        fileSize: document.file.size
      });

      onClose();
    } catch (error) {
      console.error('Error uploading document:', error);
      setError('Kunne ikke laste opp dokumentet. Vennligst prøv igjen.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2>Last opp dokument</h2>
        <form onSubmit={handleSubmit}>
          <div className="file-input-wrapper">
            <div className="file-input-button">
              <input
                type="file"
                onChange={handleFileChange}
                required
              />
              <span>
                {fileName ? 'Endre fil' : 'Velg fil'}
              </span>
            </div>
            {fileName && (
              <div className="file-name">
                Valgt fil: {fileName}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Tittel:</label>
            <input
              type="text"
              value={document.name}
              onChange={(e) => setDocument({ ...document, name: e.target.value })}
              placeholder="Dokumenttittel"
              required
            />
          </div>

          <div className="form-group">
            <label>Beskrivelse:</label>
            <textarea
              value={document.description}
              onChange={(e) => setDocument({ ...document, description: e.target.value })}
              placeholder="Kort beskrivelse av dokumentet"
              required
              rows="3"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="dialog-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="cancel-btn"
              disabled={uploading}
            >
              Avbryt
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={!document.file || uploading}
            >
              {uploading ? 'Laster opp...' : 'Last opp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDocumentDialog;

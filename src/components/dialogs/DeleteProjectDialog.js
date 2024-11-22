import React, { useState } from 'react';
import { ProjectActions } from '../../services/ProjectActions';
import BaseDialog from './BaseDialog';
import './DialogStyles.css';

const DeleteProjectDialog = ({ project, onClose, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== project.name.toLowerCase()) {
      setError('Prosjektnavnet stemmer ikke overens');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await ProjectActions.handleDeleteProject(project.id);
      
      if (success) {
        onDelete(project.id);
        onClose();
      } else {
        throw new Error('Kunne ikke slette prosjektet');
      }
    } catch (err) {
      setError(err.message || 'Det oppstod en feil ved sletting av prosjektet');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmChange = (e) => {
    setConfirmText(e.target.value);
    if (error) setError('');
  };

  return (
    <BaseDialog title="Slett prosjekt" onClose={onClose}>
      <div className="delete-project-content">
        <div className="warning-message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Dette vil permanent slette prosjektet</span>
        </div>
        
        <div className="project-info">
          <h3>Prosjektdetaljer:</h3>
          <p><strong>Navn:</strong> {project.name}</p>
          <p><strong>Beskrivelse:</strong> {project.description}</p>
        </div>

        <div className="confirmation-section">
          <p>For å bekrefte sletting, skriv inn prosjektnavnet: <strong>{project.name}</strong></p>
          <div className="form-group">
            <input
              type="text"
              value={confirmText}
              onChange={handleConfirmChange}
              placeholder="Skriv prosjektnavn her"
              aria-label="Bekreft prosjektnavn"
            />
          </div>
        </div>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <div className="dialog-actions">
          <button 
            type="button" 
            onClick={onClose}
            className="cancel-btn"
            disabled={loading}
          >
            Avbryt
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="delete-btn"
            disabled={loading || confirmText.toLowerCase() !== project.name.toLowerCase()}
          >
            {loading ? 'Sletter...' : 'Slett prosjekt'}
          </button>
        </div>
      </div>
    </BaseDialog>
  );
};

export default DeleteProjectDialog;

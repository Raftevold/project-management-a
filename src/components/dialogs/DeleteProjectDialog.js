import React from 'react';
import './DialogStyles.css';

const DeleteProjectDialog = ({ project, onClose, onDelete }) => {
  const handleDelete = () => {
    onDelete(project.id);
    onClose();
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2>Slett prosjekt</h2>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: '#dc3545', marginBottom: '1rem' }}>
            Er du sikker på at du vil slette prosjektet "{project.name}"?
          </p>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            Dette vil permanent slette all prosjektinformasjon, inkludert:
          </p>
          <ul style={{ color: '#666', fontSize: '0.9rem', marginLeft: '1.5rem' }}>
            <li>Alle milepæler</li>
            <li>Teammedlemmer</li>
            <li>Dokumenter</li>
            <li>Budsjettinformasjon</li>
          </ul>
          <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '1rem' }}>
            Denne handlingen kan ikke angres.
          </p>
        </div>
        <div className="dialog-actions">
          <button type="button" onClick={onClose} className="cancel-btn">
            Avbryt
          </button>
          <button 
            type="button" 
            onClick={handleDelete} 
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Slett prosjekt
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProjectDialog;

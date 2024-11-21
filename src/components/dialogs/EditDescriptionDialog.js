import React, { useState } from 'react';
import { ProjectActions } from '../department/ProjectActions';
import './DialogStyles.css';

const EditDescriptionDialog = ({ project, onClose, onUpdate }) => {
  const [description, setDescription] = useState(project.description || '');

  const handleSave = async () => {
    const success = await ProjectActions.handleUpdateDescription(project.id, description);
    if (success) {
      onUpdate(description);
      onClose();
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2>Rediger Beskrivelse</h2>

        <div className="form-group">
          <label>Beskrivelse:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Prosjektbeskrivelse"
            rows={6}
          />
        </div>

        <div className="dialog-actions">
          <button onClick={onClose} className="cancel-btn">
            Avbryt
          </button>
          <button onClick={handleSave} className="submit-btn">
            Lagre
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDescriptionDialog;

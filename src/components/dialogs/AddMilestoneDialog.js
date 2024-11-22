import React, { useState } from 'react';
import { ProjectActions } from '../../services/ProjectActions';
import './DialogStyles.css';

const AddMilestoneDialog = ({ project, onClose, onAdd }) => {
  const [milestone, setMilestone] = useState({
    name: '',
    date: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMilestone = {
      ...milestone,
      id: Date.now().toString(),
      completed: false,
      progress: 0
    };
    
    const updatedMilestones = [...project.milestones, newMilestone];
    const success = await ProjectActions.handleAddMilestone(project.id, newMilestone, project.milestones);
    
    if (success) {
      onAdd(updatedMilestones);
      onClose();
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2>Legg til milepæl</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Navn:</label>
            <input
              type="text"
              value={milestone.name}
              onChange={(e) => setMilestone({ ...milestone, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Dato:</label>
            <input
              type="date"
              value={milestone.date}
              onChange={(e) => setMilestone({ ...milestone, date: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Beskrivelse:</label>
            <textarea
              value={milestone.description}
              onChange={(e) => setMilestone({ ...milestone, description: e.target.value })}
              required
              rows="3"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <div className="dialog-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Avbryt
            </button>
            <button type="submit" className="submit-btn">
              Legg til
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMilestoneDialog;

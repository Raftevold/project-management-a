import React, { useState } from 'react';
import './DialogStyles.css';

const AddMilestoneDialog = ({ onClose, onAdd }) => {
  const [milestone, setMilestone] = useState({
    name: '',
    date: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...milestone,
      id: Date.now().toString(),
      completed: false
    });
    onClose();
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

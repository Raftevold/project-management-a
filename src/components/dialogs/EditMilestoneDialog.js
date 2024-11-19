import React, { useState } from 'react';
import './DialogStyles.css';

const EditMilestoneDialog = ({ project, onClose, onUpdate, onDelete }) => {
  const [milestones, setMilestones] = useState(project.milestones || []);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [milestoneForm, setMilestoneForm] = useState({
    name: '',
    description: '',
    date: '',
    completed: false,
    progress: 0
  });

  const handleEdit = (milestone) => {
    setEditingMilestone(milestone);
    setMilestoneForm({
      name: milestone.name,
      description: milestone.description || '',
      date: new Date(milestone.date).toISOString().split('T')[0],
      completed: milestone.completed || false,
      progress: milestone.progress || 0
    });
  };

  const handleDelete = async (milestoneId) => {
    if (window.confirm('Er du sikker på at du vil slette denne milepælen?')) {
      const updatedMilestones = milestones.filter(milestone => milestone.id !== milestoneId);
      setMilestones(updatedMilestones);
      await onDelete(milestoneId, updatedMilestones);
    }
  };

  const handleSaveMilestone = () => {
    if (editingMilestone) {
      const updatedMilestones = milestones.map(milestone =>
        milestone.id === editingMilestone.id
          ? { ...milestone, ...milestoneForm }
          : milestone
      );
      setMilestones(updatedMilestones);
      onUpdate(updatedMilestones);
      setEditingMilestone(null);
      setMilestoneForm({
        name: '',
        description: '',
        date: '',
        completed: false,
        progress: 0
      });
    }
  };

  const handleCancel = () => {
    setEditingMilestone(null);
    setMilestoneForm({
      name: '',
      description: '',
      date: '',
      completed: false,
      progress: 0
    });
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2>Rediger Milepæler</h2>

        <div className="milestone-list">
          {milestones.map(milestone => (
            <div key={milestone.id} className="milestone-item">
              {editingMilestone?.id === milestone.id ? (
                <div className="milestone-edit-form">
                  <div className="form-group">
                    <label>Navn:</label>
                    <input
                      type="text"
                      value={milestoneForm.name}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, name: e.target.value })}
                      placeholder="Milepæl navn"
                    />
                  </div>
                  <div className="form-group">
                    <label>Beskrivelse:</label>
                    <textarea
                      value={milestoneForm.description}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                      placeholder="Beskrivelse"
                    />
                  </div>
                  <div className="form-group">
                    <label>Dato:</label>
                    <input
                      type="date"
                      value={milestoneForm.date}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, date: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Fremdrift:</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={milestoneForm.progress}
                      onChange={(e) => setMilestoneForm({ 
                        ...milestoneForm, 
                        progress: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={milestoneForm.completed}
                        onChange={(e) => setMilestoneForm({ 
                          ...milestoneForm, 
                          completed: e.target.checked,
                          progress: e.target.checked ? 100 : milestoneForm.progress
                        })}
                      />
                      Fullført
                    </label>
                  </div>
                  <div className="form-actions">
                    <button onClick={handleSaveMilestone} className="submit-btn">
                      Lagre
                    </button>
                    <button onClick={handleCancel} className="cancel-btn">
                      Avbryt
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="milestone-info">
                    <div className="milestone-name">{milestone.name}</div>
                    {milestone.description && (
                      <div className="milestone-description">{milestone.description}</div>
                    )}
                    <div className="milestone-date">
                      {new Date(milestone.date).toLocaleDateString()}
                    </div>
                    <div className="milestone-status">
                      {milestone.completed ? 'Fullført' : `${milestone.progress || 0}% fullført`}
                    </div>
                  </div>
                  <div className="milestone-actions">
                    <button
                      onClick={() => handleEdit(milestone)}
                      className="edit-btn"
                    >
                      Rediger
                    </button>
                    <button
                      onClick={() => handleDelete(milestone.id)}
                      className="delete-btn"
                    >
                      Slett
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="dialog-actions">
          <button onClick={onClose} className="cancel-btn">
            Lukk
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMilestoneDialog;

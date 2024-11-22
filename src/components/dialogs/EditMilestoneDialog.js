import React, { useState } from 'react';
import { ProjectService } from '../../services/ProjectService';
import './DialogStyles.css';

const EditMilestoneDialog = ({ project, onClose, onUpdate }) => {
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
      const success = await ProjectService.handleDeleteMilestone(project.id, milestoneId, updatedMilestones);
      if (success) {
        setMilestones(updatedMilestones);
        onUpdate(updatedMilestones);
      }
    }
  };

  const handleSaveMilestone = async () => {
    if (editingMilestone) {
      const updatedMilestones = milestones.map(milestone =>
        milestone.id === editingMilestone.id
          ? { ...milestone, ...milestoneForm }
          : milestone
      );
      const success = await ProjectService.handleUpdateMilestone(project.id, updatedMilestones);
      if (success) {
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
                    <button onClick={handleSaveMilestone} className="submit-btn" title="Lagre endringer">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button onClick={handleCancel} className="cancel-btn" title="Avbryt">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
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
                      title="Rediger milepæl"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(milestone.id)}
                      className="delete-btn"
                      title="Slett milepæl"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                      </svg>
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

import React, { useState } from 'react';
import { ProjectActions } from '../department/ProjectActions';
import './DialogStyles.css';

const AddTeamMemberDialog = ({ project, onClose, onAdd }) => {
  const [member, setMember] = useState({
    name: '',
    role: '',
    email: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMember = {
      ...member,
      id: Date.now().toString()
    };
    
    const updatedTeam = [...project.team, newMember];
    const success = await ProjectActions.handleAddTeamMember(project.id, newMember, project.team);
    
    if (success) {
      onAdd(updatedTeam);
      onClose();
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2>Legg til teammedlem</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Navn:</label>
            <input
              type="text"
              value={member.name}
              onChange={(e) => setMember({ ...member, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Rolle:</label>
            <input
              type="text"
              value={member.role}
              onChange={(e) => setMember({ ...member, role: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>E-post:</label>
            <input
              type="email"
              value={member.email}
              onChange={(e) => setMember({ ...member, email: e.target.value })}
              required
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

export default AddTeamMemberDialog;

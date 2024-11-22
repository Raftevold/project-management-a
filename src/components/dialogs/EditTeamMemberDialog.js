import React, { useState } from 'react';
import { ProjectService } from '../../services/ProjectService';
import BaseDialog from './BaseDialog';
import './DialogStyles.css';

const EditTeamMemberDialog = ({ project, onClose, onUpdate }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [editedMember, setEditedMember] = useState({
    name: '',
    role: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!editedMember.name.trim()) return 'Navn er påkrevd';
    if (!editedMember.role.trim()) return 'Rolle er påkrevd';
    if (!editedMember.email.trim()) return 'E-post er påkrevd';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedMember.email)) {
      return 'Ugyldig e-postformat';
    }
    return '';
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setEditedMember({
      name: member.name,
      role: member.role,
      email: member.email
    });
    setError('');
  };

  const handleDelete = async (memberId) => {
    setLoading(true);
    setError('');

    try {
      const updatedTeam = project.team.filter(m => m.id !== memberId);
      const success = await ProjectService.handleUpdateTeamMember(project.id, updatedTeam);
      
      if (success) {
        onUpdate(updatedTeam);
        setSelectedMember(null);
      } else {
        throw new Error('Kunne ikke slette teammedlem');
      }
    } catch (err) {
      setError(err.message || 'Det oppstod en feil ved sletting av teammedlem');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMember = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updatedMember = {
        ...selectedMember,
        ...editedMember
      };

      const updatedTeam = project.team.map(member =>
        member.id === selectedMember.id ? updatedMember : member
      );

      const success = await ProjectService.handleUpdateTeamMember(project.id, updatedTeam);
      
      if (success) {
        onUpdate(updatedTeam);
        setSelectedMember(null);
      } else {
        throw new Error('Kunne ikke oppdatere teammedlem');
      }
    } catch (err) {
      setError(err.message || 'Det oppstod en feil ved oppdatering av teammedlem');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedMember(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleCancel = () => {
    setSelectedMember(null);
    setError('');
  };

  return (
    <BaseDialog title="Rediger teammedlem" onClose={onClose}>
      {!selectedMember ? (
        <div className="team-list">
          {project.team.map(member => (
            <div key={member.id} className="team-member-item">
              <div className="member-info">
                <div className="member-name">{member.name}</div>
                <div className="member-role">{member.role}</div>
              </div>
              <div className="member-actions">
                <button
                  onClick={() => handleEdit(member)}
                  className="edit-btn"
                  aria-label="Rediger medlem"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="delete-btn"
                  disabled={loading}
                  aria-label="Slett medlem"
                >
                  Slett
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); handleSaveMember(); }} noValidate>
          <div className="form-group">
            <label htmlFor="name">Navn:</label>
            <input
              id="name"
              name="name"
              type="text"
              value={editedMember.name}
              onChange={handleChange}
              required
              aria-required="true"
              aria-invalid={error && !editedMember.name ? "true" : "false"}
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Rolle:</label>
            <input
              id="role"
              name="role"
              type="text"
              value={editedMember.role}
              onChange={handleChange}
              required
              aria-required="true"
              aria-invalid={error && !editedMember.role ? "true" : "false"}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-post:</label>
            <input
              id="email"
              name="email"
              type="email"
              value={editedMember.email}
              onChange={handleChange}
              required
              aria-required="true"
              aria-invalid={error && !editedMember.email ? "true" : "false"}
            />
          </div>
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
          <div className="dialog-actions">
            <button 
              type="button" 
              onClick={handleCancel}
              className="cancel-btn"
              disabled={loading}
            >
              Avbryt
            </button>
            <button 
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Lagrer...' : 'Lagre'}
            </button>
          </div>
        </form>
      )}
    </BaseDialog>
  );
};

export default EditTeamMemberDialog;

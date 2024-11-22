import React, { useState } from 'react';
import { ProjectService } from '../../services/ProjectService';
import BaseDialog from './BaseDialog';
import './DialogStyles.css';

const AddTeamMemberDialog = ({ project, onClose, onAdd }) => {
  const [member, setMember] = useState({
    name: '',
    role: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!member.name.trim()) return 'Navn er påkrevd';
    if (!member.role.trim()) return 'Rolle er påkrevd';
    if (!member.email.trim()) return 'E-post er påkrevd';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
      return 'Ugyldig e-postformat';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newMember = {
        ...member,
        id: Date.now().toString()
      };
      
      const success = await ProjectService.handleAddTeamMember(
        project.id, 
        newMember, 
        project.team
      );
      
      if (success) {
        const updatedTeam = [...project.team, newMember];
        onAdd(updatedTeam);
        onClose();
      } else {
        throw new Error('Kunne ikke legge til teammedlem');
      }
    } catch (err) {
      setError(err.message || 'Det oppstod en feil. Vennligst prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  return (
    <BaseDialog title="Legg til teammedlem" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Navn:</label>
          <input
            id="name"
            name="name"
            type="text"
            value={member.name}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={error && !member.name ? "true" : "false"}
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Rolle:</label>
          <input
            id="role"
            name="role"
            type="text"
            value={member.role}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={error && !member.role ? "true" : "false"}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-post:</label>
          <input
            id="email"
            name="email"
            type="email"
            value={member.email}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={error && !member.email ? "true" : "false"}
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
            onClick={onClose} 
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
            {loading ? 'Legger til...' : 'Legg til'}
          </button>
        </div>
      </form>
    </BaseDialog>
  );
};

export default AddTeamMemberDialog;

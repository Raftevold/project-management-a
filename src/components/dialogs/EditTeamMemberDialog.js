import React, { useState } from 'react';
import { ProjectActions } from '../department/ProjectActions';
import './DialogStyles.css';

const EditTeamMemberDialog = ({ project, onClose, onUpdate }) => {
  const [teamMembers, setTeamMembers] = useState(project.team || []);
  const [editingMember, setEditingMember] = useState(null);
  const [memberForm, setMemberForm] = useState({
    name: '',
    role: '',
    email: ''
  });

  const handleEdit = (member) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      role: member.role,
      email: member.email
    });
  };

  const handleDelete = async (memberId) => {
    if (window.confirm('Er du sikker på at du vil slette dette teammedlemmet?')) {
      const updatedTeam = teamMembers.filter(member => member.id !== memberId);
      const success = await ProjectActions.handleDeleteTeamMember(project.id, memberId, updatedTeam);
      if (success) {
        setTeamMembers(updatedTeam);
        onUpdate(updatedTeam);
      }
    }
  };

  const handleSaveMember = async () => {
    if (editingMember) {
      const updatedTeam = teamMembers.map(member =>
        member.id === editingMember.id
          ? { ...member, ...memberForm }
          : member
      );
      const success = await ProjectActions.handleUpdateTeamMember(project.id, updatedTeam);
      if (success) {
        setTeamMembers(updatedTeam);
        onUpdate(updatedTeam);
        setEditingMember(null);
        setMemberForm({ name: '', role: '', email: '' });
      }
    }
  };

  const handleCancel = () => {
    setEditingMember(null);
    setMemberForm({ name: '', role: '', email: '' });
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2>Rediger Team</h2>

        <div className="team-member-list">
          {teamMembers.map(member => (
            <div key={member.id} className="team-member-item">
              {editingMember?.id === member.id ? (
                <div className="team-member-edit-form">
                  <div className="form-group">
                    <input
                      type="text"
                      value={memberForm.name}
                      onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                      placeholder="Navn"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      value={memberForm.role}
                      onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                      placeholder="Rolle"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      value={memberForm.email}
                      onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                      placeholder="E-post"
                    />
                  </div>
                  <div className="form-actions">
                    <button onClick={handleSaveMember} className="submit-btn" title="Lagre endringer">
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
                  <div className="team-member-info">
                    <span className="member-name">{member.name}</span>
                    <span className="member-role">{member.role}</span>
                    <span className="member-email">{member.email}</span>
                  </div>
                  <div className="team-member-actions">
                    <button
                      onClick={() => handleEdit(member)}
                      className="edit-btn"
                      title="Rediger medlem"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="delete-btn"
                      title="Slett medlem"
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

export default EditTeamMemberDialog;

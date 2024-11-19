import React, { useState } from 'react';
import './DialogStyles.css';

const EditTeamMemberDialog = ({ project, onClose, onUpdate, onDelete }) => {
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
      setTeamMembers(updatedTeam);
      await onDelete(memberId, updatedTeam);
    }
  };

  const handleSaveMember = () => {
    if (editingMember) {
      const updatedTeam = teamMembers.map(member =>
        member.id === editingMember.id
          ? { ...member, ...memberForm }
          : member
      );
      setTeamMembers(updatedTeam);
      onUpdate(updatedTeam);
      setEditingMember(null);
      setMemberForm({ name: '', role: '', email: '' });
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
                    <button onClick={handleSaveMember} className="submit-btn">
                      Lagre
                    </button>
                    <button onClick={handleCancel} className="cancel-btn">
                      Avbryt
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
                    >
                      Rediger
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
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

export default EditTeamMemberDialog;

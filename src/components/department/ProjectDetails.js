import React, { useState } from 'react';
import ProjectProgress from '../ProjectProgress';
import ProjectComments from '../ProjectComments';
import ProjectReport from '../ProjectReport';
import EditTeamMemberDialog from '../dialogs/EditTeamMemberDialog';
import EditMilestoneDialog from '../dialogs/EditMilestoneDialog';
import { auth } from '../../firebase';

const ProjectDetails = ({ 
  project, 
  isAdmin,
  onProgressUpdate,
  onToggleMilestone,
  onMilestoneProgressUpdate,
  onAddComment,
  onEditComment,
  onDownloadDocument,
  onActionClick 
}) => {
  const [showEditTeamDialog, setShowEditTeamDialog] = useState(false);
  const [showEditMilestoneDialog, setShowEditMilestoneDialog] = useState(false);
  const isProjectOwner = project.createdBy === auth.currentUser?.email;
  const canEdit = isAdmin || isProjectOwner;

  const handleMilestoneProgressChange = (milestoneId, progress) => {
    const value = Math.min(100, Math.max(0, progress));
    onMilestoneProgressUpdate(project.id, milestoneId, value);
  };

  return (
    <div className="project-details">
      <div className="project-description">
        <h4>Beskrivelse</h4>
        <p>{project.description}</p>
      </div>

      <ProjectProgress
        progress={project.progress || 0}
        onUpdate={(progress) => onProgressUpdate(project.id, progress)}
        isEditable={canEdit}
      />

      <div className="project-budget">
        <h4>Budsjett</h4>
        <div className="budget-info">
          <div>
            <span>Planlagt: </span>
            <strong>{project.budget.planned.toLocaleString()} kr</strong>
          </div>
          <div>
            <span>Faktisk: </span>
            <strong>{(project.budget.entries || [])
              .reduce((sum, entry) => sum + Number(entry.amount), 0)
              .toLocaleString()} kr</strong>
          </div>
        </div>
        {canEdit && (
          <button 
            onClick={(e) => onActionClick(e, project, 'budget')}
            className="edit-btn"
          >
            Oppdater budsjett
          </button>
        )}
      </div>

      <div className="project-team">
        <div className="section-header-with-actions">
          <h4>Team</h4>
          {canEdit && (
            <div className="section-actions">
              <button 
                onClick={() => setShowEditTeamDialog(true)}
                className="edit-btn"
              >
                Rediger team
              </button>
              <button 
                onClick={(e) => onActionClick(e, project, 'team')}
                className="add-btn"
              >
                Legg til teammedlem
              </button>
            </div>
          )}
        </div>
        <div className="team-list">
          {project.team.map(member => (
            <div key={member.id} className="team-member">
              <span className="member-name">{member.name}</span>
              <span className="member-role">{member.role}</span>
              <span className="member-email">{member.email}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="project-milestones">
        <div className="section-header-with-actions">
          <h4>Milepæler</h4>
          {canEdit && (
            <div className="section-actions">
              <button 
                onClick={() => setShowEditMilestoneDialog(true)}
                className="edit-btn"
              >
                Rediger milepæler
              </button>
              <button 
                onClick={(e) => onActionClick(e, project, 'milestone')}
                className="add-btn"
              >
                Legg til milepæl
              </button>
            </div>
          )}
        </div>
        <div className="milestones-list">
          {project.milestones.map(milestone => (
            <div key={milestone.id} className="milestone">
              <input
                type="checkbox"
                className="milestone-checkbox"
                checked={milestone.completed}
                onChange={() => onToggleMilestone(project.id, milestone.id)}
              />
              <div className="milestone-info">
                <span className="milestone-name">{milestone.name}</span>
                <span className="milestone-date">
                  {new Date(milestone.date).toLocaleDateString()}
                </span>
                {milestone.description && (
                  <span className="milestone-description">{milestone.description}</span>
                )}
              </div>
              <div className="milestone-progress">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={milestone.progress || 0}
                  onChange={(e) => handleMilestoneProgressChange(milestone.id, parseInt(e.target.value))}
                  className="milestone-progress-input"
                />
                <span className="milestone-progress-label">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="project-documents">
        <h4>Dokumenter</h4>
        <div className="documents-list">
          {project.documents.map(doc => (
            <div key={doc.id} className="document">
              <div className="document-info">
                <span className="document-name">{doc.name}</span>
                {doc.description && (
                  <span className="document-description">{doc.description}</span>
                )}
                <div className="document-meta">
                  <span className="document-date">
                    Lastet opp: {new Date(doc.uploadDate).toLocaleDateString()}
                  </span>
                  {doc.fileSize && (
                    <span className="document-size">
                      {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                  )}
                </div>
              </div>
              <div className="document-actions">
                <button
                  onClick={() => onDownloadDocument(doc)}
                  className="download-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v6.293L6.707 8a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L11 10.293V4a1 1 0 00-1-1z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Last ned
                </button>
              </div>
            </div>
          ))}
        </div>
        {canEdit && (
          <button 
            onClick={(e) => onActionClick(e, project, 'document')}
            className="add-btn"
          >
            Last opp dokument
          </button>
        )}
      </div>

      <ProjectComments
        comments={project.comments || []}
        onAddComment={(comment) => onAddComment(project.id, comment)}
        onEditComment={(commentId, newText) => onEditComment(project.id, commentId, newText)}
      />

      <div className="project-actions">
        <div className="project-actions-left">
          <ProjectReport project={project} />
        </div>
        {isAdmin && (
          <div className="project-actions-right">
            <button 
              onClick={(e) => onActionClick(e, project, 'delete')}
              className="delete-btn"
            >
              Slett Prosjekt
            </button>
          </div>
        )}
      </div>

      {showEditTeamDialog && (
        <EditTeamMemberDialog
          project={project}
          onClose={() => setShowEditTeamDialog(false)}
          onUpdate={(updatedTeam) => {
            onActionClick(null, { ...project, team: updatedTeam }, 'updateTeam');
            setShowEditTeamDialog(false);
          }}
          onDelete={(memberId, updatedTeam) => {
            onActionClick(null, { ...project, team: updatedTeam }, 'deleteTeamMember');
            setShowEditTeamDialog(false);
          }}
        />
      )}

      {showEditMilestoneDialog && (
        <EditMilestoneDialog
          project={project}
          onClose={() => setShowEditMilestoneDialog(false)}
          onUpdate={(updatedMilestones) => {
            onActionClick(null, { ...project, milestones: updatedMilestones }, 'updateMilestone');
            setShowEditMilestoneDialog(false);
          }}
          onDelete={(milestoneId, updatedMilestones) => {
            onActionClick(null, { ...project, milestones: updatedMilestones }, 'deleteMilestone');
            setShowEditMilestoneDialog(false);
          }}
        />
      )}
    </div>
  );
};

export default ProjectDetails;

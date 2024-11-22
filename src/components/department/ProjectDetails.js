import React, { useState } from 'react';
import ProjectProgress from '../ProjectProgress';
import ProjectComments from '../ProjectComments';
import ProjectReport from '../ProjectReport';
import EditTeamMemberDialog from '../dialogs/EditTeamMemberDialog';
import EditMilestoneDialog from '../dialogs/EditMilestoneDialog';
import EditDescriptionDialog from '../dialogs/EditDescriptionDialog';
import AddTeamMemberDialog from '../dialogs/AddTeamMemberDialog';
import AddMilestoneDialog from '../dialogs/AddMilestoneDialog';
import UpdateBudgetDialog from '../dialogs/UpdateBudgetDialog';
import { auth } from '../../firebase';
import { ProjectActions } from './ProjectActions';
import './ProjectDetails.css';

const ProjectDetails = ({ 
  project, 
  isAdmin,
  onProgressUpdate,
  onToggleMilestone,
  onMilestoneProgressUpdate,
  onDownloadDocument,
  onActionClick 
}) => {
  const [showEditTeamDialog, setShowEditTeamDialog] = useState(false);
  const [showEditMilestoneDialog, setShowEditMilestoneDialog] = useState(false);
  const [showEditDescriptionDialog, setShowEditDescriptionDialog] = useState(false);
  const [showAddTeamDialog, setShowAddTeamDialog] = useState(false);
  const [showAddMilestoneDialog, setShowAddMilestoneDialog] = useState(false);
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState(project);
  const [milestoneProgress, setMilestoneProgress] = useState(
    project.milestones.reduce((acc, milestone) => ({
      ...acc,
      [milestone.id]: milestone.progress ?? 0
    }), {})
  );
  const [milestoneCompleted, setMilestoneCompleted] = useState(
    project.milestones.reduce((acc, milestone) => ({
      ...acc,
      [milestone.id]: milestone.completed ?? false
    }), {})
  );
  const [localProgress, setLocalProgress] = useState(project.progress ?? 0);
  const isProjectOwner = project.createdBy === auth.currentUser?.email;
  const canEdit = isAdmin || isProjectOwner;

  // Create a project object with the latest local state for the report
  const getUpdatedProject = () => ({
    ...currentProject,
    progress: localProgress,
    milestones: currentProject.milestones.map(milestone => ({
      ...milestone,
      progress: milestoneProgress[milestone.id] ?? (milestone.progress ?? 0),
      completed: milestoneCompleted[milestone.id] ?? milestone.completed ?? false
    }))
  });

  const handleProgressUpdate = (projectId, progress) => {
    setLocalProgress(progress);
    onProgressUpdate(projectId, progress);
  };

  const handleMilestoneProgressChange = (milestoneId, progress) => {
    const value = Math.min(100, Math.max(0, progress));
    setMilestoneProgress(prev => ({
      ...prev,
      [milestoneId]: value
    }));
    onMilestoneProgressUpdate(project.id, milestoneId, value);
  };

  const handleToggleMilestone = (projectId, milestoneId) => {
    setMilestoneCompleted(prev => {
      const newValue = !prev[milestoneId];
      return {
        ...prev,
        [milestoneId]: newValue
      };
    });
    onToggleMilestone(projectId, milestoneId);
  };

  const handleTeamUpdate = async (updatedTeam) => {
    const success = await ProjectActions.handleUpdateTeamMember(project.id, updatedTeam);
    if (success) {
      setCurrentProject(prev => ({
        ...prev,
        team: updatedTeam
      }));
      onActionClick(null, { ...currentProject, team: updatedTeam }, 'updateTeam');
    }
  };

  const handleMilestoneUpdate = async (updatedMilestones) => {
    const success = await ProjectActions.handleUpdateMilestone(project.id, updatedMilestones);
    if (success) {
      setCurrentProject(prev => ({
        ...prev,
        milestones: updatedMilestones
      }));
      onActionClick(null, { ...currentProject, milestones: updatedMilestones }, 'updateMilestone');
    }
  };

  const handleDescriptionUpdate = async (description) => {
    const success = await ProjectActions.handleUpdateDescription(project.id, description);
    if (success) {
      setCurrentProject(prev => ({
        ...prev,
        description
      }));
      onActionClick(null, { ...currentProject, description }, 'updateDescription');
    }
  };

  const handleAddTeamMember = async (updatedTeam) => {
    setCurrentProject(prev => ({
      ...prev,
      team: updatedTeam
    }));
    onActionClick(null, { ...currentProject, team: updatedTeam }, 'updateTeam');
  };

  const handleAddMilestone = async (updatedMilestones) => {
    setCurrentProject(prev => ({
      ...prev,
      milestones: updatedMilestones
    }));
    onActionClick(null, { ...currentProject, milestones: updatedMilestones }, 'updateMilestone');
  };

  const handleBudgetUpdate = async (updatedBudget) => {
    setCurrentProject(prev => ({
      ...prev,
      budget: updatedBudget
    }));
    onActionClick(null, { ...currentProject, budget: updatedBudget }, 'updateBudget');
  };

  const handleAddComment = async (comment) => {
    const updatedComments = [...(currentProject.comments || []), comment];
    setCurrentProject(prev => ({
      ...prev,
      comments: updatedComments
    }));
  };

  const handleEditComment = async (commentId, newText, updatedComments) => {
    if (updatedComments) {
      setCurrentProject(prev => ({
        ...prev,
        comments: updatedComments
      }));
      return;
    }

    const updatedCommentsArray = currentProject.comments.map(comment => 
      comment.id === commentId
        ? { 
            ...comment, 
            text: newText,
            edited: true,
            editedAt: new Date().toISOString()
          }
        : comment
    );
    setCurrentProject(prev => ({
      ...prev,
      comments: updatedCommentsArray
    }));
  };

  return (
    <div className="project-details">
      <div className="project-description">
        <div className="section-header">
          <h4>Beskrivelse</h4>
          {canEdit && (
            <button 
              onClick={() => setShowEditDescriptionDialog(true)}
              className="edit-btn"
              title="Rediger beskrivelse"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
              </svg>
            </button>
          )}
        </div>
        <p>{currentProject.description}</p>
      </div>

      <ProjectProgress
        progress={localProgress}
        onUpdate={(progress) => handleProgressUpdate(currentProject.id, progress)}
        isEditable={canEdit}
      />

      <div className="project-budget">
        <h4>Budsjett</h4>
        <div className="budget-info">
          <div>
            <span>Planlagt: </span>
            <strong>{currentProject.budget.planned.toLocaleString()} kr</strong>
          </div>
          <div>
            <span>Faktisk: </span>
            <strong>{(currentProject.budget.entries || [])
              .reduce((sum, entry) => sum + Number(entry.amount), 0)
              .toLocaleString()} kr</strong>
          </div>
        </div>
        {canEdit && (
          <button 
            onClick={() => setShowBudgetDialog(true)}
            className="add-btn"
            title="Vis budsjettdetaljer"
          >
            Detaljer
          </button>
        )}
      </div>

      <div className="project-team">
        <h4>Team</h4>
        <div className="team-list">
          {currentProject.team.map(member => (
            <div key={member.id} className="team-member">
              <span className="member-name">{member.name}</span>
              <span className="member-role">{member.role}</span>
              <span className="member-email">{member.email}</span>
            </div>
          ))}
        </div>
        {canEdit && (
          <>
            <button 
              onClick={() => setShowAddTeamDialog(true)}
              className="add-btn"
            >
              Legg til teammedlem
            </button>
            <button 
              onClick={() => setShowEditTeamDialog(true)}
              className="edit-btn"
              title="Rediger team"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
              </svg>
            </button>
          </>
        )}
      </div>

      <div className="project-milestones">
        <h4>Milepæler</h4>
        <div className="milestones-list">
          {currentProject.milestones.map(milestone => (
            <div key={milestone.id} className="milestone">
              <input
                type="checkbox"
                className="milestone-checkbox"
                checked={milestoneCompleted[milestone.id] ?? milestone.completed ?? false}
                onChange={() => handleToggleMilestone(currentProject.id, milestone.id)}
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
                  value={milestoneProgress[milestone.id]}
                  onChange={(e) => handleMilestoneProgressChange(milestone.id, parseInt(e.target.value))}
                  className="milestone-progress-input"
                />
                <span className="milestone-progress-label">%</span>
              </div>
            </div>
          ))}
        </div>
        {canEdit && (
          <>
            <button 
              onClick={() => setShowAddMilestoneDialog(true)}
              className="add-btn"
            >
              Legg til milepæl
            </button>
            <button 
              onClick={() => setShowEditMilestoneDialog(true)}
              className="edit-btn"
              title="Rediger milepæler"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
              </svg>
            </button>
          </>
        )}
      </div>

      <div className="project-documents">
        <h4>Dokumenter</h4>
        <div className="documents-list">
          {currentProject.documents.map(doc => (
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
            onClick={(e) => onActionClick(e, currentProject, 'document')}
            className="add-btn"
          >
            Last opp dokument
          </button>
        )}
      </div>

      <ProjectComments
        project={currentProject}
        comments={currentProject.comments || []}
        onAddComment={handleAddComment}
        onEditComment={handleEditComment}
      />

      <div className="project-actions">
        <div className="project-actions-left">
          <ProjectReport project={getUpdatedProject()} />
        </div>
        {isAdmin && (
          <div className="project-actions-right">
            <button 
              onClick={(e) => onActionClick(e, currentProject, 'delete')}
              className="delete-btn"
            >
              Slett Prosjekt
            </button>
          </div>
        )}
      </div>

      {showEditDescriptionDialog && (
        <EditDescriptionDialog
          project={currentProject}
          onClose={() => setShowEditDescriptionDialog(false)}
          onUpdate={handleDescriptionUpdate}
        />
      )}

      {showBudgetDialog && (
        <UpdateBudgetDialog
          project={currentProject}
          onClose={() => setShowBudgetDialog(false)}
          onUpdate={handleBudgetUpdate}
        />
      )}

      {showEditTeamDialog && (
        <EditTeamMemberDialog
          project={currentProject}
          onClose={() => setShowEditTeamDialog(false)}
          onUpdate={handleTeamUpdate}
        />
      )}

      {showEditMilestoneDialog && (
        <EditMilestoneDialog
          project={currentProject}
          onClose={() => setShowEditMilestoneDialog(false)}
          onUpdate={handleMilestoneUpdate}
        />
      )}

      {showAddTeamDialog && (
        <AddTeamMemberDialog
          project={currentProject}
          onClose={() => setShowAddTeamDialog(false)}
          onAdd={handleAddTeamMember}
        />
      )}

      {showAddMilestoneDialog && (
        <AddMilestoneDialog
          project={currentProject}
          onClose={() => setShowAddMilestoneDialog(false)}
          onAdd={handleAddMilestone}
        />
      )}
    </div>
  );
};

export default ProjectDetails;

import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { permissionService } from '../../services/PermissionService';
import ProjectProgress from '../ProjectProgress';
import EditTeamMemberDialog from '../dialogs/EditTeamMemberDialog';
import EditMilestoneDialog from '../dialogs/EditMilestoneDialog';
import EditDescriptionDialog from '../dialogs/EditDescriptionDialog';
import AddTeamMemberDialog from '../dialogs/AddTeamMemberDialog';
import AddMilestoneDialog from '../dialogs/AddMilestoneDialog';
import UpdateBudgetDialog from '../dialogs/UpdateBudgetDialog';
import CommentsDialog from '../dialogs/CommentsDialog';

// Import new section components
import ProjectDescription from './project-sections/ProjectDescription';
import ProjectBudget from './project-sections/ProjectBudget';
import ProjectTeam from './project-sections/ProjectTeam';
import ProjectMilestones from './project-sections/ProjectMilestones';
import ProjectDocuments from './project-sections/ProjectDocuments';
import ProjectActionsToolbar from './project-sections/ProjectActionsToolbar';
import { ProjectService } from '../../services/ProjectService';

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
  const [showCommentsDialog, setShowCommentsDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState(project);
  const [canEditProject, setCanEditProject] = useState(false);
  const [isProjectAdmin, setIsProjectAdmin] = useState(false);
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

  useEffect(() => {
    const checkPermissions = async () => {
      if (!auth.currentUser) return;

      try {
        // Check if user is system admin or department admin
        const [systemAdmin, deptAdmin] = await Promise.all([
          permissionService.isSystemAdmin(auth.currentUser.uid),
          permissionService.isDepartmentAdmin(auth.currentUser.uid, project.departmentId)
        ]);

        const hasAdminAccess = systemAdmin || deptAdmin;
        setIsProjectAdmin(hasAdminAccess);
        setCanEditProject(hasAdminAccess || project.createdBy === auth.currentUser?.email);
      } catch (error) {
        console.error('Error checking project permissions:', error);
      }
    };

    checkPermissions();
  }, [project.departmentId, project.createdBy]);

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
    if (!canEditProject) return;
    setLocalProgress(progress);
    onProgressUpdate(projectId, progress);
  };

  const handleMilestoneProgressChange = (milestoneId, progress) => {
    if (!canEditProject) return;
    const value = Math.min(100, Math.max(0, progress));
    setMilestoneProgress(prev => ({
      ...prev,
      [milestoneId]: value
    }));
    onMilestoneProgressUpdate(project.id, milestoneId, value);
  };

  const handleToggleMilestone = (milestoneId) => {
    if (!canEditProject) return;
    setMilestoneCompleted(prev => {
      const newValue = !prev[milestoneId];
      return {
        ...prev,
        [milestoneId]: newValue
      };
    });
    onToggleMilestone(project.id, milestoneId);
  };

  const handleTeamUpdate = async (updatedTeam) => {
    if (!isProjectAdmin) return;
    const success = await ProjectService.handleUpdateTeamMember(project.id, updatedTeam);
    if (success) {
      setCurrentProject(prev => ({
        ...prev,
        team: updatedTeam
      }));
      onActionClick(null, { ...currentProject, team: updatedTeam }, 'updateTeam');
    }
  };

  const handleMilestoneUpdate = async (updatedMilestones) => {
    if (!isProjectAdmin) return;
    const success = await ProjectService.handleUpdateMilestone(project.id, updatedMilestones);
    if (success) {
      setCurrentProject(prev => ({
        ...prev,
        milestones: updatedMilestones
      }));
      onActionClick(null, { ...currentProject, milestones: updatedMilestones }, 'updateMilestone');
    }
  };

  const handleDescriptionUpdate = async (description) => {
    if (!canEditProject) return;
    const success = await ProjectService.handleUpdateDescription(project.id, description);
    if (success) {
      setCurrentProject(prev => ({
        ...prev,
        description
      }));
      onActionClick(null, { ...currentProject, description }, 'updateDescription');
    }
  };

  const handleAddTeamMember = async (updatedTeam) => {
    if (!isProjectAdmin) return;
    setCurrentProject(prev => ({
      ...prev,
      team: updatedTeam
    }));
    onActionClick(null, { ...currentProject, team: updatedTeam }, 'updateTeam');
  };

  const handleAddMilestone = async (updatedMilestones) => {
    if (!isProjectAdmin) return;
    setCurrentProject(prev => ({
      ...prev,
      milestones: updatedMilestones
    }));
    onActionClick(null, { ...currentProject, milestones: updatedMilestones }, 'updateMilestone');
  };

  const handleBudgetUpdate = async (updatedBudget) => {
    if (!isProjectAdmin) return;
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
    // Check if user can edit this comment
    const comment = currentProject.comments.find(c => c.id === commentId);
    if (!comment) return;

    if (!isProjectAdmin && comment.author !== auth.currentUser?.email) return;

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
      <ProjectDescription 
        description={currentProject.description}
        canEdit={canEditProject}
        onEditClick={() => setShowEditDescriptionDialog(true)}
      />

      <ProjectProgress
        progress={localProgress}
        onUpdate={(progress) => handleProgressUpdate(currentProject.id, progress)}
        isEditable={canEditProject}
      />

      <ProjectBudget 
        budget={currentProject.budget}
        canEdit={isProjectAdmin}
        onShowBudgetDialog={() => setShowBudgetDialog(true)}
      />

      <ProjectTeam 
        team={currentProject.team}
        canEdit={isProjectAdmin}
        onAddTeamMember={() => setShowAddTeamDialog(true)}
        onEditTeam={() => setShowEditTeamDialog(true)}
      />

      <ProjectMilestones 
        milestones={currentProject.milestones}
        milestoneProgress={milestoneProgress}
        milestoneCompleted={milestoneCompleted}
        canEdit={canEditProject}
        onToggleMilestone={handleToggleMilestone}
        onProgressChange={handleMilestoneProgressChange}
        onAddMilestone={() => setShowAddMilestoneDialog(true)}
        onEditMilestones={() => setShowEditMilestoneDialog(true)}
      />

      <ProjectDocuments 
        documents={currentProject.documents}
        canEdit={canEditProject}
        onDownloadDocument={onDownloadDocument}
        onUploadDocument={(e) => onActionClick(e, currentProject, 'document')}
      />

      <div className="project-section">
        <div className="section-header">
          <h3>Kommentarer</h3>
          <button 
            onClick={() => setShowCommentsDialog(true)}
            className="view-comments-btn"
          >
            Vis kommentarer ({currentProject.comments?.length || 0})
          </button>
        </div>
      </div>

      <ProjectActionsToolbar 
        project={getUpdatedProject()}
        isAdmin={isProjectAdmin}
        onDeleteProject={(e) => onActionClick(e, currentProject, 'delete')}
      />

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

      {showCommentsDialog && (
        <CommentsDialog
          project={currentProject}
          comments={currentProject.comments || []}
          onClose={() => setShowCommentsDialog(false)}
          onAddComment={handleAddComment}
          onEditComment={handleEditComment}
        />
      )}
    </div>
  );
};

export default ProjectDetails;

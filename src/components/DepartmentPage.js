import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectService } from '../services/ProjectService';
import useDepartmentState from './department/department-sections/DepartmentState';
import DepartmentHeader from './department/department-sections/DepartmentHeader';
import ProjectsSection from './department/department-sections/ProjectsSection';
import DepartmentDialogs from './department/department-sections/DepartmentDialogs';
import './DepartmentPage.css';

const DepartmentPage = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useDepartmentState(departmentId, navigate);

  if (state.loading) {
    return <div className="loading">Laster...</div>;
  }

  if (!state.department) {
    return <div className="loading">Laster avdelingsdata...</div>;
  }

  return (
    <div className="department-page">
      <DepartmentHeader
        department={state.department}
        isAdmin={state.isAdmin}
        onNavigateBack={() => navigate('/')}
      />

      <div className="department-content">
        <ProjectsSection
          showNewProject={state.showNewProject}
          setShowNewProject={actions.setShowNewProject}
          newProject={state.newProject}
          setNewProject={actions.setNewProject}
          projects={state.projects}
          selectedProject={state.selectedProject}
          isAdmin={state.isAdmin}
          onCreateProject={actions.handleCreateProject}
          onProjectClick={actions.handleProjectClick}
          onProgressUpdate={async (projectId, progress) => {
            const success = await ProjectService.handleProgressUpdate(projectId, progress);
            if (success) await actions.fetchProjects();
          }}
          onToggleMilestone={async (projectId, milestoneId) => {
            const project = state.projects.find(p => p.id === projectId);
            if (project) {
              const success = await ProjectService.handleToggleMilestone(
                projectId,
                milestoneId,
                project.milestones
              );
              if (success) await actions.fetchProjects();
            }
          }}
          onMilestoneProgressUpdate={actions.handleMilestoneProgressUpdate}
          onAddComment={async (projectId, comment) => {
            const project = state.projects.find(p => p.id === projectId);
            if (project) {
              const success = await ProjectService.handleAddComment(
                projectId,
                comment,
                project.comments
              );
              if (success) await actions.fetchProjects();
            }
          }}
          onEditComment={async (projectId, commentId, newText) => {
            const project = state.projects.find(p => p.id === projectId);
            if (project) {
              const success = await ProjectService.handleEditComment(
                projectId,
                commentId,
                newText,
                project.comments
              );
              if (success) await actions.fetchProjects();
            }
          }}
          onDownloadDocument={actions.handleDownloadDocument}
          onActionClick={actions.handleActionClick}
        />
      </div>

      <DepartmentDialogs
        activeProject={state.activeProject}
        showBudgetDialog={state.showBudgetDialog}
        showTeamDialog={state.showTeamDialog}
        showMilestoneDialog={state.showMilestoneDialog}
        showDocumentDialog={state.showDocumentDialog}
        showDeleteDialog={state.showDeleteDialog}
        onClose={actions.handleDialogClose}
        onDialogAction={actions.handleDialogAction}
      />
    </div>
  );
};

export default DepartmentPage;

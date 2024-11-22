import React from 'react';
import ProjectForm from '../ProjectForm';
import ProjectList from '../ProjectList';

const ProjectsSection = ({
  showNewProject,
  setShowNewProject,
  newProject,
  setNewProject,
  projects,
  selectedProject,
  isAdmin,
  onCreateProject,
  onProjectClick,
  onProgressUpdate,
  onToggleMilestone,
  onMilestoneProgressUpdate,
  onAddComment,
  onEditComment,
  onDownloadDocument,
  onActionClick
}) => {
  return (
    <section className="projects-section">
      <div className="section-header">
        <h2>Prosjekter</h2>
        <button 
          onClick={() => setShowNewProject(!showNewProject)}
          className="new-project-btn"
        >
          {showNewProject ? 'Avbryt' : 'Nytt Prosjekt'}
        </button>
      </div>

      {showNewProject && (
        <ProjectForm
          newProject={newProject}
          setNewProject={setNewProject}
          onSubmit={onCreateProject}
        />
      )}

      <ProjectList
        projects={projects}
        selectedProject={selectedProject}
        isAdmin={isAdmin}
        onProjectClick={onProjectClick}
        onProgressUpdate={onProgressUpdate}
        onToggleMilestone={onToggleMilestone}
        onMilestoneProgressUpdate={onMilestoneProgressUpdate}
        onAddComment={onAddComment}
        onEditComment={onEditComment}
        onDownloadDocument={onDownloadDocument}
        onActionClick={onActionClick}
      />
    </section>
  );
};

export default ProjectsSection;

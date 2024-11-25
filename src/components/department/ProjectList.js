import React from 'react';
import ProjectDetails from './ProjectDetails';

const ProjectList = ({
  projects,
  selectedProject,
  isAdmin,
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
    <div className="projects-list">
      {projects.map(project => (
        <div 
          key={project.id} 
          className={`project-card ${selectedProject === project.id ? 'selected' : ''}`}
          onClick={(e) => onProjectClick(project.id, e)}
        >
          <div className="project-header">
            <div className="project-header-content">
              <h3>{project.name}</h3>
              <span className="project-dates">
                {new Date(project.startDate).toLocaleDateString()} - 
                {new Date(project.endDate).toLocaleDateString()}
              </span>
            </div>
            <div 
              className="project-progress-compact"
              data-progress={project.progress || 0}
            >
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${project.progress || 0}%` }}
                />
              </div>
              <span className="progress-text">{project.progress || 0}%</span>
            </div>
          </div>
          
          {selectedProject === project.id && (
            <ProjectDetails
              project={project}
              isAdmin={isAdmin}
              onProgressUpdate={onProgressUpdate}
              onToggleMilestone={onToggleMilestone}
              onMilestoneProgressUpdate={onMilestoneProgressUpdate}
              onAddComment={onAddComment}
              onEditComment={onEditComment}
              onDownloadDocument={onDownloadDocument}
              onActionClick={onActionClick}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectList;

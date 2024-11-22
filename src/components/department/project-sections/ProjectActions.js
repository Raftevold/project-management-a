import React from 'react';
import ProjectReport from '../../ProjectReport';

const ProjectActions = ({ project, isAdmin, onDeleteProject }) => {
  return (
    <div className="project-actions">
      <div className="project-actions-left">
        <ProjectReport project={project} />
      </div>
      {isAdmin && (
        <div className="project-actions-right">
          <button 
            onClick={onDeleteProject}
            className="delete-btn"
          >
            Slett Prosjekt
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectActions;

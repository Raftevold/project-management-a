import React from 'react';
import './ProjectProgress.css';

const ProjectProgress = ({ progress, onUpdate, isEditable }) => {
  const handleChange = (e) => {
    if (isEditable && onUpdate) {
      onUpdate(parseInt(e.target.value, 10));
    }
  };

  const getProgressBarClass = (progress) => {
    if (progress < 30) return 'progress-bar progress-bar-low';
    if (progress < 70) return 'progress-bar progress-bar-medium';
    return 'progress-bar progress-bar-high';
  };

  return (
    <div className="project-progress">
      <div className="progress-header">
        <span className="progress-title">Fremdrift</span>
        <span className="progress-percentage">{progress}%</span>
      </div>
      <div className="progress-bar-container">
        {isEditable && (
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleChange}
            className="progress-slider"
          />
        )}
        <div 
          className={getProgressBarClass(progress)}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="progress-labels">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default ProjectProgress;

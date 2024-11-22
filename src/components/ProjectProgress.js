import React, { useState, useEffect } from 'react';
import './ProjectProgress.css';

const ProjectProgress = ({ progress, onUpdate, isEditable }) => {
  const [localProgress, setLocalProgress] = useState(progress);

  useEffect(() => {
    setLocalProgress(progress);
  }, [progress]);

  const handleChange = (e) => {
    if (isEditable && onUpdate) {
      const newProgress = parseInt(e.target.value, 10);
      setLocalProgress(newProgress);
      onUpdate(newProgress);
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
        <span className="progress-percentage">{localProgress}%</span>
      </div>
      <div className="progress-bar-container">
        {isEditable && (
          <input
            type="range"
            min="0"
            max="100"
            value={localProgress}
            onChange={handleChange}
            className="progress-slider"
          />
        )}
        <div 
          className={getProgressBarClass(localProgress)}
          style={{ width: `${localProgress}%` }}
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

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

  const getProgressColor = (value) => {
    if (value < 30) return 'low';
    if (value < 70) return 'medium';
    return 'high';
  };

  const colorLevel = getProgressColor(localProgress);

  return (
    <div className="project-progress">
      <div className="progress-header">
        <span className="progress-title">Fremdrift</span>
        <span className="progress-percentage">{localProgress}%</span>
      </div>
      <div className={`progress-container ${colorLevel}`}>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${localProgress}%` }}
          />
        </div>
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

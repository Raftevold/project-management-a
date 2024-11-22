import React from 'react';

const ProjectBudget = ({ budget, canEdit, onShowBudgetDialog }) => {
  const actualBudget = (budget.entries || [])
    .reduce((sum, entry) => sum + Number(entry.amount), 0);

  return (
    <div className="project-budget">
      <h4>Budsjett</h4>
      <div className="budget-info">
        <div>
          <span>Planlagt: </span>
          <strong>{budget.planned.toLocaleString()} kr</strong>
        </div>
        <div>
          <span>Faktisk: </span>
          <strong>{actualBudget.toLocaleString()} kr</strong>
        </div>
      </div>
      {canEdit && (
        <button 
          onClick={onShowBudgetDialog}
          className="add-btn"
          title="Vis budsjettdetaljer"
        >
          Detaljer
        </button>
      )}
    </div>
  );
};

export default ProjectBudget;

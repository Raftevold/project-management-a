import React from 'react';

const ProjectBudget = ({ budget, canEdit, onShowBudgetDialog }) => {
  const actualBudget = (budget.entries || [])
    .reduce((sum, entry) => sum + Number(entry.amount), 0);
  
  const remaining = Number(budget.planned || 0) - actualBudget;
  const percentageUsed = budget.planned ? (actualBudget / Number(budget.planned) * 100) : 0;

  const getBudgetStatus = () => {
    if (percentageUsed >= 100) return 'status-danger';
    if (percentageUsed >= 80) return 'status-warning';
    return 'status-good';
  };

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString('nb-NO');
  };

  return (
    <div className="project-budget">
      <h4>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
        Budsjett
      </h4>
      <div className="budget-info">
        <div className={getBudgetStatus()}>
          <span>Planlagt budsjett</span>
          <strong>{formatNumber(budget.planned)} kr</strong>
        </div>
        <div className={getBudgetStatus()}>
          <span>Totalt forbruk</span>
          <strong>{formatNumber(actualBudget)} kr</strong>
        </div>
        <div className={getBudgetStatus()}>
          <span>Gjenstående</span>
          <strong>{formatNumber(remaining)} kr</strong>
        </div>
      </div>
      {canEdit && (
        <button 
          onClick={onShowBudgetDialog}
          className="add-btn"
          title="Vis budsjettdetaljer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            marginTop: '1rem'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Detaljer
        </button>
      )}
    </div>
  );
};

export default ProjectBudget;

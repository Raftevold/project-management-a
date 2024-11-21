import React, { useState } from 'react';
import { ProjectActions } from '../department/ProjectActions';
import './DialogStyles.css';

const UpdateBudgetDialog = ({ project, onClose, onUpdate }) => {
  const [plannedBudget, setPlannedBudget] = useState(project.budget.planned);
  const [budgetEntries, setBudgetEntries] = useState(
    project.budget.entries || []
  );
  const [newEntry, setNewEntry] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  const totalActual = budgetEntries.reduce((sum, entry) => sum + Number(entry.amount), 0);

  const handleAddEntry = () => {
    if (newEntry.description && newEntry.amount) {
      const updatedEntries = [...budgetEntries, { ...newEntry, id: Date.now().toString() }];
      setBudgetEntries(updatedEntries);
      setNewEntry({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleRemoveEntry = async (entryId) => {
    if (window.confirm('Er du sikker på at du vil slette denne kostnaden?')) {
      const updatedEntries = budgetEntries.filter(entry => entry.id !== entryId);
      const updatedBudget = {
        planned: Number(plannedBudget),
        actual: updatedEntries.reduce((sum, entry) => sum + Number(entry.amount), 0),
        entries: updatedEntries
      };
      
      const success = await ProjectActions.handleUpdateBudget(project.id, updatedBudget);
      if (success) {
        setBudgetEntries(updatedEntries);
        onUpdate(updatedBudget);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedBudget = {
      planned: Number(plannedBudget),
      actual: totalActual,
      entries: budgetEntries
    };
    
    const success = await ProjectActions.handleUpdateBudget(project.id, updatedBudget);
    if (success) {
      onUpdate(updatedBudget);
      onClose();
    }
  };

  // Sort entries by date in ascending order
  const sortedEntries = [...budgetEntries].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="dialog-overlay">
      <div className="dialog-content budget-dialog">
        <h2>Oppdater Budsjett</h2>
        
        <div className="budget-summary">
          <div className="summary-item">
            <label>Planlagt budsjett:</label>
            <div className="planned-budget-input">
              <input
                type="number"
                value={plannedBudget}
                onChange={(e) => setPlannedBudget(e.target.value)}
                className="budget-input"
              />
              <span className="currency">kr</span>
            </div>
          </div>
          <div className="summary-item">
            <label>Totalt forbruk:</label>
            <span>{totalActual.toLocaleString()} kr</span>
          </div>
          <div className="summary-item">
            <label>Gjenstående:</label>
            <span>{(plannedBudget - totalActual).toLocaleString()} kr</span>
          </div>
        </div>

        <div className="budget-entries">
          <h3>Kostnader</h3>
          {sortedEntries.map(entry => (
            <div key={entry.id} className="budget-entry">
              <div className="entry-info">
                <span className="entry-date">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
                <span className="entry-description">{entry.description}</span>
                <span className="entry-amount">{Number(entry.amount).toLocaleString()} kr</span>
              </div>
              <button 
                type="button" 
                onClick={() => handleRemoveEntry(entry.id)}
                className="remove-entry-btn"
                title="Slett kostnad"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="new-entry-form">
          <h3>Legg til ny kostnad</h3>
          <div className="entry-inputs">
            <div className="form-group">
              <label>Dato:</label>
              <input
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Beskrivelse:</label>
              <input
                type="text"
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                placeholder="F.eks. Konsulentarbeid"
              />
            </div>
            <div className="form-group">
              <label>Beløp (NOK):</label>
              <input
                type="number"
                value={newEntry.amount}
                onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                placeholder="0"
              />
            </div>
            <button 
              type="button" 
              onClick={handleAddEntry}
              className="add-entry-btn"
              disabled={!newEntry.description || !newEntry.amount}
            >
              Legg til
            </button>
          </div>
        </div>

        <div className="dialog-actions">
          <button type="button" onClick={onClose} className="cancel-btn">
            Avbryt
          </button>
          <button type="button" onClick={handleSubmit} className="submit-btn">
            Lagre endringer
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateBudgetDialog;

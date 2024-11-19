import React, { useState } from 'react';
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
      setBudgetEntries([...budgetEntries, { ...newEntry, id: Date.now().toString() }]);
      setNewEntry({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleRemoveEntry = (entryId) => {
    setBudgetEntries(budgetEntries.filter(entry => entry.id !== entryId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      planned: Number(plannedBudget),
      actual: totalActual,
      entries: budgetEntries
    });
    onClose();
  };

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
          {budgetEntries.map(entry => (
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
              >
                ×
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

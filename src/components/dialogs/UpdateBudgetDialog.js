import React, { useState } from 'react';
import { ProjectService } from '../../services/ProjectService';
import BaseDialog from './BaseDialog';
import './DialogStyles.css';

const UpdateBudgetDialog = ({ project, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plannedBudget, setPlannedBudget] = useState(project.budget?.planned || '');
  const [entries, setEntries] = useState(project.budget?.entries || []);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: '',
    description: '',
    amount: ''
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const calculateTotalSpent = () => {
    return entries.reduce((sum, entry) => sum + Number(entry.amount), 0);
  };

  const calculateRemaining = () => {
    return Number(plannedBudget) - calculateTotalSpent();
  };

  const formatNumber = (num) => {
    return Number(num).toLocaleString('nb-NO');
  };

  const handlePlannedBudgetChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPlannedBudget(value);
    if (error) setError('');
  };

  const handleBudgetEditComplete = () => {
    if (plannedBudget) {
      setIsEditingBudget(false);
    }
  };

  const handleNewEntryChange = (e) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleAddEntry = () => {
    if (!newEntry.date || !newEntry.description || !newEntry.amount) {
      setError('Alle felt må fylles ut');
      return;
    }

    setEntries(prev => [...prev, { ...newEntry, id: Date.now().toString() }]);
    setNewEntry({ date: '', description: '', amount: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plannedBudget) {
      setError('Planlagt budsjett må fylles ut');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updatedBudget = {
        planned: plannedBudget,
        entries: entries
      };

      const success = await ProjectService.handleUpdateBudget(project.id, updatedBudget);
      
      if (success) {
        onUpdate(updatedBudget);
        onClose();
      } else {
        throw new Error('Kunne ikke oppdatere budsjettet');
      }
    } catch (err) {
      setError(err.message || 'Det oppstod en feil ved oppdatering av budsjettet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseDialog title="Oppdater budsjett" onClose={onClose}>
      <div className="budget-dialog">
        <div className="budget-header">
          <div className="planned-budget">
            <label>Planlagt budsjett:</label>
            <div className="budget-display">
              {isEditingBudget ? (
                <div className="budget-edit">
                  <input
                    type="text"
                    value={plannedBudget}
                    onChange={handlePlannedBudgetChange}
                    onBlur={handleBudgetEditComplete}
                    autoFocus
                  />
                  <span>kr</span>
                </div>
              ) : (
                <div className="budget-value">
                  <span>{formatNumber(plannedBudget)} kr</span>
                  <button 
                    className="edit-button"
                    onClick={() => setIsEditingBudget(true)}
                    aria-label="Rediger budsjett"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="budget-summary">
            <div>Totalt forbruk: {formatNumber(calculateTotalSpent())} kr</div>
            <div>Gjenstående: {formatNumber(calculateRemaining())} kr</div>
          </div>
        </div>

        <div className="costs-section">
          <h3>Kostnader</h3>
          <div className="costs-table">
            <div className="table-header">
              <div>Dato</div>
              <div>Beskrivelse</div>
              <div>Beløp</div>
            </div>
            {entries.map(entry => (
              <div key={entry.id} className="table-row">
                <div>{formatDate(entry.date)}</div>
                <div>{entry.description}</div>
                <div>{formatNumber(entry.amount)} kr</div>
              </div>
            ))}
          </div>
        </div>

        <div className="add-cost">
          <h3>Legg til ny kostnad</h3>
          <div className="add-cost-form">
            <div className="form-group">
              <label htmlFor="date">Dato:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={newEntry.date}
                onChange={handleNewEntryChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Beskrivelse:</label>
              <input
                type="text"
                id="description"
                name="description"
                value={newEntry.description}
                onChange={handleNewEntryChange}
                placeholder="F.eks. Konsulentarbeid"
              />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Beløp (NOK):</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={newEntry.amount}
                onChange={handleNewEntryChange}
              />
            </div>
            <button type="button" onClick={handleAddEntry} className="add-btn">
              Legg til
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="dialog-actions">
          <button onClick={onClose} className="cancel-btn" disabled={loading}>
            Avbryt
          </button>
          <button onClick={handleSubmit} className="save-btn" disabled={loading}>
            {loading ? 'Lagrer...' : 'Lagre endringer'}
          </button>
        </div>
      </div>
    </BaseDialog>
  );
};

export default UpdateBudgetDialog;

import React from 'react';

const ProjectForm = ({ newProject, setNewProject, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="new-project-form">
      <div className="form-group">
        <label>Prosjektnavn:</label>
        <input
          type="text"
          value={newProject.name}
          onChange={(e) => setNewProject({...newProject, name: e.target.value})}
          required
        />
      </div>
      <div className="form-group">
        <label>Beskrivelse:</label>
        <textarea
          value={newProject.description}
          onChange={(e) => setNewProject({...newProject, description: e.target.value})}
          required
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Startdato:</label>
          <input
            type="date"
            value={newProject.startDate}
            onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Sluttdato:</label>
          <input
            type="date"
            value={newProject.endDate}
            onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
            required
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Planlagt budsjett:</label>
          <input
            type="number"
            value={newProject.budget.planned}
            onChange={(e) => setNewProject({
              ...newProject,
              budget: { ...newProject.budget, planned: Number(e.target.value) }
            })}
            required
          />
        </div>
      </div>
      <button type="submit" className="submit-btn">Opprett Prosjekt</button>
    </form>
  );
};

export default ProjectForm;

import React from 'react';
import './DepartmentCard.css';

const DepartmentCard = ({ department, onSelect }) => {
  return (
    <div 
      className="department-card"
      onClick={() => onSelect(department.id)}
      style={{ backgroundColor: department.color }}
    >
      <h3>{department.name}</h3>
      <p>{department.description}</p>
      <div className="department-stats">
        <span>Antall brukere: {department.userCount || 0}</span>
      </div>
    </div>
  );
};

export default DepartmentCard;

import React from 'react';

const DepartmentHeader = ({ department, isAdmin, onNavigateBack }) => {
  return (
    <header className="department-header" style={{ backgroundColor: department.color }}>
      <h1>{department.name}</h1>
      <div className="header-actions">
        {isAdmin && <span className="admin-badge">Administrator</span>}
        <button onClick={onNavigateBack} className="back-btn">
          Tilbake til forsiden
        </button>
      </div>
    </header>
  );
};

export default DepartmentHeader;

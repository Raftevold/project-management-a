import React from 'react';

const ProjectDocuments = ({ documents, canEdit, onDownloadDocument, onUploadDocument }) => {
  return (
    <div className="project-documents">
      <h4>Dokumenter</h4>
      <div className="documents-list">
        {documents.map(doc => (
          <div key={doc.id} className="document">
            <div className="document-info">
              <span className="document-name">{doc.name}</span>
              {doc.description && (
                <span className="document-description">{doc.description}</span>
              )}
              <div className="document-meta">
                <span className="document-date">
                  Lastet opp: {new Date(doc.uploadDate).toLocaleDateString()}
                </span>
                {doc.fileSize && (
                  <span className="document-size">
                    {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                  </span>
                )}
              </div>
            </div>
            <div className="document-actions">
              <button
                onClick={() => onDownloadDocument(doc)}
                className="download-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v6.293L6.707 8a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L11 10.293V4a1 1 0 00-1-1z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Last ned
              </button>
            </div>
          </div>
        ))}
      </div>
      {canEdit && (
        <button 
          onClick={onUploadDocument}
          className="add-btn"
        >
          Last opp dokument
        </button>
      )}
    </div>
  );
};

export default ProjectDocuments;

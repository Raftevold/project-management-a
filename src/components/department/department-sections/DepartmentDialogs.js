import React from 'react';
import UpdateBudgetDialog from '../../dialogs/UpdateBudgetDialog';
import AddTeamMemberDialog from '../../dialogs/AddTeamMemberDialog';
import AddMilestoneDialog from '../../dialogs/AddMilestoneDialog';
import UploadDocumentDialog from '../../dialogs/UploadDocumentDialog';
import DeleteProjectDialog from '../../dialogs/DeleteProjectDialog';

const DepartmentDialogs = ({
  activeProject,
  showBudgetDialog,
  showTeamDialog,
  showMilestoneDialog,
  showDocumentDialog,
  showDeleteDialog,
  onClose,
  onDialogAction
}) => {
  return (
    <>
      {showBudgetDialog && activeProject && (
        <UpdateBudgetDialog
          project={activeProject}
          onClose={() => onClose('budget')}
          onUpdate={(budget) => onDialogAction('budget', budget)}
        />
      )}

      {showTeamDialog && activeProject && (
        <AddTeamMemberDialog
          onClose={() => onClose('team')}
          onAdd={(member) => onDialogAction('team', member)}
        />
      )}

      {showMilestoneDialog && activeProject && (
        <AddMilestoneDialog
          onClose={() => onClose('milestone')}
          onAdd={(milestone) => onDialogAction('milestone', milestone)}
        />
      )}

      {showDocumentDialog && activeProject && (
        <UploadDocumentDialog
          onClose={() => onClose('document')}
          onUpload={(document) => onDialogAction('document', document)}
        />
      )}

      {showDeleteDialog && activeProject && (
        <DeleteProjectDialog
          project={activeProject}
          onClose={() => onClose('delete')}
          onDelete={() => onDialogAction('delete')}
        />
      )}
    </>
  );
};

export default DepartmentDialogs;

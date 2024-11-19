import { db, auth } from '../../firebase';
import {
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

export const ProjectActions = {
  handleUpdateBudget: async (projectId, budget) => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, { budget });
      return true;
    } catch (error) {
      console.error('Feil ved oppdatering av budsjett:', error);
      return false;
    }
  },

  handleAddTeamMember: async (projectId, member, currentTeam) => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      const updatedTeam = [...currentTeam, member];
      await updateDoc(projectRef, { team: updatedTeam });
      return true;
    } catch (error) {
      console.error('Feil ved tillegging av teammedlem:', error);
      return false;
    }
  },

  handleUpdateTeamMember: async (projectId, updatedTeam) => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, { team: updatedTeam });
      return true;
    } catch (error) {
      console.error('Feil ved oppdatering av teammedlem:', error);
      return false;
    }
  },

  handleDeleteTeamMember: async (projectId, memberId, updatedTeam) => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, { team: updatedTeam });
      return true;
    } catch (error) {
      console.error('Feil ved sletting av teammedlem:', error);
      return false;
    }
  },

  handleAddMilestone: async (projectId, milestone, currentMilestones) => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      const updatedMilestones = [...currentMilestones, milestone];
      await updateDoc(projectRef, { milestones: updatedMilestones });
      return true;
    } catch (error) {
      console.error('Feil ved tillegging av milepæl:', error);
      return false;
    }
  },

  handleUpdateMilestone: async (projectId, updatedMilestones) => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, { milestones: updatedMilestones });
      return true;
    } catch (error) {
      console.error('Feil ved oppdatering av milepæl:', error);
      return false;
    }
  },

  handleDeleteMilestone: async (projectId, milestoneId, updatedMilestones) => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, { milestones: updatedMilestones });
      return true;
    } catch (error) {
      console.error('Feil ved sletting av milepæl:', error);
      return false;
    }
  },

  handleToggleMilestone: async (projectId, milestoneId, currentMilestones) => {
    try {
      const updatedMilestones = currentMilestones.map(milestone => 
        milestone.id === milestoneId 
          ? { ...milestone, completed: !milestone.completed }
          : milestone
      );
      
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, { milestones: updatedMilestones });
      return true;
    } catch (error) {
      console.error('Feil ved oppdatering av milepæl:', error);
      return false;
    }
  },

  handleMilestoneProgressUpdate: async (projectId, milestoneId, progress, currentMilestones) => {
    try {
      const updatedMilestones = currentMilestones.map(milestone => 
        milestone.id === milestoneId 
          ? { ...milestone, progress }
          : milestone
      );
      
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, { milestones: updatedMilestones });
      return true;
    } catch (error) {
      console.error('Feil ved oppdatering av milepæl fremdrift:', error);
      return false;
    }
  },

  handleProgressUpdate: async (projectId, progress) => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, { progress });
      return true;
    } catch (error) {
      console.error('Feil ved oppdatering av fremdrift:', error);
      return false;
    }
  },

  handleAddComment: async (projectId, comment, currentComments) => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      const updatedComments = [...(currentComments || []), {
        ...comment,
        timestamp: new Date().toISOString(), // Using ISO string instead of serverTimestamp
        author: auth.currentUser?.email
      }];
      await updateDoc(projectRef, { comments: updatedComments });
      return true;
    } catch (error) {
      console.error('Feil ved tillegging av kommentar:', error);
      return false;
    }
  },

  handleEditComment: async (projectId, commentId, newText, currentComments) => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      const updatedComments = currentComments.map(comment => 
        comment.id === commentId
          ? { 
              ...comment, 
              text: newText,
              edited: true,
              editedAt: new Date().toISOString()
            }
          : comment
      );
      await updateDoc(projectRef, { comments: updatedComments });
      return true;
    } catch (error) {
      console.error('Feil ved redigering av kommentar:', error);
      return false;
    }
  },

  handleUploadDocument: async (projectId, document, currentDocuments) => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      const documentData = {
        id: document.id,
        name: document.name,
        description: document.description,
        uploadDate: document.uploadDate,
        uploadedBy: auth.currentUser?.email,
        fileUrl: document.fileUrl,
        fileName: document.fileName,
        fileSize: document.fileSize,
        fileType: document.fileType
      };
      const updatedDocuments = [...currentDocuments, documentData];
      await updateDoc(projectRef, { documents: updatedDocuments });
      return true;
    } catch (error) {
      console.error('Feil ved opplasting av dokument:', error);
      return false;
    }
  },

  handleDeleteProject: async (projectId) => {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      return true;
    } catch (error) {
      console.error('Feil ved sletting av prosjekt:', error);
      return false;
    }
  }
};

export default ProjectActions;

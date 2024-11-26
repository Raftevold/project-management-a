import { db, auth } from '../firebase';
import { permissionService } from './PermissionService';
import {
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

export const ProjectService = {
  // Helper function to check project permissions
  checkProjectAccess: async (projectId, requiredRole = 'member') => {
    try {
      if (!auth.currentUser) return false;

      // Get project to check department
      const projectDoc = await getDoc(doc(db, 'projects', projectId));
      if (!projectDoc.exists()) return false;

      const projectData = projectDoc.data();
      const departmentId = projectData.departmentId;

      // Check permissions hierarchy
      const isAdmin = await permissionService.isSystemAdmin(auth.currentUser.uid);
      if (isAdmin) return true;

      const isDeptAdmin = await permissionService.isDepartmentAdmin(auth.currentUser.uid, departmentId);
      if (isDeptAdmin) return true;

      if (requiredRole === 'admin') return false; // Only admins can proceed past this point

      const isDeptMember = await permissionService.isDepartmentMember(auth.currentUser.uid, departmentId);
      return isDeptMember;
    } catch (error) {
      console.error('Error checking project access:', error);
      return false;
    }
  },

  handleUpdateDescription: async (projectId, description) => {
    try {
      if (!await ProjectService.checkProjectAccess(projectId)) {
        throw new Error('Insufficient permissions');
      }

      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, { description });
      return true;
    } catch (error) {
      console.error('Feil ved oppdatering av beskrivelse:', error);
      return false;
    }
  },

  handleUpdateBudget: async (projectId, budget) => {
    try {
      if (!await ProjectService.checkProjectAccess(projectId, 'admin')) {
        throw new Error('Insufficient permissions');
      }

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
      if (!await ProjectService.checkProjectAccess(projectId, 'admin')) {
        throw new Error('Insufficient permissions');
      }

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
      if (!await ProjectService.checkProjectAccess(projectId, 'admin')) {
        throw new Error('Insufficient permissions');
      }

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
      if (!await ProjectService.checkProjectAccess(projectId, 'admin')) {
        throw new Error('Insufficient permissions');
      }

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
      if (!await ProjectService.checkProjectAccess(projectId, 'admin')) {
        throw new Error('Insufficient permissions');
      }

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
      if (!await ProjectService.checkProjectAccess(projectId, 'admin')) {
        throw new Error('Insufficient permissions');
      }

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
      if (!await ProjectService.checkProjectAccess(projectId, 'admin')) {
        throw new Error('Insufficient permissions');
      }

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
      if (!await ProjectService.checkProjectAccess(projectId)) {
        throw new Error('Insufficient permissions');
      }

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
      if (!await ProjectService.checkProjectAccess(projectId)) {
        throw new Error('Insufficient permissions');
      }

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
      if (!await ProjectService.checkProjectAccess(projectId)) {
        throw new Error('Insufficient permissions');
      }

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
      if (!await ProjectService.checkProjectAccess(projectId)) {
        throw new Error('Insufficient permissions');
      }

      const projectRef = doc(db, 'projects', projectId);
      const updatedComments = [...(currentComments || []), {
        ...comment,
        timestamp: new Date().toISOString(),
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
      if (!await ProjectService.checkProjectAccess(projectId)) {
        throw new Error('Insufficient permissions');
      }

      // Only allow editing own comments unless admin
      const comment = currentComments.find(c => c.id === commentId);
      if (!comment) return false;

      const isAdmin = await ProjectService.checkProjectAccess(projectId, 'admin');
      if (!isAdmin && comment.author !== auth.currentUser?.email) {
        throw new Error('Can only edit own comments');
      }

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

  handleDeleteComment: async (projectId, commentId, updatedComments) => {
    try {
      if (!await ProjectService.checkProjectAccess(projectId)) {
        throw new Error('Insufficient permissions');
      }

      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, { comments: updatedComments });
      return true;
    } catch (error) {
      console.error('Feil ved sletting av kommentar:', error);
      return false;
    }
  },

  handleUploadDocument: async (projectId, document, currentDocuments) => {
    try {
      if (!await ProjectService.checkProjectAccess(projectId)) {
        throw new Error('Insufficient permissions');
      }

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
      if (!await ProjectService.checkProjectAccess(projectId, 'admin')) {
        throw new Error('Insufficient permissions');
      }

      await deleteDoc(doc(db, 'projects', projectId));
      return true;
    } catch (error) {
      console.error('Feil ved sletting av prosjekt:', error);
      return false;
    }
  }
};

export default ProjectService;

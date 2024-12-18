import { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase';
import { permissionService } from '../../../services/PermissionService';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { ProjectService } from '../../../services/ProjectService';

const useDepartmentState = (departmentId, navigate) => {
  const [department, setDepartment] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showNewProject, setShowNewProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDepartmentAdmin, setIsDepartmentAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Dialog visibility states
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: {
      planned: 0,
      actual: 0,
      entries: []
    },
    team: [],
    milestones: [],
    documents: [],
    progress: 0,
    comments: []
  });

  const checkAccess = async () => {
    if (!auth.currentUser) {
      navigate('/');
      return false;
    }

    try {
      const [adminStatus, deptAdminStatus] = await Promise.all([
        permissionService.isSystemAdmin(auth.currentUser.uid),
        permissionService.isDepartmentAdmin(auth.currentUser.uid, departmentId)
      ]);

      setIsAdmin(adminStatus);
      setIsDepartmentAdmin(deptAdminStatus);

      // Check if user has any access to this department
      const hasDeptAccess = adminStatus || 
        deptAdminStatus || 
        await permissionService.isDepartmentMember(auth.currentUser.uid, departmentId);

      if (!hasDeptAccess) {
        navigate('/');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Feil ved sjekk av tilgang:', error);
      navigate('/');
      return false;
    }
  };

  const fetchDepartmentData = async () => {
    if (!auth.currentUser) return;

    try {
      const departmentDoc = await getDoc(doc(db, 'departments', departmentId));
      if (departmentDoc.exists()) {
        setDepartment({ id: departmentDoc.id, ...departmentDoc.data() });
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Feil ved henting av avdelingsdata:', error);
      navigate('/');
    }
  };

  const fetchProjects = async () => {
    if (!auth.currentUser) return;

    try {
      const projectsQuery = query(
        collection(db, 'projects'),
        where('departmentId', '==', departmentId)
      );
      const querySnapshot = await getDocs(projectsQuery);
      const projectsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsList);
    } catch (error) {
      console.error('Feil ved henting av prosjekter:', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const hasAccess = await checkAccess();
      if (hasAccess) {
        await fetchDepartmentData();
        await fetchProjects();
      }
      setLoading(false);
    };

    initialize();
  }, [departmentId, navigate]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!auth.currentUser || (!isAdmin && !isDepartmentAdmin)) return;

    try {
      const projectData = {
        ...newProject,
        departmentId,
        createdAt: serverTimestamp(),
        status: 'active',
        createdBy: auth.currentUser.email,
        progress: 0,
        comments: []
      };
      await addDoc(collection(db, 'projects'), projectData);
      setShowNewProject(false);
      setNewProject({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: {
          planned: 0,
          actual: 0,
          entries: []
        },
        team: [],
        milestones: [],
        documents: [],
        progress: 0,
        comments: []
      });
      await fetchProjects();
    } catch (error) {
      console.error('Feil ved opprettelse av prosjekt:', error);
    }
  };

  const handleProjectClick = (projectId, e) => {
    if (e.target.closest('.project-header')) {
      setSelectedProject(selectedProject === projectId ? null : projectId);
    }
  };

  const handleActionClick = (e, project, action) => {
    e?.stopPropagation();
    setActiveProject(project);
    
    switch (action) {
      case 'budget':
        setShowBudgetDialog(true);
        break;
      case 'team':
        setShowTeamDialog(true);
        break;
      case 'milestone':
        setShowMilestoneDialog(true);
        break;
      case 'document':
        setShowDocumentDialog(true);
        break;
      case 'delete':
        if (isAdmin || isDepartmentAdmin) {
          setShowDeleteDialog(true);
        }
        break;
      default:
        break;
    }
  };

  const handleDialogClose = (dialogType) => {
    switch (dialogType) {
      case 'budget':
        setShowBudgetDialog(false);
        break;
      case 'team':
        setShowTeamDialog(false);
        break;
      case 'milestone':
        setShowMilestoneDialog(false);
        break;
      case 'document':
        setShowDocumentDialog(false);
        break;
      case 'delete':
        setShowDeleteDialog(false);
        break;
      default:
        break;
    }
  };

  const handleDialogAction = async (action, data) => {
    if (!activeProject) return;

    let success = false;
    switch (action) {
      case 'budget':
        success = await ProjectService.handleUpdateBudget(activeProject.id, data);
        if (success) setShowBudgetDialog(false);
        break;
      case 'team':
        success = await ProjectService.handleAddTeamMember(activeProject.id, data, activeProject.team);
        if (success) setShowTeamDialog(false);
        break;
      case 'milestone':
        success = await ProjectService.handleAddMilestone(activeProject.id, data, activeProject.milestones);
        if (success) setShowMilestoneDialog(false);
        break;
      case 'document':
        success = await ProjectService.handleUploadDocument(activeProject.id, data, activeProject.documents);
        if (success) setShowDocumentDialog(false);
        break;
      case 'delete':
        if (isAdmin || isDepartmentAdmin) {
          success = await ProjectService.handleDeleteProject(activeProject.id);
          if (success) {
            setShowDeleteDialog(false);
            setSelectedProject(null);
          }
        }
        break;
      default:
        break;
    }

    if (success) {
      await fetchProjects();
    }
  };

  const handleMilestoneProgressUpdate = async (projectId, milestoneId, progress) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      const success = await ProjectService.handleMilestoneProgressUpdate(
        projectId,
        milestoneId,
        progress,
        project.milestones
      );
      if (success) await fetchProjects();
    }
  };

  const handleDownloadDocument = async (doc) => {
    try {
      if (doc.fileUrl) {
        window.open(doc.fileUrl, '_blank');
      }
    } catch (error) {
      console.error('Feil ved nedlasting av dokument:', error);
    }
  };

  return {
    state: {
      department,
      projects,
      showNewProject,
      selectedProject,
      isAdmin,
      isDepartmentAdmin,
      loading,
      showBudgetDialog,
      showTeamDialog,
      showMilestoneDialog,
      showDocumentDialog,
      showDeleteDialog,
      activeProject,
      newProject
    },
    actions: {
      setShowNewProject,
      setNewProject,
      handleCreateProject,
      handleProjectClick,
      handleActionClick,
      handleDialogClose,
      handleDialogAction,
      handleMilestoneProgressUpdate,
      handleDownloadDocument,
      fetchProjects
    }
  };
};

export default useDepartmentState;

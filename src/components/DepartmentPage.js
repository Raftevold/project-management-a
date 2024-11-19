import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { checkIsAdmin } from '../initFirestore';
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
import './DepartmentPage.css';

// Import dialog components
import UpdateBudgetDialog from './dialogs/UpdateBudgetDialog';
import AddTeamMemberDialog from './dialogs/AddTeamMemberDialog';
import AddMilestoneDialog from './dialogs/AddMilestoneDialog';
import UploadDocumentDialog from './dialogs/UploadDocumentDialog';
import DeleteProjectDialog from './dialogs/DeleteProjectDialog';

// Import department components
import ProjectForm from './department/ProjectForm';
import ProjectList from './department/ProjectList';
import { ProjectActions } from './department/ProjectActions';

const DepartmentPage = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showNewProject, setShowNewProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
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

  useEffect(() => {
    const checkAuth = async () => {
      if (!auth.currentUser) {
        navigate('/');
        return;
      }

      try {
        const adminStatus = await checkIsAdmin(auth.currentUser.email);
        setIsAdmin(adminStatus);
        setLoading(false);

        await fetchDepartmentData();
        await fetchProjects();
      } catch (error) {
        console.error('Feil ved autentisering:', error);
        setLoading(false);
      }
    };

    checkAuth();
  }, [departmentId, navigate]);

  const fetchDepartmentData = async () => {
    if (!auth.currentUser) return;

    try {
      const departmentDoc = await getDoc(doc(db, 'departments', departmentId));
      if (departmentDoc.exists()) {
        setDepartment({ id: departmentDoc.id, ...departmentDoc.data() });
      }
    } catch (error) {
      console.error('Feil ved henting av avdelingsdata:', error);
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

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;

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
        setShowDeleteDialog(true);
        break;
      default:
        break;
    }
  };

  const handleMilestoneProgressUpdate = async (projectId, milestoneId, progress) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      const success = await ProjectActions.handleMilestoneProgressUpdate(
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

  const handleDialogAction = async (action, data) => {
    if (!activeProject) return;

    let success = false;
    switch (action) {
      case 'budget':
        success = await ProjectActions.handleUpdateBudget(activeProject.id, data);
        if (success) setShowBudgetDialog(false);
        break;
      case 'team':
        success = await ProjectActions.handleAddTeamMember(activeProject.id, data, activeProject.team);
        if (success) setShowTeamDialog(false);
        break;
      case 'milestone':
        success = await ProjectActions.handleAddMilestone(activeProject.id, data, activeProject.milestones);
        if (success) setShowMilestoneDialog(false);
        break;
      case 'document':
        success = await ProjectActions.handleUploadDocument(activeProject.id, data, activeProject.documents);
        if (success) setShowDocumentDialog(false);
        break;
      case 'delete':
        success = await ProjectActions.handleDeleteProject(activeProject.id);
        if (success) {
          setShowDeleteDialog(false);
          setSelectedProject(null);
        }
        break;
      default:
        break;
    }

    if (success) {
      await fetchProjects();
    }
  };

  if (loading) {
    return <div className="loading">Laster...</div>;
  }

  if (!department) {
    return <div className="loading">Laster avdelingsdata...</div>;
  }

  return (
    <div className="department-page">
      <header className="department-header" style={{ backgroundColor: department.color }}>
        <h1>{department.name}</h1>
        <div className="header-actions">
          {isAdmin && <span className="admin-badge">Administrator</span>}
          <button onClick={() => navigate('/')} className="back-btn">
            Tilbake til forsiden
          </button>
        </div>
      </header>

      <div className="department-content">
        <section className="projects-section">
          <div className="section-header">
            <h2>Prosjekter</h2>
            <button 
              onClick={() => setShowNewProject(!showNewProject)}
              className="new-project-btn"
            >
              {showNewProject ? 'Avbryt' : 'Nytt Prosjekt'}
            </button>
          </div>

          {showNewProject && (
            <ProjectForm
              newProject={newProject}
              setNewProject={setNewProject}
              onSubmit={handleCreateProject}
            />
          )}

          <ProjectList
            projects={projects}
            selectedProject={selectedProject}
            isAdmin={isAdmin}
            onProjectClick={handleProjectClick}
            onProgressUpdate={async (projectId, progress) => {
              const success = await ProjectActions.handleProgressUpdate(projectId, progress);
              if (success) await fetchProjects();
            }}
            onToggleMilestone={async (projectId, milestoneId) => {
              const project = projects.find(p => p.id === projectId);
              if (project) {
                const success = await ProjectActions.handleToggleMilestone(
                  projectId,
                  milestoneId,
                  project.milestones
                );
                if (success) await fetchProjects();
              }
            }}
            onMilestoneProgressUpdate={handleMilestoneProgressUpdate}
            onAddComment={async (projectId, comment) => {
              const project = projects.find(p => p.id === projectId);
              if (project) {
                const success = await ProjectActions.handleAddComment(
                  projectId,
                  comment,
                  project.comments
                );
                if (success) await fetchProjects();
              }
            }}
            onEditComment={async (projectId, commentId, newText) => {
              const project = projects.find(p => p.id === projectId);
              if (project) {
                const success = await ProjectActions.handleEditComment(
                  projectId,
                  commentId,
                  newText,
                  project.comments
                );
                if (success) await fetchProjects();
              }
            }}
            onDownloadDocument={handleDownloadDocument}
            onActionClick={handleActionClick}
          />
        </section>
      </div>

      {/* Dialogs */}
      {showBudgetDialog && activeProject && (
        <UpdateBudgetDialog
          project={activeProject}
          onClose={() => setShowBudgetDialog(false)}
          onUpdate={(budget) => handleDialogAction('budget', budget)}
        />
      )}

      {showTeamDialog && activeProject && (
        <AddTeamMemberDialog
          onClose={() => setShowTeamDialog(false)}
          onAdd={(member) => handleDialogAction('team', member)}
        />
      )}

      {showMilestoneDialog && activeProject && (
        <AddMilestoneDialog
          onClose={() => setShowMilestoneDialog(false)}
          onAdd={(milestone) => handleDialogAction('milestone', milestone)}
        />
      )}

      {showDocumentDialog && activeProject && (
        <UploadDocumentDialog
          onClose={() => setShowDocumentDialog(false)}
          onUpload={(document) => handleDialogAction('document', document)}
        />
      )}

      {showDeleteDialog && activeProject && (
        <DeleteProjectDialog
          project={activeProject}
          onClose={() => setShowDeleteDialog(false)}
          onDelete={() => handleDialogAction('delete')}
        />
      )}
    </div>
  );
};

export default DepartmentPage;

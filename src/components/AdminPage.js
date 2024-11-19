import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeFirestore, checkIsAdmin } from '../initFirestore';
import { auth, db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  setDoc,
  query,
  where
} from 'firebase/firestore';
import './AdminPage.css';

const AdminPage = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [message, setMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: ''
  });
  const [users, setUsers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      if (auth.currentUser) {
        const adminStatus = await checkIsAdmin(auth.currentUser.email);
        setIsAdmin(adminStatus);
      }
    };
    checkAdmin();
    fetchDepartments();
    fetchUsers();
  }, []);

  const fetchDepartments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'departments'));
      const departmentList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDepartments(departmentList);
    } catch (error) {
      console.error('Feil ved henting av avdelinger:', error);
      setMessage('Feil ved henting av avdelinger: ' + error.message);
    }
  };

  const fetchUsers = async () => {
    try {
      // First ensure the current user exists in the users collection
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, {
          email: auth.currentUser.email,
          updatedAt: new Date()
        }, { merge: true });
      }

      const usersCollection = collection(db, 'users');
      const querySnapshot = await getDocs(usersCollection);
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      console.error('Feil ved henting av brukere:', error);
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      const departmentData = {
        ...newDepartment,
        userCount: 0,
        createdAt: new Date()
      };
      await addDoc(collection(db, 'departments'), departmentData);
      setMessage('Avdeling opprettet!');
      setNewDepartment({ name: '', description: '' });
      fetchDepartments();
    } catch (error) {
      console.error('Feil ved opprettelse av avdeling:', error);
      setMessage('Feil ved opprettelse av avdeling: ' + error.message);
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (window.confirm('Er du sikker på at du vil slette denne avdelingen?')) {
      try {
        await deleteDoc(doc(db, 'departments', departmentId));
        setMessage('Avdeling slettet!');
        fetchDepartments();
      } catch (error) {
        console.error('Feil ved sletting av avdeling:', error);
        setMessage('Feil ved sletting av avdeling: ' + error.message);
      }
    }
  };

  const handleAddUserToDepartment = async (userId, departmentId) => {
    try {
      const userDepartmentRef = doc(db, 'userDepartments', `${userId}_${departmentId}`);
      await setDoc(userDepartmentRef, {
        userId,
        departmentId,
        addedAt: new Date()
      });
      
      // Update department userCount
      const departmentRef = doc(db, 'departments', departmentId);
      const department = departments.find(d => d.id === departmentId);
      if (department) {
        await updateDoc(departmentRef, {
          userCount: (department.userCount || 0) + 1
        });
      }
      
      setMessage('Bruker lagt til i avdeling!');
      fetchDepartments();
    } catch (error) {
      console.error('Feil ved tillegging av bruker til avdeling:', error);
      setMessage('Feil ved tillegging av bruker: ' + error.message);
    }
  };

  if (!auth.currentUser) {
    return (
      <div className="admin-page">
        <div className="admin-content">
          <h2>Ikke tilgang</h2>
          <p>Du må være logget inn for å se denne siden.</p>
          <button onClick={() => navigate('/')} className="back-btn">
            Tilbake til forsiden
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-page">
        <div className="admin-content">
          <h2>Ikke tilgang</h2>
          <p>Du har ikke administratortilgang til denne siden.</p>
          <button onClick={() => navigate('/')} className="back-btn">
            Tilbake til forsiden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Administrasjonspanel</h1>
        <button onClick={() => navigate('/')} className="back-btn">
          Tilbake til forsiden
        </button>
      </header>

      <div className="admin-content">
        {message && (
          <div className={`message ${message.includes('Feil') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <section className="admin-section">
          <h2>Opprett Ny Avdeling</h2>
          <form onSubmit={handleCreateDepartment} className="department-form">
            <div className="form-group">
              <label>Navn:</label>
              <input
                type="text"
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Beskrivelse:</label>
              <textarea
                value={newDepartment.description}
                onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="create-btn">Opprett Avdeling</button>
          </form>
        </section>

        <section className="admin-section">
          <h2>Administrer Avdelinger</h2>
          <div className="departments-list">
            {departments.map(dept => (
              <div key={dept.id} className="department-item">
                <div className="department-info">
                  <h3>{dept.name}</h3>
                  <p>{dept.description}</p>
                  <span>Antall brukere: {dept.userCount || 0}</span>
                </div>
                <div className="department-actions">
                  <button 
                    onClick={() => setSelectedDepartment(dept.id === selectedDepartment ? null : dept.id)}
                    className="manage-btn"
                  >
                    {dept.id === selectedDepartment ? 'Lukk' : 'Administrer Tilgang'}
                  </button>
                  <button 
                    onClick={() => handleDeleteDepartment(dept.id)}
                    className="delete-btn"
                  >
                    Slett
                  </button>
                </div>
                {selectedDepartment === dept.id && (
                  <div className="user-access-panel">
                    <h4>Gi tilgang til brukere:</h4>
                    <div className="users-list">
                      {users.map(user => (
                        <div key={user.id} className="user-item">
                          <span>{user.email}</span>
                          <button 
                            onClick={() => handleAddUserToDepartment(user.id, dept.id)}
                            className="add-user-btn"
                          >
                            Legg til
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;

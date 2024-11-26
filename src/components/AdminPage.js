import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { checkIsAdmin } from '../initFirestore';
import Auth from './Auth';
import { 
  collection, 
  getDocs, 
  addDoc,
  deleteDoc, 
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where
} from 'firebase/firestore';
import './AdminPage.css';

const AdminPage = () => {
  const [message, setMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!auth.currentUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const adminStatus = await checkIsAdmin(auth.currentUser.email);
        console.log("Admin check result:", adminStatus, "for user:", auth.currentUser.email);
        setIsAdmin(adminStatus);
        setUser(auth.currentUser);
        
        if (adminStatus) {
          await fetchDepartments();
          await fetchUsers();
        }
        setLoading(false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setLoading(false);
      }
    };

    checkAdminStatus();
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
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      console.error('Feil ved henting av brukere:', error);
      setMessage('Feil ved henting av brukere: ' + error.message);
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
      await fetchDepartments();
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
        await fetchDepartments();
      } catch (error) {
        console.error('Feil ved sletting av avdeling:', error);
        setMessage('Feil ved sletting av avdeling: ' + error.message);
      }
    }
  };

  const handleAddUserToDepartment = async (userId, departmentId) => {
    try {
      const userDepartmentRef = doc(db, 'departmentRoles', userId);
      const userDepartmentDoc = await getDoc(userDepartmentRef);
      
      let departments = [];
      if (userDepartmentDoc.exists()) {
        departments = userDepartmentDoc.data().memberOf || [];
        if (departments.includes(departmentId)) {
          setMessage('Bruker har allerede tilgang til denne avdelingen');
          return;
        }
      }
      
      await setDoc(userDepartmentRef, {
        memberOf: [...departments, departmentId],
        updatedAt: new Date()
      }, { merge: true });

      // Update department userCount
      const departmentRef = doc(db, 'departments', departmentId);
      const departmentDoc = await getDoc(departmentRef);
      await updateDoc(departmentRef, {
        userCount: (departmentDoc.data().userCount || 0) + 1
      });
      
      setMessage('Bruker lagt til i avdeling!');
      await fetchDepartments();
    } catch (error) {
      console.error('Feil ved tillegging av bruker:', error);
      setMessage('Feil ved tillegging av bruker: ' + error.message);
    }
  };

  const handleRemoveUserFromDepartment = async (userId, departmentId) => {
    try {
      const userDepartmentRef = doc(db, 'departmentRoles', userId);
      const userDepartmentDoc = await getDoc(userDepartmentRef);
      
      if (userDepartmentDoc.exists()) {
        const departments = userDepartmentDoc.data().memberOf || [];
        const updatedDepartments = departments.filter(id => id !== departmentId);
        
        await setDoc(userDepartmentRef, {
          memberOf: updatedDepartments,
          updatedAt: new Date()
        }, { merge: true });

        // Update department userCount
        const departmentRef = doc(db, 'departments', departmentId);
        const departmentDoc = await getDoc(departmentRef);
        await updateDoc(departmentRef, {
          userCount: Math.max((departmentDoc.data().userCount || 1) - 1, 0)
        });

        setMessage('Brukertilgang fjernet!');
        await fetchDepartments();
      }
    } catch (error) {
      console.error('Feil ved fjerning av brukertilgang:', error);
      setMessage('Feil ved fjerning av brukertilgang: ' + error.message);
    }
  };

  const handleMakeUserDepartmentAdmin = async (userId, departmentId) => {
    try {
      const userDepartmentRef = doc(db, 'departmentRoles', userId);
      const userDepartmentDoc = await getDoc(userDepartmentRef);
      
      let adminOf = [];
      if (userDepartmentDoc.exists()) {
        adminOf = userDepartmentDoc.data().adminOf || [];
        if (adminOf.includes(departmentId)) {
          setMessage('Bruker er allerede admin for denne avdelingen');
          return;
        }
      }
      
      await setDoc(userDepartmentRef, {
        adminOf: [...adminOf, departmentId],
        updatedAt: new Date()
      }, { merge: true });
      
      setMessage('Bruker gjort til avdelingsadmin!');
    } catch (error) {
      console.error('Feil ved setting av admin:', error);
      setMessage('Feil ved setting av admin: ' + error.message);
    }
  };

  const handleRemoveDepartmentAdmin = async (userId, departmentId) => {
    try {
      const userDepartmentRef = doc(db, 'departmentRoles', userId);
      const userDepartmentDoc = await getDoc(userDepartmentRef);
      
      if (userDepartmentDoc.exists()) {
        const adminOf = userDepartmentDoc.data().adminOf || [];
        const updatedAdminOf = adminOf.filter(id => id !== departmentId);
        
        await setDoc(userDepartmentRef, {
          adminOf: updatedAdminOf,
          updatedAt: new Date()
        }, { merge: true });

        setMessage('Admin-tilgang fjernet!');
      }
    } catch (error) {
      console.error('Feil ved fjerning av admin:', error);
      setMessage('Feil ved fjerning av admin: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-content">
          <h2>Laster...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-page">
        <div className="admin-content">
          <h2>Ikke tilgang</h2>
          <p>Du må være logget inn for å se denne siden.</p>
          <Auth user={user} setUser={setUser} />
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
        <div className="header-actions">
          <Auth user={user} setUser={setUser} />
          <button onClick={() => navigate('/')} className="back-btn">
            Tilbake til forsiden
          </button>
        </div>
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
                    <h4>Administrer brukertilgang:</h4>
                    <div className="users-list">
                      {users.map(user => (
                        <div key={user.id} className="user-item">
                          <span>{user.email}</span>
                          <div className="role-buttons">
                            <button
                              onClick={() => handleAddUserToDepartment(user.id, dept.id)}
                              className="add-user-btn"
                            >
                              Gi tilgang
                            </button>
                            <button
                              onClick={() => handleRemoveUserFromDepartment(user.id, dept.id)}
                              className="remove-user-btn"
                            >
                              Fjern tilgang
                            </button>
                            <button
                              onClick={() => handleMakeUserDepartmentAdmin(user.id, dept.id)}
                              className="make-admin-btn"
                            >
                              Gjør til admin
                            </button>
                            <button
                              onClick={() => handleRemoveDepartmentAdmin(user.id, dept.id)}
                              className="remove-admin-btn"
                            >
                              Fjern admin
                            </button>
                          </div>
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

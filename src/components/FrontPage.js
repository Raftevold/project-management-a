import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import DepartmentCard from './DepartmentCard';
import Auth from './Auth';
import { checkIsAdmin } from '../initFirestore';
import './FrontPage.css';

const FrontPage = () => {
  const [user, setUser] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAdminStatus = useCallback(async () => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    
    try {
      const adminStatus = await checkIsAdmin(user.email);
      console.log('Admin status:', adminStatus, 'for bruker:', user.email);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error("Feil ved sjekk av admin-status:", error);
      setIsAdmin(false);
    }
  }, [user]);

  const fetchDepartments = useCallback(async () => {
    if (!user) {
      setDepartments([]);
      return;
    }

    try {
      const querySnapshot = await getDocs(collection(db, 'departments'));
      const departmentList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Hentet avdelinger:', departmentList.length);
      setDepartments(departmentList);
    } catch (error) {
      console.error("Feil ved henting av avdelinger:", error);
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setLoading(true);
        await checkAdminStatus();
        await fetchDepartments();
        setLoading(false);
      } else {
        setIsAdmin(false);
        setDepartments([]);
        setLoading(false);
      }
    };

    loadData();
  }, [user, checkAdminStatus, fetchDepartments]);

  const handleDepartmentSelect = (departmentId) => {
    navigate(`/department/${departmentId}`);
  };

  const navigateToAdmin = () => {
    navigate('/admin');
  };

  return (
    <div className="front-page">
      {user ? (
        <>
          <header className="header">
            <h1>Prosjektstyring</h1>
            <div className="auth-section">
              <Auth user={user} setUser={setUser} />
              {isAdmin && (
                <button onClick={navigateToAdmin} className="admin-btn">
                  Administrasjonspanel
                </button>
              )}
            </div>
          </header>

          <div className="departments-container">
            <h2>Avdelinger</h2>
            {loading ? (
              <div className="loading">Laster inn avdelinger...</div>
            ) : departments.length > 0 ? (
              <div className="departments-grid">
                {departments.map(department => (
                  <DepartmentCard
                    key={department.id}
                    department={department}
                    onSelect={handleDepartmentSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="no-departments">
                <p>
                  Ingen avdelinger funnet. 
                  {isAdmin && ' Gå til administrasjonspanelet for å legge til avdelinger.'}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="welcome-container">
          <div className="welcome-stripe">
            <h1>Prosjekter</h1>
            <div className="welcome-message">
              <h2>Velkommen til Prosjektstyring</h2>
              <p>Vennligst logg inn for å se avdelinger og administrere prosjekter.</p>
              <div className="login-button">
                <Auth user={user} setUser={setUser} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrontPage;

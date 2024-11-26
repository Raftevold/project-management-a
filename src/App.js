import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { initializeFirestore, ensureUserExists } from './initFirestore';
import FrontPage from './components/FrontPage';
import AdminPage from './components/AdminPage';
import DepartmentPage from './components/DepartmentPage';
import './App.css';

function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed in App:", user?.email);
      
      if (user) {
        try {
          // Initialize Firestore with admin and default data
          await initializeFirestore();
          
          // Ensure user document exists
          await ensureUserExists(user.uid, user.email);
        } catch (error) {
          console.error('Error initializing app:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/department/:departmentId" element={<DepartmentPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

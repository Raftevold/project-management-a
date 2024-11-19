import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import FrontPage from './components/FrontPage';
import AdminPage from './components/AdminPage';
import DepartmentPage from './components/DepartmentPage';
import './App.css';

function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed in App:", user?.email);
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

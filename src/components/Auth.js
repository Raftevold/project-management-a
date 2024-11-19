import React, { useState, useEffect } from 'react';
import { auth, provider } from '../firebase';
import { 
  signInWithPopup,
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import './Auth.css';

const Auth = ({ user, setUser }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth tilstand endret:", currentUser?.displayName || "Ingen bruker");
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await signInWithPopup(auth, provider);
      console.log("Pålogging vellykket:", result.user.displayName);
      setUser(result.user);
    } catch (error) {
      console.error("Feil ved pålogging:", error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setError("Det oppstod en feil ved pålogging. Vennligst prøv igjen.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signOut(auth);
      setUser(null);
      console.log("Utlogging vellykket");
    } catch (error) {
      console.error("Feil ved utlogging:", error);
      setError("Det oppstod en feil ved utlogging. Vennligst prøv igjen.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      {error && (
        <div className="auth-error">
          {error}
          <button onClick={() => setError(null)} className="error-close">×</button>
        </div>
      )}
      
      {user ? (
        <div className="user-info">
          {user.photoURL && (
            <img 
              src={user.photoURL} 
              alt="Profil" 
              className="profile-image"
              referrerPolicy="no-referrer"
            />
          )}
          <span className="user-name">{user.displayName}</span>
          <button 
            onClick={handleSignOut} 
            className="sign-out-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Logger ut...' : 'Logg ut'}
          </button>
        </div>
      ) : (
        <button 
          onClick={signInWithGoogle} 
          className="sign-in-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Logger inn...' : 'Logg inn med Google'}
        </button>
      )}
    </div>
  );
};

export default Auth;

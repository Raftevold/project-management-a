import { db } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query } from 'firebase/firestore';

export const initializeFirestore = async () => {
  try {
    // Create admin user document first
    const adminDocRef = doc(db, 'admins', 'raftevold@gmail.com');
    const adminDoc = await getDoc(adminDocRef);

    if (!adminDoc.exists()) {
      await setDoc(adminDocRef, {
        email: 'raftevold@gmail.com',
        role: 'ADMIN',
        createdAt: new Date()
      });
      console.log('Admin lagt til:', 'raftevold@gmail.com');
    }

    // Check and create default departments
    const departmentsRef = collection(db, 'departments');
    const departmentsSnapshot = await getDocs(query(departmentsRef));
    
    if (departmentsSnapshot.empty) {
      const departments = [
        {
          name: 'Privat',
          description: 'Private prosjekter og oppgaver',
          color: '#4CAF50',
          userCount: 0
        },
        {
          name: 'Jobb',
          description: 'Arbeidsrelaterte prosjekter',
          color: '#2196F3',
          userCount: 0
        },
        {
          name: 'Hobby',
          description: 'Hobbyprosjekter og fritidsaktiviteter',
          color: '#FF9800',
          userCount: 0
        }
      ];

      for (const dept of departments) {
        const newDeptRef = doc(departmentsRef);
        await setDoc(newDeptRef, {
          ...dept,
          createdAt: new Date()
        });
        console.log('Avdeling lagt til:', dept.name);
      }
    }

    console.log('Database initialisert vellykket!');
    return true;
  } catch (error) {
    console.error('Feil ved initialisering av database:', error);
    throw error;
  }
};

// Function to check admin status
export const checkIsAdmin = async (email) => {
  if (!email) return false;
  try {
    const adminDocRef = doc(db, 'admins', email);
    const adminDoc = await getDoc(adminDocRef);
    return adminDoc.exists();
  } catch (error) {
    console.error('Feil ved sjekk av admin-status:', error);
    return false;
  }
};

// Function to ensure user document exists
export const ensureUserExists = async (uid, email) => {
  if (!uid || !email) return;
  
  try {
    // Create/update user document
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      email,
      updatedAt: new Date()
    }, { merge: true });

    // Check if user is admin
    const isAdmin = await checkIsAdmin(email);
    if (isAdmin) {
      // Update user document with admin role
      await setDoc(userRef, {
        roles: ['ADMIN'],
        updatedAt: new Date()
      }, { merge: true });
    }
  } catch (error) {
    console.error('Feil ved oppretting av bruker:', error);
  }
};

import { db } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query } from 'firebase/firestore';

export const initializeFirestore = async () => {
  try {
    // Sjekk først om admin-dokumentet allerede eksisterer
    const adminDocRef = doc(db, 'admins', 'raftevold@gmail.com');
    const adminDoc = await getDoc(adminDocRef);

    if (!adminDoc.exists()) {
      // Legg til admin hvis den ikke eksisterer
      await setDoc(adminDocRef, {
        email: 'raftevold@gmail.com',
        role: 'admin',
        createdAt: new Date()
      });
      console.log('Admin lagt til:', 'raftevold@gmail.com');
    }

    // Sjekk om det allerede finnes avdelinger
    const departmentsRef = collection(db, 'departments');
    const departmentsSnapshot = await getDocs(query(departmentsRef));
    
    // Bare legg til avdelinger hvis det ikke finnes noen fra før
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

// Funksjon for å sjekke admin-status
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

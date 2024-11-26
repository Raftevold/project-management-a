import { db, auth } from '../firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  serverTimestamp
} from 'firebase/firestore';

// System-wide role definitions
export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  USER: 'USER'
};

// Department-level role definitions
export const DEPARTMENT_ROLES = {
  ADMIN: 'DEPARTMENT_ADMIN',
  MEMBER: 'DEPARTMENT_MEMBER'
};

// Project-level role definitions
export const PROJECT_ROLES = {
  MANAGER: 'PROJECT_MANAGER',
  MEMBER: 'PROJECT_MEMBER'
};

class PermissionService {
  // User Roles Management
  async getUserRoles(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.exists() ? userDoc.data().roles || [] : [];
    } catch (error) {
      console.error('Error getting user roles:', error);
      throw error;
    }
  }

  async addUserRole(userId, role) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        roles: arrayUnion(role),
        updatedAt: serverTimestamp()
      });

      await this.logAuditTrail('ADD_USER_ROLE', {
        userId,
        role,
        performedBy: auth.currentUser?.uid
      });
    } catch (error) {
      console.error('Error adding user role:', error);
      throw error;
    }
  }

  async removeUserRole(userId, role) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        roles: arrayRemove(role),
        updatedAt: serverTimestamp()
      });

      await this.logAuditTrail('REMOVE_USER_ROLE', {
        userId,
        role,
        performedBy: auth.currentUser?.uid
      });
    } catch (error) {
      console.error('Error removing user role:', error);
      throw error;
    }
  }

  // Department Roles Management
  async getDepartmentRoles(userId) {
    try {
      const rolesDoc = await getDoc(doc(db, 'departmentRoles', userId));
      if (!rolesDoc.exists()) {
        return { adminOf: [], memberOf: [] };
      }
      return rolesDoc.data();
    } catch (error) {
      console.error('Error getting department roles:', error);
      throw error;
    }
  }

  async addDepartmentRole(userId, departmentId, roleType) {
    try {
      const roleRef = doc(db, 'departmentRoles', userId);
      const roleDoc = await getDoc(roleRef);
      
      let updateData = {};
      if (roleDoc.exists()) {
        if (roleType === DEPARTMENT_ROLES.ADMIN) {
          updateData = {
            adminOf: arrayUnion(departmentId),
            updatedAt: serverTimestamp()
          };
        } else {
          updateData = {
            memberOf: arrayUnion(departmentId),
            updatedAt: serverTimestamp()
          };
        }
        await updateDoc(roleRef, updateData);
      } else {
        updateData = {
          adminOf: roleType === DEPARTMENT_ROLES.ADMIN ? [departmentId] : [],
          memberOf: roleType === DEPARTMENT_ROLES.MEMBER ? [departmentId] : [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        await setDoc(roleRef, updateData);
      }

      await this.logAuditTrail('ADD_DEPARTMENT_ROLE', {
        userId,
        departmentId,
        roleType,
        performedBy: auth.currentUser?.uid
      });
    } catch (error) {
      console.error('Error adding department role:', error);
      throw error;
    }
  }

  async removeDepartmentRole(userId, departmentId, roleType) {
    try {
      const roleRef = doc(db, 'departmentRoles', userId);
      const updateData = roleType === DEPARTMENT_ROLES.ADMIN
        ? { adminOf: arrayRemove(departmentId) }
        : { memberOf: arrayRemove(departmentId) };
      
      await updateDoc(roleRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });

      await this.logAuditTrail('REMOVE_DEPARTMENT_ROLE', {
        userId,
        departmentId,
        roleType,
        performedBy: auth.currentUser?.uid
      });
    } catch (error) {
      console.error('Error removing department role:', error);
      throw error;
    }
  }

  // Permission Checks
  async isSystemAdmin(userId) {
    try {
      const roles = await this.getUserRoles(userId);
      return roles.includes(ROLES.ADMIN);
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  async isDepartmentAdmin(userId, departmentId) {
    try {
      const roles = await this.getDepartmentRoles(userId);
      return roles.adminOf?.includes(departmentId) || false;
    } catch (error) {
      console.error('Error checking department admin status:', error);
      return false;
    }
  }

  async isDepartmentMember(userId, departmentId) {
    try {
      const roles = await this.getDepartmentRoles(userId);
      return roles.memberOf?.includes(departmentId) || false;
    } catch (error) {
      console.error('Error checking department member status:', error);
      return false;
    }
  }

  // Audit Trail
  async logAuditTrail(action, details) {
    try {
      const auditRef = doc(db, 'auditLog', `${Date.now()}_${auth.currentUser?.uid}`);
      await setDoc(auditRef, {
        action,
        details,
        performedBy: auth.currentUser?.uid,
        performedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error logging audit trail:', error);
    }
  }
}

export const permissionService = new PermissionService();
export default permissionService;

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

interface SetUserRoleData {
  uid: string;
  role: string;
}

export const setUserRole = functions.https.onCall(async (request) => {
  const { uid, role } = request.data as SetUserRoleData;

  // Ensure the caller is an admin
  if (!request.auth?.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can set user roles'
    );
  }

  if (!uid || !role) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'UID and role are required'
    );
  }

  try {
    // Set custom claims
    await admin.auth().setCustomUserClaims(uid, { role });
    
    // Force token refresh
    await admin.auth().revokeRefreshTokens(uid);
    
    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError(
      'internal',
      'Error setting user role'
    );
  }
}); 
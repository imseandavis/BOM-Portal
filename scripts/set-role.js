const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert('./serviceAccountKey.json')
});

async function setUserRole(uid, role) {
  try {
    // Set custom claims
    await admin.auth().setCustomUserClaims(uid, { role });
    
    // Force token refresh
    await admin.auth().revokeRefreshTokens(uid);
    
    console.log(`Successfully set role "${role}" for user ${uid}`);
    
    // Verify the claims
    const user = await admin.auth().getUser(uid);
    console.log('Current user claims:', user.customClaims);
  } catch (error) {
    console.error('Error setting role:', error);
  }
}

// Set the role for your user
setUserRole('j4POJg3vJQeFhA3ZvxppVdZWvbi1', 'admin');
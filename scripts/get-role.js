const admin = require('firebase-admin');
const readline = require('readline');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert('./serviceAccountKey.json')
});

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function getUserRole(uid) {
  try {
    const user = await admin.auth().getUser(uid);
    const claims = user.customClaims || {};
    console.log(`\nUser ID: ${uid}`);
    console.log('Current user claims:', claims);
    console.log(`Role: ${claims.role || 'No role assigned'}`);
  } catch (error) {
    console.error('Error getting user role:', error.message);
  } finally {
    rl.close();
  }
}

// Prompt user for ID
rl.question('Enter the user ID: ', (uid) => {
  getUserRole(uid);
}); 
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function checkUserRoles() {
  try {
    // List all users
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users;

    console.log('\n=== User Roles Report ===\n');
    console.log(`Total Users: ${users.length}\n`);

    // Count roles
    const roleCounts: { [key: string]: number } = {
      admin: 0,
      client: 0,
      no_role: 0
    };

    // Print user details
    users.forEach((user) => {
      const customClaims = user.customClaims || {};
      const role = customClaims.role || 'no_role';
      
      roleCounts[role]++;
      
      console.log(`User: ${user.email || 'No Email'}`);
      console.log(`UID: ${user.uid}`);
      console.log(`Role: ${role}`);
      console.log(`Created: ${new Date(user.metadata.creationTime).toLocaleString()}`);
      console.log('---');
    });

    // Print summary
    console.log('\n=== Role Summary ===');
    console.log(`Admins: ${roleCounts.admin}`);
    console.log(`Clients: ${roleCounts.client}`);
    console.log(`No Role: ${roleCounts.no_role}`);
    console.log('\n=== End Report ===\n');

  } catch (error) {
    console.error('Error checking user roles:', error);
  } finally {
    // Clean up
    process.exit(0);
  }
}

// Run the script
checkUserRoles(); 
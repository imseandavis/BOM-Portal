import * as admin from 'firebase-admin';

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function assignRole(email: string, role: 'admin' | 'client') {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    if (!user) {
      console.error(`No user found with email: ${email}`);
      return;
    }

    // Set custom claims
    await admin.auth().setCustomUserClaims(user.uid, { role });

    console.log(`\n=== Role Assignment Successful ===`);
    console.log(`User: ${email}`);
    console.log(`UID: ${user.uid}`);
    console.log(`New Role: ${role}`);
    console.log(`\nNote: User will need to sign out and sign back in for changes to take effect.`);

  } catch (error) {
    console.error('Error assigning role:', error);
  } finally {
    process.exit(0);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
const email = args[0];
const role = args[1] as 'admin' | 'client';

if (!email || !role) {
  console.log('\nUsage: npx ts-node -P scripts/tsconfig.json scripts/assign-role.ts <email> <role>');
  console.log('\nExample:');
  console.log('npx ts-node -P scripts/tsconfig.json scripts/assign-role.ts user@example.com admin');
  console.log('npx ts-node -P scripts/tsconfig.json scripts/assign-role.ts user@example.com client');
  process.exit(1);
}

if (role !== 'admin' && role !== 'client') {
  console.error('\nError: Role must be either "admin" or "client"');
  process.exit(1);
}

// Run the script
assignRole(email, role); 
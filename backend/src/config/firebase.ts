import admin from 'firebase-admin';
import config from './config';

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: config.firebase.projectId,
    clientEmail: config.firebase.clientEmail,
    privateKey: config.firebase.privateKey,
  }),
});

const db = admin.firestore();

// Configure Firestore settings
db.settings({
  ignoreUndefinedProperties: true,
});

export { admin, db };

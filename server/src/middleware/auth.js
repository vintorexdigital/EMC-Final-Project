import admin from 'firebase-admin';

let firebaseReady = false;
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)) });
    firebaseReady = true;
  } catch (error) { console.error('Firebase Admin configuration failed:', error.message); }
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({ message: 'Authentication required.' });
  const token = header.slice(7);
  if (!firebaseReady) {
    if (token === 'demo-token') {
      req.user = { uid: 'demo-user', name: 'Demo Student', email: 'demo@example.com' };
      return next();
    }
    return res.status(503).json({ message: 'Firebase Admin is not configured on the server.' });
  }
  try { req.user = await admin.auth().verifyIdToken(token); next(); }
  catch { res.status(401).json({ message: 'Invalid or expired authentication token.' }); }
}

import { db } from '../config/firebase';
import { EmailOtp } from '../types';

const COLLECTION = 'emailOtps';

/**
 * Converts a Firestore document's date fields (Timestamp) to JS Date objects.
 * Firestore returns Timestamp objects from doc.data(), not plain Date objects.
 */
function toEmailOtp(id: string, data: FirebaseFirestore.DocumentData): EmailOtp {
  return {
    id,
    email: data.email,
    otp: data.otp,
    expiresAt: data.expiresAt?.toDate ? data.expiresAt.toDate() : new Date(data.expiresAt),
    attempts: data.attempts ?? 0,
    verified: data.verified ?? false,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
  };
}

export class OtpRepository {
  async create(data: Omit<EmailOtp, 'id'>): Promise<EmailOtp> {
    const docRef = await db.collection(COLLECTION).add(data);
    const doc = await docRef.get();

    return toEmailOtp(doc.id, doc.data()!);
  }

  async findLatestByEmail(email: string): Promise<EmailOtp | null> {
    // Avoid composite index requirement by using only equality filters
    // and sorting in application code instead of Firestore orderBy.
    const snapshot = await db
      .collection(COLLECTION)
      .where('email', '==', email)
      .where('verified', '==', false)
      .get();

    if (snapshot.empty) {
      return null;
    }

    // Sort descending by createdAt in-app and return the most recent
    const sorted = snapshot.docs
      .map((doc) => toEmailOtp(doc.id, doc.data()))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return sorted[0] ?? null;
  }

  async update(id: string, data: Partial<Omit<EmailOtp, 'id'>>): Promise<EmailOtp | null> {
    const docRef = db.collection(COLLECTION).doc(id);
    await docRef.update(data);

    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    return toEmailOtp(doc.id, doc.data()!);
  }

  async countRecentAttempts(email: string, minutesAgo: number): Promise<number> {
    const timeThreshold = new Date(Date.now() - minutesAgo * 60 * 1000);

    // Query by email only (single-field index), then filter by time in-app
    // to avoid requiring a composite index on (email, createdAt).
    const snapshot = await db.collection(COLLECTION).where('email', '==', email).get();

    return snapshot.docs.filter((doc) => {
      const data = doc.data();
      const createdAt: Date = data.createdAt?.toDate
        ? data.createdAt.toDate()
        : new Date(data.createdAt);
      return createdAt >= timeThreshold;
    }).length;
  }
}

export default new OtpRepository();

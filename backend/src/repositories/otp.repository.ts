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
    const snapshot = await db
      .collection(COLLECTION)
      .where('email', '==', email)
      .where('verified', '==', false)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return toEmailOtp(doc.id, doc.data());
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

    const snapshot = await db
      .collection(COLLECTION)
      .where('email', '==', email)
      .where('createdAt', '>=', timeThreshold)
      .get();

    return snapshot.size;
  }
}

export default new OtpRepository();

import { db } from '../config/firebase';
import { EmailOtp } from '../types';

const COLLECTION = 'emailOtps';

export class OtpRepository {
  async create(data: Omit<EmailOtp, 'id'>): Promise<EmailOtp> {
    const docRef = await db.collection(COLLECTION).add(data);
    const doc = await docRef.get();

    return {
      id: doc.id,
      ...doc.data(),
    } as EmailOtp;
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
    return {
      id: doc.id,
      ...doc.data(),
    } as EmailOtp;
  }

  async update(id: string, data: Partial<Omit<EmailOtp, 'id'>>): Promise<EmailOtp | null> {
    const docRef = db.collection(COLLECTION).doc(id);
    await docRef.update(data);

    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as EmailOtp;
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

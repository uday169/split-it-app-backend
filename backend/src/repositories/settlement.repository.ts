import { db } from '../config/firebase';
import { Settlement } from '../types';

const COLLECTION = 'settlements';

export class SettlementRepository {
  async create(data: Omit<Settlement, 'id'>): Promise<Settlement> {
    const docRef = await db.collection(COLLECTION).add(data);
    const doc = await docRef.get();

    return {
      id: doc.id,
      ...doc.data(),
    } as Settlement;
  }

  async findById(id: string): Promise<Settlement | null> {
    const doc = await db.collection(COLLECTION).doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as Settlement;
  }

  async findByGroupId(groupId: string, limit: number = 50): Promise<Settlement[]> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('groupId', '==', groupId)
      .orderBy('date', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Settlement[];
  }

  async update(id: string, data: Partial<Omit<Settlement, 'id'>>): Promise<Settlement | null> {
    const docRef = db.collection(COLLECTION).doc(id);
    await docRef.update(data);

    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as Settlement;
  }
}

export default new SettlementRepository();

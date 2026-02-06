import { db } from '../config/firebase';
import { Expense } from '../types';

const COLLECTION = 'expenses';

export class ExpenseRepository {
  async create(data: Omit<Expense, 'id'>): Promise<Expense> {
    const docRef = await db.collection(COLLECTION).add(data);
    const doc = await docRef.get();

    return {
      id: doc.id,
      ...doc.data(),
    } as Expense;
  }

  async findById(id: string): Promise<Expense | null> {
    const doc = await db.collection(COLLECTION).doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as Expense;
  }

  async findByGroupId(groupId: string, limit: number = 50): Promise<Expense[]> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('groupId', '==', groupId)
      .orderBy('date', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Expense[];
  }

  async update(id: string, data: Partial<Omit<Expense, 'id'>>): Promise<Expense | null> {
    const docRef = db.collection(COLLECTION).doc(id);
    await docRef.update({
      ...data,
      updatedAt: new Date(),
    });

    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as Expense;
  }

  async delete(id: string): Promise<void> {
    await db.collection(COLLECTION).doc(id).delete();
  }
}

export default new ExpenseRepository();

import { db } from '../config/firebase';
import { ExpenseSplit } from '../types';

const COLLECTION = 'expenseSplits';

export class ExpenseSplitRepository {
  async create(data: Omit<ExpenseSplit, 'id'>): Promise<ExpenseSplit> {
    const docRef = await db.collection(COLLECTION).add(data);
    const doc = await docRef.get();

    return {
      id: doc.id,
      ...doc.data(),
    } as ExpenseSplit;
  }

  async createMany(splits: Array<Omit<ExpenseSplit, 'id'>>): Promise<ExpenseSplit[]> {
    const batch = db.batch();
    const refs: FirebaseFirestore.DocumentReference[] = [];

    splits.forEach((split) => {
      const ref = db.collection(COLLECTION).doc();
      batch.set(ref, split);
      refs.push(ref);
    });

    await batch.commit();

    // Fetch the created documents
    const docs = await Promise.all(refs.map((ref) => ref.get()));

    return docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ExpenseSplit[];
  }

  async findByExpenseId(expenseId: string): Promise<ExpenseSplit[]> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('expenseId', '==', expenseId)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ExpenseSplit[];
  }

  async findByGroupId(groupId: string): Promise<ExpenseSplit[]> {
    // First get all expense IDs for this group
    const expenseSnapshot = await db.collection('expenses').where('groupId', '==', groupId).get();

    if (expenseSnapshot.empty) {
      return [];
    }

    const expenseIds = expenseSnapshot.docs.map((doc) => doc.id);

    // Fetch splits in batches (Firestore IN query limit is 10)
    const splits: ExpenseSplit[] = [];
    const batchSize = 10;

    for (let i = 0; i < expenseIds.length; i += batchSize) {
      const batch = expenseIds.slice(i, i + batchSize);
      const splitSnapshot = await db
        .collection(COLLECTION)
        .where('expenseId', 'in', batch)
        .get();

      splitSnapshot.docs.forEach((doc) => {
        splits.push({
          id: doc.id,
          ...doc.data(),
        } as ExpenseSplit);
      });
    }

    return splits;
  }

  async deleteByExpenseId(expenseId: string): Promise<void> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('expenseId', '==', expenseId)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }
}

export default new ExpenseSplitRepository();

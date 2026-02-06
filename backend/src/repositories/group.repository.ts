import { db } from '../config/firebase';
import { Group } from '../types';

const COLLECTION = 'groups';

export class GroupRepository {
  async create(data: Omit<Group, 'id'>): Promise<Group> {
    const docRef = await db.collection(COLLECTION).add(data);
    const doc = await docRef.get();

    return {
      id: doc.id,
      ...doc.data(),
    } as Group;
  }

  async findById(id: string): Promise<Group | null> {
    const doc = await db.collection(COLLECTION).doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as Group;
  }

  async findByUserId(userId: string, limit: number = 50): Promise<Group[]> {
    // First get all group memberships for this user
    const memberSnapshot = await db
      .collection('groupMembers')
      .where('userId', '==', userId)
      .limit(limit)
      .get();

    if (memberSnapshot.empty) {
      return [];
    }

    // Get all group IDs
    const groupIds = memberSnapshot.docs.map((doc) => doc.data().groupId);

    // Fetch all groups (Firestore doesn't support IN with more than 10 items, so batch)
    const groups: Group[] = [];
    const batchSize = 10;

    for (let i = 0; i < groupIds.length; i += batchSize) {
      const batch = groupIds.slice(i, i + batchSize);
      const groupSnapshot = await db.collection(COLLECTION).where('__name__', 'in', batch).get();

      groupSnapshot.docs.forEach((doc) => {
        groups.push({
          id: doc.id,
          ...doc.data(),
        } as Group);
      });
    }

    // Sort by updatedAt desc
    return groups.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async findByIds(ids: string[]): Promise<Group[]> {
    if (ids.length === 0) {
      return [];
    }

    const groups: Group[] = [];
    
    // Firestore getAll is more efficient for fetching by IDs
    for (const id of ids) {
      const doc = await db.collection(COLLECTION).doc(id).get();
      if (doc.exists) {
        groups.push({
          id: doc.id,
          ...doc.data(),
        } as Group);
      }
    }

    return groups;
  }

  async update(id: string, data: Partial<Omit<Group, 'id'>>): Promise<Group | null> {
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
    } as Group;
  }

  async delete(id: string): Promise<void> {
    await db.collection(COLLECTION).doc(id).delete();
  }

  async incrementMemberCount(id: string): Promise<void> {
    const docRef = db.collection(COLLECTION).doc(id);
    const admin = (await import('../config/firebase')).admin;
    await docRef.update({
      memberCount: admin.firestore.FieldValue.increment(1),
      updatedAt: new Date(),
    });
  }

  async decrementMemberCount(id: string): Promise<void> {
    const docRef = db.collection(COLLECTION).doc(id);
    const admin = (await import('../config/firebase')).admin;
    await docRef.update({
      memberCount: admin.firestore.FieldValue.increment(-1),
      updatedAt: new Date(),
    });
  }
}

export default new GroupRepository();

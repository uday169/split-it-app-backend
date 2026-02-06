import { db } from '../config/firebase';
import { User } from '../types';

const COLLECTION = 'users';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await db.collection(COLLECTION).where('email', '==', email).limit(1).get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as User;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await db.collection(COLLECTION).doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as User;
  }

  async create(data: Omit<User, 'id'>): Promise<User> {
    const docRef = await db.collection(COLLECTION).add(data);
    const doc = await docRef.get();

    return {
      id: doc.id,
      ...doc.data(),
    } as User;
  }

  async update(id: string, data: Partial<Omit<User, 'id'>>): Promise<User | null> {
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
    } as User;
  }

  async findByIds(ids: string[]): Promise<User[]> {
    if (ids.length === 0) {
      return [];
    }

    const users: User[] = [];
    
    // Firestore getAll is more efficient for fetching by IDs
    for (const id of ids) {
      const doc = await db.collection(COLLECTION).doc(id).get();
      if (doc.exists) {
        users.push({
          id: doc.id,
          ...doc.data(),
        } as User);
      }
    }

    return users;
  }
}

export default new UserRepository();

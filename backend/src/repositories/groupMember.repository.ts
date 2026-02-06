import { db } from '../config/firebase';
import { GroupMember, User } from '../types';

const COLLECTION = 'groupMembers';

export class GroupMemberRepository {
  async create(data: Omit<GroupMember, 'id'>): Promise<GroupMember> {
    const docRef = await db.collection(COLLECTION).add(data);
    const doc = await docRef.get();

    return {
      id: doc.id,
      ...doc.data(),
    } as GroupMember;
  }

  async findByGroupId(groupId: string): Promise<GroupMember[]> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('groupId', '==', groupId)
      .orderBy('joinedAt', 'asc')
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as GroupMember[];
  }

  async findByGroupAndUser(groupId: string, userId: string): Promise<GroupMember | null> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('groupId', '==', groupId)
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as GroupMember;
  }

  async findById(id: string): Promise<GroupMember | null> {
    const doc = await db.collection(COLLECTION).doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as GroupMember;
  }

  async delete(id: string): Promise<void> {
    await db.collection(COLLECTION).doc(id).delete();
  }

  async getMembersWithUserDetails(groupId: string): Promise<Array<GroupMember & { user: User }>> {
    const members = await this.findByGroupId(groupId);

    // Fetch user details for all members
    const memberIds = members.map((m) => m.userId);
    const users: User[] = [];

    // Batch fetch users (Firestore IN query limit is 10)
    const batchSize = 10;
    for (let i = 0; i < memberIds.length; i += batchSize) {
      const batch = memberIds.slice(i, i + batchSize);
      const userSnapshot = await db.collection('users').where('__name__', 'in', batch).get();

      userSnapshot.docs.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data(),
        } as User);
      });
    }

    // Combine members with user details
    return members.map((member) => ({
      ...member,
      user: users.find((u) => u.id === member.userId)!,
    }));
  }
}

export default new GroupMemberRepository();

import { AppError } from '../middleware/errorHandler';
import groupRepository from '../repositories/group.repository';
import groupMemberRepository from '../repositories/groupMember.repository';
import userRepository from '../repositories/user.repository';
import { Group, GroupMember } from '../types';
import logger from '../config/logger';

export class GroupService {
  async createGroup(userId: string, name: string, description?: string): Promise<Group> {
    // Create the group
    const group = await groupRepository.create({
      name,
      description: description || '',
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      memberCount: 1,
    });

    // Add creator as admin
    await groupMemberRepository.create({
      groupId: group.id,
      userId,
      role: 'admin',
      joinedAt: new Date(),
    });

    logger.info(`Group created: ${group.id} by user ${userId}`);

    return group;
  }

  async getGroup(groupId: string, userId: string): Promise<Group> {
    const group = await groupRepository.findById(groupId);

    if (!group) {
      throw new AppError(404, 'Group not found', 'GROUP_NOT_FOUND');
    }

    // Check if user is a member
    await this.checkMembership(groupId, userId);

    return group;
  }

  async getUserGroups(userId: string): Promise<Group[]> {
    return groupRepository.findByUserId(userId);
  }

  async updateGroup(
    groupId: string,
    userId: string,
    updates: { name?: string; description?: string }
  ): Promise<Group> {
    // Check if user is admin
    await this.checkAdminRole(groupId, userId);

    const group = await groupRepository.update(groupId, updates);

    if (!group) {
      throw new AppError(404, 'Group not found', 'GROUP_NOT_FOUND');
    }

    logger.info(`Group updated: ${groupId} by user ${userId}`);

    return group;
  }

  async deleteGroup(groupId: string, userId: string): Promise<void> {
    // Check if user is admin
    await this.checkAdminRole(groupId, userId);

    // Delete all members
    const members = await groupMemberRepository.findByGroupId(groupId);
    await Promise.all(members.map((member) => groupMemberRepository.delete(member.id)));

    // Delete the group
    await groupRepository.delete(groupId);

    logger.info(`Group deleted: ${groupId} by user ${userId}`);
  }

  async getGroupMembers(groupId: string, userId: string) {
    // Check if user is a member
    await this.checkMembership(groupId, userId);

    return groupMemberRepository.getMembersWithUserDetails(groupId);
  }

  async addMember(groupId: string, requesterId: string, email: string): Promise<GroupMember> {
    // Check if requester is admin
    await this.checkAdminRole(groupId, requesterId);

    // Find or create user
    let user = await userRepository.findByEmail(email.toLowerCase());

    if (!user) {
      // Auto-create user if they don't exist
      user = await userRepository.create({
        email: email.toLowerCase(),
        name: email.split('@')[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      logger.info(`New user auto-created: ${user.id} for group ${groupId}`);
    }

    // Check if user is already a member
    const existingMember = await groupMemberRepository.findByGroupAndUser(groupId, user.id);

    if (existingMember) {
      throw new AppError(400, 'User is already a member of this group', 'ALREADY_MEMBER');
    }

    // Add as member
    const member = await groupMemberRepository.create({
      groupId,
      userId: user.id,
      role: 'member',
      joinedAt: new Date(),
    });

    // Increment member count
    await groupRepository.incrementMemberCount(groupId);

    logger.info(`Member added to group ${groupId}: ${user.id}`);

    return member;
  }

  async removeMember(
    groupId: string,
    requesterId: string,
    membershipId: string
  ): Promise<void> {
    // Get the membership
    const membership = await groupMemberRepository.findById(membershipId);

    if (!membership || membership.groupId !== groupId) {
      throw new AppError(404, 'Member not found in this group', 'MEMBER_NOT_FOUND');
    }

    // Check if requester is admin or removing themselves
    const requesterMembership = await groupMemberRepository.findByGroupAndUser(
      groupId,
      requesterId
    );

    if (!requesterMembership) {
      throw new AppError(403, 'You are not a member of this group', 'NOT_A_MEMBER');
    }

    if (requesterMembership.role !== 'admin' && membership.userId !== requesterId) {
      throw new AppError(
        403,
        'Only admins can remove other members',
        'INSUFFICIENT_PERMISSIONS'
      );
    }

    // Cannot remove the last admin
    if (membership.role === 'admin') {
      const members = await groupMemberRepository.findByGroupId(groupId);
      const adminCount = members.filter((m) => m.role === 'admin').length;

      if (adminCount === 1) {
        throw new AppError(400, 'Cannot remove the last admin', 'LAST_ADMIN');
      }
    }

    // Remove member
    await groupMemberRepository.delete(membershipId);

    // Decrement member count
    await groupRepository.decrementMemberCount(groupId);

    logger.info(`Member removed from group ${groupId}: ${membership.userId}`);
  }

  // Helper methods
  private async checkMembership(groupId: string, userId: string): Promise<GroupMember> {
    const membership = await groupMemberRepository.findByGroupAndUser(groupId, userId);

    if (!membership) {
      throw new AppError(403, 'You are not a member of this group', 'NOT_A_MEMBER');
    }

    return membership;
  }

  private async checkAdminRole(groupId: string, userId: string): Promise<void> {
    const membership = await this.checkMembership(groupId, userId);

    if (membership.role !== 'admin') {
      throw new AppError(403, 'Admin role required', 'INSUFFICIENT_PERMISSIONS');
    }
  }
}

export default new GroupService();

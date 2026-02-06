import { Response, NextFunction } from 'express';
import groupService from '../services/group.service';
import { AuthRequest, ApiResponse } from '../types';
import {
  CreateGroupInput,
  UpdateGroupInput,
  GetGroupInput,
  AddMemberInput,
  RemoveMemberInput,
} from '../schemas/group.schema';

export class GroupController {
  async createGroup(
    req: AuthRequest<{}, {}, CreateGroupInput>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { name, description } = req.body;

      const group = await groupService.createGroup(userId, name, description);

      res.status(201).json({
        success: true,
        data: group,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserGroups(
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;

      const groups = await groupService.getUserGroups(userId);

      res.status(200).json({
        success: true,
        data: groups,
      });
    } catch (error) {
      next(error);
    }
  }

  async getGroup(
    req: AuthRequest<GetGroupInput>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { groupId } = req.params;

      const group = await groupService.getGroup(groupId, userId);

      res.status(200).json({
        success: true,
        data: group,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateGroup(
    req: AuthRequest<UpdateGroupInput['params'], {}, UpdateGroupInput['body']>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { groupId } = req.params;
      const updates = req.body;

      const group = await groupService.updateGroup(groupId, userId, updates);

      res.status(200).json({
        success: true,
        data: group,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteGroup(
    req: AuthRequest<GetGroupInput>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { groupId } = req.params;

      await groupService.deleteGroup(groupId, userId);

      res.status(200).json({
        success: true,
        data: {
          message: 'Group deleted successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getGroupMembers(
    req: AuthRequest<GetGroupInput>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { groupId } = req.params;

      const members = await groupService.getGroupMembers(groupId, userId);

      res.status(200).json({
        success: true,
        data: members,
      });
    } catch (error) {
      next(error);
    }
  }

  async addMember(
    req: AuthRequest<AddMemberInput['params'], {}, AddMemberInput['body']>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { groupId } = req.params;
      const { email } = req.body;

      const member = await groupService.addMember(groupId, userId, email);

      res.status(201).json({
        success: true,
        data: member,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeMember(
    req: AuthRequest<RemoveMemberInput>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { groupId, memberId } = req.params;

      await groupService.removeMember(groupId, userId, memberId);

      res.status(200).json({
        success: true,
        data: {
          message: 'Member removed successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new GroupController();

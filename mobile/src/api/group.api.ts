import { apiClient } from './client';
import {
  Group,
  GroupDetails,
  GroupsListResponse,
  CreateGroupRequest,
  UpdateGroupRequest,
  AddMemberRequest,
  GroupMember,
  ApiResponse,
} from '../types/api.types';

export const groupApi = {
  getGroups: async (page = 1, limit = 20) => {
    const response = await apiClient.get<ApiResponse<GroupsListResponse>>(
      '/groups',
      { params: { page, limit } }
    );
    return response.data.data;
  },

  getGroup: async (groupId: string) => {
    const response = await apiClient.get<ApiResponse<GroupDetails>>(
      `/groups/${groupId}`
    );
    return response.data.data;
  },

  createGroup: async (data: CreateGroupRequest) => {
    const response = await apiClient.post<ApiResponse<Group>>('/groups', data);
    return response.data.data;
  },

  updateGroup: async (groupId: string, data: UpdateGroupRequest) => {
    const response = await apiClient.patch<ApiResponse<Group>>(
      `/groups/${groupId}`,
      data
    );
    return response.data.data;
  },

  deleteGroup: async (groupId: string) => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/groups/${groupId}`
    );
    return response.data.data;
  },

  addMember: async (groupId: string, data: AddMemberRequest) => {
    const response = await apiClient.post<
      ApiResponse<{ groupId: string; member: GroupMember }>
    >(`/groups/${groupId}/members`, data);
    return response.data.data;
  },

  removeMember: async (groupId: string, userId: string) => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/groups/${groupId}/members/${userId}`
    );
    return response.data.data;
  },
};

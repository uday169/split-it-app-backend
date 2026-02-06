import request from 'supertest';
import app from '../../src/app';
import { generateToken } from '../../src/utils/jwt';
import groupRepository from '../../src/repositories/group.repository';
import groupMemberRepository from '../../src/repositories/groupMember.repository';
import userRepository from '../../src/repositories/user.repository';
import { mockUsers, mockGroup } from '../helpers/testData';
import '../helpers/setup';

// Mock repositories
jest.mock('../../src/repositories/group.repository');
jest.mock('../../src/repositories/groupMember.repository');
jest.mock('../../src/repositories/user.repository');

describe('Group API Integration Tests', () => {
  const userId = mockUsers.user1.id;
  const userEmail = mockUsers.user1.email;
  let authToken: string;

  beforeEach(() => {
    jest.clearAllMocks();
    authToken = generateToken(userId, userEmail);
    (userRepository.findById as jest.Mock).mockResolvedValue(mockUsers.user1);
  });

  describe('POST /api/groups', () => {
    const endpoint = '/api/groups';

    it('should create a new group', async () => {
      const newGroup = {
        name: 'New Group',
        description: 'Test group',
      };

      (groupRepository.create as jest.Mock).mockResolvedValue({
        ...mockGroup,
        ...newGroup,
        id: 'new-group-id',
      });
      (groupMemberRepository.create as jest.Mock).mockResolvedValue({
        groupId: 'new-group-id',
        userId,
        role: 'admin',
      });

      const res = await request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${authToken}`)
        .send(newGroup)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toMatchObject({
        name: newGroup.name,
        description: newGroup.description,
      });
      expect(groupRepository.create).toHaveBeenCalled();
    });

    it('should reject request without authentication', async () => {
      const res = await request(app)
        .post(endpoint)
        .send({ name: 'Test Group' })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(res.body).toHaveProperty('success', false);
      expect(groupRepository.create).not.toHaveBeenCalled();
    });

    it('should reject invalid group data', async () => {
      const res = await request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'Missing name' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(groupRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/groups', () => {
    const endpoint = '/api/groups';

    it('should return user groups', async () => {
      const userGroups = [mockGroup];
      (groupRepository.findByUserId as jest.Mock).mockResolvedValue(userGroups);

      const res = await request(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0]).toMatchObject({
        id: mockGroup.id,
        name: mockGroup.name,
      });
    });

    it('should return empty array when user has no groups', async () => {
      (groupRepository.findByUserId as jest.Mock).mockResolvedValue([]);

      const res = await request(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toEqual([]);
    });

    it('should reject request without authentication', async () => {
      const res = await request(app)
        .get(endpoint)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/groups/:id', () => {
    const groupId = mockGroup.id;
    const endpoint = `/api/groups/${groupId}`;

    it('should return group details', async () => {
      (groupRepository.findById as jest.Mock).mockResolvedValue(mockGroup);
      (groupMemberRepository.findByGroupAndUser as jest.Mock).mockResolvedValue({
        groupId,
        userId,
      });

      const res = await request(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toMatchObject({
        id: mockGroup.id,
        name: mockGroup.name,
      });
    });

    it('should return 404 for non-existent group', async () => {
      (groupRepository.findById as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(res.body).toHaveProperty('success', false);
    });

    it('should return 403 for non-member', async () => {
      (groupRepository.findById as jest.Mock).mockResolvedValue(mockGroup);
      (groupMemberRepository.findByGroupAndUser as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(403);

      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/groups/:id/members', () => {
    const groupId = mockGroup.id;
    const endpoint = `/api/groups/${groupId}/members`;

    it('should add member to group', async () => {
      const newMemberEmail = mockUsers.user2.email;

      (groupRepository.findById as jest.Mock).mockResolvedValue(mockGroup);
      (groupMemberRepository.findByGroupAndUser as jest.Mock)
        .mockResolvedValueOnce({ groupId, userId, role: 'admin' }) // Requester is admin
        .mockResolvedValueOnce(null); // New user not yet a member
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUsers.user2);
      (groupMemberRepository.create as jest.Mock).mockResolvedValue({
        groupId,
        userId: mockUsers.user2.id,
        role: 'member',
      });

      const res = await request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: newMemberEmail })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body).toHaveProperty('success', true);
      expect(groupMemberRepository.create).toHaveBeenCalled();
    });

    it('should reject non-admin adding members', async () => {
      (groupRepository.findById as jest.Mock).mockResolvedValue(mockGroup);
      (groupMemberRepository.findByGroupAndUser as jest.Mock).mockResolvedValue({
        groupId,
        userId,
        role: 'member',
      });

      const res = await request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: mockUsers.user2.email })
        .expect('Content-Type', /json/)
        .expect(403);

      expect(res.body).toHaveProperty('success', false);
    });
  });
});

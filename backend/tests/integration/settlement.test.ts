import request from 'supertest';
import app from '../../src/app';
import { generateToken } from '../../src/utils/jwt';
import balanceRepository from '../../src/repositories/settlement.repository';
import groupMemberRepository from '../../src/repositories/groupMember.repository';
import userRepository from '../../src/repositories/user.repository';
import { mockUsers, mockGroup } from '../helpers/testData';
import '../helpers/setup';

// Mock repositories
jest.mock('../../src/repositories/settlement.repository');
jest.mock('../../src/repositories/groupMember.repository');
jest.mock('../../src/repositories/user.repository');

describe('Settlement API Integration Tests', () => {
  const userId = mockUsers.user1.id;
  const userEmail = mockUsers.user1.email;
  const groupId = mockGroup.id;
  let authToken: string;

  beforeEach(() => {
    jest.clearAllMocks();
    authToken = generateToken(userId, userEmail);
    (userRepository.findById as jest.Mock).mockResolvedValue(mockUsers.user1);
    (groupMemberRepository.findByGroupAndUser as jest.Mock).mockResolvedValue({
      groupId,
      userId,
    });
  });

  describe('POST /api/settlements', () => {
    const endpoint = '/api/settlements';

    it('should create a settlement', async () => {
      const newSettlement = {
        groupId,
        fromUserId: mockUsers.user2.id,
        toUserId: mockUsers.user1.id,
        amount: 50,
        currency: 'USD',
      };

      const mockSettlement = {
        id: 'settlement-1',
        ...newSettlement,
        createdAt: new Date(),
      };

      (balanceRepository.create as jest.Mock).mockResolvedValue(mockSettlement);

      const res = await request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${authToken}`)
        .send(newSettlement)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toMatchObject({
        groupId,
        amount: 50,
      });
      expect(balanceRepository.create).toHaveBeenCalled();
    });

    it('should reject request without authentication', async () => {
      const res = await request(app)
        .post(endpoint)
        .send({
          groupId,
          fromUserId: userId,
          toUserId: mockUsers.user2.id,
          amount: 50,
          currency: 'USD',
        })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(res.body).toHaveProperty('success', false);
      expect(balanceRepository.create).not.toHaveBeenCalled();
    });

    it('should reject invalid settlement data', async () => {
      const res = await request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          groupId,
          // Missing required fields
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(balanceRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/settlements/:groupId', () => {
    it('should return group settlements', async () => {
      const endpoint = `/api/settlements/${groupId}`;
      const settlements = [
        {
          id: 'settlement-1',
          groupId,
          fromUserId: mockUsers.user2.id,
          toUserId: mockUsers.user1.id,
          amount: 50,
          currency: 'USD',
          createdAt: new Date(),
        },
      ];

      (balanceRepository.findByGroupId as jest.Mock).mockResolvedValue(settlements);

      const res = await request(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data).toHaveLength(1);
    });

    it('should return empty array when no settlements', async () => {
      const endpoint = `/api/settlements/${groupId}`;
      (balanceRepository.findByGroupId as jest.Mock).mockResolvedValue([]);

      const res = await request(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toEqual([]);
    });

    it('should reject non-member access', async () => {
      const endpoint = `/api/settlements/${groupId}`;
      (groupMemberRepository.findByGroupAndUser as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(403);

      expect(res.body).toHaveProperty('success', false);
    });
  });
});

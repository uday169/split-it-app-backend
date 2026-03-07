import { OpenAPIV3 } from '../types/swagger';

const auth = [{ bearerAuth: [] }];

const groupIdParam: OpenAPIV3.ParameterObject = {
  name: 'groupId',
  in: 'path',
  required: true,
  schema: { type: 'string' },
  description: 'The group ID',
};

const settlementIdParam: OpenAPIV3.ParameterObject = {
  name: 'settlementId',
  in: 'path',
  required: true,
  schema: { type: 'string' },
  description: 'The settlement ID',
};

const settlementPaths: OpenAPIV3.PathsObject = {
  '/api/settlements': {
    post: {
      summary: 'Create a new settlement',
      description:
        'Records a payment settlement between two users within a group. The fromUser is paying the toUser.',
      tags: ['Settlements'],
      security: auth,
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['groupId', 'fromUserId', 'toUserId', 'amount'],
              properties: {
                groupId: { type: 'string', example: 'group_abc123' },
                fromUserId: {
                  type: 'string',
                  description: 'User ID of the person paying',
                  example: 'user_abc123',
                },
                toUserId: {
                  type: 'string',
                  description:
                    'User ID of the person being paid (must be different from fromUserId)',
                  example: 'user_def456',
                },
                amount: { type: 'number', minimum: 0, exclusiveMinimum: true, example: 50.0 },
                currency: {
                  type: 'string',
                  minLength: 3,
                  maxLength: 3,
                  default: 'USD',
                  example: 'USD',
                },
                date: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Optional settlement date (defaults to now)',
                },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Settlement created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Settlement' },
                },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '403': { $ref: '#/components/responses/Forbidden' },
      },
    },
  },

  '/api/settlements/group/{groupId}': {
    get: {
      summary: 'Get all settlements for a group',
      description: 'Returns all settlements within a specific group.',
      tags: ['Settlements'],
      security: auth,
      parameters: [groupIdParam],
      responses: {
        '200': {
          description: 'Settlements retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { type: 'array', items: { $ref: '#/components/schemas/Settlement' } },
                },
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '403': { $ref: '#/components/responses/Forbidden' },
        '404': { $ref: '#/components/responses/NotFound' },
      },
    },
  },

  '/api/settlements/{settlementId}': {
    get: {
      summary: 'Get settlement details',
      description: 'Returns detailed information about a specific settlement.',
      tags: ['Settlements'],
      security: auth,
      parameters: [settlementIdParam],
      responses: {
        '200': {
          description: 'Settlement details retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Settlement' },
                },
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '404': { $ref: '#/components/responses/NotFound' },
      },
    },
  },

  '/api/settlements/{settlementId}/confirm': {
    post: {
      summary: 'Confirm a settlement',
      description:
        'Confirms a pending settlement, marking it as completed. Only the payee (toUser) can confirm.',
      tags: ['Settlements'],
      security: auth,
      parameters: [settlementIdParam],
      responses: {
        '200': {
          description: 'Settlement confirmed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Settlement' },
                },
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '403': { $ref: '#/components/responses/Forbidden' },
        '404': { $ref: '#/components/responses/NotFound' },
      },
    },
  },
};

export default settlementPaths;

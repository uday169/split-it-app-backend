import { OpenAPIV3 } from '../types/swagger';

const userPaths: OpenAPIV3.PathsObject = {
  '/api/users/me': {
    get: {
      summary: 'Get current user profile',
      description: "Returns the authenticated user's profile information.",
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'User profile retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/Unauthorized' },
      },
    },
    put: {
      summary: 'Update current user profile',
      description: "Updates the authenticated user's profile (currently only name).",
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name'],
              properties: {
                name: { type: 'string', minLength: 1, maxLength: 100, example: 'John Doe' },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'User profile updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '401': { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
};

export default userPaths;

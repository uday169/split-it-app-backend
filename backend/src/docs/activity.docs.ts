import { OpenAPIV3 } from '../types/swagger';

const auth = [{ bearerAuth: [] }];

const activityPaths: OpenAPIV3.PathsObject = {
  '/api/activity': {
    get: {
      summary: "Get user's activity feed",
      description:
        'Returns a paginated activity feed for the authenticated user, including expense and settlement events across all groups.',
      tags: ['Activity'],
      security: auth,
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: 'Page number for pagination',
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          description: 'Number of items per page',
        },
      ],
      responses: {
        '200': {
          description: 'Activity feed retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      activities: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Activity' },
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          page: { type: 'integer', example: 1 },
                          limit: { type: 'integer', example: 20 },
                          total: { type: 'integer', example: 45 },
                          totalPages: { type: 'integer', example: 3 },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
};

export default activityPaths;

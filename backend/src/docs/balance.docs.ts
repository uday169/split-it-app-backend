import { OpenAPIV3 } from '../types/swagger';

const auth = [{ bearerAuth: [] }];

const groupIdParam: OpenAPIV3.ParameterObject = {
  name: 'groupId',
  in: 'path',
  required: true,
  schema: { type: 'string' },
  description: 'The group ID',
};

const balancePaths: OpenAPIV3.PathsObject = {
  '/api/balances/{groupId}': {
    get: {
      summary: 'Get balances for a group',
      description: 'Returns calculated balances for all members in the specified group.',
      tags: ['Balances'],
      security: auth,
      parameters: [groupIdParam],
      responses: {
        '200': {
          description: 'Balances retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { type: 'array', items: { $ref: '#/components/schemas/Balance' } },
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

export default balancePaths;

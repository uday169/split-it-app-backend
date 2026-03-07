import { OpenAPIV3 } from '../types/swagger';

// Reusable parameter definitions for group routes
const groupIdParam: OpenAPIV3.ParameterObject = {
  name: 'groupId',
  in: 'path',
  required: true,
  schema: { type: 'string' },
  description: 'The group ID',
};

const memberIdParam: OpenAPIV3.ParameterObject = {
  name: 'memberId',
  in: 'path',
  required: true,
  schema: { type: 'string' },
  description: 'The member ID to remove',
};

const auth = [{ bearerAuth: [] }];

const groupPaths: OpenAPIV3.PathsObject = {
  '/api/groups': {
    post: {
      summary: 'Create a new group',
      description:
        'Creates a new expense-sharing group. The authenticated user becomes the group admin.',
      tags: ['Groups'],
      security: auth,
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name'],
              properties: {
                name: {
                  type: 'string',
                  minLength: 1,
                  maxLength: 100,
                  example: 'Apartment Roommates',
                },
                description: {
                  type: 'string',
                  maxLength: 500,
                  example: 'Shared household expenses',
                },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Group created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Group' },
                },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '401': { $ref: '#/components/responses/Unauthorized' },
      },
    },
    get: {
      summary: 'Get all groups for current user',
      description: 'Returns all groups that the authenticated user is a member of.',
      tags: ['Groups'],
      security: auth,
      responses: {
        '200': {
          description: 'List of groups retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { type: 'array', items: { $ref: '#/components/schemas/Group' } },
                },
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },

  '/api/groups/{groupId}': {
    get: {
      summary: 'Get group details',
      description:
        'Returns detailed information about a specific group. User must be a member of the group.',
      tags: ['Groups'],
      security: auth,
      parameters: [groupIdParam],
      responses: {
        '200': {
          description: 'Group details retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Group' },
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
    put: {
      summary: 'Update group',
      description: 'Updates group details (name and/or description). Only group admin can update.',
      tags: ['Groups'],
      security: auth,
      parameters: [groupIdParam],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  minLength: 1,
                  maxLength: 100,
                  example: 'Updated Group Name',
                },
                description: { type: 'string', maxLength: 500, example: 'Updated description' },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Group updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Group' },
                },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '403': { $ref: '#/components/responses/Forbidden' },
        '404': { $ref: '#/components/responses/NotFound' },
      },
    },
    delete: {
      summary: 'Delete group',
      description: 'Deletes a group. Only group admin can delete.',
      tags: ['Groups'],
      security: auth,
      parameters: [groupIdParam],
      responses: {
        '200': {
          description: 'Group deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Group deleted successfully' },
                    },
                  },
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

  '/api/groups/{groupId}/members': {
    get: {
      summary: 'Get group members',
      description: 'Returns all members of a specific group. User must be a member of the group.',
      tags: ['Groups'],
      security: auth,
      parameters: [groupIdParam],
      responses: {
        '200': {
          description: 'Group members retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { type: 'array', items: { $ref: '#/components/schemas/GroupMember' } },
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
    post: {
      summary: 'Add member to group',
      description:
        'Adds a user to the group by their email address. The user must have an existing account.',
      tags: ['Groups'],
      security: auth,
      parameters: [groupIdParam],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email'],
              properties: {
                email: { type: 'string', format: 'email', example: 'newmember@example.com' },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Member added successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/GroupMember' },
                },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '403': { $ref: '#/components/responses/Forbidden' },
        '404': { $ref: '#/components/responses/NotFound' },
      },
    },
  },

  '/api/groups/{groupId}/members/{memberId}': {
    delete: {
      summary: 'Remove member from group',
      description: 'Removes a member from the group. Only group admin can remove members.',
      tags: ['Groups'],
      security: auth,
      parameters: [groupIdParam, memberIdParam],
      responses: {
        '200': {
          description: 'Member removed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Member removed successfully' },
                    },
                  },
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

  '/api/groups/{groupId}/expenses': {
    get: {
      summary: 'Get expenses for a group',
      description:
        'Returns all expenses within a specific group. User must be a member of the group.',
      tags: ['Expenses'],
      security: auth,
      parameters: [
        groupIdParam,
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer' },
          description: 'Maximum number of expenses to return',
        },
      ],
      responses: {
        '200': {
          description: 'Expenses retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { type: 'array', items: { $ref: '#/components/schemas/Expense' } },
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

  '/api/groups/{groupId}/balances': {
    get: {
      summary: 'Get balances for a group',
      description: 'Returns calculated balances for all members in the group.',
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

  '/api/groups/{groupId}/balances/me': {
    get: {
      summary: "Get current user's balance in group",
      description: "Returns the authenticated user's balance in the specified group.",
      tags: ['Balances'],
      security: auth,
      parameters: [groupIdParam],
      responses: {
        '200': {
          description: 'User balance retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Balance' },
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

  '/api/groups/{groupId}/settlements': {
    get: {
      summary: 'Get settlements for a group',
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
};

export default groupPaths;

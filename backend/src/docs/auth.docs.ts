import { OpenAPIV3 } from '../types/swagger';

const authPaths: OpenAPIV3.PathsObject = {
  '/api/auth/send-otp': {
    post: {
      summary: 'Send OTP to email',
      description:
        'Sends a 6-digit OTP code to the provided email address for authentication. Rate limited to 3 requests per 15 minutes.',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email'],
              properties: {
                email: { type: 'string', format: 'email', example: 'user@example.com' },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'OTP sent successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'OTP sent successfully' },
                    },
                  },
                },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '429': { $ref: '#/components/responses/TooManyRequests' },
      },
    },
  },

  '/api/auth/verify-otp': {
    post: {
      summary: 'Verify OTP and get JWT token',
      description:
        "Verifies the OTP code sent to the email and returns a JWT token for authenticated requests. Creates a new user if one doesn't exist.",
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'otp'],
              properties: {
                email: { type: 'string', format: 'email', example: 'user@example.com' },
                otp: { type: 'string', minLength: 6, maxLength: 6, example: '123456' },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'OTP verified, JWT token returned',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      token: { type: 'string', description: 'JWT access token' },
                      user: { $ref: '#/components/schemas/User' },
                      isNewUser: {
                        type: 'boolean',
                        description: 'Whether this is a newly created account',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
      },
    },
  },
};

export default authPaths;

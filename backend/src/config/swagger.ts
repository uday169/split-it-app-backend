import config from './config';
import { schemas, responses, securitySchemes } from '../docs/components';
import paths from '../docs/index';

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Split It - Expense Sharing API',
    version: '1.0.0',
    description:
      'REST API for the Split It expense sharing application. Supports group creation, expense tracking, balance calculation, and settlements.',
    contact: {
      name: 'Split It Team',
    },
    license: {
      name: 'ISC',
    },
  },
  servers: [
    {
      url: 'https://split-it-app-backend.vercel.app',
      description: 'Production server',
    },
    {
      url: `http://localhost:${config.port}`,
      description: 'Local server',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication via email OTP' },
    { name: 'Users', description: 'User profile management' },
    { name: 'Groups', description: 'Group management and membership' },
    { name: 'Expenses', description: 'Expense tracking and splitting' },
    { name: 'Balances', description: 'Balance calculation within groups' },
    { name: 'Settlements', description: 'Debt settlement management' },
    { name: 'Activity', description: 'Activity feed and history' },
  ],
  paths,
  components: {
    securitySchemes,
    schemas,
    responses,
  },
};

export default swaggerSpec;

import { OpenAPIV3 } from '../types/swagger';
import authPaths from './auth.docs';
import userPaths from './user.docs';
import groupPaths from './group.docs';
import expensePaths from './expense.docs';
import balancePaths from './balance.docs';
import settlementPaths from './settlement.docs';
import activityPaths from './activity.docs';

/**
 * Aggregates all API path definitions from individual module doc files.
 *
 * To add docs for a new module:
 *   1. Create a new `<module>.docs.ts` file in this directory
 *   2. Export a default PathsObject
 *   3. Import it here and spread it into the array below
 */
const allPaths: OpenAPIV3.PathsObject = {
  ...authPaths,
  ...userPaths,
  ...groupPaths,
  ...expensePaths,
  ...balancePaths,
  ...settlementPaths,
  ...activityPaths,
};

export default allPaths;

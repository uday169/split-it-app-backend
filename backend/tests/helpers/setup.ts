/**
 * Test setup and teardown utilities
 */

export const resetMocks = () => {
  jest.clearAllMocks();
};

export const setupTest = () => {
  beforeEach(() => {
    resetMocks();
  });
};

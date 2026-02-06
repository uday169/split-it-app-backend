"use strict";
/**
 * Test setup and teardown utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupTest = exports.resetMocks = void 0;
const resetMocks = () => {
    jest.clearAllMocks();
};
exports.resetMocks = resetMocks;
const setupTest = () => {
    beforeEach(() => {
        (0, exports.resetMocks)();
    });
};
exports.setupTest = setupTest;

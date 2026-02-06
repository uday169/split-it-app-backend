"use strict";
// Mock Firebase config first - must run before any imports
jest.mock('../src/config/config', () => ({
    __esModule: true,
    default: {
        port: 3000,
        nodeEnv: 'test',
        jwtSecret: 'test-secret-key-for-testing',
        frontendUrl: 'http://localhost:3001',
        email: {
            host: 'smtp.test.com',
            port: 587,
            user: 'test@test.com',
            pass: 'test-pass',
            from: 'test@test.com',
        },
        firebase: {
            projectId: 'test-project-id',
            clientEmail: 'test@test-project.iam.gserviceaccount.com',
            privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC\n-----END PRIVATE KEY-----',
        },
    },
}));
// Mock Firebase Admin SDK
jest.mock('firebase-admin', () => {
    const mockFirestore = () => ({
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({ exists: false, data: () => ({}) }),
        set: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({}),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        add: jest.fn().mockResolvedValue({ id: 'mock-id' }),
        settings: jest.fn(),
        batch: jest.fn(() => ({
            set: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            commit: jest.fn().mockResolvedValue([]),
        })),
    });
    return {
        __esModule: true,
        default: {
            initializeApp: jest.fn(),
            credential: {
                cert: jest.fn(() => ({})),
            },
            firestore: mockFirestore,
        },
        initializeApp: jest.fn(),
        credential: {
            cert: jest.fn(() => ({})),
        },
        firestore: mockFirestore,
    };
});
// Mock logger
jest.mock('../src/config/logger', () => ({
    __esModule: true,
    default: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
    },
}));
// Mock email service
jest.mock('../src/services/email.service', () => ({
    __esModule: true,
    default: {
        sendOtpEmail: jest.fn().mockResolvedValue(undefined),
    },
}));

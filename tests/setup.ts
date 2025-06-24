// Jest setup file for Khaos CLI tests
import { jest } from '@jest/globals';

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Set test environment variables
process.env['NODE_ENV'] = 'test';
process.env['KHAOS_MODE'] = 'test';
process.env['KHAOS_LOG_LEVEL'] = 'error';

// Mock file system operations for tests
jest.mock('fs-extra');

// Increase timeout for AI operations in tests
jest.setTimeout(30000);
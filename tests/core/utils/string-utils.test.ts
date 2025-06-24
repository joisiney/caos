import {
  toPascalCase,
  toCamelCase,
  toKebabCase,
  validateNaming,
  sanitizeFileName,
  extractNamespace,
  extractBaseName,
  createNamespace,
} from '@/core/utils/string-utils';

describe('String Utils', () => {
  describe('toPascalCase', () => {
    it('should convert dash-case to PascalCase', () => {
      expect(toPascalCase('button-component')).toBe('ButtonComponent');
      expect(toPascalCase('user-profile-card')).toBe('UserProfileCard');
    });

    it('should convert snake_case to PascalCase', () => {
      expect(toPascalCase('button_component')).toBe('ButtonComponent');
      expect(toPascalCase('user_profile_card')).toBe('UserProfileCard');
    });

    it('should handle single words', () => {
      expect(toPascalCase('button')).toBe('Button');
      expect(toPascalCase('BUTTON')).toBe('Button');
    });
  });

  describe('toCamelCase', () => {
    it('should convert dash-case to camelCase', () => {
      expect(toCamelCase('button-component')).toBe('buttonComponent');
      expect(toCamelCase('user-profile-card')).toBe('userProfileCard');
    });

    it('should handle single words', () => {
      expect(toCamelCase('button')).toBe('button');
      expect(toCamelCase('BUTTON')).toBe('button');
    });
  });

  describe('toKebabCase', () => {
    it('should convert PascalCase to kebab-case', () => {
      expect(toKebabCase('ButtonComponent')).toBe('button-component');
      expect(toKebabCase('UserProfileCard')).toBe('user-profile-card');
    });

    it('should convert camelCase to kebab-case', () => {
      expect(toKebabCase('buttonComponent')).toBe('button-component');
      expect(toKebabCase('userProfileCard')).toBe('user-profile-card');
    });
  });

  describe('validateNaming', () => {
    const kebabPattern = /^[a-z]+(-[a-z]+)*$/;

    it('should validate correct kebab-case names', () => {
      expect(validateNaming('button', kebabPattern)).toBe(true);
      expect(validateNaming('button-component', kebabPattern)).toBe(true);
      expect(validateNaming('user-profile-card', kebabPattern)).toBe(true);
    });

    it('should reject invalid names', () => {
      expect(validateNaming('ButtonComponent', kebabPattern)).toBe(false);
      expect(validateNaming('button_component', kebabPattern)).toBe(false);
      expect(validateNaming('button-', kebabPattern)).toBe(false);
      expect(validateNaming('-button', kebabPattern)).toBe(false);
    });
  });

  describe('extractNamespace', () => {
    it('should extract namespace from namespaced names', () => {
      expect(extractNamespace('strategy/investors')).toBe('strategy');
      expect(extractNamespace('auth/login')).toBe('auth');
    });

    it('should return empty string for non-namespaced names', () => {
      expect(extractNamespace('button')).toBe('');
      expect(extractNamespace('header')).toBe('');
    });
  });

  describe('extractBaseName', () => {
    it('should extract base name from namespaced names', () => {
      expect(extractBaseName('strategy/investors')).toBe('investors');
      expect(extractBaseName('auth/login')).toBe('login');
    });

    it('should return the name itself for non-namespaced names', () => {
      expect(extractBaseName('button')).toBe('button');
      expect(extractBaseName('header')).toBe('header');
    });
  });

  describe('createNamespace', () => {
    it('should create proper namespace for components', () => {
      expect(createNamespace('button', 'atom')).toBe('ButtonAtom');
      expect(createNamespace('login-form', 'molecule')).toBe('LoginFormMolecule');
      expect(createNamespace('user-profile', 'organism')).toBe('UserProfileOrganism');
    });
  });

  describe('sanitizeFileName', () => {
    it('should sanitize invalid characters', () => {
      expect(sanitizeFileName('button@component')).toBe('button-component');
      expect(sanitizeFileName('user profile card')).toBe('user-profile-card');
      expect(sanitizeFileName('button--component')).toBe('button-component');
    });

    it('should handle edge cases', () => {
      expect(sanitizeFileName('-button-')).toBe('button');
      expect(sanitizeFileName('BUTTON')).toBe('button');
    });
  });
});
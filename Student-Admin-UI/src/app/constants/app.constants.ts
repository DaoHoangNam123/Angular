export const APP_CONSTANTS = {
  // API Configuration
  API: {
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  },

  // Local Storage Keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'access_token',
    USER_NAME: 'userName',
    USER_DATA: 'userData',
    THEME: 'theme',
    LANGUAGE: 'language',
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
  },

  // Validation
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN_LENGTH: 8,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
  },

  // Error Messages
  ERROR_MESSAGES: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PASSWORD: 'Password must be at least 8 characters long',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input data.',
  },

  // Success Messages
  SUCCESS_MESSAGES: {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    SAVE_SUCCESS: 'Data saved successfully',
    DELETE_SUCCESS: 'Data deleted successfully',
    UPDATE_SUCCESS: 'Data updated successfully',
  },

  // UI Configuration
  UI: {
    DEBOUNCE_TIME: 300, // milliseconds
    ANIMATION_DURATION: 300, // milliseconds
    TOAST_DURATION: 5000, // 5 seconds
  },

  // Tree Node Types
  TREE_NODE_TYPES: {
    FOLDER: 1,
    FILE: 0,
  },

  // Gender Options
  GENDER_OPTIONS: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ],
} as const;

export type AppConstants = typeof APP_CONSTANTS;

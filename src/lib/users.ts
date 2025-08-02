/**
 * @file Defines the TypeScript type for a User object.
 */

/**
 * Represents a user in the application.
 * @property {string} id - The unique identifier for the user (from Firebase Auth).
 * @property {string} username - The user's chosen username.
 * @property {string} [password] - The user's password. This is optional and only used during user creation. It should not be stored or fetched.
 * @property {string} name - The user's full name.
 * @property {string} email - The user's email address.
 * @property {'admin' | 'user'} role - The role of the user, which determines their permissions.
 */
export type User = {
  id: string;
  username: string;
  password?: string; // Password is now optional, only used for creation
  name: string;
  email: string;
  role: 'admin' | 'user';
};

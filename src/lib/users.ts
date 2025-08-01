
export type User = {
  id: string;
  username: string;
  password?: string; // Password is now optional, only used for creation
  name: string;
  email: string;
  role: 'admin' | 'user';
};

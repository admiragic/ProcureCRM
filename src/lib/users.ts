
export type User = {
  id: string;
  username: string;
  password?: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
};

export const users: User[] = [
  {
    id: 'USR-001',
    username: 'jnadmin01082025',
    password: 'shaban$$',
    name: 'Admin Admin',
    email: 'admin@procurerm.com',
    role: 'admin',
  },
  {
    id: 'USR-002',
    username: 'user',
    password: 'user',
    name: 'Iva Ivić',
    email: 'iva.ivic@example.com',
    role: 'user',
  },
];

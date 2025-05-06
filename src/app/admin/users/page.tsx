'use client';

import { useAuth } from '@/lib/firebase/AuthContext';

export default function UsersPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">User Management</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Users List</h2>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            User management functionality coming soon...
          </p>
        </div>
      </div>
    </div>
  );
} 
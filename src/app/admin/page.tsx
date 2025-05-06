'use client';

import { useAuth } from '@/lib/firebase/AuthContext';

export default function AdminPage() {
  const { user, role } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Admin Dashboard</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Welcome, {user?.email}</h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-600 dark:text-gray-300">Your Role: <span className="font-medium text-gray-900 dark:text-white">{role}</span></p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-300">User ID: <span className="font-medium text-gray-900 dark:text-white">{user?.uid}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
} 
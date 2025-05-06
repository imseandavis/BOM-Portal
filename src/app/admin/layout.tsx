import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthProvider } from '@/lib/firebase/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </AuthProvider>
  );
} 
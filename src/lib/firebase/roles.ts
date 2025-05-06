export interface UserClaims {
  role: UserRole;
}

export type UserRole = typeof ROLES[keyof typeof ROLES];

export const ROLES = {
  ADMIN: 'admin',
  CLIENT: 'client',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const hasRequiredRole = (userRole: UserRole | undefined, requiredRole: UserRole): boolean => {
  if (!userRole) return false;
  
  const roleHierarchy = {
    [ROLES.ADMIN]: 2,
    [ROLES.CLIENT]: 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}; 
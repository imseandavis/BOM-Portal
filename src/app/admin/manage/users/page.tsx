'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { UserProduct, getUserProducts } from '@/lib/firebase/users'
import { ChevronDown, ChevronRight, Loader2, Shield, User as UserIcon, Package } from 'lucide-react'
import { toast } from 'react-hot-toast'
import React from 'react'
import { DomainProductCard } from '@/components/products/DomainProductCard'
import { HostingProductCard } from '@/components/products/HostingProductCard'
import { 
  Container, 
  Paper, 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  useTheme,
  alpha,
  Collapse,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Avatar,
  Card,
  CardContent,
} from '@mui/material'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { SelectChangeEvent } from '@mui/material/Select'

const MotionPaper = motion.create(Paper);
const MotionContainer = motion.create(Container);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const isExpiringWithin30Days = (expiryDate: Date | null | undefined) => {
  if (!expiryDate) return false;
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return expiryDate <= thirtyDaysFromNow;
};

const formatExpiryDate = (expiryDate: Date | null | undefined) => {
  if (!expiryDate) return 'No expiry date';
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return expiryDate.toLocaleDateString(undefined, options);
};

interface User {
  uid: string;
  email: string;
  displayName: string;
  firstName: string | null;
  lastName: string | null;
  photoURL: string | null;
  role: 'admin' | 'client';
  createdAt: Timestamp;
  lastLoginAt: Timestamp | null;
  status: 'active' | 'inactive';
}

const updateUserRole = async (userId: string, role: User['role']) => {
  const response = await fetch('/api/users/update-role', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uid: userId, role }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update role')
  }

  return response.json()
}

export default function ManageUsers() {
  const theme = useTheme()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [userProducts, setUserProducts] = useState<Record<string, UserProduct[]>>({})
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Get all users from Firestore
        const usersRef = collection(db, 'users')
        const q = query(usersRef, orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        
        console.log('Number of users found:', snapshot.size)
        
        // Get custom claims for each user
        const usersData = await Promise.all(snapshot.docs.map(async (doc) => {
          const userData = doc.data()
          
          // Get custom claims from API
          const response = await fetch('/api/users/get-claims', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid: doc.id }),
          })
          
          const { customClaims } = await response.json()
          const role = customClaims?.role || 'client' // Default to client if no role set
          
          console.log('User data:', doc.id, { ...userData, role })
          
          return {
            ...userData,
            uid: doc.id,
            role,
            status: 'active'
          } as User
        }))
        
        console.log('Processed users:', usersData)
        setUsers(usersData)
      } catch (error) {
        console.error('Error fetching users:', error)
        toast.error('Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleUpdateRole = async (userId: string, newRole: User['role']) => {
    try {
      setUpdatingUserId(userId)
      setError(null)

      await updateUserRole(userId, newRole)
      
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.uid === userId ? { ...user, role: newRole } : user
        )
      )
      
      toast.success('User role updated successfully')
    } catch (err) {
      console.error('Error updating user role:', err)
      setError('Failed to update user role')
      toast.error('Failed to update user role')
    } finally {
      setUpdatingUserId(null)
    }
  }

  const handleRowClick = async (uid: string) => {
    if (expandedUser === uid) {
      setExpandedUser(null)
    } else {
      setExpandedUser(uid)
      if (!userProducts[uid]) {
        try {
          const products = await getUserProducts(uid)
          console.log('Fetched products:', products)
          setUserProducts(prev => ({ ...prev, [uid]: products }))
        } catch (error) {
          console.error('Error fetching user products:', error)
          toast.error('Failed to fetch user products')
        }
      }
    }
  }

  const handleRoleChange = (userId: string) => (event: SelectChangeEvent) => {
    const newRole = event.target.value as User['role']
    handleUpdateRole(userId, newRole)
  }

  return (
    <MotionContainer
      maxWidth={false}
      disableGutters
      className="px-4 sm:px-6 lg:px-8 py-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Manage Users
        </Typography>
        <Button
          variant="outlined"
          onClick={() => {/* TODO: Implement invite user */}}
        >
          Invite User
        </Button>
      </Box>

      <MotionPaper
        variants={itemVariants}
        sx={{ 
          p: 4,
          background: (theme) => alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Loader2 className="animate-spin" />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={50}></TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Last Login</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <React.Fragment key={user.uid}>
                    <TableRow
                      hover
                      onClick={() => handleRowClick(user.uid)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(user.uid);
                          }}
                        >
                          {expandedUser === user.uid ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={user.photoURL || undefined}>
                            {user.displayName?.[0] || user.email?.[0] || 'U'}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {user.displayName || user.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={user.role}
                            onChange={handleRoleChange(user.uid)}
                            disabled={updatingUserId === user.uid}
                          >
                            <MenuItem value="admin">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Shield size={16} />
                                <Typography>Admin</Typography>
                              </Box>
                            </MenuItem>
                            <MenuItem value="client">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <UserIcon size={16} />
                                <Typography>Client</Typography>
                              </Box>
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        {format(user.createdAt.toDate(), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        {user.lastLoginAt ? format(user.lastLoginAt.toDate(), 'MMM d, yyyy') : 'Never'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} sx={{ p: 0, border: 0 }}>
                        <Collapse in={expandedUser === user.uid}>
                          <Box sx={{ p: 3, bgcolor: 'background.default' }}>
                            <Typography variant="h6" gutterBottom>
                              User Products
                            </Typography>
                            {userProducts[user.uid] ? (
                              <Box sx={{ 
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 2,
                                '& > *': {
                                  flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' }
                                }
                              }}>
                                {userProducts[user.uid].map((product) => (
                                  <Box key={product.id}>
                                    {product.type === 'domain' ? (
                                      <DomainProductCard product={product} />
                                    ) : (
                                      <HostingProductCard product={product} />
                                    )}
                                  </Box>
                                ))}
                                {userProducts[user.uid].length === 0 && (
                                  <Box sx={{ width: '100%' }}>
                                    <Card>
                                      <CardContent>
                                        <Box sx={{ 
                                          display: 'flex', 
                                          flexDirection: 'column', 
                                          alignItems: 'center', 
                                          py: 4,
                                          color: 'text.secondary'
                                        }}>
                                          <Package size={48} />
                                          <Typography variant="h6" sx={{ mt: 2 }}>
                                            No Products
                                          </Typography>
                                          <Typography variant="body2">
                                            This user doesn't have any products yet.
                                          </Typography>
                                        </Box>
                                      </CardContent>
                                    </Card>
                                  </Box>
                                )}
                              </Box>
                            ) : (
                              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <Loader2 className="animate-spin" />
                              </Box>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </MotionPaper>
    </MotionContainer>
  );
} 
'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { 
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Link,
  Chip,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  AlertTitle,
} from '@mui/material'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

const MotionContainer = motion.create(Container);
const MotionPaper = motion.create(Paper);

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

interface ContentApproval {
  id: string
  title: string
  type: string
  clientName: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
}

export default function ContentApprovals() {
  const [approvals, setApprovals] = useState<ContentApproval[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await fetch('/api/content/approvals')
        if (!response.ok) {
          throw new Error('Failed to fetch approvals')
        }
        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format')
        }
        setApprovals(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch approvals')
      } finally {
        setLoading(false)
      }
    }

    fetchApprovals()
  }, [])

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Chip
            icon={<Clock size={16} />}
            label="Pending"
            color="warning"
            size="small"
          />
        )
      case 'approved':
        return (
          <Chip
            icon={<CheckCircle size={16} />}
            label="Approved"
            color="success"
            size="small"
          />
        )
      case 'rejected':
        return (
          <Chip
            icon={<XCircle size={16} />}
            label="Rejected"
            color="error"
            size="small"
          />
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    )
  }

  return (
    <MotionContainer
      maxWidth="lg"
      disableGutters
      className="px-4 sm:px-6 lg:px-8 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <MotionPaper
        variants={itemVariants}
        sx={{ 
          p: 3,
          background: (theme) => alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Content Approvals
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review and manage content submissions
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {approvals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No content approvals found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                approvals.map((approval) => (
                  <TableRow 
                    key={approval.id}
                    hover
                    sx={{ 
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {approval.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                        {approval.type}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {approval.clientName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(approval.status)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDistanceToNow(approval.createdAt, { addSuffix: true })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/content/approvals/${approval.id}`}
                        sx={{
                          color: 'primary.main',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        View Details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </MotionPaper>
    </MotionContainer>
  )
} 
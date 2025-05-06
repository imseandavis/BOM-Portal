'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
} from '@mui/material'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ContentApproval {
  id: string
  title: string
  description: string
  content: string
  type: string
  clientId: string
  clientName: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  updatedAt: Date
  createdBy: string
  clientEmail: string
}

const MotionContainer = motion.create(Container)
const MotionPaper = motion.create(Paper)

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

export default function ContentApprovalDetail() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const [approval, setApproval] = useState<ContentApproval | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  useEffect(() => {
    const fetchApproval = async () => {
      try {
        const response = await fetch(`/api/content/approvals/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch approval')
        }
        const data = await response.json()
        setApproval(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchApproval()
  }, [id])

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip label="Pending" color="warning" />
      case 'approved':
        return <Chip label="Approved" color="success" />
      case 'rejected':
        return <Chip label="Rejected" color="error" />
      default:
        return <Chip label={status} />
    }
  }

  const handleSendApprovalRequest = async () => {
    if (!approval) return;
    
    setIsSending(true);
    setSendError(null);
    
    try {
      const response = await fetch('/api/content/approvals/send-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approvalId: approval.id,
          clientEmail: approval.clientEmail,
          title: approval.title,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send approval request');
      }

      toast.success('Approval request sent successfully');
    } catch (error) {
      console.error('Error sending approval request:', error);
      setSendError(error instanceof Error ? error.message : 'Failed to send approval request');
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Container>
    )
  }

  if (!approval) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning">
          <AlertTitle>Not Found</AlertTitle>
          Content approval not found
        </Alert>
      </Container>
    )
  }

  return (
    <MotionContainer
      initial="initial"
      animate="animate"
      variants={containerVariants}
      sx={{ py: 4 }}
    >
      <Box mb={4}>
        <Button
          startIcon={<ArrowLeft />}
          onClick={() => router.back()}
          variant="outlined"
        >
          Back
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {sendError && (
        <Alert severity="error" sx={{ mb: 4 }}>
          <AlertTitle>Error</AlertTitle>
          {sendError}
        </Alert>
      )}

      <MotionPaper
        elevation={3}
        sx={{ p: 4 }}
        variants={itemVariants}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" component="h1">
                {approval.title}
              </Typography>
              {approval.status === 'pending' && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendApprovalRequest}
                  disabled={isSending}
                  startIcon={isSending ? <CircularProgress size={20} /> : null}
                >
                  {isSending ? 'Sending...' : 'Send Approval Request'}
                </Button>
              )}
            </Box>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
              Created on {new Date(approval.createdAt).toLocaleDateString()}
            </Typography>
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Client Information
              </Typography>
              <Typography variant="body1">
                <strong>Name:</strong> {approval.clientName}
              </Typography>
              <Typography variant="body1">
                <strong>ID:</strong> {approval.clientId}
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Content Details
              </Typography>
              <Typography variant="body1">
                <strong>Type:</strong> {approval.type}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {approval.status}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {approval.description}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Content
            </Typography>
            <Typography variant="body1" paragraph>
                {approval.content}
            </Typography>
          </Box>
        </Box>
      </MotionPaper>
    </MotionContainer>
  )
} 
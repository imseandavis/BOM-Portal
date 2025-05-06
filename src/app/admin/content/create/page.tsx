'use client'

import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { User } from '@/lib/firebase/users'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { 
  Container, 
  Paper, 
  Box, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button,
  useTheme,
  alpha,
} from '@mui/material'
import { motion } from 'framer-motion'

const MotionPaper = motion.create(Paper);
const MotionContainer = motion.create(Container);
const MotionBox = motion.create(Box);

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

export default function CreateContent() {
  const router = useRouter()
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<User[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    type: 'blog',
    clientId: '',
  })

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const usersRef = collection(db, 'users')
        const snapshot = await getDocs(usersRef)
        
        const clientsData = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        })) as User[]

        setClients(clientsData)
      } catch (error) {
        console.error('Error fetching clients:', error)
      }
    }

    fetchClients()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const selectedClient = clients.find(client => client.uid === formData.clientId)
      if (!selectedClient) throw new Error('Client not found')

      await addDoc(collection(db, 'content-approvals'), {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        clientId: formData.clientId,
        clientName: selectedClient.firstName && selectedClient.lastName 
          ? `${selectedClient.firstName} ${selectedClient.lastName}`
          : selectedClient.displayName || selectedClient.email,
        clientEmail: selectedClient.email,
        contentType: formData.type,
        status: 'Pending Approval',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success('Content created and sent for approval')
      router.push('/admin/content/approvals')
    } catch (error) {
      console.error('Error creating content:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create content')
    } finally {
      setLoading(false)
    }
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
      <MotionBox
        variants={itemVariants}
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Create New Content
        </Typography>
      </MotionBox>

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
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Title"
              required
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />

            <TextField
              label="Description"
              required
              multiline
              rows={3}
              fullWidth
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />

            <TextField
              label="Content"
              required
              multiline
              rows={10}
              fullWidth
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            />

            <Box sx={{ display: 'flex', gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Content Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Content Type"
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                >
                  <MenuItem value="blog">Blog Post</MenuItem>
                  <MenuItem value="page">Page</MenuItem>
                  <MenuItem value="post">Social Post</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Assign to Client</InputLabel>
                <Select
                  value={formData.clientId}
                  label="Assign to Client"
                  onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                >
                  <MenuItem value="">Select a client</MenuItem>
                  {clients.map(client => (
                    <MenuItem key={client.uid} value={client.uid}>
                      {client.firstName && client.lastName 
                        ? `${client.firstName} ${client.lastName}`
                        : client.displayName || client.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <Loader2 className="animate-spin" /> : null}
              >
                {loading ? 'Creating...' : 'Create Content'}
              </Button>
            </Box>
          </Box>
        </form>
      </MotionPaper>
    </MotionContainer>
  )
} 
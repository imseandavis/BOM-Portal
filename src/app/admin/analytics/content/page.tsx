'use client'

import { LineChart } from '@/components/charts/LineChart'
import { BarChart } from '@/components/charts/BarChart'
import { StatsCard } from '@/components/analytics/mui/StatsCard'
import { 
  Container, 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  useTheme,
  alpha,
  Stack,
  Paper,
  type Theme,
} from '@mui/material'
import { FileText, CheckCircle, Clock, Users } from 'lucide-react'
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

// Mock data
const contentCreationData = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  data: [
    {
      name: 'Blog Posts',
      data: [30, 40, 35, 50, 49, 60],
    },
    {
      name: 'Pages',
      data: [20, 25, 30, 35, 30, 40],
    },
    {
      name: 'Social Posts',
      data: [45, 50, 55, 60, 55, 65],
    },
  ],
}

const approvalRatesByClient = {
  clients: ['Client A', 'Client B', 'Client C', 'Client D', 'Client E'],
  data: [
    {
      name: 'Approved',
      data: [85, 75, 90, 80, 95],
    },
    {
      name: 'Rejected',
      data: [15, 25, 10, 20, 5],
    },
  ],
}

const approvalFrequency = {
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  data: [12, 15, 10, 18, 14],
}

const clientPerformance = [
  {
    client: 'Client A',
    totalContent: 156,
    approvalRate: '92%',
    avgApprovalTime: '2.5 days',
  },
  {
    client: 'Client B',
    totalContent: 98,
    approvalRate: '88%',
    avgApprovalTime: '1.8 days',
  },
  {
    client: 'Client C',
    totalContent: 134,
    approvalRate: '95%',
    avgApprovalTime: '1.2 days',
  },
  {
    client: 'Client D',
    totalContent: 78,
    approvalRate: '85%',
    avgApprovalTime: '3.1 days',
  },
]

export default function ContentAnalytics() {
  const theme = useTheme();

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
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Content Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor content performance and approval metrics
          </Typography>
        </Box>
      </MotionBox>

      {/* Stats Cards Section */}
      <Box sx={{ display: 'grid', gap: 3 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 3
        }}>
          <StatsCard
            title="Total Content"
            value="466"
            changePercent={15}
            icon={<FileText size={20} />}
          />
          <StatsCard
            title="Approval Rate"
            value="89%"
            changePercent={4}
            icon={<CheckCircle size={20} />}
          />
          <StatsCard
            title="Avg. Approval Time"
            value="2.1 days"
            changePercent={-8}
            icon={<Clock size={20} />}
          />
          <StatsCard
            title="Active Clients"
            value="12"
            changePercent={2}
            icon={<Users size={20} />}
          />
        </Box>
      </Box>

      {/* Charts Section */}
      <Stack spacing={6} sx={{ mt: 3 }}>
        {/* Content Creation Trends */}
        <MotionPaper
          variants={itemVariants}
          sx={{ 
            p: 3,
            height: '100%',
            background: (theme: Theme) => alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Content Creation Trends
          </Typography>
          <LineChart
            title="Content Creation Trends"
            data={contentCreationData.data}
            categories={contentCreationData.months}
            height={300}
          />
        </MotionPaper>

        {/* Approval Rates by Client */}
        <MotionPaper
          variants={itemVariants}
          sx={{ 
            p: 3,
            height: '100%',
            background: (theme: Theme) => alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Approval Rates by Client
          </Typography>
          <BarChart
            title="Approval Rates by Client"
            data={approvalRatesByClient.data}
            categories={approvalRatesByClient.clients}
            stacked={true}
            height={300}
          />
        </MotionPaper>

        {/* Client Performance */}
        <MotionPaper
          variants={itemVariants}
          sx={{ 
            p: 3,
            height: '100%',
            background: (theme: Theme) => alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Client Performance
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client</TableCell>
                  <TableCell>Total Content</TableCell>
                  <TableCell>Approval Rate</TableCell>
                  <TableCell>Avg. Approval Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientPerformance.map((client, index) => (
                  <TableRow key={index}>
                    <TableCell>{client.client}</TableCell>
                    <TableCell>{client.totalContent}</TableCell>
                    <TableCell>{client.approvalRate}</TableCell>
                    <TableCell>{client.avgApprovalTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MotionPaper>
      </Stack>
    </MotionContainer>
  )
} 
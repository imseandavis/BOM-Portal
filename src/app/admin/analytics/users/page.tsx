'use client'

import { useEffect, useState } from 'react'
import { StatsCard } from '@/components/analytics/mui/StatsCard'
import { AnalyticsChart } from '@/components/analytics/AnalyticsChart'
import { PieChart } from '@/components/charts/PieChart'
import { getUserAnalytics, type UserAnalytics } from '@/lib/firebase/users'
import { 
  Container, 
  Box, 
  Typography, 
  useTheme, 
  alpha,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  AlertTitle,
  Stack,
  Paper,
  type Theme,
} from '@mui/material'
import { 
  Users,
  UserPlus,
  Activity,
  Download,
  Calendar,
  RefreshCcw,
  UserCheck,
} from 'lucide-react'
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

export default function UsersAnalytics() {
  const theme = useTheme();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setError(null)
        const data = await getUserAnalytics()
        setAnalytics(data)
      } catch {
        setError('Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const handleRefresh = async () => {
    setLoading(true)
    const fetchAnalytics = async () => {
      try {
        setError(null)
        const data = await getUserAnalytics()
        setAnalytics(data)
      } catch {
        setError('Failed to refresh analytics data')
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }

  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">
          Loading analytics data...
        </Typography>
      </Box>
    )
  }

  if (error || !analytics) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error"
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={handleRefresh}
            >
              <RefreshCcw size={16} />
            </IconButton>
          }
        >
          <AlertTitle>Error</AlertTitle>
          {error || 'Failed to load analytics data'}
        </Alert>
      </Box>
    )
  }

  // Calculate month-over-month growth
  const currentMonthUsers = analytics.userGrowth.counts[analytics.userGrowth.counts.length - 1]
  const lastMonthUsers = analytics.userGrowth.counts[analytics.userGrowth.counts.length - 2]
  const monthlyGrowth = lastMonthUsers ? 
    ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 : 
    0

  // Prepare data for role distribution chart
  const roleData = Object.entries(analytics.usersByRole)
  const roleSeries = roleData.map(([_, count]) => count)
  const roleLabels = roleData.map(([role]) => role.charAt(0).toUpperCase() + role.slice(1))

  // Prepare data for login activity chart
  const loginData = Object.entries(analytics.lastLoginDistribution)
  const loginSeries = loginData.map(([_, count]) => count)
  const loginLabels = ['Last 24h', 'Last 7 days', 'Last 30 days', 'Older']

  return (
    <MotionContainer
      maxWidth={false}
      disableGutters
      className="px-4 sm:px-6 lg:px-8 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <MotionBox
        variants={itemVariants}
        sx={{
          mb: 5,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="h4" fontWeight="bold">
              User Analytics
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Monitor user growth and engagement metrics
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh Data">
            <IconButton 
              onClick={handleRefresh}
              sx={{ 
                bgcolor: 'background.paper',
                boxShadow: theme.shadows[2],
                '&:hover': { bgcolor: 'background.default' },
              }}
            >
              <RefreshCcw size={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download Report">
            <IconButton 
              sx={{ 
                bgcolor: 'background.paper',
                boxShadow: theme.shadows[2],
                '&:hover': { bgcolor: 'background.default' },
              }}
            >
              <Download size={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Select Date Range">
            <IconButton
              sx={{ 
                bgcolor: 'background.paper',
                boxShadow: theme.shadows[2],
                '&:hover': { bgcolor: 'background.default' },
              }}
            >
              <Calendar size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </MotionBox>

      {/* Stats Cards Section */}
      <MotionBox 
        variants={itemVariants}
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 3,
          mb: 6
        }}
      >
        <StatsCard
          title="Total Users"
          value={analytics.totalUsers.toString()}
          changePercent={monthlyGrowth}
          icon={<Users size={20} />}
        />
        <StatsCard
          title="Active Users"
          value={analytics.activeUsers.toString()}
          changePercent={8}
          icon={<Activity size={20} />}
        />
        <StatsCard
          title="New Users"
          value={analytics.newUsers.toString()}
          changePercent={monthlyGrowth}
          icon={<UserPlus size={20} />}
        />
        <StatsCard
          title="User Activity"
          value={`${analytics.activeUsers / analytics.totalUsers * 100}%`}
          changePercent={4}
          icon={<UserCheck size={20} />}
        />
      </MotionBox>

      {/* Charts Section */}
      <Stack spacing={6}>
        {/* User Growth Chart */}
        <MotionPaper
          variants={itemVariants}
          sx={{ 
            p: 4,
            height: '100%',
            background: (theme: Theme) => alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(6px)',
            border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="bold">
            User Growth Trend
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Monthly user registration trend over time
          </Typography>
          <AnalyticsChart
            data={analytics.userGrowth.counts}
            categories={analytics.userGrowth.dates}
            height={360}
          />
        </MotionPaper>

        {/* Charts Grid */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 6
        }}>
          {/* User Roles Distribution */}
          <MotionPaper
            variants={itemVariants}
            sx={{ 
              p: 4,
              height: '100%',
              background: (theme: Theme) => alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(6px)',
              border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              User Roles Distribution
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Distribution of users across different roles
            </Typography>
            <PieChart
              title="User Roles Distribution"
              series={roleSeries}
              labels={roleLabels}
              height={320}
            />
          </MotionPaper>

          {/* Login Activity Distribution */}
          <MotionPaper
            variants={itemVariants}
            sx={{ 
              p: 4,
              height: '100%',
              background: (theme: Theme) => alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(6px)',
              border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Login Activity Distribution
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              User login frequency distribution
            </Typography>
            <PieChart
              title="Login Activity Distribution"
              series={loginSeries}
              labels={loginLabels}
              height={320}
            />
          </MotionPaper>
        </Box>
      </Stack>
    </MotionContainer>
  )
} 
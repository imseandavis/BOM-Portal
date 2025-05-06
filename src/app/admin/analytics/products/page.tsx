'use client'

import { useEffect, useState } from 'react'
import { StatsCard } from '@/components/analytics/mui/StatsCard'
import { AnalyticsChart } from '@/components/analytics/AnalyticsChart'
import { PieChart } from '@/components/charts/PieChart'
import { BarChart } from '@/components/charts/BarChart'
import { getProductAnalytics, type ProductAnalytics } from '@/lib/firebase/products'
import { 
  Container, 
  Paper, 
  Box, 
  Typography, 
  useTheme, 
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
  Chip,
} from '@mui/material'
import { 
  Package,
  ShoppingCart,
  TrendingUp as Growth,
  DollarSign,
  Download,
  Calendar,
  RefreshCcw,
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

export default function ProductsAnalytics() {
  const theme = useTheme();
  const [analytics, setAnalytics] = useState<ProductAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState(0)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setError(null)
        const data = await getProductAnalytics()
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
        const data = await getProductAnalytics()
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="h4" fontWeight="bold">
              Product Analytics
            </Typography>
            <Chip 
              label="Live" 
              size="small" 
              color="success"
              sx={{ height: 20 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Monitor product performance and sales metrics
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh Data">
            <IconButton 
              onClick={handleRefresh}
              sx={{ 
                bgcolor: 'background.paper',
                boxShadow: theme.shadows[2],
                '&:hover': { bgcolor: 'background.paper' },
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
                '&:hover': { bgcolor: 'background.paper' },
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
                '&:hover': { bgcolor: 'background.paper' },
              }}
            >
              <Calendar size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </MotionBox>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        <Box>
          <StatsCard
            title="Total Products"
            value={analytics.totalProducts}
            icon={<Package />}
            trend={analytics.productGrowth}
            trendLabel="Growth"
          />
        </Box>
        <Box>
          <StatsCard
            title="Active Products"
            value={analytics.activeProducts}
            icon={<ShoppingCart />}
            trend={analytics.activeGrowth}
            trendLabel="Growth"
          />
        </Box>
        <Box>
          <StatsCard
            title="Revenue"
            value={`$${analytics.revenue.toLocaleString()}`}
            icon={<DollarSign />}
            trend={analytics.revenueGrowth}
            trendLabel="Growth"
          />
        </Box>
        <Box>
          <StatsCard
            title="Average Order Value"
            value={`$${analytics.averageOrderValue.toLocaleString()}`}
            icon={<Growth />}
            trend={analytics.aovGrowth}
            trendLabel="Growth"
          />
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <MotionPaper
          variants={itemVariants}
          sx={{ p: 3 }}
        >
          <Tabs
            value={timeRange}
            onChange={(_, newValue) => setTimeRange(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="7 Days" />
            <Tab label="30 Days" />
            <Tab label="90 Days" />
          </Tabs>
          <AnalyticsChart
            data={analytics.salesData}
            timeRange={timeRange}
          />
        </MotionPaper>
      </Box>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3
      }}>
        <Box>
          <MotionPaper
            variants={itemVariants}
            sx={{ p: 3 }}
          >
            <Typography variant="h6" gutterBottom>
              Product Categories
            </Typography>
            <PieChart
              data={analytics.categoryData}
              height={300}
            />
          </MotionPaper>
        </Box>
        <Box>
          <MotionPaper
            variants={itemVariants}
            sx={{ p: 3 }}
          >
            <Typography variant="h6" gutterBottom>
              Sales by Product
            </Typography>
            <BarChart
              data={analytics.productSalesData}
              height={300}
            />
          </MotionPaper>
        </Box>
      </Box>
    </MotionContainer>
  )
} 
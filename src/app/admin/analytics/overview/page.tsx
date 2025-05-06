'use client'

import { LineChart } from '@/components/charts/LineChart'
import { BarChart } from '@/components/charts/BarChart'
import { StatsCard } from '@/components/analytics/mui/StatsCard'
import { AnalyticsChart } from '@/components/analytics/AnalyticsChart'
import { 
  Container, 
  Box, 
  Typography, 
  useTheme, 
  alpha,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Stack,
  Paper,
  type Theme,
} from '@mui/material'
import { 
  MoreHorizontal, 
  Download, 
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

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

export default function AnalyticsOverview() {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState(0);

  // Example data for the stats cards
  const statsData = [
    {
      title: 'Total Revenue',
      value: '£5,678.09',
      count: 3,
      countLabel: 'invoices',
      changePercent: 20.3,
      icon: <DollarSign size={20} />
    },
    {
      title: 'Paid Invoices',
      value: '£5,678.09',
      count: 5,
      countLabel: 'invoices',
      changePercent: -8.73,
      icon: <CheckCircle size={20} />
    },
    {
      title: 'Pending Payments',
      value: '£5,678.09',
      count: 20,
      countLabel: 'invoices',
      changePercent: 1.73,
      icon: <Clock size={20} />
    },
    {
      title: 'Overdue Invoices',
      value: '£5,678.09',
      count: 5,
      countLabel: 'invoices',
      changePercent: -4.7,
      icon: <AlertTriangle size={20} />
    }
  ]

  // Example data for the analytics chart
  const analyticsData = {
    data: [30, 25, 35, 30, 45, 35, 40, 65, 52, 59, 35, 35],
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }

  // Example data for other charts
  const monthlyData = {
    title: 'Revenue vs Expenses',
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    series: [
      {
        name: 'Revenue',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 150, 170, 200]
      },
      {
        name: 'Expenses',
        data: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75]
      }
    ]
  }

  const categoryData = {
    title: 'Sales by Category',
    categories: ['Electronics', 'Clothing', 'Food', 'Books', 'Toys'],
    series: [
      {
        name: 'Sales',
        data: [400, 430, 448, 470, 540]
      }
    ]
  }

  const handleTimeRangeChange = (_: React.SyntheticEvent, newValue: number) => {
    setTimeRange(newValue);
  };

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
            Analytics Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track your business performance and growth
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
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
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </Box>
      </Box>

      {/* Charts Section */}
      <Stack spacing={6} sx={{ mt: 3 }}>
        {/* Revenue Overview Chart */}
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
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
          }}>
            <Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Revenue Overview
              </Typography>
              <Tabs 
                value={timeRange} 
                onChange={handleTimeRangeChange}
                sx={{
                  minHeight: 36,
                  '& .MuiTab-root': {
                    minHeight: 36,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                  },
                }}
              >
                <Tab label="Weekly" />
                <Tab label="Monthly" />
                <Tab label="Yearly" />
              </Tabs>
            </Box>
            <IconButton>
              <MoreHorizontal size={20} />
            </IconButton>
          </Box>
          <AnalyticsChart
            data={analyticsData.data}
            categories={analyticsData.categories}
            height={300}
          />
        </MotionPaper>

        {/* Revenue vs Expenses Chart */}
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
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
          }}>
            <Typography variant="h6" fontWeight="bold">
              Revenue vs Expenses
            </Typography>
            <IconButton>
              <MoreHorizontal size={20} />
            </IconButton>
          </Box>
          <LineChart
            title={monthlyData.title}
            data={monthlyData.series}
            categories={monthlyData.categories}
            height={300}
          />
        </MotionPaper>
        
        {/* Sales by Category Chart */}
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
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
          }}>
            <Typography variant="h6" fontWeight="bold">
              Sales by Category
            </Typography>
            <IconButton>
              <MoreHorizontal size={20} />
            </IconButton>
          </Box>
          <BarChart
            title={categoryData.title}
            data={categoryData.series}
            categories={categoryData.categories}
            height={300}
          />
        </MotionPaper>
      </Stack>
    </MotionContainer>
  )
} 
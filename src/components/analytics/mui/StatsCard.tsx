'use client'

import { 
  Paper, 
  Box, 
  Typography, 
  useTheme, 
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material'
import { TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'

const MotionPaper = motion.create(Paper);

interface StatsCardProps {
  title: string
  value: string
  changePercent: number
  icon: React.ReactNode
}

export function StatsCard({ title, value, changePercent, icon }: StatsCardProps) {
  const theme = useTheme()
  const isPositive = changePercent >= 0

  return (
    <MotionPaper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      sx={{ 
        p: 2,
        height: '100%',
        background: (theme) => theme.palette.background.paper,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        '&:hover': {
          boxShadow: (theme) => theme.shadows[2],
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box 
          sx={{ 
            p: 1,
            borderRadius: 1,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            color: (theme) => theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Tooltip title="More Options">
          <IconButton 
            size="small"
            sx={{ 
              color: (theme) => theme.palette.text.secondary,
              '&:hover': {
                color: (theme) => theme.palette.text.primary,
              }
            }}
          >
            <MoreHorizontal size={16} />
          </IconButton>
        </Tooltip>
      </Box>

      <Box>
        <Typography variant="body2" color="text.secondary" noWrap>
          {title}
        </Typography>
        <Typography variant="h5" fontWeight="bold" noWrap>
          {value}
        </Typography>
      </Box>

      <Box
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: (theme) => isPositive ? theme.palette.success.main : theme.palette.error.main,
        }}
      >
        {isPositive ? (
          <TrendingUp size={14} />
        ) : (
          <TrendingDown size={14} />
        )}
        <Typography variant="caption" fontWeight="medium">
          {Math.abs(changePercent)}%
        </Typography>
        <Typography variant="caption" color="text.secondary">
          vs last period
        </Typography>
      </Box>
    </MotionPaper>
  )
} 
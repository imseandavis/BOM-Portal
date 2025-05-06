'use client'

import { Box, Typography, Paper } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface StatsCardProps {
  title: string;
  value: string | number;
  count: string | number;
  countLabel: string;
  changePercent: number;
}

export function StatsCard({ 
  title, 
  value, 
  count, 
  countLabel,
  changePercent 
}: StatsCardProps) {
  const theme = useTheme();
  const isPositive = changePercent > 0;
  const isNegative = changePercent < 0;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[2],
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: isPositive ? 'success.main' : isNegative ? 'error.main' : 'warning.main',
            typography: 'body2',
          }}
        >
          {isPositive && <ArrowUpward sx={{ fontSize: 16, mr: 0.5 }} />}
          {isNegative && <ArrowDownward sx={{ fontSize: 16, mr: 0.5 }} />}
          {changePercent.toFixed(2)}%
        </Box>
      </Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {count} {countLabel}
      </Typography>
    </Paper>
  );
} 
import { Box, Typography, Paper } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    type: 'increase' | 'decrease';
    value: number;
  };
  icon?: React.ReactNode;
}

export function StatsCard({ title, value, change, icon }: StatsCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ mt: 1 }}>
            {value}
          </Typography>
        </Box>
        {icon && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: '50%',
              bgcolor: 'primary.light',
              color: 'primary.main',
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
      {change && (
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: change.type === 'increase' ? 'success.light' : 'error.light',
              typography: 'body2',
              fontWeight: 500,
            }}
          >
            {change.type === 'increase' ? (
              <ArrowUpward sx={{ fontSize: 16, mr: 0.5 }} />
            ) : (
              <ArrowDownward sx={{ fontSize: 16, mr: 0.5 }} />
            )}
            {Math.abs(change.value)}% from last month
          </Box>
        </Box>
      )}
    </Paper>
  );
} 
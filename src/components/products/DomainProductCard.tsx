import { UserProduct } from '@/lib/firebase/users'
import { 
  Paper, 
  Box, 
  Typography, 
  Chip,
  useTheme,
  alpha,
  Stack,
} from '@mui/material'

interface DomainProductCardProps {
  product: UserProduct
}

const isExpiringWithin30Days = (expiryDate: Date | null | undefined) => {
  if (!expiryDate) return false;
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return expiryDate <= thirtyDaysFromNow;
};

const formatExpiryDate = (expiryDate: Date | null | undefined) => {
  if (!expiryDate) return 'No expiry date';
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return expiryDate.toLocaleDateString(undefined, options);
};

export function DomainProductCard({ product }: DomainProductCardProps) {
  const theme = useTheme();
  const isExpiring = isExpiringWithin30Days(product.expiryDate);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'success.light', text: 'success.dark' };
      case 'expired':
        return { bg: 'error.light', text: 'error.dark' };
      default:
        return { bg: 'warning.light', text: 'warning.dark' };
    }
  };

  const statusColors = getStatusColor(product.status);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        background: (theme) => alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(10px)',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      <Stack spacing={2}>
        {/* Header with Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
              {product.domainName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Domain
            </Typography>
          </Box>
          <Chip
            label={product.status.charAt(0).toUpperCase() + product.status.slice(1)}
            size="small"
            sx={{
              bgcolor: statusColors.bg,
              color: statusColors.text,
              '& .MuiChip-label': {
                fontWeight: 'medium',
              },
            }}
          />
        </Box>

        {/* Domain Details */}
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Domain Name:
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {product.domainName}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Expiration:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: isExpiring ? 'error.main' : 'text.primary',
                  fontWeight: isExpiring ? 'bold' : 'normal'
                }}
              >
                {product.expiryDate ? formatExpiryDate(product.expiryDate) : 'No expiry date'}
              </Typography>
              {isExpiring && (
                <Chip
                  label="Expiring Soon"
                  size="small"
                  sx={{
                    bgcolor: 'error.light',
                    color: 'error.dark',
                    '& .MuiChip-label': {
                      fontSize: '0.75rem',
                    },
                  }}
                />
              )}
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Paper>
  )
} 
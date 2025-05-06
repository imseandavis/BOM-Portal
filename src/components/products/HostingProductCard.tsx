import { UserProduct } from '@/lib/firebase/users'
import { 
  Paper, 
  Box, 
  Typography, 
  Chip,
  useTheme,
  alpha,
} from '@mui/material'

interface HostingProductCardProps {
  product: UserProduct
}

const formatExpiryDate = (expiryDate: Date | null | undefined) => {
  if (!expiryDate) return 'No expiry date';
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return expiryDate.toLocaleDateString(undefined, options);
};

export function HostingProductCard({ product }: HostingProductCardProps) {
  const theme = useTheme();

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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Header with Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="medium">
              {product.plan}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Web Hosting
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

        {/* Hosting Details */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Storage: {product.storage} GB
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bandwidth: {product.bandwidth} GB
          </Typography>
        </Box>

        {/* Expiry Information */}
        {product.expiryDate && (
          <Typography variant="body2" color="text.secondary">
            Expires: {formatExpiryDate(product.expiryDate)}
          </Typography>
        )}
      </Box>
    </Paper>
  )
} 
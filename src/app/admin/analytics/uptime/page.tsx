'use client';

import { useEffect, useState } from 'react';
import { 
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  AlertTitle,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const MotionContainer = motion.create(Container);
const MotionPaper = motion.create(Paper);

interface Monitor {
  id: string;
  friendly_name: string;
  url: string;
  status: number;
  type: number;
  uptime_ratio: number;
  last_uptime: string;
}

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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export default function UptimePage() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonitors = async () => {
      try {
        const response = await fetch('/api/uptime/monitors');
        if (!response.ok) {
          throw new Error('Failed to fetch monitors');
        }
        const data = await response.json();
        setMonitors(data.monitors);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMonitors();
  }, []);

  const getStatusChip = (status: number) => {
    switch (status) {
      case 2:
        return <Chip icon={<CheckCircle size={16} />} label="Up" color="success" />;
      case 9:
        return <Chip icon={<XCircle size={16} />} label="Down" color="error" />;
      default:
        return <Chip icon={<Clock size={16} />} label="Pending" color="warning" />;
    }
  };

  const getTypeLabel = (type: number) => {
    switch (type) {
      case 1:
        return 'HTTP(s)';
      case 2:
        return 'Keyword';
      case 3:
        return 'Ping';
      case 4:
        return 'Port';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <MotionContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      sx={{ py: 4 }}
    >
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Uptime Monitoring
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor the status and performance of your services
        </Typography>
      </Box>

      <MotionPaper
        elevation={3}
        sx={{ p: 4 }}
        variants={itemVariants}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Uptime</TableCell>
                <TableCell>Last Check</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monitors.map((monitor) => (
                <TableRow key={monitor.id}>
                  <TableCell>{monitor.friendly_name}</TableCell>
                  <TableCell>{monitor.url}</TableCell>
                  <TableCell>{getTypeLabel(monitor.type)}</TableCell>
                  <TableCell>{getStatusChip(monitor.status)}</TableCell>
                  <TableCell>{monitor.uptime_ratio}%</TableCell>
                  <TableCell>{new Date(monitor.last_uptime).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MotionPaper>
    </MotionContainer>
  );
} 
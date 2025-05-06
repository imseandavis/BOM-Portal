'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { 
  Container,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  alpha,
  TablePagination,
  Link
} from '@mui/material';
import { motion } from 'framer-motion';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const MotionCard = motion.create(Card);
const MotionContainer = motion.create(Container);

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

interface YelpBusiness {
  id: string;
  name: string;
  url: string;
  phone: string;
  rating: number;
  review_count: number;
  location: {
    address1: string;
    city: string;
    state: string;
    zip_code: string;
  };
}

interface YelpLeadDocument {
  searchTerm: string;
  location: string;
  results: YelpBusiness[];
  createdAt: string;
  status: 'pending' | 'processed';
}

interface YelpLeadResultsClientProps {
  id: string;
}

export default function YelpLeadResultsClient({ id }: YelpLeadResultsClientProps) {
  const theme = useTheme();
  const [leadDoc, setLeadDoc] = useState<YelpLeadDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const docRef = doc(db, 'yelp-leads', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setLeadDoc(docSnap.data() as YelpLeadDocument);
        } else {
          setError('Document not found');
        }
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Failed to fetch document');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleLeadSelection = (businessId: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(businessId)) {
      newSelected.delete(businessId);
    } else {
      newSelected.add(businessId);
    }
    setSelectedLeads(newSelected);
  };

  const handleProcessLeads = async () => {
    try {
      setProcessing(true);
      
      // Create leads in the leads collection
      const selectedBusinesses = leadDoc?.results.filter(business => 
        selectedLeads.has(business.id)
      );

      if (!selectedBusinesses?.length) return;

      // Update the document status
      const docRef = doc(db, 'yelp-leads', id);
      await updateDoc(docRef, {
        status: 'processed'
      });

      // Refresh the document
      const updatedDoc = await getDoc(docRef);
      setLeadDoc(updatedDoc.data() as YelpLeadDocument);
      setSelectedLeads(new Set());
    } catch (err) {
      console.error('Error processing leads:', err);
      setError('Failed to process leads');
    } finally {
      setProcessing(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !leadDoc) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">{error || 'No data available'}</Typography>
      </Container>
    );
  }

  return (
    <MotionContainer
      maxWidth="lg"
      disableGutters
      className="px-4 sm:px-6 lg:px-8 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <MotionCard
        elevation={0}
        sx={{
          background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.1)})`,
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }
        }}
        variants={itemVariants}
      >
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h5" component="div">
            Search Results
              </Typography>
              <Chip
                label={leadDoc.status}
                color={leadDoc.status === 'processed' ? 'success' : 'default'}
              />
            </Box>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
            Search: {leadDoc.searchTerm} in {leadDoc.location}
            </Typography>
          }
        />
        <CardContent>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">
              {selectedLeads.size} leads selected
            </Typography>
              <Button
              variant="contained"
              color="primary"
              startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                onClick={handleProcessLeads}
                disabled={selectedLeads.size === 0 || processing || leadDoc.status === 'processed'}
              >
                {processing ? 'Processing...' : 'Process Selected Leads'}
              </Button>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedLeads.size === leadDoc.results.length}
                      indeterminate={selectedLeads.size > 0 && selectedLeads.size < leadDoc.results.length}
                      onChange={() => {
                        if (selectedLeads.size === leadDoc.results.length) {
                          setSelectedLeads(new Set());
                        } else {
                          setSelectedLeads(new Set(leadDoc.results.map(b => b.id)));
                        }
                      }}
                      disabled={leadDoc.status === 'processed'}
                    />
                  </TableCell>
                  <TableCell>Business</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leadDoc.results
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((business) => (
                    <TableRow key={business.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedLeads.has(business.id)}
                          onChange={() => handleLeadSelection(business.id)}
                          disabled={leadDoc.status === 'processed'}
                        />
                      </TableCell>
                      <TableCell>
                        <Link
                          href={business.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          {business.name}
                          <OpenInNewIcon fontSize="small" />
                        </Link>
                      </TableCell>
                      <TableCell>
                        {business.location.address1}, {business.location.city}, {business.location.state} {business.location.zip_code}
                      </TableCell>
                      <TableCell>{business.phone}</TableCell>
                      <TableCell>
                        {business.rating}/5 ({business.review_count} reviews)
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={leadDoc.results.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </MotionCard>
    </MotionContainer>
  );
} 
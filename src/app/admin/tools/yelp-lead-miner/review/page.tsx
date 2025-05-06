'use client';

import { useEffect, useState } from 'react';
import { collection, query, getDocs, doc, updateDoc, orderBy, where, limit, startAfter } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { 
  Container,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Divider,
  Tabs,
  Tab,
  Badge,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/firebase/auth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';

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

interface YelpLead {
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
  searchTerm: string;
  searchLocation: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
  note: string;
  lastUpdated: string;
  actionBy?: {
    uid: string;
    email: string;
    timestamp: string;
  };
}

const LEADS_PER_PAGE = 1;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`status-tabpanel-${index}`}
      aria-labelledby={`status-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function YelpLeadReview() {
  const theme = useTheme();
  const { user } = useAuth();
  const [leads, setLeads] = useState<YelpLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<YelpLead['status']>('pending');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<YelpLead | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [statusCounts, setStatusCounts] = useState<Record<YelpLead['status'], number>>({
    pending: 0,
    accepted: 0,
    rejected: 0
  });

  const fetchStatusCounts = async () => {
    try {
      const statuses: YelpLead['status'][] = ['pending', 'accepted', 'rejected'];
      const counts: Record<YelpLead['status'], number> = {
        pending: 0,
        accepted: 0,
        rejected: 0
      };

      for (const status of statuses) {
        const q = query(
          collection(db, 'yelp-leads'),
          where('status', '==', status)
        );
        const querySnapshot = await getDocs(q);
        counts[status] = querySnapshot.size;
      }

      setStatusCounts(counts);
    } catch (err) {
      console.error('Error fetching status counts:', err);
    }
  };

  useEffect(() => {
    fetchStatusCounts();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    const statuses: YelpLead['status'][] = ['pending', 'accepted', 'rejected'];
    setStatusFilter(statuses[newValue]);
  };

  const fetchLeads = async (startAfterDoc = null) => {
    try {
      setLoading(true);
      let leadsQuery = query(
        collection(db, 'yelp-leads'),
        where('status', '==', statusFilter),
        orderBy('lastUpdated', 'desc'),
        limit(LEADS_PER_PAGE)
      );

      if (startAfterDoc) {
        leadsQuery = query(
          collection(db, 'yelp-leads'),
          where('status', '==', statusFilter),
          orderBy('lastUpdated', 'desc'),
          startAfter(startAfterDoc),
          limit(LEADS_PER_PAGE)
        );
      }
      
      const querySnapshot = await getDocs(leadsQuery);
      const leadsData = querySnapshot.docs.map(doc => ({
        ...doc.data()
      })) as YelpLead[];

      setLeads(leadsData);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setIsFirstPage(!startAfterDoc);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const handleStatusChange = async (lead: YelpLead, newStatus: YelpLead['status'], note: string = '') => {
    if (!user) return;

    try {
      const leadRef = doc(db, 'yelp-leads', lead.id);
      await updateDoc(leadRef, {
        status: newStatus,
        note: note,
        lastUpdated: new Date().toISOString(),
        actionBy: {
          uid: user.uid,
          email: user.email,
          timestamp: new Date().toISOString()
        }
      });

      // Refresh the leads list and status counts
      fetchLeads();
      fetchStatusCounts();
    } catch (err) {
      console.error('Error updating lead:', err);
      setError('Failed to update lead status');
    }
  };

  const openRejectDialog = (lead: YelpLead) => {
    setSelectedLead(lead);
    setRejectNote('');
    setRejectDialogOpen(true);
  };

  const handleReject = async () => {
    if (selectedLead) {
      await handleStatusChange(selectedLead, 'rejected', rejectNote);
      setRejectDialogOpen(false);
      setSelectedLead(null);
    }
  };

  const handleNextPage = () => {
    if (lastVisible) {
      fetchLeads(lastVisible);
    }
  };

  const handlePreviousPage = () => {
    fetchLeads(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Review Leads
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="status tabs"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                minWidth: 120,
                minHeight: 67,
                py: 2,
                '& .MuiBadge-badge': {
                  right: -12,
                  top: -12,
                  height: 24,
                  minWidth: 24,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  padding: '0 8px',
                  borderRadius: '12px'
                }
              }
            }}
          >
            <Tab 
              label={
                <Badge 
                  badgeContent={statusCounts.pending} 
                  color="primary"
                  sx={{ 
                    '& .MuiBadge-badge': {
                      backgroundColor: theme.palette.primary.main
                    }
                  }}
                >
                  Pending
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge 
                  badgeContent={statusCounts.accepted} 
                  color="success"
                  sx={{ 
                    '& .MuiBadge-badge': {
                      backgroundColor: theme.palette.success.main
                    }
                  }}
                >
                  Accepted
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge 
                  badgeContent={statusCounts.rejected} 
                  color="error"
                  sx={{ 
                    '& .MuiBadge-badge': {
                      backgroundColor: theme.palette.error.main
                    }
                  }}
                >
                  Rejected
                </Badge>
              } 
            />
          </Tabs>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {leads.map((lead) => (
        <MotionCard
          key={lead.id}
          sx={{
            mb: 4,
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
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                  {lead.name}
                </Typography>
                <Chip
                  label={lead.status}
                  color={
                    lead.status === 'accepted' ? 'success' :
                    lead.status === 'rejected' ? 'error' :
                    'default'
                  }
                  sx={{ 
                    textTransform: 'capitalize',
                    fontWeight: 500
                  }}
                />
              </Box>
            }
            action={
              <Tooltip title="View on Yelp">
                <IconButton 
                  href={lead.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ 
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1)
                    }
                  }}
                >
                  <OpenInNewIcon />
                </IconButton>
              </Tooltip>
            }
          />
          <CardContent>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3
            }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 3 }}>
                  {lead.location.address1}
                </Typography>
                <Typography variant="body1" sx={{ ml: 3 }}>
                  {lead.location.city}, {lead.location.state} {lead.location.zip_code}
                </Typography>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Contact
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 3 }}>
                  {lead.phone}
                </Typography>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <StarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Rating
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 3 }}>
                  {lead.rating}/5 ({lead.review_count} reviews)
                </Typography>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Search Details
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 3 }}>
                  Term: {lead.searchTerm}
                </Typography>
                <Typography variant="body1" sx={{ ml: 3 }}>
                  Location: {lead.searchLocation}
                </Typography>
              </Box>
              {lead.note && (
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Note
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ ml: 3 }}>
                    {lead.note}
                  </Typography>
                </Box>
              )}
              {lead.actionBy && (
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Action Taken By
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ ml: 3 }}>
                    {lead.actionBy.email} on {new Date(lead.actionBy.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
          {lead.status === 'pending' && (
            <CardActions sx={{ p: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => handleStatusChange(lead, 'accepted')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 2
                }}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => openRejectDialog(lead)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 2
                }}
              >
                Reject
              </Button>
            </CardActions>
          )}
        </MotionCard>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<NavigateBeforeIcon />}
          onClick={handlePreviousPage}
          disabled={isFirstPage}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 2
          }}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          endIcon={<NavigateNextIcon />}
          onClick={handleNextPage}
          disabled={!lastVisible || leads.length < LEADS_PER_PAGE}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 2
          }}
        >
          Next
        </Button>
      </Box>

      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle>Reject Lead</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Note"
            fullWidth
            multiline
            rows={4}
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            variant="outlined"
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setRejectDialogOpen(false)}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2
            }}
          >
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>
    </MotionContainer>
  );
} 
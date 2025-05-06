'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { 
  Container, 
  Paper, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  AlertTitle,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Tabs,
  Tab,
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import ListAltIcon from '@mui/icons-material/ListAlt';
import YelpLeadImportZone from '@/components/YelpLeadImportZone';

const MotionPaper = motion.create(Paper);
const MotionContainer = motion.create(Container);
const MotionCard = motion.create(Card);

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

interface SearchStats {
  added: number;
  updated: number;
}

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
      id={`import-tabpanel-${index}`}
      aria-labelledby={`import-tab-${index}`}
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

export default function YelpLeadMiner() {
  const theme = useTheme();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [limit, setLimit] = useState('5');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<SearchStats | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError('');
      setStats(null);

      // Validate limit
      const numLimit = parseInt(limit);
      if (isNaN(numLimit) || numLimit < 1 || numLimit > 50) {
        setError('Limit must be between 1 and 50');
        return;
      }

      const response = await fetch(`/api/yelp?term=${encodeURIComponent(searchTerm)}&location=${encodeURIComponent(location)}&limit=${numLimit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();
      const stats: SearchStats = { added: 0, updated: 0 };
      
      // Process each business
      for (const business of data.businesses) {
        const yelpLeadRef = doc(db, 'yelp-leads', business.id);
        const businessData = {
          id: business.id,
          name: business.name,
          url: business.url,
          phone: business.phone || '',
          rating: business.rating || 0,
          review_count: business.review_count || 0,
          location: {
            address1: business.location?.address1 || '',
            city: business.location?.city || '',
            state: business.location?.state || '',
            zip_code: business.location?.zip_code || '',
          },
          searchTerm,
          searchLocation: location,
          createdAt: new Date().toISOString(),
          status: 'pending',
          note: '',
          lastUpdated: new Date().toISOString()
        };

        // Check if document exists
        const docSnap = await getDocs(query(collection(db, 'yelp-leads'), where('id', '==', business.id)));
        
        if (docSnap.empty) {
          await setDoc(yelpLeadRef, businessData);
          stats.added++;
        } else {
          await setDoc(yelpLeadRef, {
            ...businessData,
            createdAt: docSnap.docs[0].data().createdAt // Preserve original creation date
          });
          stats.updated++;
        }
      }

      setStats(stats);
      
      // Wait a moment to show the stats before redirecting
      setTimeout(() => {
        router.push('/admin/tools/yelp-lead-miner/review');
      }, 2000);

    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileImport = async (file: File) => {
    try {
      const text = await file.text();
      const leads = JSON.parse(text);

      if (!Array.isArray(leads)) {
        throw new Error('Invalid file format. Expected an array of leads.');
      }

      let added = 0;
      let updated = 0;

      for (const lead of leads) {
        if (!lead.id || !lead.name) {
          throw new Error('Invalid lead format. Each lead must have an id and name.');
        }

        const yelpLeadRef = doc(db, 'yelp-leads', lead.id);
        const leadData = {
          ...lead,
          status: 'pending',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };

        // Check if document exists
        const docSnap = await getDocs(query(collection(db, 'yelp-leads'), where('id', '==', lead.id)));
        
        if (docSnap.empty) {
          await setDoc(yelpLeadRef, leadData);
          added++;
        } else {
          await setDoc(yelpLeadRef, {
            ...leadData,
            createdAt: docSnap.docs[0].data().createdAt // Preserve original creation date
          });
          updated++;
        }
      }

      setImportSuccess(`Successfully imported ${added} new leads and updated ${updated} existing leads.`);
      setImportError(null);

      // Redirect to review page after a short delay
      setTimeout(() => {
        router.push('/admin/tools/yelp-lead-miner/review');
      }, 2000);

    } catch (err) {
      console.error('Import error:', err);
      setImportError(err instanceof Error ? err.message : 'Failed to import leads');
      setImportSuccess(null);
    }
  };

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
          borderRadius: 4,
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
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Yelp Lead Miner
            </Typography>
          }
          subheader={
            <Typography variant="subtitle1" color="text.secondary">
              Search and collect business leads from Yelp
            </Typography>
          }
          action={
            <Tooltip title="View Existing Leads">
              <IconButton 
                onClick={() => router.push('/admin/tools/yelp-lead-miner/review')}
                sx={{ 
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                  }
                }}
              >
                <ListAltIcon />
              </IconButton>
            </Tooltip>
          }
        />
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="import tabs">
              <Tab label="Search Yelp" />
              <Tab label="Import Leads" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Box component="form" sx={{ mt: 2 }}>
              <Box sx={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                '& > *': {
                  flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' }
                }
              }}>
                <Box>
                  <MotionPaper
                    variants={itemVariants}
                    sx={{ p: 3 }}
                  >
                  <TextField
                    fullWidth
                    label="Search Term"
                    placeholder="e.g., restaurants, plumbers, dentists"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        '&:hover': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          }
                        }
                      }
                    }}
                  />
                  </MotionPaper>
                </Box>
                <Box>
                  <MotionPaper
                    variants={itemVariants}
                    sx={{ p: 3 }}
                  >
                  <TextField
                    fullWidth
                    label="Location"
                    placeholder="e.g., New York, NY"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        '&:hover': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          }
                        }
                      }
                    }}
                  />
                  </MotionPaper>
                </Box>
                <Box>
                  <MotionPaper
                    variants={itemVariants}
                    sx={{ p: 3 }}
                  >
                  <TextField
                    fullWidth
                    label="Limit"
                    type="number"
                    inputProps={{ min: 1, max: 50 }}
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        '&:hover': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          }
                        }
                      }
                    }}
                  />
                  </MotionPaper>
                </Box>
              </Box>

                {error && (
                <Box sx={{ mt: 3 }}>
                  <MotionPaper
                    variants={itemVariants}
                    sx={{ p: 3 }}
                  >
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                      <AlertTitle>Error</AlertTitle>
                      {error}
                    </Alert>
                  </MotionPaper>
                </Box>
                )}

                {stats && (
                <Box sx={{ mt: 3 }}>
                  <MotionPaper
                    variants={itemVariants}
                    sx={{ p: 3 }}
                  >
                    <Alert severity="success" sx={{ borderRadius: 2 }}>
                      Added {stats.added} new leads and updated {stats.updated} existing leads.
                    </Alert>
                  </MotionPaper>
                </Box>
                )}

              <Box sx={{ mt: 3 }}>
                <MotionPaper
                  variants={itemVariants}
                  sx={{ p: 3 }}
                >
                  <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={loading || !searchTerm || !location}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                    fullWidth
                    sx={{
                      height: 48,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                      }
                    }}
                  >
                    {loading ? 'Searching...' : 'Search Yelp'}
                  </Button>
                </MotionPaper>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mt: 2 }}>

              {importError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {importError}
                </Alert>
              )}

              {importSuccess && (
                <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                  {importSuccess}
                </Alert>
              )}

              <YelpLeadImportZone onFileAcceptedAction={handleFileImport} />
            </Box>
          </TabPanel>
        </CardContent>
      </MotionCard>
    </MotionContainer>
  );
} 
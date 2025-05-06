'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Button,
  Tabs,
  Tab,
  Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import { motion } from 'framer-motion';
import Papa from 'papaparse';

interface YelpLeadImportZoneProps {
  onFileAcceptedAction: (file: File) => Promise<void>;
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

export default function YelpLeadImportZone({ onFileAcceptedAction }: YelpLeadImportZoneProps) {
  const theme = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const isJson = file.type === 'application/json';
    const isCsv = file.type === 'text/csv' || file.name.endsWith('.csv');

    if (!isJson && !isCsv) {
      setError('Please upload a JSON or CSV file');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      if (isJson) {
        await onFileAcceptedAction(file);
      } else if (isCsv) {
        const text = await file.text();
        Papa.parse(text, {
          header: true,
          complete: async (results) => {
            if (results.errors.length > 0) {
              throw new Error('Error parsing CSV file');
            }

            // Convert CSV data to JSON format
            const leads = results.data.map((row: any) => ({
              id: row.id || Math.random().toString(36).substr(2, 9),
              name: row.name || row.business_name || row.business,
              url: row.url || row.yelp_url || '',
              phone: row.phone || row.phone_number || '',
              rating: parseFloat(row.rating) || 0,
              review_count: parseInt(row.review_count) || 0,
              location: {
                address1: row.address || row.address1 || '',
                city: row.city || '',
                state: row.state || '',
                zip_code: row.zip || row.zip_code || ''
              },
              searchTerm: row.search_term || '',
              searchLocation: row.search_location || ''
            }));

            // Create a new file with the converted data
            const jsonBlob = new Blob([JSON.stringify(leads)], { type: 'application/json' });
            const jsonFile = new File([jsonBlob], 'converted.json', { type: 'application/json' });
            await onFileAcceptedAction(jsonFile);
          }
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  }, [onFileAcceptedAction]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="import tabs"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              minWidth: 120
            }
          }}
        >
          <Tab label="JSON" icon={<DescriptionIcon />} />
          <Tab label="CSV" icon={<TableChartIcon />} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <div {...getRootProps()}>
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: `2px dashed ${isDragActive ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 2,
                backgroundColor: isDragActive ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                transition: 'all 0.2s ease-in-out',
                cursor: isProcessing ? 'default' : 'pointer',
                '&:hover': {
                  backgroundColor: !isProcessing ? alpha(theme.palette.primary.main, 0.05) : undefined,
                  borderColor: !isProcessing ? theme.palette.primary.main : undefined
                }
              }}
            >
              <input {...getInputProps()} />
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap={2}
              >
                {isProcessing ? (
                  <>
                    <CircularProgress />
                    <Typography variant="body1" color="text.secondary">
                      Processing file...
                    </Typography>
                  </>
                ) : (
                  <>
                    {isDragActive ? (
                      <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                    ) : (
                      <DescriptionIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                    )}
                    <Typography variant="h6" component="div" textAlign="center">
                      {isDragActive ? 'Drop your file here' : 'Drag & drop a JSON file here'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      or click to browse files
                    </Typography>
                    <Typography variant="caption" color="text.secondary" textAlign="center">
                      Only JSON files are accepted
                    </Typography>
                  </>
                )}
              </Box>
            </Paper>
          </motion.div>
        </div>

        <Paper 
          variant="outlined" 
          sx={{ 
            p: 2, 
            mt: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 2
          }}
        >
          <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
            {`[
  {
    "id": "unique-id",
    "name": "Business Name",
    "url": "Yelp URL",
    "phone": "Phone Number",
    "rating": 4.5,
    "review_count": 100,
    "location": {
      "address1": "Street Address",
      "city": "City",
      "state": "State",
      "zip_code": "ZIP"
    }
  }
]`}
          </Typography>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <div {...getRootProps()}>
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: `2px dashed ${isDragActive ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 2,
                backgroundColor: isDragActive ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                transition: 'all 0.2s ease-in-out',
                cursor: isProcessing ? 'default' : 'pointer',
                '&:hover': {
                  backgroundColor: !isProcessing ? alpha(theme.palette.primary.main, 0.05) : undefined,
                  borderColor: !isProcessing ? theme.palette.primary.main : undefined
                }
              }}
            >
              <input {...getInputProps()} />
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap={2}
              >
                {isProcessing ? (
                  <>
                    <CircularProgress />
                    <Typography variant="body1" color="text.secondary">
                      Processing file...
                    </Typography>
                  </>
                ) : (
                  <>
                    {isDragActive ? (
                      <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                    ) : (
                      <TableChartIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                    )}
                    <Typography variant="h6" component="div" textAlign="center">
                      {isDragActive ? 'Drop your file here' : 'Drag & drop a CSV file here'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      or click to browse files
                    </Typography>
                    <Typography variant="caption" color="text.secondary" textAlign="center">
                      Only CSV files are accepted
                    </Typography>
                  </>
                )}
              </Box>
            </Paper>
          </motion.div>
        </div>

        <Paper 
          variant="outlined" 
          sx={{ 
            p: 2, 
            mt: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 2
          }}
        >
          <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
            {`id,name,url,phone,rating,review_count,address,city,state,zip,search_term,search_location
unique-id,Business Name,Yelp URL,Phone Number,4.5,100,Street Address,City,State,ZIP,Search Term,Search Location`}
          </Typography>
        </Paper>
      </TabPanel>

      {error && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
} 
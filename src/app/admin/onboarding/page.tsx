'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  FormControlLabel, 
  Checkbox, 
  Button, 
  Alert
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/AuthContext';

// Define the onboarding sections
const onboardingSections = [
  {
    id: 'business-info',
    title: 'Business Information',
    description: 'Basic business details, contact information, and company profile'
  },
  {
    id: 'social-platforms',
    title: 'Social Media Platforms',
    description: 'Social media account setup and management'
  },
  {
    id: 'social-content',
    title: 'Social Media Content',
    description: 'Content strategy and posting guidelines'
  },
  {
    id: 'paid-ads',
    title: 'Paid Advertising',
    description: 'Advertising platform setup and campaign management'
  },
  {
    id: 'email-marketing',
    title: 'Email Marketing',
    description: 'Email marketing platform setup and strategy'
  },
  {
    id: 'blog-content',
    title: 'Blog Content',
    description: 'Blog setup and content strategy'
  }
];

export default function ClientOnboardingPage() {
  const router = useRouter();
  const { role } = useAuth();
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  // Redirect if not admin
  if (role !== 'admin') {
    router.push('/');
    return null;
  }

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSubmit = async () => {
    if (selectedSections.length === 0) {
      setError('Please select at least one onboarding section');
      return;
    }

    try {
      // TODO: Implement the logic to send onboarding sections to the client
      console.log('Selected sections:', selectedSections);
      router.push('/admin');
    } catch (error) {
      setError('Failed to send onboarding sections. Please try again.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Client Onboarding
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Select the onboarding sections you want to send to the client
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          '& > *': {
            flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
            minWidth: { xs: '100%', md: 'calc(50% - 12px)' }
          }
        }}
      >
        {onboardingSections.map((section) => (
          <Card 
            key={section.id}
            sx={{ 
              height: '100%',
              border: selectedSections.includes(section.id) 
                ? '2px solid' 
                : '1px solid',
              borderColor: selectedSections.includes(section.id)
                ? 'primary.main'
                : 'divider',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: (theme) => `0 0 0 1px ${theme.palette.primary.main}`,
              }
            }}
          >
            <CardContent>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedSections.includes(section.id)}
                    onChange={() => handleSectionToggle(section.id)}
                    sx={{ 
                      '& .MuiSvgIcon-root': { 
                        fontSize: 28 
                      } 
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="h6" component="div" gutterBottom>
                      {section.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {section.description}
                    </Typography>
                  </Box>
                }
                sx={{ 
                  width: '100%',
                  m: 0,
                  '& .MuiFormControlLabel-label': {
                    width: '100%'
                  }
                }}
              />
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => router.push('/admin')}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={selectedSections.length === 0}
        >
          Send Onboarding
        </Button>
      </Box>
    </Container>
  );
} 
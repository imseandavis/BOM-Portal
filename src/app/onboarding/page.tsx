'use client';

import { Box, Container, Typography } from '@mui/material';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';

export default function OnboardingPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Our Service Onboarding
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Please complete the following sections to help us better understand your business needs.
        </Typography>
        <OnboardingWizard />
      </Box>
    </Container>
  );
} 
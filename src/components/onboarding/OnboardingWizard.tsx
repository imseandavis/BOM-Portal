'use client';

import { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import BusinessInformation from './sections/BusinessInformation';
import SocialPlatforms from './sections/SocialPlatforms';
import SocialMediaContent from './sections/SocialMediaContent';
import BlogContent from './sections/BlogContent';
import EmailMarketing from './sections/EmailMarketing';
import PaidAds from './sections/PaidAds';

const steps = [
  'Business Information',
  'Social Platforms',
  'Social Media Content',
  'Blog Content',
  'Email Marketing',
  'Paid Ads',
];

export default function OnboardingWizard() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <BusinessInformation />;
      case 1:
        return <SocialPlatforms />;
      case 2:
        return <SocialMediaContent />;
      case 3:
        return <BlogContent />;
      case 4:
        return <EmailMarketing />;
      case 5:
        return <PaidAds />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3, mb: 3 }}>
        {renderStepContent(activeStep)}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
} 
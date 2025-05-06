'use client';

import { useState } from 'react';
import { Box, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';

export default function EmailMarketing() {
  const [formData, setFormData] = useState({
    emailTypes: '',
    emailFrequency: '',
    brandGuidelines: '',
    competitorEmails: '',
    successfulCampaigns: '',
  });

  const [selectedEmailTypes, setSelectedEmailTypes] = useState<string[]>([]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Email Marketing
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Types of Emails
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Select Email Types</InputLabel>
            <Select
              multiple
              value={selectedEmailTypes}
              onChange={(event) => setSelectedEmailTypes(event.target.value as string[])}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              <MenuItem value="newsletter">Newsletter</MenuItem>
              <MenuItem value="promotional">Promotional</MenuItem>
              <MenuItem value="educational">Educational</MenuItem>
              <MenuItem value="product-updates">Product Updates</MenuItem>
              <MenuItem value="event-invitations">Event Invitations</MenuItem>
              <MenuItem value="welcome-series">Welcome Series</MenuItem>
              <MenuItem value="abandoned-cart">Abandoned Cart</MenuItem>
              <MenuItem value="re-engagement">Re-engagement</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            multiline
            rows={2}
            value={formData.emailTypes}
            onChange={handleChange('emailTypes')}
            placeholder="Additional email types or specific requirements"
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Email Frequency
          </Typography>
          <TextField
            fullWidth
            value={formData.emailFrequency}
            onChange={handleChange('emailFrequency')}
            placeholder="e.g., Weekly newsletter, Monthly promotions"
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Brand Guidelines and Templates
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={formData.brandGuidelines}
            onChange={handleChange('brandGuidelines')}
            placeholder="Do you have brand guidelines or templates we should follow?"
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Competitor Email Examples
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={formData.competitorEmails}
            onChange={handleChange('competitorEmails')}
            placeholder="Are there competitors or brands whose emails you like? Why?"
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Successful Campaigns
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={formData.successfulCampaigns}
            onChange={handleChange('successfulCampaigns')}
            placeholder="What are some past subject lines or campaigns that worked well?"
          />
        </Box>
      </Box>
    </Box>
  );
} 
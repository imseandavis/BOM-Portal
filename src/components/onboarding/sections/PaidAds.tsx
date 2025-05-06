'use client';

import { useState } from 'react';
import { Box, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';

export default function PaidAds() {
  const [formData, setFormData] = useState({
    adPlatforms: '',
    targetAudience: '',
    budgetAllocation: '',
    campaignObjectives: '',
    keyMessages: '',
    competitorAds: '',
    successMetrics: '',
    creativeGuidelines: '',
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Paid Advertising
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Advertising Platforms
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Select Platforms</InputLabel>
            <Select
              multiple
              value={selectedPlatforms}
              onChange={(event) => setSelectedPlatforms(event.target.value as string[])}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              <MenuItem value="google-ads">Google Ads</MenuItem>
              <MenuItem value="facebook-ads">Facebook Ads</MenuItem>
              <MenuItem value="instagram-ads">Instagram Ads</MenuItem>
              <MenuItem value="linkedin-ads">LinkedIn Ads</MenuItem>
              <MenuItem value="twitter-ads">Twitter Ads</MenuItem>
              <MenuItem value="tiktok-ads">TikTok Ads</MenuItem>
              <MenuItem value="youtube-ads">YouTube Ads</MenuItem>
              <MenuItem value="display-ads">Display Ads</MenuItem>
              <MenuItem value="native-ads">Native Ads</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Target Audience
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={formData.targetAudience}
            onChange={handleChange('targetAudience')}
            placeholder="Describe your target audience demographics, interests, and behaviors"
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Budget Allocation
          </Typography>
          <TextField
            fullWidth
            value={formData.budgetAllocation}
            onChange={handleChange('budgetAllocation')}
            placeholder="Monthly budget and how it should be allocated across platforms"
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Campaign Objectives
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Select Objectives</InputLabel>
            <Select
              multiple
              value={selectedObjectives}
              onChange={(event) => setSelectedObjectives(event.target.value as string[])}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              <MenuItem value="brand-awareness">Brand Awareness</MenuItem>
              <MenuItem value="lead-generation">Lead Generation</MenuItem>
              <MenuItem value="sales">Sales</MenuItem>
              <MenuItem value="traffic">Website Traffic</MenuItem>
              <MenuItem value="engagement">Engagement</MenuItem>
              <MenuItem value="app-installs">App Installs</MenuItem>
              <MenuItem value="video-views">Video Views</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Key Messages
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={formData.keyMessages}
            onChange={handleChange('keyMessages')}
            placeholder="What are the key messages you want to communicate in your ads?"
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Competitor Ads
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={formData.competitorAds}
            onChange={handleChange('competitorAds')}
            placeholder="Are there competitor ads you like or want to avoid? Why?"
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Success Metrics
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={formData.successMetrics}
            onChange={handleChange('successMetrics')}
            placeholder="What metrics will determine the success of your campaigns?"
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Creative Guidelines
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={formData.creativeGuidelines}
            onChange={handleChange('creativeGuidelines')}
            placeholder="Any specific creative guidelines or brand elements that must be included?"
          />
        </Box>
      </Box>
    </Box>
  );
} 
'use client';

import { useState } from 'react';
import { Box, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';

export default function SocialMediaContent() {
  const [formData, setFormData] = useState({
    topicsOfInterest: '',
    frequencyPerPlatform: '',
    socialPostInstructions: '',
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleTopicAdd = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && formData.topicsOfInterest.trim()) {
      setTopics([...topics, formData.topicsOfInterest.trim()]);
      setFormData({ ...formData, topicsOfInterest: '' });
      event.preventDefault();
    }
  };

  const handleTopicDelete = (topicToDelete: string) => () => {
    setTopics(topics.filter((topic) => topic !== topicToDelete));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Social Media Content
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Topics of Interest
          </Typography>
          <TextField
            fullWidth
            value={formData.topicsOfInterest}
            onChange={handleChange('topicsOfInterest')}
            onKeyDown={handleTopicAdd}
            placeholder="Type a topic and press Enter"
          />
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {topics.map((topic) => (
              <Chip
                key={topic}
                label={topic}
                onDelete={handleTopicDelete(topic)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Frequency Per Platform
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
              <MenuItem value="facebook">Facebook</MenuItem>
              <MenuItem value="instagram">Instagram</MenuItem>
              <MenuItem value="twitter">Twitter</MenuItem>
              <MenuItem value="linkedin">LinkedIn</MenuItem>
              <MenuItem value="tiktok">TikTok</MenuItem>
              <MenuItem value="youtube">YouTube</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            label="Posting Frequency"
            value={formData.frequencyPerPlatform}
            onChange={handleChange('frequencyPerPlatform')}
            placeholder="e.g., 3 posts per week on Facebook, 1 post daily on Instagram"
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Social Post Instructions
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={formData.socialPostInstructions}
            onChange={handleChange('socialPostInstructions')}
            placeholder="Enter instructions about tone, voice, emojis, themes, etc."
          />
        </Box>
      </Box>
    </Box>
  );
} 
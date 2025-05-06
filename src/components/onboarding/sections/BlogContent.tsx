'use client';

import { useState } from 'react';
import { Box, TextField, Typography, Chip } from '@mui/material';

export default function BlogContent() {
  const [formData, setFormData] = useState({
    blogPostInstructions: '',
    postFrequency: '',
    importantTopics: '',
    keywords: '',
    toneAndStyle: '',
    callToAction: '',
  });

  const [keywords, setKeywords] = useState<string[]>([]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleKeywordAdd = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && formData.keywords.trim()) {
      setKeywords([...keywords, formData.keywords.trim()]);
      setFormData({ ...formData, keywords: '' });
      event.preventDefault();
    }
  };

  const handleKeywordDelete = (keywordToDelete: string) => () => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToDelete));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Blog Content
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Blog Post Instructions
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={formData.blogPostInstructions}
            onChange={handleChange('blogPostInstructions')}
            placeholder="Enter specific instructions for blog post creation"
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Post Frequency
          </Typography>
          <TextField
            fullWidth
            value={formData.postFrequency}
            onChange={handleChange('postFrequency')}
            placeholder="e.g., 2 posts per week"
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Important Topics for Your Audience
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={formData.importantTopics}
            onChange={handleChange('importantTopics')}
            placeholder="What topics are most important to your audience?"
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Keywords and SEO Focus Areas
          </Typography>
          <TextField
            fullWidth
            value={formData.keywords}
            onChange={handleChange('keywords')}
            onKeyDown={handleKeywordAdd}
            placeholder="Type keywords and press Enter"
          />
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {keywords.map((keyword) => (
              <Chip
                key={keyword}
                label={keyword}
                onDelete={handleKeywordDelete(keyword)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Preferred Tone and Style
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={formData.toneAndStyle}
            onChange={handleChange('toneAndStyle')}
            placeholder="Describe your preferred writing style and tone"
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Call-to-Action (CTA) Requirements
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={formData.callToAction}
            onChange={handleChange('callToAction')}
            placeholder="What CTAs should be included in each blog post?"
          />
        </Box>
      </Box>
    </Box>
  );
} 
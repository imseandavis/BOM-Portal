'use client';

import { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';

export default function SocialPlatforms() {
  const [formData, setFormData] = useState({
    googleMyBusiness: '',
    linkedIn: '',
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    yelp: '',
    betterBusinessBureau: '',
    tiktok: '',
    linkInBio: '',
    blog: '',
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Social Platforms
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <TextField
            sx={{ flex: 1, minWidth: 300 }}
            label="Google My Business"
            value={formData.googleMyBusiness}
            onChange={handleChange('googleMyBusiness')}
            placeholder="https://g.page/your-business"
          />
          <TextField
            sx={{ flex: 1, minWidth: 300 }}
            label="LinkedIn"
            value={formData.linkedIn}
            onChange={handleChange('linkedIn')}
            placeholder="https://linkedin.com/company/your-business"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <TextField
            sx={{ flex: 1, minWidth: 300 }}
            label="Facebook"
            value={formData.facebook}
            onChange={handleChange('facebook')}
            placeholder="https://facebook.com/your-business"
          />
          <TextField
            sx={{ flex: 1, minWidth: 300 }}
            label="Instagram"
            value={formData.instagram}
            onChange={handleChange('instagram')}
            placeholder="https://instagram.com/your-business"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <TextField
            sx={{ flex: 1, minWidth: 300 }}
            label="X (Twitter)"
            value={formData.twitter}
            onChange={handleChange('twitter')}
            placeholder="https://twitter.com/your-business"
          />
          <TextField
            sx={{ flex: 1, minWidth: 300 }}
            label="YouTube"
            value={formData.youtube}
            onChange={handleChange('youtube')}
            placeholder="https://youtube.com/your-business"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <TextField
            sx={{ flex: 1, minWidth: 300 }}
            label="Yelp"
            value={formData.yelp}
            onChange={handleChange('yelp')}
            placeholder="https://yelp.com/biz/your-business"
          />
          <TextField
            sx={{ flex: 1, minWidth: 300 }}
            label="Better Business Bureau"
            value={formData.betterBusinessBureau}
            onChange={handleChange('betterBusinessBureau')}
            placeholder="https://bbb.org/your-business"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <TextField
            sx={{ flex: 1, minWidth: 300 }}
            label="TikTok"
            value={formData.tiktok}
            onChange={handleChange('tiktok')}
            placeholder="https://tiktok.com/@your-business"
          />
          <TextField
            sx={{ flex: 1, minWidth: 300 }}
            label="Link In Bio"
            value={formData.linkInBio}
            onChange={handleChange('linkInBio')}
            placeholder="https://linktr.ee/your-business"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <TextField
            sx={{ flex: 1, minWidth: 300 }}
            label="Blog"
            value={formData.blog}
            onChange={handleChange('blog')}
            placeholder="https://your-business.com/blog"
          />
        </Box>
      </Box>
    </Box>
  );
} 
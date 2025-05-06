'use client';

import { Box, Typography, Button, Container } from '@mui/material';
import Image from 'next/image';
import { useTheme } from '@mui/material/styles';

export default function Home() {
  const theme = useTheme();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" sx={{ mb: 4 }}>
          Welcome to the Admin Portal
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 6, maxWidth: 600 }}>
          Manage your content, users, and analytics from one central location
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
          }}
        >
          <Button
            variant="contained"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              borderRadius: '9999px',
              textTransform: 'none',
              px: 3,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Image
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
              style={{
                filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none',
              }}
            />
            Deploy now
          </Button>
          <Button
            variant="outlined"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              borderRadius: '9999px',
              textTransform: 'none',
              px: 3,
              py: 1.5,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Read our docs
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthActions } from '@/lib/firebase/useAuthActions';
import { Alert, Box, Card, CardContent, Typography, Divider, Container, alpha, Button, TextField } from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion.create(Card);
const MotionBox = motion.create(Box);

// Google button colors according to guidelines
const googleColors = {
  default: '#fff',
  hover: '#f8f9fa',
  active: '#e8e8e9',
  border: '#dadce0',
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, signInWithGoogle } = useAuthActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/admin');
    } catch {
      setError('Invalid email or password');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/admin');
    } catch {
      setError('Failed to sign in with Google');
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        sx={{
          maxWidth: 450,
          width: '100%',
          overflow: 'visible',
          background: (theme) => alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(20px)',
          boxShadow: (theme) => `0 0 24px ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <MotionBox
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
              }}
            >
              <LockIcon sx={{ color: 'white' }} />
            </Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Sign in to access your admin dashboard
            </Typography>
          </MotionBox>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': { alignItems: 'center' }
                }}
              >
                {error}
              </Alert>
            )}

            <TextField
              id="email"
              label="Email address"
              type="email"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              id="password"
              label="Password"
              type="password"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              sx={{ mb: 2 }}
            >
              Sign In
            </Button>

            <Box sx={{ my: 3 }}>
              <Divider>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ px: 2, py: 1 }}
                >
                  Or continue with
                </Typography>
              </Divider>
            </Box>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleSignIn}
              startIcon={
                <Box
                  component="img"
                  src="https://developers.google.com/identity/images/g-logo.png"
                  sx={{
                    width: 18,
                    height: 18,
                    mr: 2,
                  }}
                  alt="Google logo"
                />
              }
              sx={{
                mb: 2,
                backgroundColor: googleColors.default,
                borderColor: googleColors.border,
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: googleColors.hover,
                  borderColor: googleColors.border,
                },
                '&:active': {
                  backgroundColor: googleColors.active,
                },
              }}
            >
              Sign in with Google
            </Button>
          </form>
        </CardContent>
      </MotionCard>
    </Container>
  );
} 
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { Button, Container, Typography, Box, Alert } from '@mui/material';

export default function SetAdminPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSetAdmin = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/auth/set-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: user.uid }),
      });

      if (!response.ok) {
        throw new Error('Failed to set admin role');
      }

      setSuccess(true);
      // Force token refresh to get new claims
      await user.getIdToken(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Set Admin Role
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Admin role set successfully! Please refresh the page to see the changes.
          </Alert>
        )}

        <Button
          variant="contained"
          onClick={handleSetAdmin}
          disabled={loading || !user}
          sx={{ mt: 2 }}
        >
          {loading ? 'Setting Admin Role...' : 'Set Admin Role'}
        </Button>
      </Box>
    </Container>
  );
} 
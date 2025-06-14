import React from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { ShoppingCart, Description } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout/Layout';

export default function HomePage() {
  const router = useRouter();
  const { currentUser } = useAuth();

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            textAlign: 'center',
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to HireDesk
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Your digital equipment rental platform
          </Typography>

          {currentUser ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Welcome back, {currentUser.displayName || currentUser.email}!
              </Typography>
              <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 600 }}>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <ShoppingCart sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Browse Equipment
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Explore our extensive catalog of rental equipment
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => router.push('/equipment')}
                      >
                        View Catalog
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <Description sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        My Quotes
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        View and manage your rental quotes
                      </Typography>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => router.push('/quotes')}
                      >
                        View Quotes
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/login')}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push('/register')}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Layout>
  );
} 
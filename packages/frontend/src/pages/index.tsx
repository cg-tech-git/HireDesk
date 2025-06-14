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
  Paper,
  Divider,
} from '@mui/material';
import { ShoppingCart, Description } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout/Layout';
import { mockBrands } from '@/lib/mockData';

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

        {/* Brands Section */}
        <Box sx={{ py: 8 }}>
          <Divider sx={{ mb: 6 }} />
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Trusted Equipment Brands
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 6 }}>
            We partner with world-leading manufacturers to provide you with the best equipment
          </Typography>
          
          <Grid container spacing={3} justifyContent="center">
            {mockBrands.map((brand) => (
              <Grid item xs={6} sm={4} md={3} key={brand.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'grey.50',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                      backgroundColor: 'background.paper',
                    },
                  }}
                  onClick={() => router.push(`/equipment?brand=${brand.name}`)}
                >
                  <Box
                    sx={{
                      width: 120,
                      height: 80,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        filter: 'grayscale(100%)',
                        opacity: 0.7,
                        transition: 'all 0.3s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.filter = 'grayscale(0%)';
                        e.currentTarget.style.opacity = '1';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.filter = 'grayscale(100%)';
                        e.currentTarget.style.opacity = '0.7';
                      }}
                    />
                  </Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {brand.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" align="center">
                    {brand.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
} 
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Grid,
} from '@mui/material';
import { Search, ArrowForward } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout/Layout';
import { mockBrands } from '@/lib/mockData';

export default function HomePage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/equipment?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const cardTitles = [
    'Aerial Work Platforms',
    'Temporary Facilities', 
    'Site Mobility',
    'Temporary Infrastructure',
    'Power Generation',
    'Material Handling',
    'Safety Equipment',
    'Testing & Monitoring'
  ];

  return (
    <Layout>
      <Box
        sx={{
          backgroundColor: 'white',
          color: 'black',
          pb: 4,
          mx: -3, // Negative margin to counteract Layout's padding
        }}
      >
        <Container maxWidth={false} disableGutters sx={{ px: 3 }}>
          <Box sx={{ textAlign: 'center', pt: 2, pb: 4 }}>
            <Typography 
              variant="h6" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 400,
                fontSize: '2.2rem',
                background: 'linear-gradient(15deg, #0b162b, #0d223e, #0e3053, #0e4169, #0c5680, #097098, #058eb1, #00b1cc)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
              }}
            >
              Welcome to Al Laith Projects Services
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.7 }}>
              Search from our wide range of project equipment and temporary infrastucture available for hire
            </Typography>
          </Box>
          
          <Box 
            component="form" 
            onSubmit={handleSearch} 
            sx={{ 
              maxWidth: 800, 
              mx: 'auto',
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for equipment (e.g., excavator, generator, forklift...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                backgroundColor: 'grey.50',
                borderRadius: '30px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '30px',
                  '& fieldset': {
                    borderColor: 'grey.300',
                    borderRadius: '30px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'grey.400',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                    borderRadius: '30px',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="submit"
                      sx={{
                        backgroundColor: '#64B5F6',
                        color: 'white',
                        width: 40,
                        height: 40,
                        '&:hover': {
                          backgroundColor: '#42A5F5',
                        },
                      }}
                    >
                      <ArrowForward />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: 'white', minHeight: '100vh', mx: -3 }}>
        <Container maxWidth={false} disableGutters sx={{ px: 3 }}>
          {/* Brands Section */}
          <Box sx={{ py: 4, pt: 1 }}>

            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
              {mockBrands.slice(0, 4).map((brand, index) => (
                <Paper
                  key={brand.id}
                  elevation={0}
                  sx={{
                    p: index <= 3 ? 0 : 3,
                    width: { xs: '45%', sm: '30%', md: '22%' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    backgroundColor: 'grey.50',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                      backgroundColor: 'background.paper',
                    },
                  }}
                  onClick={() => router.push(`/equipment?brand=${brand.name}`)}
                >
                  {index <= 3 ? (
                    <>
                      <Box
                        sx={{
                          width: '100%',
                          height: 120,
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'center',
                          mt: 0,
                          pt: 0,
                        }}
                      >
                        <img
                          src={
                            index === 0 ? "/images/brands/pa banner.png" : 
                            index === 1 ? "/images/brands/cabins-Photoroom.png" : 
                            index === 2 ? "/images/brands/golfcart.png" :
                            "/images/brands/tempinfra.png"
                          }
                          alt={cardTitles[index]}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                      <Box sx={{ p: 3, width: '100%' }}>
                        <Typography variant="subtitle1" fontWeight="medium"
                          sx={{
                            background: 'linear-gradient(15deg, #0b162b, #0d223e, #0e3053, #0e4169, #0c5680, #097098, #058eb1, #00b1cc)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            display: 'inline-block',
                            width: '100%',
                            textAlign: 'center',
                          }}
                        >
                          {cardTitles[index]}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block' }}>
                          {brand.description}
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <>
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
                      <Typography variant="subtitle1" fontWeight="medium"
                        sx={{
                          background: 'linear-gradient(15deg, #0b162b, #0d223e, #0e3053, #0e4169, #0c5680, #097098, #058eb1, #00b1cc)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent',
                          display: 'inline-block',
                          width: '100%',
                          textAlign: 'center',
                        }}
                      >
                        {cardTitles[index]}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" align="center">
                        {brand.description}
                      </Typography>
                    </>
                  )}
                </Paper>
              ))}
            </Box>
            
            {/* Second Row of Cards */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', mt: 3 }}>
              {mockBrands.slice(4, 8).map((brand, index) => (
                <Paper
                  key={brand.id}
                  elevation={0}
                  sx={{
                    p: 3,
                    width: { xs: '45%', sm: '30%', md: '22%' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'grey.50',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                      backgroundColor: 'background.paper',
                    },
                  }}
                  onClick={() => router.push(`/equipment?category=${cardTitles[index + 4]}`)}
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
                  <Typography variant="subtitle1" fontWeight="medium"
                    sx={{
                      background: 'linear-gradient(15deg, #0b162b, #0d223e, #0e3053, #0e4169, #0c5680, #097098, #058eb1, #00b1cc)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      display: 'inline-block',
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    {cardTitles[index + 4]}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" align="center">
                    {brand.description}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
          
          {/* Static Brand Grid */}
          <Box sx={{ py: 4, pt: 1 }}>
            <Container maxWidth={false} sx={{ mt: 2, px: 3 }} disableGutters>
              <Box sx={{
                backgroundColor: 'white',
                borderRadius: '12px',
                p: 2,
              }}>
                <Grid container spacing={1} justifyContent="center" alignItems="center">
                  {mockBrands.map((brand) => (
                    <Grid item xs={4} sm={3} md={2} lg={2} key={brand.id}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '45px',
                          p: 0.5,
                          borderRadius: '8px',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'white',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                          }
                        }}
                      >
                        {brand.logo && (
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            style={{
                              maxHeight: brand.name === 'Genie' ? '48.4px' : brand.name === 'Sogeco' ? '27.62px' : brand.name === 'Niftylift' ? '42.9px' : brand.name === 'JCB' ? '32.4px' : brand.name === 'Polaris' ? '25.84px' : brand.name === 'Kawasaki' ? '36px' : brand.name === 'EZGO' ? '26.16px' : brand.name === 'Trime' ? '38px' : brand.name === 'Club Car' ? '38px' : brand.name === 'Flexiloo' ? '25.5px' : brand.name === 'PASMA' ? '30.78px' : brand.name === 'Peri' ? '31.28px' : '40px',
                              width: 'auto',
                              objectFit: 'contain',
                              marginTop: brand.name === 'IPAF' ? '-8px' : '0px',
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Container>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
} 
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
import { BrandCarousel } from '@/components/BrandCarousel/BrandCarousel';
import { CustomerCarousel } from '@/components/BrandCarousel/CustomerCarousel';
import { toast } from 'react-hot-toast';

export default function HomePage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success('Search functionality is currently unavailable');
    }
  };

  const cardTitles = [
    'Aerial Work Platforms',
    'Modular Cabins', 
    'Site Mobility',
    'Site Overlay',
    'Event Infrastructure',
    'Event Seating',
    'Construction Scaffolding',
    'Vertical Access'
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
                background: 'linear-gradient(to right, #155799, #159957)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
              }}
            >
              Welcome to Al Laith Projects Services
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.7 }}>
              Search from our wide range of project equipment and event infrastucture solutions
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
                    borderColor: 'grey.300',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'grey.300',
                    borderWidth: '1px',
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
                        backgroundColor: 'rgba(76, 175, 80, 0.5)',  // 50% transparent light green
                        color: 'white',
                        width: 40,
                        height: 40,
                        '&:hover': {
                          backgroundColor: 'rgba(69, 160, 73, 0.5)',  // 50% transparent darker green
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
                    p: 0,
                    width: { xs: '45%', sm: '30%', md: '22%' },
                    height: '225px', // Reduced from 300px
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    backgroundColor: 'grey.50',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    position: 'relative', // Added for overlay positioning
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                      backgroundColor: 'background.paper',
                    },
                  }}
                  onClick={() => {
                    toast.success('Equipment catalog is currently unavailable');
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={
                        index === 0 ? "/images/brands/pa banner.png" : 
                        index === 1 ? "/images/brands/cabins_banner-Photoroom.png" : 
                        index === 2 ? "/images/brands/golfcart.png" :
                        index === 3 ? "/images/brands/overlay_banner.png" :
                        "/images/brands/tempinfra.png"
                      }
                      alt={cardTitles[index]}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {/* Dark overlay gradient */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: index === 0 
                          ? 'linear-gradient(rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.0) 100%)'  // 20% lighter for Aerial Work Platform
                          : 'linear-gradient(rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.2) 100%)',  // 10% lighter for others
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 2,
                        px: 1,
                      }}
                    >
                      <Typography 
                        variant="subtitle1" 
                        fontWeight="medium"
                        sx={{
                          color: 'white',
                          width: '100%',
                          textAlign: 'center',
                          fontSize: '1rem',
                          mb: 1,
                          textTransform: 'uppercase',
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        }}
                      >
                        {cardTitles[index]}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        align="center" 
                        sx={{ 
                          display: 'block',
                          fontSize: '0.75rem',
                          lineHeight: 1.2,
                          color: 'rgba(255,255,255,0.9)',
                          maxWidth: '95%',
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                          mb: 1,
                        }}
                      >
                        {index === 0 ? "Powered access solutions including boom lifts, scissor lifts and low-level access machinery" : 
                         index === 1 ? "Customisable modular cabins designed to meet the specific requirements of any project" : 
                         index === 2 ? "A full range of golf carts and ATVs for reliable transport in challenging environments" :
                         index === 3 ? "Temporary high-quality elevators, construction hoists and work platforms" :
                         brand.description}
                      </Typography>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          color: 'white',
                          opacity: 0,
                          textDecoration: 'underline',
                          transition: 'opacity 0.3s ease',
                          '.MuiPaper-root:hover &': {
                            opacity: 1,
                          },
                          fontSize: '0.75rem',
                        }}
                      >
                        View products
                      </Typography>
                    </Box>
                  </Box>
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
                    p: 0,
                    width: { xs: '45%', sm: '30%', md: '22%' },
                    height: '225px', // Reduced from 300px
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    backgroundColor: 'grey.50',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    position: 'relative', // Added for overlay positioning
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                      backgroundColor: 'background.paper',
                    },
                  }}
                  onClick={() => {
                    toast.success('Equipment catalog is currently unavailable');
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={
                        index === 0 ? "/images/brands/event_banner.png" : 
                        index === 1 ? "/images/brands/seating_banner.png" :
                        index === 2 ? "/images/brands/scaff_banner.png" :
                        "/images/brands/hek_banner.png"
                      }
                      alt={cardTitles[index + 4]}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {/* Dark overlay gradient */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.2) 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 2,
                        px: 1,
                      }}
                    >
                      <Typography 
                        variant="subtitle1" 
                        fontWeight="medium"
                        sx={{
                          color: 'white',
                          width: '100%',
                          textAlign: 'center',
                          fontSize: '1rem',
                          mb: 1,
                          textTransform: 'uppercase',
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        }}
                      >
                        {cardTitles[index + 4]}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        align="center" 
                        sx={{ 
                          display: 'block',
                          fontSize: '0.75rem',
                          lineHeight: 1.2,
                          color: 'rgba(255,255,255,0.9)',
                          maxWidth: '95%',
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                          mb: 1,
                        }}
                      >
                        {index === 0 ? "Customised high-performance stage and platform systems for events of all sizes" : 
                         index === 1 ? "Modular grandstands and tiered seating designed for comfort and safety for large-scale events" :
                         index === 2 ? "Specialized scaffolding solutions for complex construction projects" :
                         index === 3 ? "Temporary high-quality elevators, construction hoists and work platforms" :
                         brand.description}
                      </Typography>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          color: 'white',
                          opacity: 0,
                          textDecoration: 'underline',
                          transition: 'opacity 0.3s ease',
                          '.MuiPaper-root:hover &': {
                            opacity: 1,
                          },
                          fontSize: '0.75rem',
                        }}
                      >
                        View products
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
          
          {/* Partners Section */}
          <Box sx={{ py: 4, pt: 6 }}>
            <Typography 
              variant="h4" 
              component="h2" 
              align="center" 
              gutterBottom
              sx={{
                fontSize: '1.8rem',
                fontWeight: 400,
                mb: 3,
                background: 'linear-gradient(to right, #155799, #159957)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
                width: '100%',
              }}
            >
              Industry Leading OEM Brands
            </Typography>
            <Typography 
              variant="body1" 
              align="center" 
              sx={{ 
                mb: 2,
                mx: 'auto',
                maxWidth: '800px',
                color: 'text.secondary',
                lineHeight: 1.6,
                fontSize: '1rem'
              }}
            >
              Whether you're managing a complex event or construction project, maintaining industrial sites or handling specialised installations, our project solutions are engineered to enhance productivity while prioritising safety and ease of use.
            </Typography>

            {/* Brand Carousel (First - OEM Brands) */}
            <Box sx={{ mt: 1 }}>
              <BrandCarousel brands={mockBrands.filter(brand => brand.logo)} />
            </Box>
          </Box>

          {/* Partners in Success Title */}
          <Box sx={{ py: 4 }}>
            <Typography 
              variant="h4" 
              component="h2" 
              align="center" 
              gutterBottom
              sx={{
                fontSize: '1.8rem',
                fontWeight: 400,
                mb: 3,
                background: 'linear-gradient(to right, #155799, #159957)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
                width: '100%',
              }}
            >
              Our Partners in Success
            </Typography>
            <Typography 
              variant="body1" 
              align="center" 
              sx={{ 
                mb: 2,
                mx: 'auto',
                maxWidth: '800px',
                color: 'text.secondary',
                lineHeight: 1.6,
                fontSize: '1rem'
              }}
            >
              Together with our trusted partners, we deliver excellence in equipment solutions, ensuring your projects achieve their full potential through innovation and reliability.
            </Typography>
          </Box>

          {/* Customer Carousel */}
          <CustomerCarousel />
        </Container>
      </Box>
    </Layout>
  );
} 
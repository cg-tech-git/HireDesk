import React from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Button,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { Layout } from '@/components/Layout/Layout';
import { toast } from 'react-hot-toast';

export default function AerialWorkPlatformsPage() {
  const router = useRouter();

  // Placeholder data for equipment cards
  const equipmentItems = [
    {
      id: 1,
      title: 'Articulated Diesel Boom Lifts',
      description: 'Versatile articulating boom lifts for complex access requirements, ideal for construction and maintenance',
      image: '/images/equipment/articulated-boom-lift.jpg',
    },
    {
      id: 2,
      title: 'Telescopic Diesel Boom Lifts',
      description: 'Long-reach telescopic boom lifts offering maximum height access for industrial and construction applications',
      image: '/images/equipment/telescopic-boom-lift.jpg',
    },
    {
      id: 3,
      title: 'Electric Boom Lifts',
      description: 'Zero-emission boom lifts perfect for indoor use and environmentally sensitive projects',
      image: '/images/equipment/electric-boom-lift.jpg',
    },
    {
      id: 4,
      title: 'Diesel Scissor Lifts',
      description: 'Robust rough-terrain scissor lifts for outdoor construction and industrial applications',
      image: '/images/equipment/diesel-scissor-lift.jpg',
    },
    {
      id: 5,
      title: 'Electric Scissor Lifts',
      description: 'Clean and quiet scissor lifts ideal for indoor work and finished floor applications',
      image: '/images/equipment/electric-scissor-lift.jpg',
    },
    {
      id: 6,
      title: 'Personnel Lifts',
      description: 'Compact and lightweight lifts designed for safe and efficient single-person elevation',
      image: '/images/equipment/personnel.jpg',
    },
    {
      id: 7,
      title: 'Material Lifts',
      description: 'Specialized lifts for safely elevating materials and equipment to height',
      image: '/images/equipment/material-lift.jpg',
    },
  ];

  const handleEquipmentClick = (equipment: any) => {
    const categoryUrls: { [key: string]: string } = {
      'Articulated Diesel Boom Lifts': '/aerial-work-platforms/articulated-diesel-boom-lifts',
      'Telescopic Diesel Boom Lifts': '/aerial-work-platforms/telescopic-diesel-boom-lifts',
      'Electric Boom Lifts': '/aerial-work-platforms/electric-boom-lifts',
      'Diesel Scissor Lifts': '/aerial-work-platforms/diesel-scissor-lifts',
      'Electric Scissor Lifts': '/aerial-work-platforms/electric-scissor-lifts',
      'Personnel Lifts': '/aerial-work-platforms/personnel-lifts',
      'Material Lifts': '/aerial-work-platforms/material-lifts',
    };

    const url = categoryUrls[equipment.title];
    if (url) {
      router.push(url);
    }
  };

  return (
    <Layout>
      <Box sx={{ backgroundColor: 'white', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 400,
                background: 'linear-gradient(to right, #155799, #159957)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
                mb: 3,
              }}
            >
              Aerial Work Platforms
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                maxWidth: '800px',
                mx: 'auto',
                color: 'text.secondary',
                lineHeight: 1.8,
                fontSize: '1.1rem',
              }}
            >
              Elevate your operations safely and efficiently with our comprehensive range of Aerial Work Platforms. 
              Ideal for construction, industrial maintenance and specialised installations, our work-at-height solutions 
              are engineered to enhance productivity without compromising on safety.
            </Typography>
          </Box>

          {/* Equipment Grid */}
          <Grid container spacing={3}>
            {equipmentItems.map((equipment) => (
              <Grid item xs={12} sm={6} md={4} key={equipment.id}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'grey.50',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                      '& img': {
                        transform: 'scale(1.1)',
                      },
                    },
                  }}
                  onClick={() => handleEquipmentClick(equipment)}
                >
                  {/* Image Placeholder */}
                  <Box
                    sx={{
                      height: 200,
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {(equipment.id === 1 || equipment.id === 2 || equipment.id === 3 || equipment.id === 4 || equipment.id === 5 || equipment.id === 6 || equipment.id === 7) ? (
                      <Box
                        sx={{
                          width: (equipment.id === 6 || equipment.id === 7) ? '64%' : '80%',
                          height: (equipment.id === 6 || equipment.id === 7) ? '64%' : '80%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          src={
                            equipment.id === 1 ? "/images/equipment/artboom.jpg" :
                            equipment.id === 2 ? "/images/equipment/telboom.jpg" :
                            equipment.id === 3 ? "/images/equipment/z45.jpg" :
                            equipment.id === 4 ? "/images/equipment/5390.jpg" :
                            equipment.id === 5 ? "/images/equipment/escissor.jpg" :
                            equipment.id === 6 ? "/images/equipment/personnel.jpg" :
                            "/images/equipment/mat.jpg"
                          }
                          alt={equipment.title}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            transition: 'transform 0.3s ease',
                          }}
                        />
                      </Box>
                    ) : (
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'grey.400',
                          textAlign: 'center',
                        }}
                      >
                        {equipment.title}
                      </Typography>
                    )}
                  </Box>

                  {/* Content */}
                  <Box sx={{ 
                    p: 2, 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    backgroundColor: 'grey.50'
                  }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 500,
                        background: 'linear-gradient(to right, #155799, #159957)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        fontSize: '0.95rem',
                      }}
                    >
                      {equipment.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        mb: 2,
                        flexGrow: 1,
                        fontSize: '0.85rem',
                      }}
                    >
                      {equipment.description}
                    </Typography>
                    <Box
                      sx={{
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: 'grey.200',
                      }}
                    >
                      <Button
                        className="view-details-btn"
                        endIcon={<ArrowForward sx={{ fontSize: '0.9rem', background: 'linear-gradient(to right, #155799, #159957)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }} />}
                        sx={{
                          justifyContent: 'flex-start',
                          background: 'linear-gradient(to right, #155799, #159957)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent',
                          fontSize: '0.85rem',
                          pl: 0,
                          minWidth: 'auto',
                          textDecoration: 'none',
                          '&:hover': {
                            backgroundColor: 'transparent',
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
} 
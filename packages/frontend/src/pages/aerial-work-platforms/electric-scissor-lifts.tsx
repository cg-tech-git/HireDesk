import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Button,
  Modal,
  Badge,
  Popover,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Remove,
  ChevronRight,
  AddCircle,
  GradingOutlined,
} from '@mui/icons-material';
import { Layout } from '@/components/Layout/Layout';
import { setPendingItem } from '@/store/quoteSlice';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Electric scissor lift models data
const scissorLiftModels = [
  {
    id: 1,
    name: 'Genie GS-4047',
    manufacturer: 'Genie',
    image: '/images/equipment/escissor.jpg',
    keySpecs: {
      maxWorkingHeight: '45 ft 6 in (13.9 m)',
      maxPlatformCapacity: '550 lbs (249 kg)',
    },
    additionalSpecs: {
      platformSize: '3 ft 10 in x 7 ft 5 in (1.17 x 2.26 m)',
      machineWeight: '7,185 lbs (3,260 kg)',
      driveSpeed: '2.0 mph (3.2 km/h)',
      gradeability: '25%',
    },
  },
  {
    id: 2,
    name: 'JLG 4045R',
    manufacturer: 'JLG',
    image: '/images/equipment/escissor.jpg',
    keySpecs: {
      maxWorkingHeight: '40 ft (12.19 m)',
      maxPlatformCapacity: '500 lbs (227 kg)',
    },
    additionalSpecs: {
      platformSize: '3 ft 10 in x 7 ft 6 in (1.17 x 2.29 m)',
      machineWeight: '6,825 lbs (3,096 kg)',
      driveSpeed: '2.5 mph (4.0 km/h)',
      gradeability: '25%',
    },
  },
  {
    id: 3,
    name: 'Genie GS-3246',
    manufacturer: 'Genie',
    image: '/images/equipment/escissor.jpg',
    keySpecs: {
      maxWorkingHeight: '38 ft (11.6 m)',
      maxPlatformCapacity: '700 lbs (318 kg)',
    },
    additionalSpecs: {
      platformSize: '3 ft 10 in x 7 ft 5 in (1.17 x 2.26 m)',
      machineWeight: '5,900 lbs (2,676 kg)',
      driveSpeed: '2.0 mph (3.2 km/h)',
      gradeability: '25%',
    },
  },
  {
    id: 4,
    name: 'JLG 3246ES',
    manufacturer: 'JLG',
    image: '/images/equipment/escissor.jpg',
    keySpecs: {
      maxWorkingHeight: '32 ft (9.75 m)',
      maxPlatformCapacity: '700 lbs (318 kg)',
    },
    additionalSpecs: {
      platformSize: '3 ft 10 in x 7 ft 6 in (1.17 x 2.29 m)',
      machineWeight: '5,250 lbs (2,381 kg)',
      driveSpeed: '2.5 mph (4.0 km/h)',
      gradeability: '25%',
    },
  },
  {
    id: 5,
    name: 'Genie GS-1930',
    manufacturer: 'Genie',
    image: '/images/equipment/escissor.jpg',
    keySpecs: {
      maxWorkingHeight: '25 ft (7.6 m)',
      maxPlatformCapacity: '500 lbs (227 kg)',
    },
    additionalSpecs: {
      platformSize: '2 ft 6 in x 5 ft 5 in (0.76 x 1.65 m)',
      machineWeight: '2,995 lbs (1,359 kg)',
      driveSpeed: '2.5 mph (4.0 km/h)',
      gradeability: '25%',
    },
  },
  {
    id: 6,
    name: 'JLG 1532R',
    manufacturer: 'JLG',
    image: '/images/equipment/escissor.jpg',
    keySpecs: {
      maxWorkingHeight: '21 ft (6.4 m)',
      maxPlatformCapacity: '600 lbs (272 kg)',
    },
    additionalSpecs: {
      platformSize: '2 ft 6 in x 5 ft 4 in (0.76 x 1.63 m)',
      machineWeight: '2,690 lbs (1,220 kg)',
      driveSpeed: '2.5 mph (4.0 km/h)',
      gradeability: '25%',
    },
  },
];



export default function ElectricScissorLiftsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [specsAnchorEl, setSpecsAnchorEl] = useState<null | HTMLElement>(null);
  const [activeModelId, setActiveModelId] = useState<number | null>(null);

  const handleAddToQuote = (model: any) => {
    // Create pending item and let QuoteManager handle the workflow
    const pendingItem = {
      modelId: model.id,
      modelName: model.name,
      manufacturer: model.manufacturer,
      category: 'Electric Scissor Lifts',
      quantity: 1,
      dates: [],
    };
    
    dispatch(setPendingItem(pendingItem));
  };



  const handleSpecsClick = (event: React.MouseEvent<HTMLElement>, modelId: number) => {
    setSpecsAnchorEl(event.currentTarget);
    setActiveModelId(modelId);
  };

  const handleSpecsClose = () => {
    setSpecsAnchorEl(null);
    setActiveModelId(null);
  };

  return (
    <Layout>
      <Box sx={{ 
        backgroundColor: '#fdfdfd', 
        minHeight: '100vh',
        mx: -3, // Negate Layout's horizontal padding
        px: 3,  // Add it back for content
      }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header Section */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={() => router.back()} 
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{
                fontWeight: 400,
                color: '#183057',
              }}
            >
              Electric Scissor Lifts
            </Typography>
          </Box>

          {/* Models Grid */}
          <Grid container spacing={3}>
            {scissorLiftModels.map((model) => (
              <Grid item xs={12} sm={6} md={4} key={model.id}>
                <Paper
                  elevation={0}
                  className={activeModelId === model.id && Boolean(specsAnchorEl) ? 'popover-active' : ''}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#f1f5f9', // slate-100
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    '&:hover, &.popover-active': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                      '& img': {
                        transform: 'scale(1.1)',
                      },
                      // Hover effect for all cards
                      '& .card-content': {
                        backgroundColor: '#183057',
                      },
                      '& .card-title, & .card-description, & .card-specs, & .card-button': {
                        color: 'white !important',
                      },
                      '& .card-border': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '& .add-button svg': {
                        color: 'white !important',
                      },
                    },
                  }}
                >
                  {/* Image Section */}
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
                    <Box
                      component="img"
                      src={model.image}
                      alt={model.name}
                      sx={{
                        width: '64%',
                        height: '64%',
                        objectFit: 'contain',
                        transition: 'transform 0.3s ease',
                      }}
                    />
                  </Box>

                  {/* Content Section */}
                  <Box 
                    className="card-content"
                    sx={{ 
                      p: 3,
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: '#f1f5f9', // slate-100
                      position: 'relative',
                      minHeight: '280px',
                      transition: 'background-color 0.3s ease',
                    }}
                  >
                    {/* Model Name */}
                    <Typography
                      className="card-title"
                      variant="h6"
                      sx={{
                        mb: 1,
                        color: '#183057',
                        fontWeight: 600,
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {model.name}
                    </Typography>

                    {/* Model Description */}
                    <Typography
                      className="card-description"
                      variant="body2"
                      sx={{
                        color: '#183057',
                        mb: 2,
                        lineHeight: 1.6,
                        fontSize: '0.875rem',
                        flexGrow: 1,
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {model.id === 1 ? 
                        "The Genie GS-4047 electric scissor lift delivers exceptional height and capacity in a compact footprint. Perfect for indoor applications, its zero-emission operation and non-marking tires make it ideal for finished floors and sensitive environments."
                        : model.id === 2 ?
                        "The JLG 4045R electric scissor lift combines impressive working height with quiet, environmentally friendly operation. Its durable design and precise controls make it perfect for indoor construction and maintenance tasks."
                        : model.id === 3 ?
                        "The Genie GS-3246 electric scissor lift offers an excellent combination of height and capacity. With its efficient electric drive system and compact dimensions, it's perfect for warehouses, retail spaces, and other indoor applications."
                        : model.id === 4 ?
                        "The JLG 3246ES electric scissor lift provides reliable performance with zero emissions. Its proportional controls and compact design make it ideal for working in tight spaces while maintaining excellent maneuverability."
                        : model.id === 5 ?
                        "The Genie GS-1930 electric scissor lift is the perfect solution for low-height indoor applications. Its narrow width and zero turning radius make it exceptionally maneuverable in confined spaces, while its electric operation ensures quiet, clean performance."
                        : model.id === 6 ?
                        "The JLG 1532R electric scissor lift is designed for maximum maneuverability in tight spaces. Its compact dimensions and higher weight capacity make it perfect for indoor applications where both space efficiency and lifting power are essential."
                        : null
                      }
                    </Typography>

                    {/* View Specifications and Add Button Row */}
                    <Box 
                      className="card-border"
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: 'auto',
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: 'grey.200',
                        transition: 'border-color 0.3s ease',
                      }}
                    >
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                        onClick={(e) => handleSpecsClick(e, model.id)}
                      >
                        <Typography
                          className="card-specs"
                          variant="subtitle1"
                          sx={{
                            color: '#183057',
                            fontWeight: 400,
                            fontSize: '0.9rem',
                            transition: 'color 0.3s ease',
                          }}
                        >
                          View Specifications
                        </Typography>
                        <ChevronRight 
                          className="card-specs"
                          sx={{
                            ml: 1,
                            color: '#183057',
                            fontSize: '1.2rem',
                            transform: activeModelId === model.id && specsAnchorEl ? 'rotate(90deg)' : 'none',
                            transition: 'transform 0.2s, color 0.3s ease',
                          }}
                        />
                      </Box>

                      <IconButton
                        className="add-button"
                        onClick={() => handleAddToQuote(model)}
                        sx={{
                          padding: 0.5,
                          '&:hover': {
                            backgroundColor: 'transparent',
                          },
                        }}
                      >
                        <AddCircle sx={{ color: '#183057', fontSize: '1.5rem', transition: 'color 0.3s ease' }} />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Specifications Popover */}
                  <Popover
                    open={activeModelId === model.id && Boolean(specsAnchorEl)}
                    anchorEl={specsAnchorEl}
                    onClose={handleSpecsClose}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    sx={{
                      '& .MuiPaper-root': {
                        width: 320,
                        mt: 0,
                        ml: 1,
                        backgroundColor: '#f8fafc',
                        boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <Box sx={{ p: 3 }}>
                      {/* Max Working Height */}
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#183057',
                            fontWeight: 400,
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            mb: 0.5,
                          }}
                        >
                          MAX WORKING HEIGHT
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 400,
                          }}
                        >
                          {model.keySpecs.maxWorkingHeight}
                        </Typography>
                      </Box>

                      {/* Max Platform Capacity */}
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#183057',
                            fontWeight: 400,
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            mb: 0.5,
                          }}
                        >
                          MAX PLATFORM CAPACITY
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 400,
                          }}
                        >
                          {model.keySpecs.maxPlatformCapacity}
                        </Typography>
                      </Box>

                      {/* Additional Specs */}
                      {Object.entries(model.additionalSpecs).map(([key, value]) => (
                        <Box key={key} sx={{ mb: 2 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#183057',
                              fontWeight: 400,
                              textTransform: 'capitalize',
                              fontSize: '0.75rem',
                              mb: 0.5,
                            }}
                          >
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 400,
                            }}
                          >
                            {value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Popover>
                </Paper>
              </Grid>
            ))}
          </Grid>


        </Container>
      </Box>
    </Layout>
  );
} 
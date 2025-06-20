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
  Popover,
} from '@mui/material';
import {
  ArrowBack,
  ChevronRight,
  AddCircle,
} from '@mui/icons-material';
import { Layout } from '@/components/Layout/Layout';
import { setPendingItem } from '@/store/quoteSlice';

// Electric boom lift models data
const boomLiftModels = [
  {
    id: 1,
    name: 'Genie Z-45 DC',
    manufacturer: 'Genie',
    image: '/images/equipment/z45.jpg',
    keySpecs: {
      maxWorkingHeight: '51 ft 6 in (15.87 m)',
      maxPlatformCapacity: '500 lbs (227 kg)',
    },
    additionalSpecs: {
      horizontalOutreach: '23 ft 1 in (7.04 m)',
      machineWeight: '15,000 lbs (6,804 kg)',
      upAndOverHeight: '24 ft 7 in (7.5 m)',
      workingOutreach: '29 ft 6 in (9 m)',
    },
  },
  {
    id: 2,
    name: 'JLG E450AJ',
    manufacturer: 'JLG',
    image: '/images/equipment/z45.jpg',
    keySpecs: {
      maxWorkingHeight: '45 ft (13.7 m)',
      maxPlatformCapacity: '500 lbs (227 kg)',
    },
    additionalSpecs: {
      horizontalOutreach: '23 ft 1 in (7.04 m)',
      machineWeight: '14,400 lbs (6,532 kg)',
      upAndOverHeight: '22 ft 1 in (6.7 m)',
      workingOutreach: '25 ft (7.62 m)',
    },
  },
  {
    id: 3,
    name: 'Genie Z-60 DC',
    manufacturer: 'Genie',
    image: '/images/equipment/z45.jpg',
    keySpecs: {
      maxWorkingHeight: '65 ft 7 in (20.16 m)',
      maxPlatformCapacity: '500 lbs (227 kg)',
    },
    additionalSpecs: {
      horizontalOutreach: '36 ft 7 in (11.15 m)',
      machineWeight: '18,400 lbs (8,346 kg)',
      upAndOverHeight: '26 ft 7 in (8.1 m)',
      workingOutreach: '30 ft 3 in (9.2 m)',
    },
  },
  {
    id: 4,
    name: 'JLG E600J',
    manufacturer: 'JLG',
    image: '/images/equipment/z45.jpg',
    keySpecs: {
      maxWorkingHeight: '60 ft (18.3 m)',
      maxPlatformCapacity: '500 lbs (227 kg)',
    },
    additionalSpecs: {
      horizontalOutreach: '43 ft 3 in (13.2 m)',
      machineWeight: '15,200 lbs (6,895 kg)',
      upAndOverHeight: '26 ft 7 in (8.1 m)',
      workingOutreach: '33 ft 8 in (10.3 m)',
    },
  },
  {
    id: 5,
    name: 'Genie Z-80 DC',
    manufacturer: 'Genie',
    image: '/images/equipment/z45.jpg',
    keySpecs: {
      maxWorkingHeight: '84 ft (25.6 m)',
      maxPlatformCapacity: '500 lbs (227 kg)',
    },
    additionalSpecs: {
      horizontalOutreach: '60 ft (18.3 m)',
      machineWeight: '34,500 lbs (15,649 kg)',
      upAndOverHeight: '29 ft (8.83 m)',
      workingOutreach: '37 ft 3 in (11.3 m)',
    },
  },
  {
    id: 6,
    name: 'Genie Z-40/23N',
    manufacturer: 'Genie',
    image: '/images/equipment/z45.jpg',
    keySpecs: {
      maxWorkingHeight: '46 ft 5 in (14.32 m)',
      maxPlatformCapacity: '500 lbs (227 kg)',
    },
    additionalSpecs: {
      horizontalOutreach: '22 ft 8 in (6.91 m)',
      machineWeight: '15,230 lbs (6,908 kg)',
      upAndOverHeight: '21 ft 3 in (6.48 m)',
      workingOutreach: '29 ft 2 in (8.89 m)',
    },
  },
];



export default function ElectricBoomLiftsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [specsAnchorEl, setSpecsAnchorEl] = useState<null | HTMLElement>(null);
  const [activeModelId, setActiveModelId] = useState<number | null>(null);

  // Map mock model names to database equipment UUIDs
  const getEquipmentUUID = (modelName: string): string => {
    const equipmentMap: {[key: string]: string} = {
      'Genie Z-45 DC': '68d96af4-6399-4798-ae97-47fec0c4fcba', // Exact match
      'JLG E450AJ': '68d96af4-6399-4798-ae97-47fec0c4fcba', // Map to similar Genie model as fallback
      'Genie Z-60 DC': '68d96af4-6399-4798-ae97-47fec0c4fcba', // Map to similar Genie model as fallback
      'JLG E600J': '68d96af4-6399-4798-ae97-47fec0c4fcba', // Map to similar Genie model as fallback
      'Genie Z-80 DC': '68d96af4-6399-4798-ae97-47fec0c4fcba', // Map to similar Genie model as fallback
      'Genie Z-40/23N': '41a67e38-53f3-4c7b-ab9c-2a9f044d67f5', // Exact match
    };
    
    return equipmentMap[modelName] || modelName; // Fallback to original if no mapping found
  };

  const handleAddToQuote = (model: any) => {
    // Create pending item and let QuoteManager handle the workflow
    const pendingItem = {
      modelId: getEquipmentUUID(model.name), // Use correct equipment UUID
      modelName: model.name,
      manufacturer: model.manufacturer,
      category: 'Electric Boom Lifts',
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
              Electric Boom Lifts
            </Typography>
          </Box>

          {/* Models Grid */}
          <Grid container spacing={3}>
            {boomLiftModels.map((model) => (
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
                        "The Genie Z-45 DC electric articulating boom lift delivers quiet, emission-free performance in the most sensitive work environments. With a working height of 51 ft 6 in and zero tailswing, it's perfect for indoor and outdoor applications where environmental impact matters."
                        : model.id === 2 ?
                        "The JLG E450AJ electric boom lift combines power and precision with zero emissions. Its advanced electric drive system provides longer duty cycles and industry-leading performance, making it ideal for environmentally sensitive job sites."
                        : model.id === 3 ?
                        "The Genie Z-60 DC electric boom lift offers exceptional range of motion with zero emissions. Its innovative design provides outstanding performance and reliability, perfect for construction sites and industrial applications requiring environmental consideration."
                        : model.id === 4 ?
                        "The JLG E600J electric boom lift delivers impressive reach and precise positioning with eco-friendly operation. Its advanced battery system provides extended duty cycles, while the articulating jib offers exceptional access in tight spaces."
                        : model.id === 5 ?
                        "The Genie Z-80 DC electric boom lift combines impressive height and reach with zero emissions operation. Perfect for indoor and outdoor applications, it delivers exceptional performance and versatility while maintaining environmental consciousness."
                        : model.id === 6 ?
                        "The Genie Z-40/23N electric boom lift is designed for narrow access applications. Its zero-emission operation and compact dimensions make it perfect for indoor work in confined spaces, while its articulating design provides excellent up-and-over reach capabilities."
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
                          color: '#183057',
                          '&:hover': {
                            backgroundColor: 'white',
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
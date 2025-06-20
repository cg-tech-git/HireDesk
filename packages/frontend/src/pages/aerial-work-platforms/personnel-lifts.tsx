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

// Personnel lift models data
const personnelLiftModels = [
  {
    id: 1,
    name: 'Genie AWP-30S',
    manufacturer: 'Genie',
    image: '/images/equipment/personnel.jpg',
    keySpecs: {
      maxWorkingHeight: '35 ft 6 in (10.8 m)',
      maxPlatformCapacity: '350 lbs (159 kg)',
    },
    additionalSpecs: {
      platformSize: '27 x 26 in (0.69 x 0.66 m)',
      machineWeight: '1,315 lbs (596 kg)',
      baseWidth: '29.5 in (0.75 m)',
      outriggerFootprint: '6 ft 7 in x 5 ft 9 in (2.0 x 1.75 m)',
    },
  },
  {
    id: 2,
    name: 'JLG 25AM',
    manufacturer: 'JLG',
    image: '/images/equipment/personnel.jpg',
    keySpecs: {
      maxWorkingHeight: '31 ft (9.45 m)',
      maxPlatformCapacity: '350 lbs (159 kg)',
    },
    additionalSpecs: {
      platformSize: '26 x 25 in (0.66 x 0.64 m)',
      machineWeight: '1,245 lbs (565 kg)',
      baseWidth: '29.5 in (0.75 m)',
      outriggerFootprint: '6 ft 3 in x 5 ft 6 in (1.9 x 1.68 m)',
    },
  },
  {
    id: 3,
    name: 'Genie AWP-25S',
    manufacturer: 'Genie',
    image: '/images/equipment/personnel.jpg',
    keySpecs: {
      maxWorkingHeight: '30 ft 5 in (9.3 m)',
      maxPlatformCapacity: '350 lbs (159 kg)',
    },
    additionalSpecs: {
      platformSize: '27 x 26 in (0.69 x 0.66 m)',
      machineWeight: '1,245 lbs (565 kg)',
      baseWidth: '29.5 in (0.75 m)',
      outriggerFootprint: '6 ft 1 in x 5 ft 5 in (1.85 x 1.65 m)',
    },
  },
  {
    id: 4,
    name: 'JLG 20AM',
    manufacturer: 'JLG',
    image: '/images/equipment/personnel.jpg',
    keySpecs: {
      maxWorkingHeight: '26 ft (7.92 m)',
      maxPlatformCapacity: '350 lbs (159 kg)',
    },
    additionalSpecs: {
      platformSize: '26 x 25 in (0.66 x 0.64 m)',
      machineWeight: '1,115 lbs (506 kg)',
      baseWidth: '29.5 in (0.75 m)',
      outriggerFootprint: '5 ft 11 in x 5 ft 4 in (1.8 x 1.62 m)',
    },
  },
  {
    id: 5,
    name: 'Genie AWP-20S',
    manufacturer: 'Genie',
    image: '/images/equipment/personnel.jpg',
    keySpecs: {
      maxWorkingHeight: '26 ft 1 in (7.95 m)',
      maxPlatformCapacity: '350 lbs (159 kg)',
    },
    additionalSpecs: {
      platformSize: '27 x 26 in (0.69 x 0.66 m)',
      machineWeight: '1,087 lbs (493 kg)',
      baseWidth: '29.5 in (0.75 m)',
      outriggerFootprint: '5 ft 11 in x 5 ft 4 in (1.8 x 1.62 m)',
    },
  },
  {
    id: 6,
    name: 'JLG 15MSP',
    manufacturer: 'JLG',
    image: '/images/equipment/personnel.jpg',
    keySpecs: {
      maxWorkingHeight: '21 ft (6.4 m)',
      maxPlatformCapacity: '350 lbs (159 kg)',
    },
    additionalSpecs: {
      platformSize: '26 x 25 in (0.66 x 0.64 m)',
      machineWeight: '960 lbs (435 kg)',
      baseWidth: '29.5 in (0.75 m)',
      outriggerFootprint: '5 ft 8 in x 5 ft 2 in (1.73 x 1.57 m)',
    },
  },
];



export default function PersonnelLiftsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [specsAnchorEl, setSpecsAnchorEl] = useState<null | HTMLElement>(null);
  const [activeModelId, setActiveModelId] = useState<number | null>(null);

  // Map mock model names to database equipment UUIDs
  const getEquipmentUUID = (modelName: string): string => {
    const equipmentMap: {[key: string]: string} = {
      'Genie AWP-30S': '0982f98f-e868-46ba-b049-91e8d9f9d4eb', // Exact match
      'JLG 25AM': '0982f98f-e868-46ba-b049-91e8d9f9d4eb', // Map to similar Genie model as fallback
      'Genie AWP-25S': 'e3cafc5f-4e1c-45e5-b45f-de1bafaad12e', // Exact match
      'JLG 20AM': 'e3cafc5f-4e1c-45e5-b45f-de1bafaad12e', // Map to similar Genie model as fallback
      'Genie AWP-20S': '0bec519d-b364-493d-8207-076353ddba5a', // Exact match
      'JLG 15MSP': '0bec519d-b364-493d-8207-076353ddba5a', // Map to similar Genie model as fallback
    };
    
    return equipmentMap[modelName] || modelName; // Fallback to original if no mapping found
  };

  const handleAddToQuote = (model: any) => {
    // Create pending item and let QuoteManager handle the workflow
    const pendingItem = {
      modelId: getEquipmentUUID(model.name), // Use correct equipment UUID
      modelName: model.name,
      manufacturer: model.manufacturer,
      category: 'Personnel Lifts',
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
              Personnel Lifts
            </Typography>
          </Box>

          {/* Models Grid */}
          <Grid container spacing={3}>
            {personnelLiftModels.map((model) => (
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
                        "The Genie AWP-30S personnel lift offers exceptional reach in a compact package. With its durable design and quick setup, it's perfect for indoor maintenance and installation work. The outrigger leveling system ensures stability on uneven surfaces."
                        : model.id === 2 ?
                        "The JLG 25AM personnel lift combines reliability with ease of use. Its compact base and lightweight design make it ideal for tight spaces, while the sturdy construction ensures safe operation at height. Perfect for facility maintenance and light installation work."
                        : model.id === 3 ?
                        "The Genie AWP-25S personnel lift delivers reliable performance in a versatile package. Its stable design and easy-to-use controls make it perfect for various indoor applications, from maintenance to installation tasks."
                        : model.id === 4 ?
                        "The JLG 20AM personnel lift provides excellent maneuverability in confined spaces. Its compact dimensions and lightweight design make it perfect for indoor applications where space is limited but precise positioning is essential."
                        : model.id === 5 ?
                        "The Genie AWP-20S personnel lift offers an ideal solution for low to medium-height access needs. Its compact footprint and quick setup make it perfect for routine maintenance and installation work in confined spaces."
                        : model.id === 6 ?
                        "The JLG 15MSP personnel lift is designed for maximum portability and ease of use. Its lightweight construction and compact dimensions make it perfect for quick setup and efficient operation in tight spaces, ideal for light maintenance and installation work."
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
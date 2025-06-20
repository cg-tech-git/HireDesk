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

// Material lift models data
const materialLiftModels = [
  {
    id: 1,
    name: 'Genie SLC-24',
    manufacturer: 'Genie',
    image: '/images/equipment/mat.jpg',
    keySpecs: {
      maxWorkingHeight: '24 ft 11 in (7.6 m)',
      maxLoadCapacity: '650 lbs (295 kg)',
    },
    additionalSpecs: {
      loadHeight: '24 ft (7.32 m)',
      machineWeight: '727 lbs (330 kg)',
      baseWidth: '31.5 in (0.80 m)',
      stowedHeight: '6 ft 6.5 in (2.0 m)',
    },
  },
  {
    id: 2,
    name: 'Genie SLC-18',
    manufacturer: 'Genie',
    image: '/images/equipment/mat.jpg',
    keySpecs: {
      maxWorkingHeight: '18 ft 6 in (5.6 m)',
      maxLoadCapacity: '650 lbs (295 kg)',
    },
    additionalSpecs: {
      loadHeight: '18 ft (5.49 m)',
      machineWeight: '659 lbs (299 kg)',
      baseWidth: '31.5 in (0.80 m)',
      stowedHeight: '6 ft 6.5 in (2.0 m)',
    },
  },
  {
    id: 3,
    name: 'Genie GL-12',
    manufacturer: 'Genie',
    image: '/images/equipment/mat.jpg',
    keySpecs: {
      maxWorkingHeight: '13 ft 9 in (4.2 m)',
      maxLoadCapacity: '350 lbs (159 kg)',
    },
    additionalSpecs: {
      loadHeight: '12 ft (3.66 m)',
      machineWeight: '397 lbs (180 kg)',
      baseWidth: '29.5 in (0.75 m)',
      stowedHeight: '5 ft 11.5 in (1.82 m)',
    },
  },
  {
    id: 4,
    name: 'Genie GL-8',
    manufacturer: 'Genie',
    image: '/images/equipment/mat.jpg',
    keySpecs: {
      maxWorkingHeight: '10 ft 11 in (3.33 m)',
      maxLoadCapacity: '400 lbs (181 kg)',
    },
    additionalSpecs: {
      loadHeight: '8 ft (2.44 m)',
      machineWeight: '319 lbs (145 kg)',
      baseWidth: '29.5 in (0.75 m)',
      stowedHeight: '4 ft 11.5 in (1.51 m)',
    },
  },
  {
    id: 5,
    name: 'Genie GL-4',
    manufacturer: 'Genie',
    image: '/images/equipment/mat.jpg',
    keySpecs: {
      maxWorkingHeight: '6 ft 7 in (2.0 m)',
      maxLoadCapacity: '500 lbs (227 kg)',
    },
    additionalSpecs: {
      loadHeight: '4 ft (1.22 m)',
      machineWeight: '241 lbs (109 kg)',
      baseWidth: '29.5 in (0.75 m)',
      stowedHeight: '4 ft 11.5 in (1.51 m)',
    },
  },
  {
    id: 6,
    name: 'Genie GL-10',
    manufacturer: 'Genie',
    image: '/images/equipment/mat.jpg',
    keySpecs: {
      maxWorkingHeight: '12 ft 5 in (3.8 m)',
      maxLoadCapacity: '350 lbs (159 kg)',
    },
    additionalSpecs: {
      loadHeight: '10 ft (3.05 m)',
      machineWeight: '368 lbs (167 kg)',
      baseWidth: '29.5 in (0.75 m)',
      stowedHeight: '5 ft 3.5 in (1.61 m)',
    },
  },
];



export default function MaterialLiftsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [specsAnchorEl, setSpecsAnchorEl] = useState<null | HTMLElement>(null);
  const [activeModelId, setActiveModelId] = useState<number | null>(null);

  // Map mock model names to database equipment UUIDs
  const getEquipmentUUID = (modelName: string): string => {
    const equipmentMap: {[key: string]: string} = {
      'Genie SLC-24': 'c9c1dc25-138a-49db-8d5f-6a8a7a849521', // Exact match
      'Genie SLC-18': '2e080142-5202-43d0-adfc-1d70ea5dff96', // Exact match
      'Genie GL-12': '1441b672-8931-43bf-a8d6-6456cc184298', // Exact match
      'Genie GL-8': 'a7ffc2dc-64ec-414c-92cc-b50881a11b59', // Exact match
      'Genie GL-4': '83b301b0-dd38-440e-99c8-9910a22f5ef2', // Exact match
      'Genie GL-10': '1b58772f-0167-4015-9757-a3c5e1baf5d6', // Exact match
    };
    
    return equipmentMap[modelName] || modelName; // Fallback to original if no mapping found
  };

  const handleAddToQuote = (model: any) => {
    // Create pending item and let QuoteManager handle the workflow
    const pendingItem = {
      modelId: getEquipmentUUID(model.name), // Use correct equipment UUID
      modelName: model.name,
      manufacturer: model.manufacturer,
      category: 'Material Lifts',
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
              Material Lifts
            </Typography>
          </Box>

          {/* Models Grid */}
          <Grid container spacing={3}>
            {materialLiftModels.map((model) => (
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
                        "The Genie SLC-24 Super Lift Contractor is designed for heavy-duty material handling. With its 650 lb capacity and 24-foot lift height, it's perfect for construction sites and industrial applications requiring reliable material elevation."
                        : model.id === 2 ?
                        "The Genie SLC-18 Super Lift Contractor offers exceptional material handling capabilities in a more compact package. Its 650 lb capacity and 18-foot lift height make it ideal for medium-height material positioning tasks."
                        : model.id === 3 ?
                        "The Genie GL-12 Genie Lift is perfect for retail and facility maintenance applications. Its compact size and 350 lb capacity make it ideal for inventory stocking and light-duty material handling tasks."
                        : model.id === 4 ?
                        "The Genie GL-8 Genie Lift provides reliable material handling for lower-height applications. With a 400 lb capacity and compact footprint, it's perfect for retail environments and light industrial use."
                        : model.id === 5 ?
                        "The Genie GL-4 Genie Lift is designed for low-level material handling tasks. Its 500 lb capacity and compact design make it perfect for retail stock rooms and light industrial applications where space is limited."
                        : model.id === 6 ?
                        "The Genie GL-10 Genie Lift bridges the gap between low and medium-height material handling needs. Its versatile design and 350 lb capacity make it perfect for retail and light industrial applications requiring precise material positioning."
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

                      {/* Max Load Capacity */}
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
                          MAX LOAD CAPACITY
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 400,
                          }}
                        >
                          {model.keySpecs.maxLoadCapacity}
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
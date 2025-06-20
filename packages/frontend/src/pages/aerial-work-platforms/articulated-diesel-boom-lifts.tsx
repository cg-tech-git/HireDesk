import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPendingItem } from '@/store/quoteSlice';
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
import { useRouter } from 'next/router';

// Update mock data structure to match new format
const boomLiftModels = [
  {
    id: 1,
    name: 'Genie Z-45/25J RT',
    manufacturer: 'Genie',
    image: '/images/equipment/artboom.jpg',
    keySpecs: {
      maxWorkingHeight: '45 ft (13.7 m)',
      maxPlatformCapacity: '500 lbs (227 kg)',
    },
    additionalSpecs: {
      horizontalOutreach: '25 ft (7.62 m)',
      machineWeight: '15,000 lbs (6,804 kg)',
      upAndOverHeight: '23.5 ft (7.16 m)',
      workingOutreach: '27.5 ft (8.38 m)',
    },
  },
  {
    id: 2,
    name: 'JLG 450AJ',
    manufacturer: 'JLG',
    image: '/images/equipment/artboom.jpg',
    keySpecs: {
      maxWorkingHeight: '45 ft (13.7 m)',
      maxPlatformCapacity: '550 lbs (250 kg)',
    },
    additionalSpecs: {
      horizontalOutreach: '25 ft (7.62 m)',
      machineWeight: '15,400 lbs (6,985 kg)',
      upAndOverHeight: '23.5 ft (7.16 m)',
      workingOutreach: '27.5 ft (8.38 m)',
    },
  },
  {
    id: 3,
    name: 'Genie Z-62/40',
    manufacturer: 'Genie',
    image: '/images/equipment/artboom.jpg',
    keySpecs: {
      maxWorkingHeight: '62 ft (18.9 m)',
      maxPlatformCapacity: '500 lbs (227 kg)',
    },
    additionalSpecs: {
      horizontalOutreach: '40 ft (12.2 m)',
      machineWeight: '22,000 lbs (9,979 kg)',
      upAndOverHeight: '23.5 ft (7.16 m)',
      workingOutreach: '27.5 ft (8.38 m)',
    },
  },
  {
    id: 4,
    name: 'JLG 600AJ',
    manufacturer: 'JLG',
    image: '/images/equipment/artboom.jpg',
    keySpecs: {
      maxWorkingHeight: '60 ft (18.3 m)',
      maxPlatformCapacity: '500 lbs (227 kg)',
    },
    additionalSpecs: {
      horizontalOutreach: '33 ft 8 in (10.3 m)',
      machineWeight: '23,000 lbs (10,433 kg)',
      upAndOverHeight: '23.5 ft (7.16 m)',
      workingOutreach: '27.5 ft (8.38 m)',
    },
  },
  {
    id: 5,
    name: 'Genie Z-80/60',
    manufacturer: 'Genie',
    image: '/images/equipment/artboom.jpg',
    keySpecs: {
      maxWorkingHeight: '80 ft (24.4 m)',
      maxPlatformCapacity: '500 lbs (227 kg)',
    },
    additionalSpecs: {
      horizontalOutreach: '60 ft (18.3 m)',
      machineWeight: '35,900 lbs (16,284 kg)',
      upAndOverHeight: '23.5 ft (7.16 m)',
      workingOutreach: '27.5 ft (8.38 m)',
    },
  },
  {
    id: 6,
    name: 'JLG 800AJ',
    manufacturer: 'JLG',
    image: '/images/equipment/artboom.jpg',
    keySpecs: {
      maxWorkingHeight: '80 ft (24.38 m)',
      maxPlatformCapacity: '500 lbs (227 kg)',
    },
    additionalSpecs: {
      horizontalOutreach: '51 ft (15.54 m)',
      machineWeight: '34,300 lbs (15,558 kg)',
      upAndOverHeight: '32 ft (9.75 m)',
      workingOutreach: '47 ft (14.33 m)',
    },
  },
];



export default function ArticulatedDieselBoomLiftsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [specsAnchorEl, setSpecsAnchorEl] = useState<null | HTMLElement>(null);
  const [activeModelId, setActiveModelId] = useState<number | null>(null);

  // Map mock model names to database equipment UUIDs
  const getEquipmentUUID = (modelName: string): string => {
    const equipmentMap: {[key: string]: string} = {
      'Genie Z-45/25J RT': '68d96af4-6399-4798-ae97-47fec0c4fcba', // Maps to Genie Z-45 DC
      // Add more mappings as needed for other models
    };
    
    return equipmentMap[modelName] || modelName; // Fallback to original if no mapping found
  };

  const handleAddToQuote = (model: any) => {
    // Create pending item and let QuoteManager handle the workflow
    const pendingItem = {
      modelId: getEquipmentUUID(model.name), // Use correct equipment UUID
      modelName: model.name,
      manufacturer: model.manufacturer,
      category: 'Articulated Diesel Boom Lifts',
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
              Articulated Diesel Boom Lifts
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
                        "The Genie® Z®-45 HF high float telescopic booms are designed to perform heavy-lifting tasks in sensitive turf conditions, such as sand and turf ground conditions. Engineered to \"float\" on soft or delicate surfaces, the Genie Z-45 HF booms protect softer surfaces during operation that could be damaged by the more aggressive tread on regular rough terrain tires."
                        : model.id === 2 ?
                        "Boost your productivity with the improved multifunction capability of the JLG 450AJ. Its new DuraTough hood design delivers more durability and ease of service, and its larger 550-lb. capacity means more efficient operations. The JLG 450AJ also includes a standard LED Motion/Amber Beacon with ClearSky Smart Fleet Connectivity Hardware."
                        : model.id === 3 ?
                        "Ideal for outdoor construction and industrial applications, the Genie® Z®-62/40 articulating boom lift with capabilities provides lifting versatility with a combination of up, out and over positioning capabilities with outreach that's second to none."
                        : model.id === 4 ?
                        "The JLG 600AJ offers the best reach envelope in its class and delivers unmatched maneuverability for even the most confined work spaces. The optional articulating jib gets you into hard-to-reach areas and a fuel-efficient Tier 4 engine keeps operations cost-effective and environmentally friendly."
                        : model.id === 5 ?
                        "With outreach that's second to none, the Genie® Z®-80/60 articulating boom lift delivers outstanding lifting versatility with up, out and over positioning capabilities — ideal for outdoor construction and industrial applications."
                        : model.id === 6 ?
                        "The JLG 800AJ articulating boom lift combines impressive height and reach with advanced controls for precise positioning. Its powerful drive system and rugged design make it perfect for challenging construction and industrial applications where maximum reach and versatility are essential."
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
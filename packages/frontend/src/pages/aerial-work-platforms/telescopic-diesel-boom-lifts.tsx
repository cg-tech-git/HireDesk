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

// Update mock data structure for telescopic boom lifts
const boomLiftModels = [
  {
    id: 1,
    name: 'Genie S-60 XC',
    manufacturer: 'Genie',
    image: '/images/equipment/telboom.jpg',
    keySpecs: {
      maxWorkingHeight: '65 ft 8 in (20.0 m)',
      maxPlatformCapacity: '1,000 lbs (454 kg)',
    },
    additionalSpecs: {
      horizontalOutreach: '50 ft 10 in (15.5 m)',
      machineWeight: '22,000 lbs (9,979 kg)',
      upAndOverHeight: '27 ft (8.23 m)',
      workingOutreach: '43 ft 3 in (13.2 m)',
    },
  },
  {
    id: 2,
    name: 'JLG 660SJ',
    manufacturer: 'JLG',
    image: '/images/equipment/telboom.jpg',
    keySpecs: {
      maxWorkingHeight: '66 ft (20.1 m)',
      maxPlatformCapacity: '750 lbs (340 kg)',
    },
    additionalSpecs: {
      horizontalOutreach: '54 ft 8 in (16.7 m)',
      machineWeight: '22,750 lbs (10,319 kg)',
      upAndOverHeight: '26 ft 7 in (8.1 m)',
      workingOutreach: '45 ft (13.72 m)',
    },
  },
  {
    id: 3,
    name: 'Genie S-85 XC',
    manufacturer: 'Genie',
    image: '/images/equipment/telboom.jpg',
    keySpecs: {
      maxWorkingHeight: '91 ft (27.7 m)',
      maxPlatformCapacity: '1,000 lbs (454 kg)',
    },
    additionalSpecs: {
      horizontalOutreach: '74 ft 6 in (22.7 m)',
      machineWeight: '36,750 lbs (16,670 kg)',
      upAndOverHeight: '29 ft (8.84 m)',
      workingOutreach: '68 ft 6 in (20.88 m)',
    },
  },
  {
    id: 4,
    name: 'JLG 860SJ',
    manufacturer: 'JLG',
    image: '/images/equipment/telboom.jpg',
    keySpecs: {
      maxWorkingHeight: '86 ft (26.2 m)',
      maxPlatformCapacity: '750 lbs (340 kg)',
    },
    additionalSpecs: {
      horizontalOutreach: '75 ft (22.9 m)',
      machineWeight: '36,200 lbs (16,420 kg)',
      upAndOverHeight: '32 ft (9.75 m)',
      workingOutreach: '67 ft (20.42 m)',
    },
  },
  {
    id: 5,
    name: 'Genie SX-105 XC',
    manufacturer: 'Genie',
    image: '/images/equipment/telboom.jpg',
    keySpecs: {
      maxWorkingHeight: '105 ft (32.0 m)',
      maxPlatformCapacity: '1,000 lbs (454 kg)',
    },
    additionalSpecs: {
      horizontalOutreach: '80 ft (24.4 m)',
      machineWeight: '44,000 lbs (19,958 kg)',
      upAndOverHeight: '35 ft (10.67 m)',
      workingOutreach: '75 ft (22.86 m)',
    },
  },
  {
    id: 6,
    name: 'JLG 1200SJP',
    manufacturer: 'JLG',
    image: '/images/equipment/telboom.jpg',
    keySpecs: {
      maxWorkingHeight: '120 ft (36.58 m)',
      maxPlatformCapacity: '1,000 lbs (454 kg)',
    },
    additionalSpecs: {
      horizontalOutreach: '75 ft (22.86 m)',
      machineWeight: '40,900 lbs (18,552 kg)',
      upAndOverHeight: '40 ft (12.19 m)',
      workingOutreach: '70 ft (21.34 m)',
    },
  },
];

export default function TelescopicDieselBoomLiftsPage() {
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
      category: 'Telescopic Diesel Boom Lifts',
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
              Telescopic Diesel Boom Lifts
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
                        "The Genie S-60 XC telescopic boom lift is engineered to work in heavy-duty applications. With an industry-leading dual lift capacity of 750/1,250 lb (340/567 kg), it maximizes productivity by allowing you to work with more tools and materials."
                        : model.id === 2 ?
                        "The JLG 660SJ telescopic boom lift delivers superior reach and exceptional performance. With a platform height of 66 ft and horizontal outreach of 54 ft 8 in, it provides excellent accessibility for a wide range of applications."
                        : model.id === 3 ?
                        "The Genie S-85 XC telescopic boom lift offers unmatched productivity with dual-envelope design delivering unrestricted range of motion with platform capacities of 660 lb (300 kg) and 1,000 lb (454 kg)."
                        : model.id === 4 ?
                        "The JLG 860SJ telescopic boom lift combines power and precision with exceptional reach capabilities. Its advanced control system provides smooth operation and precise positioning, making it ideal for challenging aerial work applications."
                        : model.id === 5 ?
                        "The Genie SX-105 XC telescopic boom lift is designed for productivity in heavy-duty construction and industrial applications. With a working height of 105 ft and horizontal reach of 80 ft, it offers exceptional reach and lifting capabilities."
                        : model.id === 6 ?
                        "The JLG 1200SJP telescopic boom lift sets the standard for ultra-high reach applications. With its impressive 120 ft working height and advanced control system, it delivers unmatched performance and precision for the most demanding aerial work requirements."
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
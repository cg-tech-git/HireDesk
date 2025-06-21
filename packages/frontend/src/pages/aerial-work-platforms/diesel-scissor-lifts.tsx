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

// Diesel scissor lift models data
const scissorLiftModels = [
  {
    id: 1,
    name: 'Genie GS-5390 RT',
    manufacturer: 'Genie',
    image: '/images/equipment/5390.jpg',
    keySpecs: {
      maxWorkingHeight: '59 ft (18.0 m)',
      maxPlatformCapacity: '2,500 lbs (1,134 kg)',
    },
    additionalSpecs: {
      platformSize: '7 ft 5 in x 18 ft 2 in (2.26 x 5.54 m)',
      machineWeight: '15,500 lbs (7,031 kg)',
      driveSpeed: '4.5 mph (7.2 km/h)',
      gradeability: '50%',
    },
  },
  {
    id: 2,
    name: 'JLG 530LRT',
    manufacturer: 'JLG',
    image: '/images/equipment/5390.jpg',
    keySpecs: {
      maxWorkingHeight: '53 ft (16.2 m)',
      maxPlatformCapacity: '2,250 lbs (1,020 kg)',
    },
    additionalSpecs: {
      platformSize: '6 ft 6 in x 15 ft 6 in (1.98 x 4.72 m)',
      machineWeight: '14,200 lbs (6,441 kg)',
      driveSpeed: '4.0 mph (6.4 km/h)',
      gradeability: '45%',
    },
  },
  {
    id: 3,
    name: 'Genie GS-4390 RT',
    manufacturer: 'Genie',
    image: '/images/equipment/5390.jpg',
    keySpecs: {
      maxWorkingHeight: '49 ft (14.9 m)',
      maxPlatformCapacity: '1,500 lbs (680 kg)',
    },
    additionalSpecs: {
      platformSize: '7 ft 5 in x 15 ft 6 in (2.26 x 4.72 m)',
      machineWeight: '12,500 lbs (5,670 kg)',
      driveSpeed: '4.5 mph (7.2 km/h)',
      gradeability: '50%',
    },
  },
  {
    id: 4,
    name: 'JLG 430LRT',
    manufacturer: 'JLG',
    image: '/images/equipment/5390.jpg',
    keySpecs: {
      maxWorkingHeight: '43 ft (13.1 m)',
      maxPlatformCapacity: '1,500 lbs (680 kg)',
    },
    additionalSpecs: {
      platformSize: '6 ft 6 in x 13 ft 6 in (1.98 x 4.11 m)',
      machineWeight: '11,500 lbs (5,216 kg)',
      driveSpeed: '4.0 mph (6.4 km/h)',
      gradeability: '45%',
    },
  },
  {
    id: 5,
    name: 'Genie GS-3390 RT',
    manufacturer: 'Genie',
    image: '/images/equipment/5390.jpg',
    keySpecs: {
      maxWorkingHeight: '39 ft (11.9 m)',
      maxPlatformCapacity: '2,500 lbs (1,134 kg)',
    },
    additionalSpecs: {
      platformSize: '7 ft 5 in x 13 ft 2 in (2.26 x 4.01 m)',
      machineWeight: '11,000 lbs (4,990 kg)',
      driveSpeed: '4.5 mph (7.2 km/h)',
      gradeability: '50%',
    },
  },
  {
    id: 6,
    name: 'JLG 330LRT',
    manufacturer: 'JLG',
    image: '/images/equipment/5390.jpg',
    keySpecs: {
      maxWorkingHeight: '33 ft (10.06 m)',
      maxPlatformCapacity: '1,500 lbs (680 kg)',
    },
    additionalSpecs: {
      platformSize: '6 ft 6 in x 13 ft (1.98 x 3.96 m)',
      machineWeight: '10,800 lbs (4,899 kg)',
      driveSpeed: '4.0 mph (6.4 km/h)',
      gradeability: '45%',
    },
  },
];

export default function DieselScissorLiftsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [specsAnchorEl, setSpecsAnchorEl] = useState<null | HTMLElement>(null);
  const [activeModelId, setActiveModelId] = useState<number | null>(null);

  // Map mock model names to database equipment UUIDs
  const getEquipmentUUID = (modelName: string): string => {
    const equipmentMap: {[key: string]: string} = {
      'Genie GS-5390 RT': '1702d722-bcac-4cf0-ae31-76c166816e12',
      'JLG 530LRT': 'f51850b3-9b68-40a0-bbe1-426ad3a198fd',
      'Genie GS-4390 RT': '15c91a3e-4443-4cbf-8333-f65e3a5ebb8a',
      'JLG 430LRT': 'f74e6cee-8df0-40b8-8d24-3245c008b836',
      'Genie GS-3390 RT': '1803c8e3-0ac2-4b6c-b18f-ee4ab0258ffa',
      'JLG 330LRT': '46b60884-2512-46df-8e5b-a0b3b0c788ab',
    };
    
    return equipmentMap[modelName] || modelName; // Fallback to original if no mapping found
  };

  const handleAddToQuote = (model: any) => {
    // Create pending item and let QuoteManager handle the workflow
    const pendingItem = {
      modelId: getEquipmentUUID(model.name), // Use correct equipment UUID
      modelName: model.name,
      manufacturer: model.manufacturer,
      category: 'Diesel Scissor Lifts',
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
              Diesel Scissor Lifts
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
                        "The Genie GS-5390 RT rough terrain scissor lift delivers exceptional power and capacity for demanding outdoor applications. With a massive 2,500 lb platform capacity and 50% gradeability, it excels in challenging construction and industrial environments."
                        : model.id === 2 ?
                        "The JLG 530LRT rough terrain scissor lift combines robust performance with versatility. Its powerful diesel engine and 45% gradeability make it perfect for uneven terrain, while the spacious platform accommodates both workers and materials efficiently."
                        : model.id === 3 ?
                        "The Genie GS-4390 RT scissor lift offers impressive height and capacity for outdoor work. With its robust 4-wheel drive system and auto-leveling outriggers, it provides stable operation even on challenging terrain."
                        : model.id === 4 ?
                        "The JLG 430LRT rough terrain scissor lift delivers reliable performance in a compact package. Its powerful diesel engine and rugged design make it ideal for construction sites, while maintaining excellent maneuverability."
                        : model.id === 5 ?
                        "The Genie GS-3390 RT scissor lift combines power with efficiency. Its high platform capacity and excellent gradeability make it perfect for outdoor applications requiring both height and substantial load-carrying capability."
                        : model.id === 6 ?
                        "The JLG 330LRT rough terrain scissor lift offers exceptional maneuverability in a compact design. Its robust construction and powerful drive system make it ideal for outdoor applications where space is limited but terrain handling is essential."
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
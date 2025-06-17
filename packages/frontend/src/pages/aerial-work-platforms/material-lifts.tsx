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
} from '@mui/icons-material';
import { Layout } from '@/components/Layout/Layout';
import { FloatingQuoteCart } from '@/components/QuoteCart/FloatingQuoteCart';
import { addItem } from '@/store/quoteSlice';
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

interface QuoteItem {
  modelId: number;
  quantity: number;
  startDate: Date | null;
  endDate: Date | null;
  sameDatesForAll: boolean;
}

export default function MaterialLiftsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [quoteItem, setQuoteItem] = useState<QuoteItem>({
    modelId: 0,
    quantity: 1,
    startDate: null,
    endDate: null,
    sameDatesForAll: true,
  });
  const [specsAnchorEl, setSpecsAnchorEl] = useState<null | HTMLElement>(null);
  const [activeModelId, setActiveModelId] = useState<number | null>(null);

  const handleAddToQuote = (model: any) => {
    setSelectedModel(model);
    setQuoteItem({
      modelId: model.id,
      quantity: 1,
      startDate: null,
      endDate: null,
      sameDatesForAll: true,
    });
    setOpenModal(true);
  };

  const handleQuantityChange = (increment: boolean) => {
    setQuoteItem(prev => ({
      ...prev,
      quantity: increment ? prev.quantity + 1 : Math.max(1, prev.quantity - 1),
    }));
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedModel(null);
  };

  const handleQuoteSubmit = () => {
    if (selectedModel && quoteItem.startDate && quoteItem.endDate) {
      const dates = quoteItem.sameDatesForAll
        ? Array(quoteItem.quantity).fill({
            startDate: quoteItem.startDate.toISOString(),
            endDate: quoteItem.endDate.toISOString(),
          })
        : [
            {
              startDate: quoteItem.startDate.toISOString(),
              endDate: quoteItem.endDate.toISOString(),
            },
          ];

      dispatch(
        addItem({
          modelId: selectedModel.id,
          modelName: selectedModel.name,
          manufacturer: selectedModel.manufacturer,
          category: 'Material Lifts',
          quantity: quoteItem.quantity,
          dates,
        })
      );
      handleModalClose();
    }
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
      <Box sx={{ backgroundColor: 'white', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
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
                background: 'linear-gradient(to right, #155799, #159957)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
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
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'grey.50',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                      '& img': {
                        transform: 'scale(1.1)',
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
                  <Box sx={{ 
                    p: 3,
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'grey.50',
                    position: 'relative',
                    minHeight: '280px',
                  }}>
                    {/* Model Name */}
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        background: 'linear-gradient(to right, #155799, #159957)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        fontWeight: 600,
                      }}
                    >
                      {model.name}
                    </Typography>

                    {/* Model Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mb: 2,
                        lineHeight: 1.6,
                        fontSize: '0.875rem',
                        flexGrow: 1,
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
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: 'auto',
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: 'grey.200',
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
                          variant="subtitle1"
                          sx={{
                            color: '#155799',
                            fontWeight: 500,
                            fontSize: '0.9rem',
                          }}
                        >
                          View Specifications
                        </Typography>
                        <ChevronRight 
                          sx={{
                            ml: 1,
                            background: 'linear-gradient(to right, #155799, #159957)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            fontSize: '1.2rem',
                            transform: activeModelId === model.id && specsAnchorEl ? 'rotate(90deg)' : 'none',
                            transition: 'transform 0.2s',
                          }}
                        />
                      </Box>

                      <IconButton
                        onClick={() => handleAddToQuote(model)}
                        sx={{
                          padding: 0.5,
                          '&:hover': {
                            backgroundColor: 'transparent',
                          },
                        }}
                      >
                        <AddCircle sx={{ color: '#155799', fontSize: '1.5rem' }} />
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
                            color: 'text.secondary',
                            fontWeight: 600,
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
                            fontWeight: 600,
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
                            color: 'text.secondary',
                            fontWeight: 600,
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
                            fontWeight: 600,
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
                              color: 'text.secondary',
                              fontWeight: 500,
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
                              fontWeight: 500,
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

          {/* Add to Quote Modal */}
          <Modal
            open={openModal}
            onClose={handleModalClose}
            aria-labelledby="add-to-quote-modal"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: 500 },
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 1,
              }}
            >
              <Typography variant="h6" component="h2" gutterBottom>
                Add to Quote
              </Typography>
              {selectedModel && (
                <Typography variant="subtitle1" sx={{ mb: 3 }}>
                  {selectedModel.name}
                </Typography>
              )}

              {/* Quantity Selector */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 2 }}>Quantity:</Typography>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(false)}
                >
                  <Remove />
                </IconButton>
                <Typography sx={{ mx: 2 }}>{quoteItem.quantity}</Typography>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(true)}
                >
                  <Add />
                </IconButton>
              </Box>

              {/* Date Selection Type */}
              <RadioGroup
                value={quoteItem.sameDatesForAll}
                onChange={(e) => setQuoteItem(prev => ({
                  ...prev,
                  sameDatesForAll: e.target.value === 'true'
                }))}
                sx={{ mb: 3 }}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="Same dates for all units"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="Different dates per unit"
                />
              </RadioGroup>

              {/* Date Pickers */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ mb: 3 }}>
                  {Array.from({ length: quoteItem.sameDatesForAll ? 1 : quoteItem.quantity }).map((_, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      {!quoteItem.sameDatesForAll && (
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Unit {index + 1}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <DatePicker
                          label="Start Date"
                          value={quoteItem.startDate}
                          onChange={(newValue) => setQuoteItem(prev => ({
                            ...prev,
                            startDate: newValue
                          }))}
                          sx={{ flex: 1 }}
                        />
                        <DatePicker
                          label="End Date"
                          value={quoteItem.endDate}
                          onChange={(newValue) => setQuoteItem(prev => ({
                            ...prev,
                            endDate: newValue
                          }))}
                          sx={{ flex: 1 }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </LocalizationProvider>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                <Button 
                  onClick={handleModalClose}
                  sx={{
                    color: '#155799',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleQuoteSubmit}
                  sx={{
                    borderRadius: '50px',
                    backgroundColor: 'white',
                    border: '1px solid',
                    borderColor: 'grey.300',
                    background: 'white',
                    px: 4,
                    '&:hover': {
                      backgroundColor: 'grey.50',
                      borderColor: 'grey.400',
                    },
                    '& .MuiButton-label': {
                      background: 'linear-gradient(to right, #155799, #159957)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      background: 'linear-gradient(to right, #155799, #159957)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      fontWeight: 500,
                    }}
                  >
                    Add to Quote
                  </Typography>
                </Button>
              </Box>
            </Box>
          </Modal>

          {/* Floating Quote Cart */}
          <FloatingQuoteCart />
        </Container>
      </Box>
    </Layout>
  );
} 
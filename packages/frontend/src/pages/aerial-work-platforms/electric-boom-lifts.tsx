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

interface QuoteItem {
  modelId: number;
  quantity: number;
  startDate: Date | null;
  endDate: Date | null;
  sameDatesForAll: boolean;
}

export default function ElectricBoomLiftsPage() {
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
          category: 'Electric Boom Lifts',
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
              Electric Boom Lifts
            </Typography>
          </Box>

          {/* Models Grid */}
          <Grid container spacing={3}>
            {boomLiftModels.map((model) => (
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

                      {/* Max Platform Capacity */}
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
                          MAX PLATFORM CAPACITY
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
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
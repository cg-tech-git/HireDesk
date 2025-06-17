import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '@/store/quoteSlice';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Modal,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  IconButton,
  Popover,
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Remove,
  ChevronRight,
  AddCircle,
} from '@mui/icons-material';
import { Layout } from '@/components/Layout/Layout';
import { useRouter } from 'next/router';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FloatingQuoteCart } from '@/components/QuoteCart/FloatingQuoteCart';

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

interface QuoteItem {
  modelId: number;
  quantity: number;
  startDate: Date | null;
  endDate: Date | null;
  sameDatesForAll: boolean;
}

export default function ArticulatedDieselBoomLiftsPage() {
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
          category: 'Articulated Diesel Boom Lifts',
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
              Articulated Diesel Boom Lifts
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
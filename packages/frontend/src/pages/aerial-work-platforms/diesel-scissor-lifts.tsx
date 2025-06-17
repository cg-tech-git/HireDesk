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

interface QuoteItem {
  modelId: number;
  quantity: number;
  startDate: Date | null;
  endDate: Date | null;
  sameDatesForAll: boolean;
}

export default function DieselScissorLiftsPage() {
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
          category: 'Diesel Scissor Lifts',
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
              Diesel Scissor Lifts
            </Typography>
          </Box>

          {/* Models Grid */}
          <Grid container spacing={3}>
            {scissorLiftModels.map((model) => (
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
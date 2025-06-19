import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Grid,
  Divider,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { GradingOutlined } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CustomerDetails } from '@/types/quote';

interface QuoteItem {
  quantity: number;
  startDate: Date | null;
  endDate: Date | null;
  sameDatesForAll: boolean;
}

interface CombinedQuoteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { 
    customerDetails: CustomerDetails; 
    quoteData: { quantity: number; dates: any[] } 
  }) => void;
  selectedModel: {
    id: number;
    name: string;
    manufacturer: string;
  } | null;
  existingCustomerDetails: CustomerDetails | null;
}

// Mock customer data (will be replaced with actual login data later)
const MOCK_CUSTOMER_DATA: Omit<CustomerDetails, 'projectRef'> = {
  name: 'John Smith',
  email: 'john.smith@company.com',
  phone: '+971 50 123 4567',
  company: 'Construction Solutions LLC',
};

export function CombinedQuoteModal({ 
  open, 
  onClose, 
  onSubmit, 
  selectedModel, 
  existingCustomerDetails 
}: CombinedQuoteModalProps) {
  const [projectRef, setProjectRef] = useState('');
  const [projectRefError, setProjectRefError] = useState('');

  const [quoteItem, setQuoteItem] = useState<QuoteItem>({
    quantity: 1,
    startDate: null,
    endDate: null,
    sameDatesForAll: true,
  });

  // Load existing project reference if available
  useEffect(() => {
    if (existingCustomerDetails?.projectRef) {
      setProjectRef(existingCustomerDetails.projectRef);
    }
  }, [existingCustomerDetails]);

  const validateProjectRef = () => {
    if (!projectRef.trim()) {
      setProjectRefError('Project reference is required');
      return false;
    }
    setProjectRefError('');
    return true;
  };

  // Use useMemo to ensure validation re-runs when dependencies change
  const isFormValid = React.useMemo(() => {
    // If we have existing customer details, we don't need to validate project ref again
    const projectValid = existingCustomerDetails ? true : projectRef.trim().length > 0;
    const quoteValid = !!(quoteItem.startDate && quoteItem.endDate);
    
    const isValid = projectValid && quoteValid;
    
    console.log('Form validation:', {
      existingCustomerDetails: !!existingCustomerDetails,
      projectRef: projectRef,
      projectValid,
      startDate: quoteItem.startDate,
      endDate: quoteItem.endDate,
      quoteValid,
      isValid
    });
    
    return isValid;
  }, [existingCustomerDetails, projectRef, quoteItem.startDate, quoteItem.endDate]);

  const handleQuantityChange = (increment: boolean) => {
    setQuoteItem(prev => ({
      ...prev,
      quantity: increment ? prev.quantity + 1 : Math.max(1, prev.quantity - 1),
    }));
  };

  const handleProjectRefChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectRef(event.target.value);
    // Clear error when user starts typing
    if (projectRefError) {
      setProjectRefError('');
    }
  };

  const handleSubmit = () => {
    if (!isFormValid || !quoteItem.startDate || !quoteItem.endDate) {
      return;
    }

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

    // Create customer details combining mock data with project reference
    const customerDetails: CustomerDetails = existingCustomerDetails || {
      ...MOCK_CUSTOMER_DATA,
      projectRef: projectRef.trim(),
    };

    onSubmit({
      customerDetails,
      quoteData: {
        quantity: quoteItem.quantity,
        dates,
      }
    });

    // Reset form
    if (!existingCustomerDetails) {
      setProjectRef('');
    }
    setQuoteItem({
      quantity: 1,
      startDate: null,
      endDate: null,
      sameDatesForAll: true,
    });
    setProjectRefError('');
  };

  const handleClose = () => {
    // Reset forms
    if (!existingCustomerDetails) {
      setProjectRef('');
    }
    setQuoteItem({
      quantity: 1,
      startDate: null,
      endDate: null,
      sameDatesForAll: true,
    });
    setProjectRefError('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="combined-quote-modal"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 600 },
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 1,
          overflow: 'hidden',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <Box sx={{ backgroundColor: '#f8f9fa', px: 4, py: 3, borderBottom: '1px solid #e9ecef' }}>
          <Typography 
            variant="h6" 
            component="h2"
            sx={{
              color: '#183057',
              fontWeight: 600,
              mb: 1,
            }}
          >
            {existingCustomerDetails ? 'Add to Quote' : 'Create Quote'}
          </Typography>
          {selectedModel && (
            <Typography variant="subtitle1" sx={{ color: '#6c757d', fontWeight: 400 }}>
              {selectedModel.name}
            </Typography>
          )}
        </Box>

        {/* Body */}
        <Box sx={{ p: 4, maxHeight: '60vh', overflow: 'auto' }}>
          {/* Customer Details Section - Always Visible */}
          <Box sx={{ mb: 4, p: 3, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
            <Typography variant="subtitle1" sx={{ color: '#183057', fontWeight: 500, mb: 2 }}>
              Customer Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">Customer</Typography>
                <Typography variant="body1">{existingCustomerDetails?.name || MOCK_CUSTOMER_DATA.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">Company</Typography>
                <Typography variant="body1">{existingCustomerDetails?.company || MOCK_CUSTOMER_DATA.company}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">Email</Typography>
                <Typography variant="body1">{existingCustomerDetails?.email || MOCK_CUSTOMER_DATA.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">Phone</Typography>
                <Typography variant="body1">{existingCustomerDetails?.phone || MOCK_CUSTOMER_DATA.phone}</Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Project Reference Input */}
          {!existingCustomerDetails && (
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                label="Project Reference"
                value={projectRef}
                onChange={handleProjectRefChange}
                error={!!projectRefError}
                helperText={projectRefError || 'Enter a reference to help identify this project'}
                required
                size="small"
                placeholder="e.g., Office Renovation 2024, Site A Construction"
              />
            </Box>
          )}

          {/* Show existing project reference if continuing existing quote */}
          {existingCustomerDetails && (
            <Box sx={{ mb: 4, p: 2, backgroundColor: '#f0f7ff', borderRadius: 1, border: '1px solid #e0f2fe' }}>
              <Typography variant="body2" color="textSecondary">Project</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{existingCustomerDetails.projectRef}</Typography>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Equipment Details Section */}
          <Typography variant="subtitle1" sx={{ color: '#183057', fontWeight: 500, mb: 3 }}>
            Equipment Details
          </Typography>

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
                      format="dd/MM/yyyy" 
                      sx={{ flex: 1 }}
                    />
                    <DatePicker
                      label="End Date"
                      value={quoteItem.endDate}
                      onChange={(newValue) => setQuoteItem(prev => ({
                        ...prev,
                        endDate: newValue
                      }))}
                      format="dd/MM/yyyy" 
                      sx={{ flex: 1 }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </LocalizationProvider>
        </Box>

        {/* Footer */}
        <Box sx={{ 
          backgroundColor: '#f8f9fa', 
          px: 4, 
          py: 3, 
          borderTop: '1px solid #e9ecef', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center',
          position: 'sticky',
          bottom: 0,
          zIndex: 1
        }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={<GradingOutlined />}
            disabled={!isFormValid}
            sx={{
              backgroundColor: '#183057',
              px: 4,
              py: 1.5,
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              borderRadius: 1,
              minHeight: '44px',
              '&:hover': {
                backgroundColor: '#1e3b64',
              },
              '&:disabled': {
                backgroundColor: '#e0e0e0 !important',
                color: '#9e9e9e !important',
                cursor: 'not-allowed',
              },
              '&:not(:disabled)': {
                backgroundColor: '#183057',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#1e3b64',
                },
              },
            }}
          >
            Add to Quote
          </Button>
        </Box>
      </Box>
    </Modal>
  );
} 
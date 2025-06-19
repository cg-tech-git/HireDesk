import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  Stack,
  Paper,
  Popover,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { 
  Close as CloseIcon,
  DescriptionOutlined as DescriptionIcon,
  SaveAlt as SaveAltIcon,
  DeleteForever as DeleteForeverIcon,
  ChevronRight as ChevronRightIcon 
} from '@mui/icons-material';
import { RootState } from '@/store/store';
import { saveQuote, SavedQuote } from '@/store/savedQuotesSlice';
import { clearQuote } from '@/store/quoteSlice';
import { downloadQuotePDF } from '@/utils/pdf-generator';
import { toast } from 'react-hot-toast';
import { colors } from '@/styles/colors';

interface QuoteQuickViewProps {
  open: boolean;
  onClose: () => void;
}

export function QuoteQuickView({ open, onClose }: QuoteQuickViewProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items, customerDetails } = useSelector((state: RootState) => state.quote);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  // Add number formatting function
  const formatNumber = (value: number): string => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const calculateTotalDays = (dates: { startDate: string | null; endDate: string | null }[]) => {
    return dates.reduce((total, date) => {
      if (date.startDate && date.endDate) {
        const start = new Date(date.startDate);
        const end = new Date(date.endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return total + days;
      }
      return total;
    }, 0);
  };

  const calculateSubtotal = () => {
    // This is a dummy calculation - replace with actual pricing logic
    return items.reduce((total, item) => {
      const days = calculateTotalDays(item.dates);
      return total + (days * 100 * item.quantity); // Assuming £100 per day
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const vat = subtotal * 0.05;
  const total = subtotal + vat;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleSaveAndPrint = () => {
    if (!customerDetails) {
      toast.error('Customer details are missing. Please start a new quote.');
      return;
    }

    // Generate quote number
    const quoteNumber = `HD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    // Create saved quote object
    const savedQuote: SavedQuote = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      quoteNumber,
      projectRef: customerDetails.projectRef,
      createdAt: new Date().toISOString(),
      items,
      customer: {
        name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone,
        company: customerDetails.company,
      },
      totals: {
        subtotal,
        vat,
        total,
      },
      status: 'draft',
    };
    
    // Save to Redux store (and localStorage)
    dispatch(saveQuote(savedQuote));
    
    // Download PDF
    downloadQuotePDF(savedQuote);
    
    // Clear current quote
    dispatch(clearQuote());
    
    // Show success message
    toast.success('Quote generated and downloaded successfully!');
    
    // Close dialog
    onClose();
    
    // Navigate to quotes page
    router.push('/quotes');
    handleMenuClose();
  };



  const handleClearQuote = () => {
    dispatch(clearQuote());
    toast.success('Quote cleared successfully');
    onClose();
    handleMenuClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1,
            maxHeight: '90vh',
            '& .MuiDialogContent-root': {
              pt: 5,
              px: 6,
              pb: 6,
            },
            '& .MuiDialogTitle-root': {
              px: 6,
              py: 3,
              bgcolor: '#f8f9fa',
              borderBottom: '1px solid #e9ecef'
            }
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                borderRadius: '4px',
                p: 1,
                ml: -1,
              }}
              onClick={handleMenuOpen}
            >
              <DescriptionIcon sx={{ color: '#183057', fontSize: '1.25rem' }} />
              <Typography component="span" sx={{ lineHeight: 1 }}>
                Quote Preview
              </Typography>
              <ChevronRightIcon 
                sx={{ 
                  color: '#183057',
                  transform: Boolean(menuAnchorEl) ? 'rotate(90deg)' : 'none',
                  transition: 'transform 0.2s',
                }} 
              />
            </Box>
          </Box>
          
          <Popover
            open={Boolean(menuAnchorEl)}
            anchorEl={menuAnchorEl}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            sx={{
              '& .MuiPaper-root': {
                borderRadius: 4,
                boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0',
                backgroundColor: '#fcfcfd',
                width: 200,
                py: 1,
                marginTop: '-24px',
              },
            }}
          >
            <MenuItem
              onClick={handleClearQuote}
              sx={{ 
                minHeight: 48,
                mx: 2,
                borderRadius: '24px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#183057' }}>
                <DeleteForeverIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Clear quote"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '14px',
                  },
                }}
              />
            </MenuItem>
            
            <MenuItem
              onClick={handleSaveAndPrint}
              sx={{ 
                minHeight: 48,
                mx: 2,
                borderRadius: '24px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#183057' }}>
                <SaveAltIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Save and print"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '14px',
                  },
                }}
              />
            </MenuItem>
          </Popover>
        </DialogTitle>

        <DialogContent>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              mt: 2,
              backgroundColor: 'white',
              position: 'relative',
              borderRadius: 2,
            }}
          >
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              {/* Title and Logo Row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5" sx={{ color: '#183057', fontWeight: 600 }}>
                  HireDesk Quotation
                </Typography>
                <img 
                  src="/images/brands/alps_logo.png" 
                  alt="Alps Logo" 
                  style={{ 
                    height: '40px',
                    width: 'auto',
                    objectFit: 'contain',
                  }} 
                />
              </Box>

              {/* Details Row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="#183057">
                    Quote #: HD-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
                  </Typography>
                  <Typography variant="body2" color="#183057">
                    Date: {new Date().toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="#183057">
                    Phone: +971 4443 6360
                  </Typography>
                  <Typography variant="body2" color="#183057">
                    Email: info@allaith.com
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  {customerDetails ? (
                    <>
                      <Typography variant="body2" color="#183057">
                        Customer: {customerDetails.company}
                      </Typography>
                      <Typography variant="body2" color="#183057">
                        Name: {customerDetails.name}
                      </Typography>
                      <Typography variant="body2" color="#183057">
                        Email: {customerDetails.email}
                      </Typography>
                      <Typography variant="body2" color="#183057">
                        Contact: {customerDetails.phone}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="body2" color="#183057">
                        Customer: Demo Customer
                      </Typography>
                      <Typography variant="body2" color="#183057">
                        Name: Demo Name
                      </Typography>
                      <Typography variant="body2" color="#183057">
                        Email: name@customer.com
                      </Typography>
                      <Typography variant="body2" color="#183057">
                        Contact: +971 550 1234
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Single Attribute Header for all items */}
            {items.length > 0 && (
              <>
                {/* Project Reference */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ color: '#183057', fontWeight: 500 }}>
                    Project: {customerDetails ? customerDetails.projectRef : 'Demo Project'}
                  </Typography>
                </Box>

                {/* Headers for the table */}
                <Box 
                  sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
                    gap: 2,
                    borderBottom: '1px solid #eee',
                    pb: 0.5,
                    mb: 2,
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#183057', fontWeight: 500 }}>
                    Equipment
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#183057', fontWeight: 500 }}>
                    Start
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#183057', fontWeight: 500 }}>
                    End
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#183057', fontWeight: 500, textAlign: 'center' }}>
                    Days
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#183057', fontWeight: 500, textAlign: 'right' }}>
                    Rate/day
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#183057', fontWeight: 500, textAlign: 'right' }}>
                    Amount
                  </Typography>
                </Box>

                {/* Items List */}
                <Stack spacing={1}>
                  {items.map((item, index) => (
                    <Box key={`${item.modelId}-${index}`}>
                      {item.dates.map((date, dateIndex) => {
                        const days = date.startDate && date.endDate 
                          ? Math.ceil((new Date(date.endDate).getTime() - new Date(date.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
                          : 0;
                        
                        return (
                          <Box 
                            key={dateIndex}
                            sx={{ 
                              display: 'grid', 
                              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
                              gap: 2,
                              backgroundColor: (index + dateIndex) % 2 === 0 ? '#f8f9fa' : 'transparent',
                              p: 1,
                              borderRadius: 1,
                              alignItems: 'center',
                            }}
                          >
                            <Box>
                              <Typography variant="body2" sx={{ color: '#183057', fontWeight: 500 }}>
                                {item.modelName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '0.75rem', fontStyle: 'italic' }}>
                                {item.category}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#183057' }}>
                              {date.startDate ? new Date(date.startDate).toLocaleDateString() : '-'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#183057' }}>
                              {date.endDate ? new Date(date.endDate).toLocaleDateString() : '-'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#183057', textAlign: 'center' }}>
                              {days}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#183057', textAlign: 'right', width: '100%' }}>
                              {formatNumber(100)}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#183057', textAlign: 'right', width: '100%' }}>
                              {formatNumber(days * 100 * item.quantity)}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  ))}
                </Stack>
              </>
            )}

            {items.length === 0 && (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="#183057">
                  No items in your quote yet
                </Typography>
              </Box>
            )}

            {items.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                
                {/* Totals */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'flex-end',
                  gap: 2,  // Increased consistent gap between rows
                  mt: 3    // Add margin top after divider
                }}>
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: 'auto 100px',  // Fixed width for amount column
                    gap: 3,
                    width: 'auto'
                  }}>
                    <Typography sx={{ textAlign: 'right' }}>
                      Subtotal:
                    </Typography>
                    <Typography sx={{ textAlign: 'right' }}>
                      {formatNumber(subtotal)}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: 'auto 100px',
                    gap: 3,
                    width: 'auto'
                  }}>
                    <Typography sx={{ textAlign: 'right' }}>
                      VAT (5%):
                    </Typography>
                    <Typography sx={{ textAlign: 'right' }}>
                      {formatNumber(vat)}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: 'auto 100px',
                    gap: 3,
                    width: 'auto',
                    borderTop: '1px solid #e0e0e0',
                    pt: 2  // Padding top after border
                  }}>
                    <Typography variant="subtitle1" sx={{ textAlign: 'right', fontWeight: 600 }}>
                      Total:
                    </Typography>
                    <Typography variant="subtitle1" sx={{ textAlign: 'right', fontWeight: 600 }}>
                      {formatNumber(total)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                  <Typography variant="body2" sx={{ 
                    fontStyle: 'italic',
                    color: '#183057', // Standard text color
                    mb: 3,
                  }}>
                    Thank you for using HireDesk quote automation. A member of our team will contact you at the earliest opportunity to discuss your project requirements. Please note that prices and equipment availability are indicative and subject to final confirmation.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#183057',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        fontSize: '0.75rem',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                      onClick={() => toast.success('Privacy Policy page coming soon')}
                    >
                      Privacy Policy
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#183057',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        fontSize: '0.75rem',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                      onClick={() => toast.success('Terms of Service page coming soon')}
                    >
                      Terms of Service
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </Paper>
        </DialogContent>
      </Dialog>

    </>
  );
} 
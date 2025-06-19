import React, { useState } from 'react';
import { Badge, Fab, Box } from '@mui/material';
import { DescriptionOutlined as DescriptionIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { QuoteQuickView } from './QuoteQuickView';

export function FloatingQuoteCart() {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const quoteItems = useSelector((state: RootState) => state.quote.items);
  const totalItems = quoteItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Badge
          badgeContent={totalItems}
          color="primary"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#10b981',
              color: 'white',
            },
          }}
        >
          <Fab
            color="primary"
            size="small"
            onClick={() => setQuickViewOpen(true)}
            sx={{
              backgroundColor: '#183057',
              '&:hover': {
                backgroundColor: '#1e3b64', // slightly lighter shade for hover
              },
            }}
          >
            <DescriptionIcon />
          </Fab>
        </Badge>
      </Box>

      <QuoteQuickView 
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
} 
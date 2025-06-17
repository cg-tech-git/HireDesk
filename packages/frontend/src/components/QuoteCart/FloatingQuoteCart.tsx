import React from 'react';
import { Badge, Fab, Box } from '@mui/material';
import { DescriptionOutlined as DescriptionIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export function FloatingQuoteCart() {
  const quoteItems = useSelector((state: RootState) => state.quote.items);
  const totalItems = quoteItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
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
            backgroundColor: '#159957',
            color: 'white',
          },
        }}
      >
        <Fab
          color="primary"
          size="small"
          sx={{
            backgroundColor: '#155799',
            '&:hover': {
              backgroundColor: '#1a6ab8', // slightly lighter shade for hover
            },
          }}
        >
          <DescriptionIcon />
        </Fab>
      </Badge>
    </Box>
  );
} 
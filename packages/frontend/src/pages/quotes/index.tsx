import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TablePagination,
  Tooltip,
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { Layout } from '@/components/Layout/Layout';
import { RootState } from '@/store/store';
import { SavedQuote } from '@/store/savedQuotesSlice';
import { format } from 'date-fns';
import { openQuotePDFInNewTab, downloadQuotePDF } from '@/utils/pdf-generator';

export default function QuotesPage() {
  const savedQuotes = useSelector((state: RootState) => state.savedQuotes.quotes);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredQuotes = savedQuotes;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewPDF = (quote: SavedQuote) => {
    openQuotePDFInNewTab(quote);
  };

  const handleDownloadPDF = (quote: SavedQuote) => {
    downloadQuotePDF(quote);
  };



  const paginatedQuotes = filteredQuotes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Layout>
      <Box sx={{ 
        backgroundColor: '#fdfdfd', 
        minHeight: '100vh',
        mx: -3, // Negate Layout's horizontal padding
        px: 3,  // Add it back for content
      }}>
        <Container maxWidth="lg" sx={{ pt: 6 }}>
        {filteredQuotes.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <PdfIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No quotes found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You haven't saved any quotes yet. Create a quote and save it to see it here.
            </Typography>
          </Paper>
        ) : (
          <>
            <TableContainer 
              component={Paper} 
              sx={{ 
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                borderRadius: 2,
              }}
            >
              <Table>
                <TableHead>
                              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600, color: '#183057', fontSize: '0.875rem' }}>Quote Number</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#183057', fontSize: '0.875rem' }}>Project</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#183057', fontSize: '0.875rem' }}>Date Created</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#183057', fontSize: '0.875rem' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#183057', fontSize: '0.875rem' }}>Company</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#183057', fontSize: '0.875rem' }} align="center">Items</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#183057', fontSize: '0.875rem' }} align="right">Total</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#183057', fontSize: '0.875rem' }} align="center">Actions</TableCell>
            </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedQuotes.map((quote) => (
                    <TableRow key={quote.id} hover>
                      <TableCell sx={{ color: '#183057', fontSize: '0.875rem' }}>
                        {quote.quoteNumber}
                      </TableCell>
                      <TableCell sx={{ color: '#183057', fontSize: '0.875rem' }}>
                        {quote.projectRef || '-'}
                      </TableCell>
                      <TableCell sx={{ color: '#183057', fontSize: '0.875rem' }}>
                        {format(new Date(quote.createdAt), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell sx={{ color: '#183057', fontSize: '0.875rem' }}>{quote.customer.name}</TableCell>
                      <TableCell sx={{ color: '#183057', fontSize: '0.875rem' }}>{quote.customer.company}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={`${quote.items.length} items`} 
                          size="small" 
                          sx={{ 
                            backgroundColor: '#e0f2fe', 
                            color: '#183057',
                            fontSize: '0.875rem',
                            '& .MuiChip-label': {
                              fontSize: '0.875rem'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ color: '#183057', fontSize: '0.875rem' }}>
                        {quote.totals.total.toLocaleString('en-US', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="Download PDF">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDownloadPDF(quote)}
                              sx={{ 
                                color: '#183057',
                                '&:hover': {
                                  backgroundColor: 'rgba(24, 48, 87, 0.08)',
                                },
                              }}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Open PDF">
                            <IconButton 
                              size="small" 
                              onClick={() => handleViewPDF(quote)}
                              sx={{ 
                                color: '#183057',
                                '&:hover': {
                                  backgroundColor: 'rgba(24, 48, 87, 0.08)',
                                },
                              }}
                            >
                              <PdfIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              component="div"
              count={filteredQuotes.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sx={{ 
                borderTop: '1px solid #e5e7eb',
                backgroundColor: 'white',
              }}
            />
          </>
        )}
      </Container>
      </Box>
    </Layout>
  );
} 
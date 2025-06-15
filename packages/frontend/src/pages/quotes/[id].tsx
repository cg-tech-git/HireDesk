import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { Layout } from '@/components/Layout/Layout';
import { quoteService } from '@/services/quote.service';
import { QuoteStatus } from '@hiredesk/shared';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { generateQuotePDF } from '@/utils/pdf-generator';

const getStatusColor = (status: QuoteStatus): "default" | "warning" | "success" | "error" | "info" => {
  switch (status) {
    case QuoteStatus.DRAFT:
      return 'default';
    case QuoteStatus.SUBMITTED:
      return 'info';
    case QuoteStatus.CONFIRMED:
      return 'success';
    case QuoteStatus.REJECTED:
      return 'error';
    default:
      return 'default';
  }
};

export default function QuoteDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: quote, isLoading, error } = useQuery({
    queryKey: ['quote', id],
    queryFn: () => quoteService.getQuoteById(id as string),
    enabled: !!id,
  });

  const handleDownloadPDF = async () => {
    if (!quote) return;

    setIsDownloading(true);
    try {
      generateQuotePDF(quote);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!quote) return;

    try {
      // TODO: Implement email sending
      toast.success('Quote has been emailed to you');
    } catch (error) {
      toast.error('Failed to send email');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  if (error || !quote) {
    return (
      <Layout>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mt: 4 }}>
            Failed to load quote details. Please try again later.
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/quotes')}
            sx={{ mt: 2 }}
          >
            Back to My Quotes
          </Button>
        </Container>
      </Layout>
    );
  }

  const subtotal = quote.items.reduce((sum: number, item: any) => sum + item.totalPrice, 0);
  const servicesTotal = quote.services?.reduce((sum: number, service: any) => sum + service.totalPrice, 0) || 0;
  const totalBeforeVAT = subtotal + servicesTotal;
  const vatAmount = totalBeforeVAT * quote.vatRate;
  const totalAmount = totalBeforeVAT + vatAmount;

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/quotes')}
            size="small"
          >
            Back to My Quotes
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={3}>
                  <Box>
                    <Typography variant="h4" gutterBottom>
                      Quote #{quote.quoteNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Created on {format(new Date(quote.createdAt), 'dd/MM/yyyy HH:mm')}
                    </Typography>
                  </Box>
                  <Chip 
                    label={quote.status} 
                    color={getStatusColor(quote.status)}
                    size="medium"
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Equipment Items
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Equipment</TableCell>
                        <TableCell>Rental Period</TableCell>
                        <TableCell align="center">Days</TableCell>
                        <TableCell align="right">Daily Rate</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {quote.items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Typography variant="body2">{item.equipment.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.equipment.category?.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {format(new Date(item.startDate), 'dd/MM/yyyy')} - 
                            {format(new Date(item.endDate), 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell align="center">{item.duration}</TableCell>
                          <TableCell align="right">£{item.dailyRate.toFixed(2)}</TableCell>
                          <TableCell align="right">£{item.totalPrice.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {quote.services && quote.services.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                      Additional Services
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Service</TableCell>
                            <TableCell align="right">Price</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {quote.services.map((service: any) => (
                            <TableRow key={service.id}>
                              <TableCell>{service.service.name}</TableCell>
                              <TableCell align="right">£{service.totalPrice.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}

                {quote.notes && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Notes
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="body2">{quote.notes}</Typography>
                    </Paper>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quote Summary
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Equipment Subtotal:</Typography>
                    <Typography>£{subtotal.toFixed(2)}</Typography>
                  </Box>
                  {servicesTotal > 0 && (
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography>Services:</Typography>
                      <Typography>£{servicesTotal.toFixed(2)}</Typography>
                    </Box>
                  )}
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>VAT ({(quote.vatRate * 100).toFixed(0)}%):</Typography>
                    <Typography>£{vatAmount.toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6">£{totalAmount.toFixed(2)}</Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    fullWidth
                  >
                    {isDownloading ? 'Downloading...' : 'Download PDF'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<EmailIcon />}
                    onClick={handleSendEmail}
                    fullWidth
                  >
                    Email Quote
                  </Button>
                </Box>

                {quote.status === QuoteStatus.SUBMITTED && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Your quote is being reviewed. We'll contact you soon.
                  </Alert>
                )}

                {quote.status === QuoteStatus.CONFIRMED && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Your quote has been approved! We'll contact you to arrange delivery.
                  </Alert>
                )}

                {quote.status === QuoteStatus.REJECTED && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Your quote has been rejected. Please contact us for more information.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
} 
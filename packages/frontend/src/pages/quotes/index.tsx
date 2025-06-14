import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Description as DescriptionIcon, Add as AddIcon } from '@mui/icons-material';
import { Layout } from '@/components/Layout/Layout';
import { api, apiEndpoints } from '@/lib/api';
import { QuoteWithItems, QuoteStatus } from '@hiredesk/shared';
import { format } from 'date-fns';

interface QuotesResponse {
  success: boolean;
  data: QuoteWithItems[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const statusColors: Record<QuoteStatus, 'default' | 'primary' | 'success' | 'error' | 'warning' | 'info'> = {
  [QuoteStatus.DRAFT]: 'default',
  [QuoteStatus.SUBMITTED]: 'primary',
  [QuoteStatus.IN_REVIEW]: 'info',
  [QuoteStatus.CONFIRMED]: 'success',
  [QuoteStatus.REJECTED]: 'error',
  [QuoteStatus.CANCELLED]: 'warning',
};

const statusLabels: Record<QuoteStatus, string> = {
  [QuoteStatus.DRAFT]: 'Draft',
  [QuoteStatus.SUBMITTED]: 'Submitted',
  [QuoteStatus.IN_REVIEW]: 'In Review',
  [QuoteStatus.CONFIRMED]: 'Confirmed',
  [QuoteStatus.REJECTED]: 'Rejected',
  [QuoteStatus.CANCELLED]: 'Cancelled',
};

export default function QuotesPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all');

  const { data, isLoading, error } = useQuery<QuotesResponse>({
    queryKey: ['quotes', statusFilter],
    queryFn: async () => {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await api.get(apiEndpoints.quotes.myQuotes, { params });
      return response.data;
    },
  });

  const handleViewQuote = (quoteId: string) => {
    router.push(`/quotes/${quoteId}`);
  };

  const handleCreateQuote = () => {
    router.push('/basket');
  };

  const handleStatusFilterChange = (event: React.SyntheticEvent, newValue: QuoteStatus | 'all') => {
    setStatusFilter(newValue);
  };

  if (isLoading) {
    return (
      <Layout>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container maxWidth="lg">
          <Alert severity="error">
            Error loading quotes. Please try again later.
          </Alert>
        </Container>
      </Layout>
    );
  }

  const quotes = data?.data || [];

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            My Quotes
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateQuote}
          >
            Create New Quote
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={statusFilter} onChange={handleStatusFilterChange}>
            <Tab label="All" value="all" />
            <Tab label="Draft" value={QuoteStatus.DRAFT} />
            <Tab label="Submitted" value={QuoteStatus.SUBMITTED} />
            <Tab label="In Review" value={QuoteStatus.IN_REVIEW} />
            <Tab label="Confirmed" value={QuoteStatus.CONFIRMED} />
            <Tab label="Rejected" value={QuoteStatus.REJECTED} />
          </Tabs>
        </Box>

        {quotes.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <DescriptionIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No quotes found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {statusFilter === 'all'
                  ? "You haven't created any quotes yet."
                  : `You don't have any ${statusLabels[statusFilter as QuoteStatus].toLowerCase()} quotes.`}
              </Typography>
              <Button variant="contained" onClick={handleCreateQuote}>
                Create Your First Quote
              </Button>
            </CardContent>
          </Card>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Quote Number</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quotes.map((quote) => (
                  <TableRow key={quote.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2">{quote.quoteNumber}</Typography>
                    </TableCell>
                    <TableCell>
                      {format(new Date(quote.createdAt), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      {quote.items?.length || 0} items
                    </TableCell>
                    <TableCell align="right">
                      £{Number(quote.total).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabels[quote.status]}
                        color={statusColors[quote.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        onClick={() => handleViewQuote(quote.id)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Layout>
  );
} 
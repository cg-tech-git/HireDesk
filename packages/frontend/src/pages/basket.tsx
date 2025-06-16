import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Grid,
  Divider,
  TextField,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ShoppingCart as ShoppingCartIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Layout } from '@/components/Layout/Layout';
import { useBasket } from '@/contexts/BasketContext';
import { useAuth } from '@/contexts/AuthContext';
import { format, differenceInDays } from 'date-fns';
import { api, apiEndpoints } from '@/lib/api';
import toast from 'react-hot-toast';

export default function BasketPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { items, removeItem, updateItemDates, clearBasket, getTotalDays } = useBasket();
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editStartDate, setEditStartDate] = useState<Date | null>(null);
  const [editEndDate, setEditEndDate] = useState<Date | null>(null);

  const handleEditDates = (itemId: string, startDate: string, endDate: string) => {
    setEditingItem(itemId);
    setEditStartDate(new Date(startDate));
    setEditEndDate(new Date(endDate));
  };

  const handleSaveEditDates = () => {
    if (editingItem && editStartDate && editEndDate) {
      const duration = differenceInDays(editEndDate, editStartDate) + 1;
      if (duration < 1) {
        toast.error('End date must be after start date');
        return;
      }

      updateItemDates(
        editingItem,
        format(editStartDate, 'yyyy-MM-dd'),
        format(editEndDate, 'yyyy-MM-dd')
      );
      setEditingItem(null);
      setEditStartDate(null);
      setEditEndDate(null);
    }
  };

  const handleSubmitQuote = async () => {
    if (!currentUser) {
      toast.error('Please login to submit a quote');
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your basket is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare quote data
      const quoteData = {
        items: items.map((item) => ({
          equipmentId: item.equipment.id,
          startDate: item.startDate,
          endDate: item.endDate,
        })),
        services: [], // No services for now
        notes: notes || undefined,
      };

      // Create quote
      const response = await api.post(apiEndpoints.quotes.create, quoteData);

      if (response.data.success) {
        toast.success('Quote request submitted successfully!');
        clearBasket();
        router.push(`/quotes/${response.data.data.id}`);
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast.error('Failed to submit quote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              textAlign: 'center',
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 100, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Your basket is empty
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Add equipment to your basket to create a quote request
            </Typography>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          RFQ Basket
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Equipment</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell align="center">Days</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.equipment.id}>
                      <TableCell>
                        <Typography variant="subtitle2">{item.equipment.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.equipment.category?.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{format(new Date(item.startDate), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{format(new Date(item.endDate), 'dd/MM/yyyy')}</TableCell>
                      <TableCell align="center">{item.duration}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleEditDates(item.equipment.id, item.startDate, item.endDate)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeItem(item.equipment.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Additional Notes (Optional)"
                placeholder="Enter any special requirements or notes for your quote..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                inputProps={{ maxLength: 500 }}
                helperText={`${notes.length}/500 characters`}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quote Summary
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Stack spacing={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Equipment Items:</Typography>
                    <Typography fontWeight="bold">{items.length}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Total Rental Days:</Typography>
                    <Typography fontWeight="bold">{getTotalDays()}</Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSubmitQuote}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
                  </Button>
                  <Button
                    variant="text"
                    color="error"
                    fullWidth
                    onClick={clearBasket}
                  >
                    Clear Basket
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Edit Dates Dialog */}
      <Dialog
        open={editingItem !== null}
        onClose={() => setEditingItem(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Rental Dates</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={editStartDate}
                  onChange={(newValue) => setEditStartDate(newValue)}
                  minDate={new Date()}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={editEndDate}
                  onChange={(newValue) => setEditEndDate(newValue)}
                  minDate={editStartDate || new Date()}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </Grid>

            {editStartDate && editEndDate && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2">
                  Duration: {differenceInDays(editEndDate, editStartDate) + 1} days
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingItem(null)}>Cancel</Button>
          <Button onClick={handleSaveEditDates} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
} 
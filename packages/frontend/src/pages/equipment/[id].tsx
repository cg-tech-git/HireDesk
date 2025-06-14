import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  ImageList,
  ImageListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ShoppingCart, ArrowBack } from '@mui/icons-material';
import { Layout } from '@/components/Layout/Layout';
import { equipmentService, categoryService } from '@/services/equipment.service';
import { useBasket } from '@/contexts/BasketContext';
import { differenceInDays, addDays, format } from 'date-fns';
import toast from 'react-hot-toast';

export default function EquipmentDetailPage() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { addItem } = useBasket();
  const [selectedImage, setSelectedImage] = useState(0);
  const [addToBasketOpen, setAddToBasketOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Fetch equipment details
  const {
    data: equipment,
    isLoading: equipmentLoading,
    error: equipmentError,
  } = useQuery({
    queryKey: ['equipment', id],
    queryFn: () => equipmentService.getEquipmentById(id),
    enabled: !!id,
  });

  // Fetch category details
  const { data: category } = useQuery({
    queryKey: ['category', equipment?.categoryId],
    queryFn: () => categoryService.getCategoryById(equipment!.categoryId),
    enabled: !!equipment?.categoryId,
  });

  // Fetch rate cards
  const { data: rateCards = [] } = useQuery({
    queryKey: ['equipment', id, 'rate-cards'],
    queryFn: () => equipmentService.getRateCards(id),
    enabled: !!id,
  });

  const handleAddToBasket = () => {
    if (!startDate || !endDate) {
      toast.error('Please select rental dates');
      return;
    }

    const duration = differenceInDays(endDate, startDate) + 1;
    if (duration < 1) {
      toast.error('End date must be after start date');
      return;
    }

    // Find applicable rate card
    const applicableRate = rateCards.find(
      (rc) => duration >= rc.durationMin && duration <= rc.durationMax
    );

    if (!applicableRate) {
      toast.error('No rate available for the selected duration');
      return;
    }

    // Add to basket
    if (equipment) {
      addItem(
        equipment,
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd')
      );
      setAddToBasketOpen(false);
      setStartDate(null);
      setEndDate(null);
    }
  };

  if (equipmentLoading) {
    return (
      <Layout>
        <Container maxWidth="lg">
          <Box sx={{ mb: 2 }}>
            <Skeleton variant="rectangular" width={100} height={36} />
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={400} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" height={60} />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="rectangular" height={48} sx={{ mt: 2 }} />
            </Grid>
          </Grid>
        </Container>
      </Layout>
    );
  }

  if (equipmentError || !equipment) {
    return (
      <Layout>
        <Container maxWidth="lg">
          <Typography color="error">
            Error loading equipment details. Please try again later.
          </Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/equipment')}
          >
            Back to Catalog
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Images Section */}
          <Grid item xs={12} md={6}>
            <Box>
              <img
                src={equipment.images[selectedImage] || '/placeholder-equipment.jpg'}
                alt={equipment.name}
                style={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 8,
                }}
              />
              {equipment.images.length > 1 && (
                <ImageList sx={{ mt: 2 }} cols={4} gap={8}>
                  {equipment.images.map((image, index) => (
                    <ImageListItem
                      key={index}
                      sx={{
                        cursor: 'pointer',
                        border: selectedImage === index ? '2px solid' : 'none',
                        borderColor: 'primary.main',
                        borderRadius: 1,
                      }}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image}
                        alt={`${equipment.name} ${index + 1}`}
                        style={{ height: 80, objectFit: 'cover' }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </Box>
          </Grid>

          {/* Details Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {equipment.name}
            </Typography>

            <Chip
              label={category?.name || 'Loading...'}
              color="primary"
              sx={{ mb: 2 }}
            />

            <Typography variant="body1" paragraph>
              {equipment.description}
            </Typography>

            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={() => setAddToBasketOpen(true)}
              fullWidth
              sx={{ mt: 3 }}
            >
              Add to Basket
            </Button>

            {/* Specifications */}
            {Object.keys(equipment.specifications).length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Specifications
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      {Object.entries(equipment.specifications).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell component="th" scope="row">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </TableCell>
                          <TableCell align="right">{value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Rate Cards */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Rental Rates
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Duration</TableCell>
                  <TableCell align="right">Daily Rate</TableCell>
                  <TableCell align="right">Example Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rateCards.map((rateCard) => (
                  <TableRow key={rateCard.id}>
                    <TableCell>
                      {rateCard.durationMin === rateCard.durationMax
                        ? `${rateCard.durationMin} day${rateCard.durationMin > 1 ? 's' : ''}`
                        : `${rateCard.durationMin} - ${rateCard.durationMax} days`}
                    </TableCell>
                    <TableCell align="right">
                      £{Number(rateCard.dailyRate).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      £{(Number(rateCard.dailyRate) * rateCard.durationMin).toFixed(2)}
                      {rateCard.durationMin !== rateCard.durationMax && '+'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>

      {/* Add to Basket Dialog */}
      <Dialog
        open={addToBasketOpen}
        onClose={() => setAddToBasketOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select Rental Dates</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  minDate={new Date()}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  minDate={startDate || new Date()}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </Grid>

            {startDate && endDate && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2">
                  Duration: {differenceInDays(endDate, startDate) + 1} days
                </Typography>
                <Typography variant="body2">
                  Period: {format(startDate, 'dd/MM/yyyy')} - {format(endDate, 'dd/MM/yyyy')}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddToBasketOpen(false)}>Cancel</Button>
          <Button onClick={handleAddToBasket} variant="contained">
            Add to Basket
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
} 
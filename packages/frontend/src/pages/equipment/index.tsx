import React, { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Box,
  Skeleton,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Chip,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout/Layout';
import { equipmentService, categoryService } from '@/services/equipment.service';
import { Equipment, EquipmentWithRelations, Category, PaginatedResponse } from '@hiredesk/shared';
import { useBasket } from '@/contexts/BasketContext';
import { toast } from 'react-hot-toast';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function EquipmentPage() {
  const router = useRouter();
  const { addItem } = useBasket();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentWithRelations | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });

  // Fetch equipment
  const { data: equipmentData, isLoading: isLoadingEquipment } = useQuery<PaginatedResponse<EquipmentWithRelations>>({
    queryKey: ['equipment', page, selectedCategory, debouncedSearch],
    queryFn: () => equipmentService.getEquipment({
      page,
      limit: 12,
      categoryId: selectedCategory || undefined,
      search: debouncedSearch || undefined,
    }),
    placeholderData: keepPreviousData,
  });

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (id: string) => {
    router.push(`/equipment/${id}`);
  };

  const handleAddToBasket = (equipment: EquipmentWithRelations) => {
    setSelectedEquipment(equipment);
    setShowDatePicker(true);
  };

  const handleDateSelect = (startDate: Date, endDate: Date) => {
    if (selectedEquipment) {
      addItem(selectedEquipment, startDate.toISOString(), endDate.toISOString());
      setShowDatePicker(false);
      setSelectedEquipment(null);
    }
  };

  const renderEquipmentCard = (equipment: EquipmentWithRelations) => (
    <Grid item xs={12} sm={6} md={4} key={equipment.id}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="200"
          image={equipment.images[0] || '/placeholder-equipment.jpg'}
          alt={equipment.name}
          sx={{ cursor: 'pointer' }}
          onClick={() => router.push(`/equipment/${equipment.id}`)}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="h2">
            {equipment.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {equipment.description.substring(0, 100)}
            {equipment.description.length > 100 && '...'}
          </Typography>
          <Typography variant="body2" color="primary">
            Category: {equipment.category?.name}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            variant="contained"
            fullWidth
            onClick={() => handleAddToBasket(equipment)}
          >
            Add to Basket
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

  const renderSkeleton = () => (
    <>
      {[...Array(6)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" height={32} />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
            </CardContent>
            <CardActions>
              <Skeleton variant="rectangular" width="100%" height={36} />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </>
  );

  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Equipment Catalog
        </Typography>

        {/* Search and Filter Controls */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1); // Reset to first page on category change
                  }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Equipment Grid */}
        {isLoadingEquipment ? (
          renderSkeleton()
        ) : equipmentData?.data.length === 0 ? (
          <Grid item xs={12}>
            <Typography align="center" sx={{ mt: 4 }}>
              No equipment found matching your criteria
            </Typography>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {equipmentData?.data.map(renderEquipmentCard)}
          </Grid>
        )}

        {/* Pagination */}
        {equipmentData && equipmentData.pagination.totalPages > 1 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={equipmentData.pagination.totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Container>

      {/* Date Selection Dialog */}
      <Dialog
        open={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select Rental Dates</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please select your rental start and end dates for {selectedEquipment?.name}
            </Typography>
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
                  Duration: {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowDatePicker(false);
            setStartDate(null);
            setEndDate(null);
          }}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (startDate && endDate) {
                handleDateSelect(startDate, endDate);
              }
            }} 
            variant="contained"
            disabled={!startDate || !endDate}
          >
            Add to Basket
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
} 
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout/Layout';
import { equipmentService, categoryService } from '@/services/equipment.service';
import { Equipment, Category } from '@hiredesk/shared';

export default function EquipmentPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });

  // Fetch equipment
  const {
    data: equipmentData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['equipment', page, debouncedSearch, categoryId],
    queryFn: () =>
      equipmentService.getEquipment({
        page,
        limit: 12,
        search: debouncedSearch || undefined,
        categoryId: categoryId || undefined,
      }),
    keepPreviousData: true,
  });

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (id: string) => {
    router.push(`/equipment/${id}`);
  };

  const renderEquipmentCard = (equipment: Equipment) => (
    <Grid item xs={12} sm={6} md={4} key={equipment.id}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="200"
          image={equipment.images?.[0] || '/placeholder-equipment.jpg'}
          alt={equipment.name}
          sx={{ objectFit: 'cover' }}
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
            onClick={() => handleViewDetails(equipment.id)}
          >
            View Details
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                  value={categoryId}
                  label="Category"
                  onChange={(e) => {
                    setCategoryId(e.target.value);
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
        <Grid container spacing={3}>
          {isLoading ? (
            renderSkeleton()
          ) : error ? (
            <Grid item xs={12}>
              <Typography color="error" align="center">
                Error loading equipment. Please try again later.
              </Typography>
            </Grid>
          ) : equipmentData?.data.length === 0 ? (
            <Grid item xs={12}>
              <Typography align="center" sx={{ py: 8 }}>
                No equipment found matching your criteria.
              </Typography>
            </Grid>
          ) : (
            equipmentData?.data.map(renderEquipmentCard)
          )}
        </Grid>

        {/* Pagination */}
        {equipmentData && equipmentData.pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={equipmentData.pagination.totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Container>
    </Layout>
  );
} 
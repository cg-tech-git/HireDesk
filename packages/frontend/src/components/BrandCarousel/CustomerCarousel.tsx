import React from 'react';
import { Box } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const scroll = keyframes`
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
`;

const CarouselContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  overflow: 'hidden',
  backgroundColor: 'white',
  padding: theme.spacing(1, 4),
  position: 'relative',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    width: '100px',
    height: '100%',
    zIndex: 2,
  },
  '&::before': {
    left: 0,
    background: `linear-gradient(to right, white 0%, transparent 100%)`,
  },
  '&::after': {
    right: 0,
    background: `linear-gradient(to left, white 0%, transparent 100%)`,
  },
}));

const ScrollingWrapper = styled(Box)({
  display: 'flex',
  animation: `${scroll} 30s linear infinite`,
  '&:hover': {
    animationPlayState: 'paused',
  },
});

const BrandItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 2),
  margin: theme.spacing(0, 1),
  width: '169px',
  height: '105px',
  flexShrink: 0,
  position: 'relative',
  '& img': {
    display: 'block',
    margin: '0 auto',
  },
  '&:hover img': {
    transform: 'scale(1.1)',
  },
}));

interface Brand {
  id: string;
  name: string;
  logo: string;
}

interface CustomerCarouselProps {
  brands?: Brand[];
}

// Default customer brands
const defaultBrands: Brand[] = [
  { id: '1', name: 'Emirates', logo: '/images/brands/emirates.png' },
  { id: '2', name: 'DP World', logo: '/images/brands/dpworld.png' },
  { id: '3', name: 'MDL', logo: '/images/brands/mdl.png' },
  { id: '4', name: 'SMS', logo: '/images/brands/sms.png' },
  { id: '5', name: 'People', logo: '/images/brands/people.png' },
  { id: '6', name: 'Expo', logo: '/images/brands/expo.png' },
  { id: '7', name: 'Etihad', logo: '/images/brands/etihad.png' },
  { id: '8', name: 'Khansaheb', logo: '/images/brands/khansaheb.png' },
  { id: '9', name: 'ALEC', logo: '/images/brands/alec.png' },
];

export const CustomerCarousel: React.FC<CustomerCarouselProps> = ({ brands = defaultBrands }) => {
  // Duplicate the brands array multiple times to create seamless loop
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <Box sx={{ py: 0 }}>
      <CarouselContainer>
        <ScrollingWrapper>
          {duplicatedBrands.map((brand, index) => (
            <BrandItem 
              key={`${brand.id}-${index}`}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                }}
              >
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  style={{
                    maxWidth: brand.name === 'SMS' ? '135px' : '150px',
                    maxHeight: brand.name === 'SMS' ? '72px' : '80px',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    transition: 'all 0.3s ease',
                  }}
                  onError={(e) => {
                    console.error(`Failed to load brand logo: ${brand.logo}`);
                  }}
                />
              </Box>
            </BrandItem>
          ))}
        </ScrollingWrapper>
      </CarouselContainer>
    </Box>
  );
}; 
import React from 'react';
import { Box } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const scroll = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
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
  padding: theme.spacing(0, 1),
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

interface BrandCarouselProps {
  brands?: Brand[];
}

// Only show the brands we have logos for
const defaultBrands: Brand[] = [
  { id: '1', name: 'Genie', logo: '/images/brands/genie.svg' },
  { id: '2', name: 'JLG', logo: '/images/brands/jlg.png' },
  { id: '3', name: 'Niftylift', logo: '/images/brands/niftylift.png' },
  { id: '4', name: 'Snorkel', logo: '/images/brands/snorkel.png' },
];

export const BrandCarousel: React.FC<BrandCarouselProps> = ({ brands = defaultBrands }) => {
  // Duplicate the brands array multiple times to create seamless loop
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <Box sx={{ py: 2 }}>
      <CarouselContainer>
        <ScrollingWrapper>
          {duplicatedBrands.map((brand, index) => (
            <BrandItem 
              key={`${brand.id}-${index}`}
              sx={{
                // Add extra margin after Niftylift logo (25px)
                marginRight: brand.name === 'Niftylift' ? '25px' : '0px',
                // Reduce space between Genie and JLG by 5% (~8px)
                marginLeft: brand.name === 'JLG' ? '-8px' : '0px',
              }}
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
                    width: brand.name === 'Genie' ? '105px' : brand.name === 'Niftylift' ? '142.2px' : brand.name === 'Snorkel' ? '142px' : brand.name === 'JLG' ? '89px' : '105px',
                    height: brand.name === 'Genie' ? '52.5px' : brand.name === 'Niftylift' ? '71.1px' : brand.name === 'Snorkel' ? '71px' : brand.name === 'JLG' ? '45px' : '53px',
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
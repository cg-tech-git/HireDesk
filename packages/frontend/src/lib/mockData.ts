import { 
  Equipment, 
  Category, 
  RateCard, 
  QuoteWithItems, 
  QuoteStatus, 
  UserRole,
  QuoteItem,
  Service
} from '@hiredesk/shared';

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Excavators',
    description: 'Heavy-duty excavation equipment',
    parentId: undefined,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Generators',
    description: 'Power generation equipment',
    parentId: undefined,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Compressors',
    description: 'Air compression equipment',
    parentId: undefined,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    name: 'Lifting Equipment',
    description: 'Cranes and lifting gear',
    parentId: undefined,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Mock Rate Cards
export const mockRateCards: Map<string, RateCard[]> = new Map();

// Mock Equipment
export const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'CAT 320D Excavator',
    description: 'Medium-sized hydraulic excavator perfect for construction sites. Features advanced hydraulic system and comfortable operator cabin.',
    categoryId: '1',
    specifications: {
      'Operating Weight': '20,000 kg',
      'Engine Power': '140 HP',
      'Bucket Capacity': '1.2 m³',
      'Max Digging Depth': '6.5 m',
    },
    images: [
      'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=800',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Atlas Copco XAS 185 Compressor',
    description: 'Portable air compressor suitable for pneumatic tools and equipment. Reliable and fuel-efficient.',
    categoryId: '3',
    specifications: {
      'Air Flow': '185 CFM',
      'Working Pressure': '7 bar',
      'Engine Type': 'Diesel',
      'Noise Level': '75 dB',
    },
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22c0d8ef5a?w=800',
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Cummins C150 Generator',
    description: 'Industrial diesel generator for continuous power supply. Ideal for construction sites and events.',
    categoryId: '2',
    specifications: {
      'Power Output': '150 kVA',
      'Voltage': '415V',
      'Frequency': '50 Hz',
      'Fuel Tank': '300 L',
    },
    images: [
      'https://images.unsplash.com/photo-1615962967814-e5c2d0a72b77?w=800',
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    name: 'Manitou MT 1740 Telehandler',
    description: 'Versatile telescopic handler for material handling at height. Essential for construction and industrial applications.',
    categoryId: '4',
    specifications: {
      'Max Lift Height': '17 m',
      'Max Capacity': '4,000 kg',
      'Engine Power': '100 HP',
      'Overall Length': '5.2 m',
    },
    images: [
      'https://images.unsplash.com/photo-1590496793907-51d60a052e2b?w=800',
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '5',
    name: 'JCB 3CX Backhoe Loader',
    description: 'Versatile backhoe loader for digging, loading, and material handling. A construction site essential.',
    categoryId: '1',
    specifications: {
      'Operating Weight': '8,000 kg',
      'Engine Power': '92 HP',
      'Backhoe Digging Depth': '4.7 m',
      'Loader Capacity': '1.1 m³',
    },
    images: [
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800',
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '6',
    name: 'Tower Crane TC6015',
    description: 'High-capacity tower crane for high-rise construction projects. Maximum safety and efficiency.',
    categoryId: '4',
    specifications: {
      'Max Load': '10,000 kg',
      'Jib Length': '60 m',
      'Max Height': '150 m',
      'Lifting Speed': '80 m/min',
    },
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Add rate cards to equipment
mockEquipment.forEach((equipment) => {
  const rateCards: RateCard[] = [
    {
      id: `${equipment.id}-1`,
      equipmentId: equipment.id,
      durationMin: 1,
      durationMax: 3,
      dailyRate: 250,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: `${equipment.id}-2`,
      equipmentId: equipment.id,
      durationMin: 4,
      durationMax: 7,
      dailyRate: 200,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: `${equipment.id}-3`,
      equipmentId: equipment.id,
      durationMin: 8,
      durationMax: 30,
      dailyRate: 150,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];
  mockRateCards.set(equipment.id, rateCards);
});

// Mock Quotes
export const mockQuotes: QuoteWithItems[] = [
  {
    id: '1',
    userId: 'user-1',
    quoteNumber: 'HD-2024-0001',
    status: QuoteStatus.SUBMITTED,
    subtotal: 3000,
    vat: 600,
    total: 3600,
    notes: 'Urgent requirement for construction project',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    submittedAt: new Date('2024-01-15'),
    items: [
      {
        id: '1',
        quoteId: '1',
        equipmentId: '1',
        equipment: mockEquipment[0],
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-10'),
        duration: 10,
        dailyRate: 200,
        total: 2000,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        quoteId: '1',
        equipmentId: '3',
        equipment: mockEquipment[2],
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-05'),
        duration: 5,
        dailyRate: 200,
        total: 1000,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
    ],
    services: [],
  },
  {
    id: '2',
    userId: 'user-1',
    quoteNumber: 'HD-2024-0002',
    status: QuoteStatus.DRAFT,
    subtotal: 1500,
    vat: 300,
    total: 1800,
    notes: 'Equipment for maintenance work',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    items: [
      {
        id: '3',
        quoteId: '2',
        equipmentId: '2',
        equipment: mockEquipment[1],
        startDate: new Date('2024-02-15'),
        endDate: new Date('2024-02-20'),
        duration: 6,
        dailyRate: 250,
        total: 1500,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
      },
    ],
    services: [],
  },
  {
    id: '3',
    userId: 'user-1',
    quoteNumber: 'HD-2024-0003',
    status: QuoteStatus.CONFIRMED,
    subtotal: 5000,
    vat: 1000,
    total: 6000,
    notes: 'Long-term rental for infrastructure project',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    submittedAt: new Date('2024-01-11'),
    reviewedAt: new Date('2024-01-12'),
    items: [
      {
        id: '4',
        quoteId: '3',
        equipmentId: '4',
        equipment: mockEquipment[3],
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-28'),
        duration: 28,
        dailyRate: 150,
        total: 4200,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      },
      {
        id: '5',
        quoteId: '3',
        equipmentId: '5',
        equipment: mockEquipment[4],
        startDate: new Date('2024-02-10'),
        endDate: new Date('2024-02-15'),
        duration: 6,
        dailyRate: 133.33,
        total: 800,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      },
    ],
    services: [],
  },
];

// Mock user for demo
export const mockUser = {
  id: 'demo-user',
  email: 'demo@hiredesk.com',
  displayName: 'Demo User',
  role: UserRole.CUSTOMER,
  company: 'Demo Construction Ltd',
  phone: '+1234567890',
};

// Mock Brands
export const mockBrands = [
  {
    id: '1',
    name: 'Caterpillar',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Caterpillar_logo.svg/200px-Caterpillar_logo.svg.png',
    description: 'World leader in construction equipment',
  },
  {
    id: '2',
    name: 'JCB',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JCB_logo.svg/200px-JCB_logo.svg.png',
    description: 'British manufacturer of equipment for construction',
  },
  {
    id: '3',
    name: 'Komatsu',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Komatsu_company_logos.svg/200px-Komatsu_company_logos.svg.png',
    description: 'Japanese construction equipment manufacturer',
  },
  {
    id: '4',
    name: 'Volvo CE',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Volvo_Construction_Equipment_logo.svg/200px-Volvo_Construction_Equipment_logo.svg.png',
    description: 'Swedish manufacturer of construction equipment',
  },
  {
    id: '5',
    name: 'Manitou',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Manitou_Group_logo.svg/200px-Manitou_Group_logo.svg.png',
    description: 'French manufacturer of handling equipment',
  },
  {
    id: '6',
    name: 'Atlas Copco',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Atlas_Copco_logo.svg/200px-Atlas_Copco_logo.svg.png',
    description: 'Swedish provider of industrial tools and equipment',
  },
  {
    id: '7',
    name: 'Cummins',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Cummins_logo.svg/200px-Cummins_logo.svg.png',
    description: 'American manufacturer of diesel engines',
  },
  {
    id: '8',
    name: 'Liebherr',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Liebherr_Logo.svg/200px-Liebherr_Logo.svg.png',
    description: 'Swiss-German equipment manufacturer',
  },
]; 
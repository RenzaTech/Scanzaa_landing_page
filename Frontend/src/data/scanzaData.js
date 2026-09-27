export const NAV_LINKS = [
  { name: 'Home', href: '#hero' },
  { name: 'Features', href: '#ecosystem' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Solutions', href: '#admin' },
  { name: 'Premium', href: '#premium' }
];

export const ECOSYSTEM_DATA = [
  {
    id: '01',
    title: 'Restaurant Admin',
    subtitle: 'For Restaurant Owners & Managers',
    description: 'Manage your restaurant\'s digital menu, QR codes and restaurant information from one centralized dashboard.',
    badge: 'Operations Hub',
    iconName: 'LayoutDashboard',
    features: [
      'Restaurant profile',
      'Menu categories',
      'Menu items',
      'Food images',
      'Pricing',
      'Availability',
      'QR generation',
      'Table QR management',
      'Menu analytics'
    ],
    cta: 'Explore Restaurant Admin',
    targetId: '#admin'
  },
  {
    id: '02',
    title: 'Waiter Portal',
    subtitle: 'For Floor Staff & Captains',
    description: 'Give restaurant staff a dedicated workspace to manage tables, customer requests and service activity.',
    badge: 'Service Hub',
    iconName: 'ConciergeBell',
    features: [
      'Assigned tables',
      'Table requests',
      'Service notifications',
      'Request acknowledgement',
      'Service status',
      'Completed requests',
      'Real-time updates'
    ],
    cta: 'Explore Waiter Portal',
    targetId: '#waiter'
  },
  {
    id: '03',
    title: 'Customer Scan View',
    subtitle: 'For Restaurant Guests',
    description: 'Customers simply scan the QR code on their table and instantly access the restaurant\'s digital menu.',
    badge: 'Instant Access',
    iconName: 'ScanLine',
    features: [
      'No app download',
      'Browse categories',
      'Search menu',
      'Food images',
      'Descriptions',
      'Prices',
      'Availability',
      'Latest menu updates'
    ],
    cta: 'See Customer Experience',
    targetId: '#customer'
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Restaurant Creates Menu',
    desc: 'Restaurant admin adds categories, items, prices, images, and sets availability status.',
    iconName: 'UtensilsCrossed',
    details: ['Categories', 'Items', 'Prices', 'Images', 'Availability']
  },
  {
    step: '02',
    title: 'Generate QR',
    desc: 'Restaurant generates a unique, high-resolution ScanzAA QR code.',
    iconName: 'QrCode',
    details: ['Vector QR', 'Branded Codes', 'High Resolution']
  },
  {
    step: '03',
    title: 'Place QR on Table',
    desc: 'The QR code is placed on the restaurant table using an acrylic stand.',
    iconName: 'MapPin',
    details: ['Acrylic Stands', 'Wooden Blocks', 'Table Precision']
  },
  {
    step: '04',
    title: 'Customer Scans',
    desc: 'Customer scans the QR using their phone. No app installation required.',
    iconName: 'ScanLine',
    details: ['Zero App Required', 'Instant Camera Scan', 'Any Smartphone']
  },
  {
    step: '05',
    title: 'Digital Menu Opens',
    desc: 'The current restaurant menu appears instantly in their mobile browser.',
    iconName: 'Smartphone',
    details: ['Sub-second Load', 'Live Prices', 'High-Res Dish Photos']
  },
  {
    step: '06',
    title: 'Service When Needed',
    desc: 'Customers can access available service functionality through the Waiter Portal workflow.',
    iconName: 'ConciergeBell',
    details: ['Call Waiter', 'Water Requests', 'Bill Assistance']
  }
];

export const PREMIUM_FEATURES = [
  {
    id: '01',
    number: '01',
    title: 'Advanced Menu Analytics',
    description: 'Understand menu engagement and identify your most interacted-with dishes.',
    category: 'Analytics',
    previewData: {
      chart: [45, 62, 78, 56, 89, 94],
      metric: 'Top Dish: Truffle Risotto (412 views)',
      rate: '+28.4% engagement'
    }
  },
  {
    id: '02',
    number: '02',
    title: 'Live Table Management',
    description: 'Monitor table activity and service requests in real time.',
    category: 'Operations',
    previewData: {
      metric: '18 Active Tables | 4 Requests',
      rate: 'Avg response: 1m 45s'
    }
  },
  {
    id: '03',
    number: '03',
    title: 'Advanced QR Analytics',
    description: 'Track QR scans and understand customer menu engagement.',
    category: 'Intelligence',
    previewData: {
      metric: '1,420 Scans This Week',
      rate: 'Peak: 8:30 PM - 10:00 PM'
    }
  },
  {
    id: '04',
    number: '04',
    title: 'Multi-Branch Management',
    description: 'Manage multiple restaurant locations from one centralized account.',
    category: 'Enterprise',
    previewData: {
      metric: '3 Outlets Synced',
      rate: 'Downtown, Uptown, Beachside'
    }
  },
  {
    id: '05',
    number: '05',
    title: 'Smart Waiter Assignment',
    description: 'Automatically assign customer service requests based on waiter availability.',
    category: 'Automation',
    previewData: {
      metric: 'Auto-Routing Active',
      rate: 'Zero missed table calls'
    }
  },
  {
    id: '06',
    number: '06',
    title: 'Waiter Performance',
    description: 'Track service activity and completed requests across your team.',
    category: 'Team Insights',
    previewData: {
      metric: '98% On-Time Delivery',
      rate: 'Leader: Arjun (48 fulfilled)'
    }
  },
  {
    id: '07',
    number: '07',
    title: 'Priority Service Requests',
    description: 'Highlight urgent table requests so your team can respond faster.',
    category: 'Floor Priority',
    previewData: {
      metric: 'Urgent: Table #12 Bill Req',
      rate: 'Flashing LED alerts'
    }
  },
  {
    id: '08',
    number: '08',
    title: 'Advanced Restaurant Branding',
    description: 'Customize the digital menu experience to match your restaurant identity.',
    category: 'Styling',
    previewData: {
      metric: 'Custom CSS & Font Theme',
      rate: 'Tailored Luxury Palette'
    }
  }
];

export const SERVICE_CARDS = [
  {
    id: '01',
    title: 'DIGITAL MENU SETUP',
    description: 'Set up your restaurant\'s digital menu and get your QR experience ready.',
    iconName: 'FileCheck'
  },
  {
    id: '02',
    title: 'QR TABLE SETUP',
    description: 'Get QR-ready table displays designed for your restaurant.',
    iconName: 'Maximize2'
  },
  {
    id: '03',
    title: 'MENU MANAGEMENT',
    description: 'Keep your restaurant menu organized and up to date.',
    iconName: 'Headphones'
  },
  {
    id: '04',
    title: 'RESTAURANT DIGITAL EXPERIENCE',
    description: 'Create a modern customer experience from table to menu.',
    iconName: 'Sparkles'
  }
];

export const DEMO_MENU_ITEMS = [
  {
    id: 1,
    name: 'Truffle & Wild Mushroom Risotto',
    category: 'Main Course',
    price: '₹580',
    description: 'Arborio rice cooked with black truffle butter, wild porcini mushrooms, parmesan crisp & microgreens.',
    available: true,
    tag: 'Chef Special',
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 2,
    name: 'Wood-Fired Burrata Pizza',
    category: 'Chef Specials',
    price: '₹490',
    description: 'San Marzano tomato base, fresh Italian burrata, heirloom cherry tomatoes, fresh basil pesto drizzle.',
    available: true,
    tag: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 3,
    name: 'Paneer Tikka Angara',
    category: 'Starters',
    price: '₹180',
    description: 'Charcoal-smoked cottage cheese cubes marinated in Kashmiri chili, hung curd, and aromatic Indian spices.',
    available: true,
    tag: 'Available',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 4,
    name: 'Chicken Biryani',
    category: 'Biryani',
    price: '₹220',
    description: 'Aromatic basmati rice layered with succulent spiced chicken cuts, saffron broth, and caramelized onions.',
    available: true,
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 5,
    name: 'Mutton Biryani',
    category: 'Biryani',
    price: '₹280',
    description: 'Slow-cooked tender mutton layered with fragrant long-grain basmati rice and royal ground spices.',
    available: false,
    tag: 'Sold Out',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 6,
    name: 'Artisanal Turquoise Mojito',
    category: 'Beverages',
    price: '₹160',
    description: 'Fresh blue curacao, kaffir lime leaves, crushed mint, sparkling soda, and silver glitter rim.',
    available: true,
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 7,
    name: 'Molten Belgian Chocolate Sphere',
    category: 'Desserts',
    price: '₹290',
    description: '70% dark Belgian chocolate shell filled with hazelnut mousse, poured over with hot espresso caramel sauce.',
    available: true,
    tag: 'Dessert Special',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600'
  }
];

export const FOOTER_LINKS = {
  column1: {
    title: 'SCanzAA',
    links: [
      { name: 'About', href: '#brand' },
      { name: 'Our Story', href: '#brand' },
      { name: 'Contact', href: '#contact' },
      { name: 'Careers', href: '#contact' }
    ]
  },
  column2: {
    title: 'For Restaurants',
    links: [
      { name: 'Restaurant Admin', href: '#admin' },
      { name: 'Waiter Portal', href: '#waiter' },
      { name: 'Digital Menu', href: '#customer' },
      { name: 'QR Services', href: '#services' }
    ]
  },
  column3: {
    title: 'Platform',
    links: [
      { name: 'Features', href: '#ecosystem' },
      { name: 'How It Works', href: '#how-it-works' },
      { name: 'Premium', href: '#premium' },
      { name: 'Solutions', href: '#admin' }
    ]
  },
  column4: {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '#contact' },
      { name: 'Contact Support', href: '#contact' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' }
    ]
  }
};

export const NAV_LINKS = [];

export const ECOSYSTEM_DATA = [
  {
    id: '01',
    name: 'Restaurant',
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
    targetPath: '/restaurant'
  },
  {
    id: '02',
    name: 'Waiter',
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
    targetPath: '/waiter'
  },
  {
    id: '03',
    name: 'Customer',
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
    targetPath: '/customer'
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
    title: 'AI Integration',
    category: 'Intelligence',
    badge: 'AI Powered',
    description: 'Intelligent dish pairings and smart dietary taste profiles driving higher dining check sizes.',
    features: [
      'AI-powered food recommendations',
      'Personalized recommendations'
    ],
    previewData: {
      badge: 'Neural Taste Engine',
      metric: 'Suggested: Truffle Pairing + Mocktail',
      rate: '+34% Upsell Conversion'
    }
  },
  {
    id: '02',
    number: '02',
    title: 'Order Food + Bill',
    category: 'Ordering & Billing',
    badge: 'Direct Ordering',
    description: 'Seamless digital ordering from table to kitchen with real-time status and instant billing.',
    features: [
      'Add food to cart',
      'Dine-in / takeaway ordering',
      'Real-time order status',
      'Automatic bill generation'
    ],
    previewData: {
      badge: 'Live Cart #08',
      metric: '3 Items • ₹980 • Bill Generated',
      rate: 'Zero Order Delay'
    }
  },
  {
    id: '03',
    number: '03',
    title: 'Food Customisation',
    category: 'Kitchen Prep',
    badge: 'Guest Preferences',
    description: 'Allow diners to configure dishes to their exact palate, allergies, and dietary lifestyle.',
    features: [
      'Spice level selection',
      'Add/remove ingredients',
      'Portion selection',
      'Extra toppings/add-ons',
      'Special instructions',
      'Dietary preferences'
    ],
    previewData: {
      badge: 'Recipe Modifier',
      metric: 'Medium Spicy • No Onion • Extra Cheese',
      rate: '100% Kitchen Accuracy'
    }
  },
  {
    id: '04',
    number: '04',
    title: 'Waiter Page',
    category: 'Floor Operations',
    badge: 'Staff Mobility',
    description: 'Empower floor staff with complete mobile control over tables, custom orders, and live billing.',
    features: [
      'Waiter login & assigned tables',
      'View table status & active calls',
      'Take customer orders & modify',
      'Send orders to kitchen (KOT)',
      'Track order status & add items',
      'Request bill & mark table available',
      'Receive instant customer requests'
    ],
    previewData: {
      badge: 'Floor Captain Active',
      metric: 'Table #14 Served • KOT Dispatched',
      rate: 'Under 90s Turnaround'
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
      { name: 'Restaurant Admin', href: '#ecosystem' },
      { name: 'Waiter Portal', href: '#ecosystem' },
      { name: 'Customer Scan View', href: '#ecosystem' },
      { name: 'Contact Us', href: '#contact' }
    ]
  },
  column3: {
    title: 'Platform',
    links: [
      { name: 'Platforms Overview', href: '#ecosystem' },
      { name: 'How It Works', href: '#how-it-works' },
      { name: 'Premium Suite', href: '#premium' },
      { name: 'Dedicated Deployment', href: '#contact' }
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

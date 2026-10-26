export const BUILDER_CATEGORIES = [
  { id: 'cpu', name: 'Processor (CPU)', icon: 'Cpu', required: true },
  { id: 'cooler', name: 'CPU Cooler', icon: 'Fan', required: true },
  { id: 'motherboard', name: 'Motherboard', icon: 'CircuitBoard', required: true },
  { id: 'ram', name: 'Memory (RAM)', icon: 'Layers', required: true },
  { id: 'gpu', name: 'Graphics Card (GPU)', icon: 'Layers', required: true },
  { id: 'storage', name: 'Primary Storage (SSD)', icon: 'HardDrive', required: true },
  { id: 'psu', name: 'Power Supply Unit (PSU)', icon: 'Zap', required: true },
  { id: 'case', name: 'Chassis / Cabinet', icon: 'Box', required: true },
];

export const BUILDER_PARTS = {
  cpu: [
    {
      id: 'cpu-7800x3d',
      name: 'AMD Ryzen 7 7800X3D (8C / 16T)',
      socket: 'AM5',
      price: 36499,
      wattage: 120,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
      specs: 'Up to 5.0 GHz | 104MB Cache | DDR5 Only'
    },
    {
      id: 'cpu-14700k',
      name: 'Intel Core i7-14700K (20C / 28T)',
      socket: 'LGA1700',
      price: 38999,
      wattage: 253,
      image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80',
      specs: 'Up to 5.6 GHz | 33MB Cache | Intel UHD 770'
    },
    {
      id: 'cpu-14900ks',
      name: 'Intel Core i9-14900KS Flagship (24C / 32T)',
      socket: 'LGA1700',
      price: 64999,
      wattage: 320,
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80',
      specs: 'Up to 6.2 GHz Special Edition | Extreme OC'
    },
    {
      id: 'cpu-7600x',
      name: 'AMD Ryzen 5 7600X (6C / 12T)',
      socket: 'AM5',
      price: 19899,
      wattage: 105,
      image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80',
      specs: 'Up to 5.3 GHz | Great Value Gaming'
    }
  ],
  cooler: [
    {
      id: 'cooler-deepcool-ls720',
      name: 'Deepcool LS720 SE 360mm ARGB AIO Liquid Cooler',
      price: 8999,
      wattage: 15,
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
      specs: '360mm Radiator | Low Noise FC120 Fans | Anti-Leak'
    },
    {
      id: 'cooler-kraken-elite-360',
      name: 'NZXT Kraken Elite 360 RGB with Custom LCD Screen',
      price: 24999,
      wattage: 20,
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=80',
      specs: '2.36" Wide-Angle LCD | 640x640 Display | Asetek 7th Gen'
    },
    {
      id: 'cooler-peerless-assassin',
      name: 'Thermalright Peerless Assassin 120 SE Dual Tower Air Cooler',
      price: 3699,
      wattage: 5,
      image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=400&q=80',
      specs: '6 Heatpipes | Dual PWM 120mm Fans | Silent Performance'
    }
  ],
  motherboard: [
    {
      id: 'mb-b650-aorus-elite',
      name: 'GIGABYTE B650 AORUS Elite AX (Wi-Fi 6E)',
      socket: 'AM5',
      price: 21499,
      wattage: 50,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
      specs: 'AM5 Socket | DDR5 | PCIe 5.0 M.2 | 14+2+1 Phases VRM'
    },
    {
      id: 'mb-z790-aorus-master',
      name: 'GIGABYTE Z790 AORUS Master X',
      socket: 'LGA1700',
      price: 49999,
      wattage: 65,
      image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80',
      specs: 'LGA1700 Socket | 20+1+2 VRM | 10GbE LAN | Wi-Fi 7'
    },
    {
      id: 'mb-msi-z790-tomahawk',
      name: 'MSI MAG Z790 Tomahawk WiFi DDR5',
      socket: 'LGA1700',
      price: 26499,
      wattage: 55,
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80',
      specs: '16+1+1 Duet Rail VRM | 4x M.2 Gen4 | Audio Boost 5'
    },
    {
      id: 'mb-asus-x670e-hero',
      name: 'ASUS ROG Crosshair X670E Hero',
      socket: 'AM5',
      price: 58999,
      wattage: 70,
      image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=400&q=80',
      specs: 'Polymo Lighting | Dual USB4 | 18+2 Power Stages'
    }
  ],
  ram: [
    {
      id: 'ram-corsair-32gb-6000',
      name: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz CL30',
      price: 11299,
      wattage: 15,
      image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=400&q=80',
      specs: '2x16GB | CL30-36-36-76 | AMD EXPO & Intel XMP 3.0'
    },
    {
      id: 'ram-gskill-trident-64gb',
      name: 'G.Skill Trident Z5 RGB 64GB (2x32GB) DDR5 6400MHz CL32',
      price: 22499,
      wattage: 20,
      image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=400&q=80',
      specs: '2x32GB | Matte Black Aluminum | Premium Hynix A-Die'
    },
    {
      id: 'ram-kingston-fury-16gb',
      name: 'Kingston Fury Beast 16GB (2x8GB) DDR5 5600MHz',
      price: 5999,
      wattage: 10,
      image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=400&q=80',
      specs: '2x8GB | Low Profile Heatspreader | Plug N Play'
    }
  ],
  gpu: [
    {
      id: 'gpu-rtx-4090-aero',
      name: 'Gigabyte GeForce RTX 4090 Gaming OC 24GB',
      price: 189999,
      wattage: 450,
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
      specs: '24GB GDDR6X | 384-bit | Windforce Vapor Chamber'
    },
    {
      id: 'gpu-rtx-4070ti-super',
      name: 'Zotac Gaming GeForce RTX 4070 Ti Super Trinity 16GB',
      price: 79999,
      wattage: 285,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
      specs: '16GB GDDR6X | 256-bit | IceStorm 2.0 Advanced Cooling'
    },
    {
      id: 'gpu-rtx-4060-ti',
      name: 'MSI GeForce RTX 4060 Ti Ventus 2X Black 8G OC',
      price: 36499,
      wattage: 160,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
      specs: '8GB GDDR6 | Dual TORX Fan 4.0 | Compact 199mm Length'
    },
    {
      id: 'gpu-rx-7800-xt',
      name: 'Sapphire PULSE AMD Radeon RX 7800 XT 16GB',
      price: 49999,
      wattage: 263,
      image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=400&q=80',
      specs: '16GB GDDR6 | Dual-X Cooling | Fuse Protection'
    }
  ],
  storage: [
    {
      id: 'ssd-samsung-990-2tb',
      name: 'Samsung 990 PRO 2TB NVMe PCIe 4.0 SSD',
      price: 17999,
      wattage: 10,
      image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&q=80',
      specs: 'Up to 7,450 MB/s Read | 6,900 MB/s Write | DRAM Cache'
    },
    {
      id: 'ssd-crucial-p3-1tb',
      name: 'Crucial P3 Plus 1TB PCIe 4.0 3D NAND NVMe',
      price: 6499,
      wattage: 7,
      image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&q=80',
      specs: 'Up to 5,000 MB/s Read | Budget King Gen4 Performance'
    },
    {
      id: 'ssd-wd-black-sn850x-4tb',
      name: 'WD Black SN850X 4TB High-Performance NVMe SSD',
      price: 33999,
      wattage: 12,
      image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&q=80',
      specs: 'Up to 7,300 MB/s Read | Massive Storage for Creators'
    }
  ],
  psu: [
    {
      id: 'psu-corsair-rm850x',
      name: 'Corsair RM850x 850W 80+ Gold Fully Modular',
      price: 11999,
      wattage: 850, // Capacity
      image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=400&q=80',
      specs: 'ATX 3.0 & PCIe 5.0 Ready | 100% Japanese 105°C Capacitors'
    },
    {
      id: 'psu-seasonic-1000w',
      name: 'Seasonic Vertex GX-1000 1000W 80+ Gold ATX 3.0',
      price: 18999,
      wattage: 1000,
      image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=400&q=80',
      specs: '1000W Continuous | 12VHPWR Dedicated Cable | 10 Yr Warranty'
    },
    {
      id: 'psu-deepcool-pm750d',
      name: 'Deepcool PM750D 750W 80+ Gold Non-Modular',
      price: 6499,
      wattage: 750,
      image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=400&q=80',
      specs: 'Active PFC + Full Bridge LLC | Flat Black Cables'
    }
  ],
  case: [
    {
      id: 'case-lianli-o11-evo',
      name: 'Lian Li O11 Dynamic EVO RGB Dual-Chamber Glass',
      price: 15499,
      wattage: 0,
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
      specs: 'Showcase Dual Tempered Glass | Supports Dual 420mm Radiators'
    },
    {
      id: 'case-nzxt-h6-flow',
      name: 'NZXT H6 Flow RGB Panoramic Compact Dual-Chamber',
      price: 11999,
      wattage: 0,
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=80',
      specs: 'Wrap-around Glass | 3 Pre-installed 120mm RGB Corner Fans'
    },
    {
      id: 'case-corsair-4000d',
      name: 'Corsair 4000D Airflow High-Airflow Mid-Tower',
      price: 6999,
      wattage: 0,
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=80',
      specs: 'Steel Airflow Front Panel | RapidRoute Cable Management'
    }
  ]
};

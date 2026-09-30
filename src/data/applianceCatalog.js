// Comprehensive database of household appliances with brands, models, and real-world wattage specifications

export const APPLIANCE_CATEGORIES = [
  { id: 'fan', name: 'Ceiling / Stand Fan', icon: 'Fan', defaultWatts: 75, defaultHours: 10, defaultCount: 3 },
  { id: 'tv', name: 'Television (TV)', icon: 'Tv', defaultWatts: 85, defaultHours: 5, defaultCount: 1 },
  { id: 'ac', name: 'Air Conditioner (AC)', icon: 'Wind', defaultWatts: 1200, defaultHours: 6, defaultCount: 1 },
  { id: 'refrigerator', name: 'Refrigerator', icon: 'Refrigerator', defaultWatts: 95, defaultHours: 24, defaultCount: 1 },
  { id: 'washing_machine', name: 'Washing Machine', icon: 'Shirt', defaultWatts: 450, defaultHours: 1.5, defaultCount: 1 },
  { id: 'geyser', name: 'Water Heater / Geyser', icon: 'Flame', defaultWatts: 2000, defaultHours: 1.5, defaultCount: 1 },
  { id: 'microwave', name: 'Microwave / Oven', icon: 'Microwave', defaultWatts: 1200, defaultHours: 0.5, defaultCount: 1 },
  { id: 'lighting', name: 'Lighting (LED / Bulbs)', icon: 'Lightbulb', defaultWatts: 12, defaultHours: 6, defaultCount: 6 },
  { id: 'computer', name: 'Computer / Laptop', icon: 'Laptop', defaultWatts: 65, defaultHours: 8, defaultCount: 1 },
  { id: 'pump', name: 'Water Pump / Motor', icon: 'Droplet', defaultWatts: 750, defaultHours: 1, defaultCount: 1 },
  { id: 'iron', name: 'Electric Iron', icon: 'Zap', defaultWatts: 1000, defaultHours: 0.5, defaultCount: 1 },
  { id: 'custom', name: 'Custom Appliance', icon: 'Cpu', defaultWatts: 100, defaultHours: 4, defaultCount: 1 }
];

export const APPLIANCE_BRAND_MODELS = {
  fan: {
    brands: [
      {
        brand: 'Havells',
        models: [
          { model: 'Stealth Air BLDC 28W (Energy Star 5-Star)', watts: 28 },
          { model: 'Ambrose Decorative 1200mm (70W)', watts: 70 },
          { model: 'Pacer High Speed 1200mm (72W)', watts: 72 },
          { model: 'Efficiencia Neo BLDC (26W)', watts: 26 },
        ]
      },
      {
        brand: 'Atomberg',
        models: [
          { model: 'Renesa Smart BLDC with Remote (28W)', watts: 28 },
          { model: 'Aris Starlight Smart IoT BLDC (39W)', watts: 39 },
          { model: 'Studio BLDC High Airflow (26W)', watts: 26 },
          { model: 'Efficio Classic BLDC (28W)', watts: 28 },
        ]
      },
      {
        brand: 'Crompton',
        models: [
          { model: 'Energion Hyperjet BLDC (28W)', watts: 28 },
          { model: 'High Breeze Standard 1200mm (75W)', watts: 75 },
          { model: 'Sea Wind High Speed (70W)', watts: 70 },
          { model: 'Silent Pro Enso BLDC (35W)', watts: 35 },
        ]
      },
      {
        brand: 'Orient Electric',
        models: [
          { model: 'Aeroslim Smart IoT BLDC (45W)', watts: 45 },
          { model: 'Apex-FX 1200mm Standard (75W)', watts: 75 },
          { model: 'Wendy Decorative 70W (70W)', watts: 70 },
          { model: 'I-Tome BLDC (26W)', watts: 26 },
        ]
      },
      {
        brand: 'LG',
        models: [
          { model: 'Dual Wing Inverter Ceiling Fan (38W)', watts: 38 },
          { model: 'Standard Inverter IoT Fan (42W)', watts: 42 },
        ]
      },
      {
        brand: 'Usha',
        models: [
          { model: 'Striker Galaxy 1200mm (70W)', watts: 70 },
          { model: 'Bloom Primrose 1200mm (75W)', watts: 75 },
          { model: 'Swift High Speed (74W)', watts: 74 },
          { model: 'Heleous BLDC 3-Blade (35W)', watts: 35 },
        ]
      },
      {
        brand: 'Generic / Other',
        models: [
          { model: 'Standard Induction Ceiling Fan (75W)', watts: 75 },
          { model: 'High Speed Stand / Pedestal Fan (100W)', watts: 100 },
          { model: 'Compact Table Fan (55W)', watts: 55 },
          { model: 'Wall Mounted Fan (65W)', watts: 65 },
        ]
      }
    ]
  },

  tv: {
    brands: [
      {
        brand: 'LG',
        models: [
          { model: 'OLED 55" 4K evo C3/C4 Series (105W)', watts: 105 },
          { model: 'OLED 65" 4K Cinema G3/G4 Series (135W)', watts: 135 },
          { model: 'NanoCell 50" 4K Smart TV (85W)', watts: 85 },
          { model: 'QNED 55" MiniLED 4K (120W)', watts: 120 },
          { model: 'UHD 43" 4K ThinQ AI UR7500 (75W)', watts: 75 },
          { model: 'Smart LED 32" HD Ready (45W)', watts: 45 },
        ]
      },
      {
        brand: 'Samsung',
        models: [
          { model: 'Neo QLED 65" 4K QN90C (155W)', watts: 155 },
          { model: 'QLED 55" 4K Q60C (115W)', watts: 115 },
          { model: 'Crystal 4K UHD 55" CU8000 (130W)', watts: 130 },
          { model: 'Crystal 4K UHD 43" CU7700 (80W)', watts: 80 },
          { model: 'HD Smart LED 32" T4340 (48W)', watts: 48 },
        ]
      },
      {
        brand: 'Sony',
        models: [
          { model: 'Bravia XR OLED 55" A80L (130W)', watts: 130 },
          { model: 'Bravia Google TV 55" 4K X82L (110W)', watts: 110 },
          { model: 'Bravia 50" 4K Ultra HD X75L (95W)', watts: 95 },
          { model: 'Bravia 43" 4K Google TV (80W)', watts: 80 },
          { model: 'Bravia 32" HD Ready W830K (50W)', watts: 50 },
        ]
      },
      {
        brand: 'Xiaomi / Mi',
        models: [
          { model: 'Mi 4K Ultra HD 55" X Series (120W)', watts: 120 },
          { model: 'Mi 43" 4K Horizon Edition (75W)', watts: 75 },
          { model: 'Redmi Smart Fire TV 32" (45W)', watts: 45 },
          { model: 'Xiaomi OLED Vision 55" (140W)', watts: 140 },
        ]
      },
      {
        brand: 'TCL',
        models: [
          { model: '55" 4K QLED Smart Google TV C645 (110W)', watts: 110 },
          { model: '43" 4K UHD Google TV P635 (75W)', watts: 75 },
          { model: '32" HD Ready Smart Android TV (45W)', watts: 45 },
        ]
      },
      {
        brand: 'OnePlus',
        models: [
          { model: 'OnePlus TV U1S 55" 4K LED (110W)', watts: 110 },
          { model: 'OnePlus TV Y1S Pro 43" 4K (75W)', watts: 75 },
          { model: 'OnePlus TV Y1S 32" HD (40W)', watts: 40 },
        ]
      },
      {
        brand: 'Generic / Other',
        models: [
          { model: 'LED Smart TV 43" Standard (75W)', watts: 75 },
          { model: 'LED Smart TV 55" Standard (110W)', watts: 110 },
          { model: 'Compact LED TV 32" (45W)', watts: 45 },
          { model: 'Older Plasma / CRT TV (180W)', watts: 180 },
        ]
      }
    ]
  },

  ac: {
    brands: [
      {
        brand: 'LG',
        models: [
          { model: 'Dual Inverter 1.5 Ton 5-Star Split AC (1050W)', watts: 1050 },
          { model: 'Dual Inverter 1.5 Ton 3-Star Split AC (1250W)', watts: 1250 },
          { model: 'Dual Inverter 1.0 Ton 5-Star Split AC (750W)', watts: 750 },
          { model: 'Dual Inverter 2.0 Ton 5-Star Split AC (1500W)', watts: 1500 },
          { model: 'AI Convertible 6-in-1 Dual Inverter 1.5T (1080W)', watts: 1080 },
        ]
      },
      {
        brand: 'Daikin',
        models: [
          { model: '1.5 Ton 5-Star Inverter Split AC FTKM (1100W)', watts: 1100 },
          { model: '1.5 Ton 3-Star Inverter Split AC FTKL (1300W)', watts: 1300 },
          { model: '1.0 Ton 5-Star Inverter FTKM (780W)', watts: 780 },
          { model: '0.8 Ton 3-Star Inverter (650W)', watts: 650 },
        ]
      },
      {
        brand: 'Voltas',
        models: [
          { model: '1.5 Ton 5-Star Adjustable Inverter Split AC (1200W)', watts: 1200 },
          { model: '1.5 Ton 3-Star Inverter Split AC (1450W)', watts: 1450 },
          { model: '1.0 Ton 3-Star Inverter Split AC (950W)', watts: 950 },
          { model: '1.5 Ton Window AC Fixed Speed (1650W)', watts: 1650 },
        ]
      },
      {
        brand: 'Samsung',
        models: [
          { model: '1.5 Ton 5-Star WindFree Inverter Split AC (1150W)', watts: 1150 },
          { model: '1.5 Ton 3-Star Convertible Inverter (1350W)', watts: 1350 },
          { model: '1.0 Ton 3-Star Inverter Split AC (850W)', watts: 850 },
        ]
      },
      {
        brand: 'Blue Star',
        models: [
          { model: '1.5 Ton 5-Star Inverter Split AC (1180W)', watts: 1180 },
          { model: '1.5 Ton 3-Star Inverter Split AC (1380W)', watts: 1380 },
          { model: '1.0 Ton 5-Star Inverter (800W)', watts: 800 },
        ]
      },
      {
        brand: 'Hitachi',
        models: [
          { model: '1.5 Ton 5-Star Kashikoi Inverter AC (1120W)', watts: 1120 },
          { model: '1.5 Ton 3-Star Toushi Inverter (1350W)', watts: 1350 },
        ]
      },
      {
        brand: 'Generic / Other',
        models: [
          { model: 'Standard 1.5 Ton Inverter AC (1250W)', watts: 1250 },
          { model: 'Standard 1.5 Ton Non-Inverter Fixed AC (1600W)', watts: 1600 },
          { model: 'Standard 1.0 Ton Split AC (950W)', watts: 950 },
          { model: 'Window AC 1.5 Ton (1700W)', watts: 1700 },
        ]
      }
    ]
  },

  refrigerator: {
    brands: [
      {
        brand: 'LG',
        models: [
          { model: 'Smart Inverter 260L Double Door Frost Free (95W)', watts: 95 },
          { model: 'Smart Inverter 190L Single Door Direct Cool (65W)', watts: 65 },
          { model: 'Frost Free 340L Double Door Convertible (115W)', watts: 115 },
          { model: 'French Door InstaView 674L Multi-Door (180W)', watts: 180 },
          { model: 'Single Door 215L 5-Star Direct Cool (70W)', watts: 70 },
        ]
      },
      {
        brand: 'Samsung',
        models: [
          { model: 'Digital Inverter 253L Double Door (90W)', watts: 90 },
          { model: 'Curd Maestro 324L Double Door (110W)', watts: 110 },
          { model: 'Direct Cool 192L Single Door (65W)', watts: 65 },
          { model: 'Side by Side 653L Convertible (170W)', watts: 170 },
        ]
      },
      {
        brand: 'Whirlpool',
        models: [
          { model: 'Protton 3-Door 240L Multi-Door (105W)', watts: 105 },
          { model: 'IntelliFresh 265L 3-Star Inverter (95W)', watts: 95 },
          { model: 'IceMagic 190L Single Door (70W)', watts: 70 },
        ]
      },
      {
        brand: 'Haier',
        models: [
          { model: 'Triple Door 328L Frost Free (110W)', watts: 110 },
          { model: 'Bottom Mount 256L Inverter (95W)', watts: 95 },
          { model: 'Direct Cool 190L Single Door (68W)', watts: 68 },
        ]
      },
      {
        brand: 'Godrej',
        models: [
          { model: 'Edge Pro 190L Direct Cool (65W)', watts: 65 },
          { model: 'Eon Frost Free 260L Inverter (100W)', watts: 100 },
        ]
      },
      {
        brand: 'Generic / Other',
        models: [
          { model: 'Single Door 190L Standard (80W)', watts: 80 },
          { model: 'Double Door 250L Standard (120W)', watts: 120 },
          { model: 'Large Double Door 350L (140W)', watts: 140 },
        ]
      }
    ]
  },

  washing_machine: {
    brands: [
      {
        brand: 'LG',
        models: [
          { model: 'AI DD 7.0kg Front Load Inverter (500W wash / 1700W heated)', watts: 500 },
          { model: 'Smart Inverter 7.0kg Top Load (360W)', watts: 360 },
          { model: 'TurboWash 8.0kg Front Load (520W wash / 1800W heated)', watts: 520 },
          { model: 'Semi-Automatic 8.0kg Roller Jet (360W)', watts: 360 },
        ]
      },
      {
        brand: 'Samsung',
        models: [
          { model: 'EcoBubble 7.0kg Front Load Inverter (450W wash / 1600W heated)', watts: 450 },
          { model: 'Wobble Technology 7.0kg Top Load (350W)', watts: 350 },
          { model: 'AI Control 8.0kg Front Load (500W)', watts: 500 },
        ]
      },
      {
        brand: 'IFB',
        models: [
          { model: 'Senator Plus 8.0kg Front Load (1800W heated / 500W wash)', watts: 500 },
          { model: 'Elena 6.5kg Front Load (1500W heated / 450W wash)', watts: 450 },
          { model: 'Aqua 7.0kg Fully Automatic Top Load (360W)', watts: 360 },
        ]
      },
      {
        brand: 'Bosch',
        models: [
          { model: 'Serie 6 8.0kg Front Load Inverter (500W wash / 1700W heated)', watts: 500 },
          { model: 'Serie 4 7.0kg Front Load (450W wash / 1500W heated)', watts: 450 },
          { model: 'Serie 4 7.0kg Top Load (360W)', watts: 360 },
        ]
      },
      {
        brand: 'Generic / Other',
        models: [
          { model: 'Semi-Automatic Twin Tub 7kg (320W)', watts: 320 },
          { model: 'Fully Automatic Top Load 7kg (380W)', watts: 380 },
          { model: 'Fully Automatic Front Load 7kg (500W)', watts: 500 },
        ]
      }
    ]
  },

  geyser: {
    brands: [
      {
        brand: 'AO Smith',
        models: [
          { model: 'HSE-HAS-015 15L Storage Geyser (2000W)', watts: 2000 },
          { model: 'Elegance 25L Storage Geyser (2000W)', watts: 2000 },
          { model: 'HeatBot Smart 25L (2000W)', watts: 2000 },
        ]
      },
      {
        brand: 'Racold',
        models: [
          { model: 'Omnis Lux Plus 25L Storage (2000W)', watts: 2000 },
          { model: 'Pronto Neo 3L Instant Water Heater (3000W)', watts: 3000 },
          { model: 'Eterno Pro 15L Storage (2000W)', watts: 2000 },
        ]
      },
      {
        brand: 'Havells',
        models: [
          { model: 'Monza EC 15L Storage Geyser (2000W)', watts: 2000 },
          { model: 'Instanio 3L Instant Geyser (3000W)', watts: 3000 },
          { model: 'Adonia Spin 25L Digital (2000W)', watts: 2000 },
        ]
      },
      {
        brand: 'Bajaj',
        models: [
          { model: 'New Shakti Neo 15L Storage (2000W)', watts: 2000 },
          { model: 'Flora 3L Instant Water Heater (3000W)', watts: 3000 },
          { model: 'Calenta Mechanical 25L (2000W)', watts: 2000 },
        ]
      },
      {
        brand: 'Generic / Other',
        models: [
          { model: 'Storage Geyser 15L Standard (2000W)', watts: 2000 },
          { model: 'Storage Geyser 25L Standard (2000W)', watts: 2000 },
          { model: 'Instant Water Heater 3L (3000W)', watts: 3000 },
        ]
      }
    ]
  },

  microwave: {
    brands: [
      {
        brand: 'LG',
        models: [
          { model: 'NeoChef Charcoal Convection 28L (1900W)', watts: 1900 },
          { model: 'All-in-One Convection 32L (1950W)', watts: 1950 },
          { model: 'Solo Microwave 20L MS2043 (1000W)', watts: 1000 },
          { model: 'Grill Microwave Oven 20L (1150W)', watts: 1150 },
        ]
      },
      {
        brand: 'Samsung',
        models: [
          { model: 'Baker Series Convection 28L (1400W)', watts: 1400 },
          { model: 'Slim Fry Convection 32L (1500W)', watts: 1500 },
          { model: 'Solo Microwave 23L MS23 (1150W)', watts: 1150 },
        ]
      },
      {
        brand: 'IFB',
        models: [
          { model: '30L Convection 30BRC2 (1400W)', watts: 1400 },
          { model: '20L Solo 20PM-MEC2 (1200W)', watts: 1200 },
        ]
      },
      {
        brand: 'Prestige',
        models: [
          { model: 'Induction Cooktop PIC 20.0 (1600W)', watts: 1600 },
          { model: 'Induction Cooktop PIC 3.1 V3 (2000W)', watts: 2000 },
        ]
      },
      {
        brand: 'Philips',
        models: [
          { model: 'Induction Cooktop Viva Collection (2100W)', watts: 2100 },
          { model: 'Airfryer Essential 4.1L (1400W)', watts: 1400 },
        ]
      },
      {
        brand: 'Generic / Other',
        models: [
          { model: 'Convection Microwave 28L (1500W)', watts: 1500 },
          { model: 'Solo Microwave 20L (1000W)', watts: 1000 },
          { model: 'Induction Cooktop (1800W)', watts: 1800 },
        ]
      }
    ]
  },

  lighting: {
    brands: [
      {
        brand: 'Philips',
        models: [
          { model: 'Stellar Bright LED Bulb 9W (9W)', watts: 9 },
          { model: 'LED Batten Tube Light 20W (20W)', watts: 20 },
          { model: 'Smart Wi-Fi Tunable White LED 12W (12W)', watts: 12 },
          { model: 'High Lumen LED Bulb 14W (14W)', watts: 14 },
          { model: 'Deco Mini Night Lamp 0.5W (1W)', watts: 1 },
        ]
      },
      {
        brand: 'Wipro',
        models: [
          { model: 'Garnet 9W LED Bulb (9W)', watts: 9 },
          { model: 'Next 20W LED Batten (20W)', watts: 20 },
          { model: 'Smart 12W RGB LED Bulb (12W)', watts: 12 },
        ]
      },
      {
        brand: 'Syska',
        models: [
          { model: 'SSK-SRL 9W LED Bulb (9W)', watts: 9 },
          { model: 'T5 18W LED Batten Tube (18W)', watts: 18 },
          { model: '12W Smart LED Bulb (12W)', watts: 12 },
        ]
      },
      {
        brand: 'Havells',
        models: [
          { model: 'Adore 9W LED Bulb (9W)', watts: 9 },
          { model: 'Glaze 20W LED Batten (20W)', watts: 20 },
        ]
      },
      {
        brand: 'Generic / Other',
        models: [
          { model: 'Standard LED Bulb 9W (9W)', watts: 9 },
          { model: 'LED Tube Batten 20W (20W)', watts: 20 },
          { model: 'Traditional Incandescent Bulb (60W)', watts: 60 },
          { model: 'CFL Spiral Lamp (18W)', watts: 18 },
        ]
      }
    ]
  },

  computer: {
    brands: [
      {
        brand: 'Apple',
        models: [
          { model: 'MacBook Pro 14"/16" Apple Silicon M3/M4 (45W)', watts: 45 },
          { model: 'MacBook Air 13"/15" M2/M3 (30W)', watts: 30 },
          { model: 'iMac 24" M3 All-in-One (65W)', watts: 65 },
          { model: 'Mac mini M2/M4 Desktop (35W)', watts: 35 },
        ]
      },
      {
        brand: 'Dell',
        models: [
          { model: 'Inspiron / XPS Laptop (65W)', watts: 65 },
          { model: 'OptiPlex Office Desktop + Monitor (120W)', watts: 120 },
          { model: 'Alienware Gaming Rig + Monitor (400W)', watts: 400 },
        ]
      },
      {
        brand: 'HP',
        models: [
          { model: 'Pavilion / Envy Laptop (65W)', watts: 65 },
          { model: 'Victus / Omen Gaming Laptop (180W)', watts: 180 },
          { model: 'Pavilion Desktop Tower (150W)', watts: 150 },
        ]
      },
      {
        brand: 'Lenovo',
        models: [
          { model: 'ThinkPad E/T Series Laptop (65W)', watts: 65 },
          { model: 'Legion Gaming Laptop (230W)', watts: 230 },
          { model: 'IdeaCentre Desktop (140W)', watts: 140 },
        ]
      },
      {
        brand: 'Asus',
        models: [
          { model: 'ROG / TUF Gaming PC Rig (450W)', watts: 450 },
          { model: 'ZenBook Ultrabook (65W)', watts: 65 },
        ]
      },
      {
        brand: 'Generic / Other',
        models: [
          { model: 'Standard Office Laptop (65W)', watts: 65 },
          { model: 'Standard Desktop PC with LCD Monitor (150W)', watts: 150 },
          { model: 'High-End Gaming PC (450W)', watts: 450 },
          { model: 'Wi-Fi Router & Modem (12W)', watts: 12 },
        ]
      }
    ]
  },

  pump: {
    brands: [
      {
        brand: 'Crompton',
        models: [
          { model: 'Mini Crest 0.5 HP Water Pump (370W)', watts: 370 },
          { model: 'Mini Master 1.0 HP Water Pump (750W)', watts: 750 },
        ]
      },
      {
        brand: 'Kirloskar',
        models: [
          { model: 'Chotu 0.5 HP Monoblock (370W)', watts: 370 },
          { model: 'Jalraaj 1.0 HP Domestic Pump (750W)', watts: 750 },
        ]
      },
      {
        brand: 'Havells',
        models: [
          { model: 'Hi-Flow 0.5 HP Self-Priming (370W)', watts: 370 },
          { model: 'Hi-Flow 1.0 HP (750W)', watts: 750 },
        ]
      },
      {
        brand: 'Generic / Other',
        models: [
          { model: '0.5 HP Domestic Water Pump (370W)', watts: 370 },
          { model: '1.0 HP Domestic Water Pump (750W)', watts: 750 },
          { model: '1.5 HP Borewell Submersible (1100W)', watts: 1100 },
        ]
      }
    ]
  },

  iron: {
    brands: [
      {
        brand: 'Philips',
        models: [
          { model: 'Dry Iron GC181 (1000W)', watts: 1000 },
          { model: 'EasySpeed Plus Steam Iron (2000W)', watts: 2000 },
        ]
      },
      {
        brand: 'Bajaj',
        models: [
          { model: 'DX 7 Dry Iron (1000W)', watts: 1000 },
          { model: 'Majesty Steam Iron (1200W)', watts: 1200 },
        ]
      },
      {
        brand: 'Usha',
        models: [
          { model: 'EI 1602 Dry Iron (1000W)', watts: 1000 },
          { model: 'Aqua Glow Steam Iron (2000W)', watts: 2000 },
        ]
      },
      {
        brand: 'Generic / Other',
        models: [
          { model: 'Heavy Dry Iron (1000W)', watts: 1000 },
          { model: 'Steam Iron (1500W)', watts: 1500 },
        ]
      }
    ]
  },

  custom: {
    brands: [
      {
        brand: 'Custom / Other',
        models: [
          { model: 'Custom Model (Enter custom wattage)', watts: 100 }
        ]
      }
    ]
  }
};

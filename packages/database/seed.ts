// ═══════════════════════════════════════════════════════════════════════════════
// PriceLens Nigeria — Database Seed
// ═══════════════════════════════════════════════════════════════════════════════
// Seeds: 6 States, 60 Cities, 117+ Stores, 20+ Categories, 100+ Products
// ═══════════════════════════════════════════════════════════════════════════════

import { PrismaClient, Region, StoreType } from '@prisma/client';

const prisma = new PrismaClient();

// ── State & City Data ───────────────────────────────────────────────────────

const STATES = [
  {
    name: 'Lagos',
    slug: 'lagos',
    code: 'LA',
    region: Region.SOUTH_WEST,
    capital: 'Ikeja',
    lat: 6.5244,
    lng: 3.3792,
    sortOrder: 1,
    cities: [
      { name: 'Ikeja', slug: 'ikeja', lat: 6.6018, lng: 3.3515, population: 650000, sortOrder: 1 },
      { name: 'Lagos Island', slug: 'lagos-island', lat: 6.4541, lng: 3.4084, population: 450000, sortOrder: 2 },
      { name: 'Lekki / Victoria Island', slug: 'lekki-vi', lat: 6.4281, lng: 3.4219, population: 400000, sortOrder: 3 },
      { name: 'Surulere', slug: 'surulere', lat: 6.4969, lng: 3.3481, population: 550000, sortOrder: 4 },
      { name: 'Yaba', slug: 'yaba', lat: 6.5095, lng: 3.3711, population: 500000, sortOrder: 5 },
      { name: 'Mushin', slug: 'mushin', lat: 6.5324, lng: 3.3539, population: 600000, sortOrder: 6 },
      { name: 'Oshodi', slug: 'oshodi', lat: 6.5540, lng: 3.3410, population: 500000, sortOrder: 7 },
      { name: 'Ikorodu', slug: 'ikorodu', lat: 6.6194, lng: 3.5105, population: 700000, sortOrder: 8 },
      { name: 'Festac / Amuwo-Odofin', slug: 'festac', lat: 6.4631, lng: 3.2826, population: 450000, sortOrder: 9 },
      { name: 'Ajah / Sangotedo', slug: 'ajah-sangotedo', lat: 6.4667, lng: 3.5667, population: 350000, sortOrder: 10 },
    ],
  },
  {
    name: 'Federal Capital Territory',
    slug: 'fct-abuja',
    code: 'FC',
    region: Region.NORTH_CENTRAL,
    capital: 'Abuja',
    lat: 9.0579,
    lng: 7.4951,
    sortOrder: 2,
    cities: [
      { name: 'Garki', slug: 'garki', lat: 9.0300, lng: 7.4900, population: 300000, sortOrder: 1 },
      { name: 'Wuse', slug: 'wuse', lat: 9.0700, lng: 7.4800, population: 350000, sortOrder: 2 },
      { name: 'Maitama', slug: 'maitama', lat: 9.0833, lng: 7.5000, population: 200000, sortOrder: 3 },
      { name: 'Gwarimpa', slug: 'gwarimpa', lat: 9.1100, lng: 7.4100, population: 400000, sortOrder: 4 },
      { name: 'Kubwa', slug: 'kubwa', lat: 9.1560, lng: 7.3297, population: 500000, sortOrder: 5 },
      { name: 'Nyanya', slug: 'nyanya', lat: 8.9600, lng: 7.5500, population: 450000, sortOrder: 6 },
      { name: 'Lugbe', slug: 'lugbe', lat: 8.9800, lng: 7.3800, population: 350000, sortOrder: 7 },
      { name: 'Bwari', slug: 'bwari', lat: 9.2800, lng: 7.3800, population: 250000, sortOrder: 8 },
      { name: 'Karu', slug: 'karu', lat: 8.9900, lng: 7.5800, population: 400000, sortOrder: 9 },
      { name: 'Asokoro / Central Area', slug: 'asokoro', lat: 9.0400, lng: 7.5200, population: 150000, sortOrder: 10 },
    ],
  },
  {
    name: 'Enugu',
    slug: 'enugu',
    code: 'EN',
    region: Region.SOUTH_EAST,
    capital: 'Enugu',
    lat: 6.4584,
    lng: 7.5464,
    sortOrder: 3,
    cities: [
      { name: 'Enugu City', slug: 'enugu-city', lat: 6.4584, lng: 7.5464, population: 750000, sortOrder: 1 },
      { name: 'Nsukka', slug: 'nsukka', lat: 6.8567, lng: 7.3958, population: 310000, sortOrder: 2 },
      { name: 'Agbani', slug: 'agbani', lat: 6.3500, lng: 7.5500, population: 100000, sortOrder: 3 },
      { name: 'Oji River', slug: 'oji-river', lat: 6.2659, lng: 7.2781, population: 120000, sortOrder: 4 },
      { name: 'Udi', slug: 'udi', lat: 6.3167, lng: 7.4167, population: 150000, sortOrder: 5 },
      { name: 'Awgu', slug: 'awgu', lat: 6.0711, lng: 7.4756, population: 100000, sortOrder: 6 },
      { name: '9th Mile / Ngwo', slug: '9th-mile-ngwo', lat: 6.4300, lng: 7.4000, population: 200000, sortOrder: 7 },
      { name: 'Abakpa Nike', slug: 'abakpa-nike', lat: 6.4800, lng: 7.5800, population: 300000, sortOrder: 8 },
      { name: 'Emene', slug: 'emene', lat: 6.4700, lng: 7.6100, population: 250000, sortOrder: 9 },
      { name: 'Trans-Ekulu / Independence Layout', slug: 'trans-ekulu', lat: 6.4600, lng: 7.5200, population: 180000, sortOrder: 10 },
    ],
  },
  {
    name: 'Rivers',
    slug: 'rivers',
    code: 'RI',
    region: Region.SOUTH_SOUTH,
    capital: 'Port Harcourt',
    lat: 4.8156,
    lng: 7.0498,
    sortOrder: 4,
    cities: [
      { name: 'Port Harcourt Central', slug: 'port-harcourt', lat: 4.8156, lng: 7.0498, population: 1200000, sortOrder: 1 },
      { name: 'Obio-Akpor', slug: 'obio-akpor', lat: 4.8600, lng: 7.0000, population: 800000, sortOrder: 2 },
      { name: 'Eleme', slug: 'eleme', lat: 4.7200, lng: 7.1000, population: 250000, sortOrder: 3 },
      { name: 'Bonny', slug: 'bonny', lat: 4.4400, lng: 7.1700, population: 100000, sortOrder: 4 },
      { name: 'Degema', slug: 'degema', lat: 4.7500, lng: 6.7700, population: 150000, sortOrder: 5 },
      { name: 'Ahoada', slug: 'ahoada', lat: 5.0800, lng: 6.6500, population: 200000, sortOrder: 6 },
      { name: 'Bori', slug: 'bori', lat: 4.6800, lng: 7.3700, population: 180000, sortOrder: 7 },
      { name: 'Omoku', slug: 'omoku', lat: 5.3300, lng: 6.6600, population: 120000, sortOrder: 8 },
      { name: 'Okirika', slug: 'okirika', lat: 4.7300, lng: 7.0800, population: 200000, sortOrder: 9 },
      { name: 'Oyigbo', slug: 'oyigbo', lat: 4.8800, lng: 7.1500, population: 250000, sortOrder: 10 },
    ],
  },
  {
    name: 'Kano',
    slug: 'kano',
    code: 'KN',
    region: Region.NORTH_WEST,
    capital: 'Kano',
    lat: 12.0022,
    lng: 8.5919,
    sortOrder: 5,
    cities: [
      { name: 'Kano City', slug: 'kano-city', lat: 12.0022, lng: 8.5919, population: 3500000, sortOrder: 1 },
      { name: 'Fagge / Kantin Kwari', slug: 'fagge', lat: 11.9900, lng: 8.5200, population: 300000, sortOrder: 2 },
      { name: 'Wudil', slug: 'wudil', lat: 11.8100, lng: 8.8400, population: 150000, sortOrder: 3 },
      { name: 'Bichi', slug: 'bichi', lat: 12.2300, lng: 8.2400, population: 200000, sortOrder: 4 },
      { name: 'Gaya', slug: 'gaya', lat: 11.8600, lng: 9.0000, population: 180000, sortOrder: 5 },
      { name: 'Rano', slug: 'rano', lat: 11.5500, lng: 8.5800, population: 130000, sortOrder: 6 },
      { name: 'Dambatta', slug: 'dambatta', lat: 12.4300, lng: 8.5200, population: 200000, sortOrder: 7 },
      { name: 'Kura', slug: 'kura', lat: 11.7700, lng: 8.4300, population: 120000, sortOrder: 8 },
      { name: 'Gezawa', slug: 'gezawa', lat: 12.0900, lng: 8.7500, population: 150000, sortOrder: 9 },
      { name: 'Dawanau', slug: 'dawanau', lat: 12.0500, lng: 8.4500, population: 100000, sortOrder: 10 },
    ],
  },
  {
    name: 'Kaduna',
    slug: 'kaduna',
    code: 'KD',
    region: Region.NORTH_WEST,
    capital: 'Kaduna',
    lat: 10.5105,
    lng: 7.4165,
    sortOrder: 6,
    cities: [
      { name: 'Kaduna Central', slug: 'kaduna-central', lat: 10.5105, lng: 7.4165, population: 800000, sortOrder: 1 },
      { name: 'Zaria', slug: 'zaria', lat: 11.0855, lng: 7.7106, population: 600000, sortOrder: 2 },
      { name: 'Kafanchan', slug: 'kafanchan', lat: 9.5833, lng: 8.3000, population: 150000, sortOrder: 3 },
      { name: 'Barnawa', slug: 'barnawa', lat: 10.4800, lng: 7.4300, population: 200000, sortOrder: 4 },
      { name: 'Kakuri', slug: 'kakuri', lat: 10.4600, lng: 7.4000, population: 180000, sortOrder: 5 },
      { name: 'Birnin Gwari', slug: 'birnin-gwari', lat: 10.7400, lng: 6.5500, population: 100000, sortOrder: 6 },
      { name: 'Saminaka', slug: 'saminaka', lat: 10.3700, lng: 8.6800, population: 120000, sortOrder: 7 },
      { name: 'Kagoro', slug: 'kagoro', lat: 9.6000, lng: 8.3800, population: 80000, sortOrder: 8 },
      { name: 'Giwa', slug: 'giwa', lat: 11.2000, lng: 7.3300, population: 150000, sortOrder: 9 },
      { name: 'Ikara', slug: 'ikara', lat: 11.1700, lng: 8.2300, population: 100000, sortOrder: 10 },
    ],
  },
];

// ── Store Data ──────────────────────────────────────────────────────────────

const STORES = [
  // ── Lagos ──
  { name: 'Shoprite Ikeja City Mall', slug: 'shoprite-ikeja', type: StoreType.SUPERMARKET, citySlug: 'ikeja', stateCode: 'LA', lat: 6.6018, lng: 3.3430 },
  { name: 'SPAR Ikeja', slug: 'spar-ikeja', type: StoreType.SUPERMARKET, citySlug: 'ikeja', stateCode: 'LA', lat: 6.6050, lng: 3.3490 },
  { name: 'Ikeja Market', slug: 'ikeja-market', type: StoreType.OPEN_MARKET, citySlug: 'ikeja', stateCode: 'LA', lat: 6.6000, lng: 3.3450 },
  { name: 'Computer Village Market', slug: 'computer-village', type: StoreType.OPEN_MARKET, citySlug: 'ikeja', stateCode: 'LA', lat: 6.5990, lng: 3.3500 },
  { name: 'Balogun Market', slug: 'balogun-market', type: StoreType.OPEN_MARKET, citySlug: 'lagos-island', stateCode: 'LA', lat: 6.4530, lng: 3.3970 },
  { name: 'Idumota Market', slug: 'idumota-market', type: StoreType.OPEN_MARKET, citySlug: 'lagos-island', stateCode: 'LA', lat: 6.4550, lng: 3.3900 },
  { name: 'Hubmart Lagos Island', slug: 'hubmart-lagos-island', type: StoreType.SUPERMARKET, citySlug: 'lagos-island', stateCode: 'LA', lat: 6.4560, lng: 3.4050 },
  { name: 'Shoprite Circle Mall Lekki', slug: 'shoprite-lekki', type: StoreType.SUPERMARKET, citySlug: 'lekki-vi', stateCode: 'LA', lat: 6.4350, lng: 3.4700 },
  { name: 'SPAR Lekki', slug: 'spar-lekki', type: StoreType.SUPERMARKET, citySlug: 'lekki-vi', stateCode: 'LA', lat: 6.4300, lng: 3.4500 },
  { name: 'Lekki Market (Marwa)', slug: 'lekki-marwa-market', type: StoreType.OPEN_MARKET, citySlug: 'lekki-vi', stateCode: 'LA', lat: 6.4370, lng: 3.4250 },
  { name: 'Tejuosho Market', slug: 'tejuosho-market', type: StoreType.OPEN_MARKET, citySlug: 'surulere', stateCode: 'LA', lat: 6.4950, lng: 3.3590 },
  { name: 'Market Square Surulere', slug: 'market-square-surulere', type: StoreType.SUPERMARKET, citySlug: 'surulere', stateCode: 'LA', lat: 6.4930, lng: 3.3550 },
  { name: 'Addide Surulere', slug: 'addide-surulere', type: StoreType.SUPERMARKET, citySlug: 'surulere', stateCode: 'LA', lat: 6.4900, lng: 3.3510 },
  { name: 'Yaba Market', slug: 'yaba-market', type: StoreType.OPEN_MARKET, citySlug: 'yaba', stateCode: 'LA', lat: 6.5080, lng: 3.3750 },
  { name: 'Oyingbo Market', slug: 'oyingbo-market', type: StoreType.OPEN_MARKET, citySlug: 'yaba', stateCode: 'LA', lat: 6.4800, lng: 3.3850 },
  { name: 'Daleko Market', slug: 'daleko-market', type: StoreType.OPEN_MARKET, citySlug: 'mushin', stateCode: 'LA', lat: 6.5350, lng: 3.3500 },
  { name: 'Mushin Market', slug: 'mushin-market', type: StoreType.OPEN_MARKET, citySlug: 'mushin', stateCode: 'LA', lat: 6.5380, lng: 3.3520 },
  { name: 'Oshodi Market', slug: 'oshodi-market', type: StoreType.OPEN_MARKET, citySlug: 'oshodi', stateCode: 'LA', lat: 6.5550, lng: 3.3430 },
  { name: 'Justrite Oshodi', slug: 'justrite-oshodi', type: StoreType.SUPERMARKET, citySlug: 'oshodi', stateCode: 'LA', lat: 6.5520, lng: 3.3400 },
  { name: 'Ikorodu Market', slug: 'ikorodu-market', type: StoreType.OPEN_MARKET, citySlug: 'ikorodu', stateCode: 'LA', lat: 6.6200, lng: 3.5080 },
  { name: 'Justrite Ikorodu', slug: 'justrite-ikorodu', type: StoreType.SUPERMARKET, citySlug: 'ikorodu', stateCode: 'LA', lat: 6.6180, lng: 3.5050 },
  { name: 'Festac Market', slug: 'festac-market', type: StoreType.OPEN_MARKET, citySlug: 'festac', stateCode: 'LA', lat: 6.4650, lng: 3.2800 },
  { name: 'Mile 2 Market', slug: 'mile-2-market', type: StoreType.OPEN_MARKET, citySlug: 'festac', stateCode: 'LA', lat: 6.4600, lng: 3.3100 },
  { name: 'Shoprite Festac', slug: 'shoprite-festac', type: StoreType.SUPERMARKET, citySlug: 'festac', stateCode: 'LA', lat: 6.4620, lng: 3.2850 },
  { name: 'Ajah Market', slug: 'ajah-market', type: StoreType.OPEN_MARKET, citySlug: 'ajah-sangotedo', stateCode: 'LA', lat: 6.4700, lng: 3.5700 },
  { name: 'Prince Ebeano Lekki', slug: 'prince-ebeano-lekki', type: StoreType.SUPERMARKET, citySlug: 'ajah-sangotedo', stateCode: 'LA', lat: 6.4650, lng: 3.5500 },

  // ── FCT Abuja ──
  { name: 'Garki Ultra Modern Market', slug: 'garki-market', type: StoreType.OPEN_MARKET, citySlug: 'garki', stateCode: 'FC', lat: 9.0280, lng: 7.4920 },
  { name: 'Next Cash & Carry Abuja', slug: 'next-cash-carry-abuja', type: StoreType.SUPERMARKET, citySlug: 'garki', stateCode: 'FC', lat: 9.0220, lng: 7.4850 },
  { name: 'Wuse Market', slug: 'wuse-market', type: StoreType.OPEN_MARKET, citySlug: 'wuse', stateCode: 'FC', lat: 9.0680, lng: 7.4750 },
  { name: 'SPAR Wuse', slug: 'spar-wuse', type: StoreType.SUPERMARKET, citySlug: 'wuse', stateCode: 'FC', lat: 9.0720, lng: 7.4800 },
  { name: 'Dunes Abuja', slug: 'dunes-abuja', type: StoreType.SUPERMARKET, citySlug: 'wuse', stateCode: 'FC', lat: 9.0750, lng: 7.4850 },
  { name: 'Sahad Stores Abuja', slug: 'sahad-abuja', type: StoreType.SUPERMARKET, citySlug: 'maitama', stateCode: 'FC', lat: 9.0850, lng: 7.5050 },
  { name: 'Gwarimpa Market', slug: 'gwarimpa-market', type: StoreType.OPEN_MARKET, citySlug: 'gwarimpa', stateCode: 'FC', lat: 9.1050, lng: 7.4050 },
  { name: 'Prince Ebeano Gwarimpa', slug: 'prince-ebeano-gwarimpa', type: StoreType.SUPERMARKET, citySlug: 'gwarimpa', stateCode: 'FC', lat: 9.1080, lng: 7.4100 },
  { name: 'Kubwa Market', slug: 'kubwa-market', type: StoreType.OPEN_MARKET, citySlug: 'kubwa', stateCode: 'FC', lat: 9.1580, lng: 7.3280 },
  { name: 'Nyanya Market', slug: 'nyanya-market', type: StoreType.OPEN_MARKET, citySlug: 'nyanya', stateCode: 'FC', lat: 8.9580, lng: 7.5480 },
  { name: 'Lugbe Market', slug: 'lugbe-market', type: StoreType.OPEN_MARKET, citySlug: 'lugbe', stateCode: 'FC', lat: 8.9780, lng: 7.3750 },
  { name: 'Bwari Market', slug: 'bwari-market', type: StoreType.OPEN_MARKET, citySlug: 'bwari', stateCode: 'FC', lat: 9.2780, lng: 7.3820 },
  { name: 'Karu / Jikwoyi Market', slug: 'karu-market', type: StoreType.OPEN_MARKET, citySlug: 'karu', stateCode: 'FC', lat: 8.9920, lng: 7.5780 },

  // ── Enugu ──
  { name: 'Ogbete Main Market', slug: 'ogbete-market', type: StoreType.OPEN_MARKET, citySlug: 'enugu-city', stateCode: 'EN', lat: 6.4500, lng: 7.5000 },
  { name: 'New Market Enugu', slug: 'new-market-enugu', type: StoreType.OPEN_MARKET, citySlug: 'enugu-city', stateCode: 'EN', lat: 6.4520, lng: 7.5100 },
  { name: 'Shoprite Enugu', slug: 'shoprite-enugu', type: StoreType.SUPERMARKET, citySlug: 'enugu-city', stateCode: 'EN', lat: 6.4560, lng: 7.5300 },
  { name: 'Roban Stores Enugu', slug: 'roban-enugu', type: StoreType.SUPERMARKET, citySlug: 'enugu-city', stateCode: 'EN', lat: 6.4580, lng: 7.5350 },
  { name: 'Ogige Market Nsukka', slug: 'ogige-market', type: StoreType.OPEN_MARKET, citySlug: 'nsukka', stateCode: 'EN', lat: 6.8550, lng: 7.3900 },
  { name: 'Nsukka Main Market', slug: 'nsukka-market', type: StoreType.OPEN_MARKET, citySlug: 'nsukka', stateCode: 'EN', lat: 6.8580, lng: 7.3950 },
  { name: 'Agbani Market', slug: 'agbani-market', type: StoreType.OPEN_MARKET, citySlug: 'agbani', stateCode: 'EN', lat: 6.3480, lng: 7.5500 },
  { name: 'Abakpa Market', slug: 'abakpa-market', type: StoreType.OPEN_MARKET, citySlug: 'abakpa-nike', stateCode: 'EN', lat: 6.4820, lng: 7.5780 },
  { name: 'Prince Ebeano Enugu', slug: 'prince-ebeano-enugu', type: StoreType.SUPERMARKET, citySlug: 'abakpa-nike', stateCode: 'EN', lat: 6.4850, lng: 7.5800 },
  { name: 'Emene Market', slug: 'emene-market', type: StoreType.OPEN_MARKET, citySlug: 'emene', stateCode: 'EN', lat: 6.4680, lng: 7.6050 },
  { name: 'Spar Trans-Ekulu', slug: 'spar-trans-ekulu', type: StoreType.SUPERMARKET, citySlug: 'trans-ekulu', stateCode: 'EN', lat: 6.4620, lng: 7.5180 },

  // ── Rivers ──
  { name: 'Mile 1 Market', slug: 'mile-1-market', type: StoreType.OPEN_MARKET, citySlug: 'port-harcourt', stateCode: 'RI', lat: 4.8100, lng: 7.0200 },
  { name: 'Mile 3 Market', slug: 'mile-3-market', type: StoreType.OPEN_MARKET, citySlug: 'port-harcourt', stateCode: 'RI', lat: 4.8200, lng: 7.0100 },
  { name: 'Shoprite Port Harcourt', slug: 'shoprite-ph', type: StoreType.SUPERMARKET, citySlug: 'port-harcourt', stateCode: 'RI', lat: 4.8150, lng: 7.0500 },
  { name: 'SPAR Port Harcourt', slug: 'spar-ph', type: StoreType.SUPERMARKET, citySlug: 'port-harcourt', stateCode: 'RI', lat: 4.8180, lng: 7.0450 },
  { name: 'Rumuokoro Market', slug: 'rumuokoro-market', type: StoreType.OPEN_MARKET, citySlug: 'obio-akpor', stateCode: 'RI', lat: 4.8650, lng: 7.0100 },
  { name: 'Choba Market', slug: 'choba-market', type: StoreType.OPEN_MARKET, citySlug: 'obio-akpor', stateCode: 'RI', lat: 4.8900, lng: 6.9200 },
  { name: 'Market Square PH', slug: 'market-square-ph', type: StoreType.SUPERMARKET, citySlug: 'obio-akpor', stateCode: 'RI', lat: 4.8700, lng: 7.0000 },
  { name: 'Oil Mill Market', slug: 'oil-mill-market', type: StoreType.OPEN_MARKET, citySlug: 'oyigbo', stateCode: 'RI', lat: 4.8750, lng: 7.1480 },
  { name: 'Creek Road Market', slug: 'creek-road-market', type: StoreType.OPEN_MARKET, citySlug: 'okirika', stateCode: 'RI', lat: 4.7280, lng: 7.0850 },
  { name: 'Bori Market', slug: 'bori-market', type: StoreType.OPEN_MARKET, citySlug: 'bori', stateCode: 'RI', lat: 4.6780, lng: 7.3680 },

  // ── Kano ──
  { name: 'Kurmi Market', slug: 'kurmi-market', type: StoreType.OPEN_MARKET, citySlug: 'kano-city', stateCode: 'KN', lat: 11.9950, lng: 8.5200 },
  { name: 'Sabon Gari Market Kano', slug: 'sabon-gari-market-kano', type: StoreType.OPEN_MARKET, citySlug: 'kano-city', stateCode: 'KN', lat: 12.0050, lng: 8.5300 },
  { name: 'A.A. Rano Supermarket Kano', slug: 'aa-rano-kano', type: StoreType.SUPERMARKET, citySlug: 'kano-city', stateCode: 'KN', lat: 12.0000, lng: 8.5400 },
  { name: 'Kantin Kwari Market', slug: 'kantin-kwari-market', type: StoreType.OPEN_MARKET, citySlug: 'fagge', stateCode: 'KN', lat: 11.9920, lng: 8.5150 },
  { name: 'Singer Market Kano', slug: 'singer-market-kano', type: StoreType.OPEN_MARKET, citySlug: 'fagge', stateCode: 'KN', lat: 11.9880, lng: 8.5180 },
  { name: 'Dawanau Grain Market', slug: 'dawanau-grain-market', type: StoreType.OPEN_MARKET, citySlug: 'dawanau', stateCode: 'KN', lat: 12.0480, lng: 8.4520 },
  { name: 'Wudil Market', slug: 'wudil-market', type: StoreType.OPEN_MARKET, citySlug: 'wudil', stateCode: 'KN', lat: 11.8080, lng: 8.8380 },
  { name: 'Bichi Market', slug: 'bichi-market', type: StoreType.OPEN_MARKET, citySlug: 'bichi', stateCode: 'KN', lat: 12.2280, lng: 8.2420 },

  // ── Kaduna ──
  { name: 'Kaduna Central Market', slug: 'kaduna-central-market', type: StoreType.OPEN_MARKET, citySlug: 'kaduna-central', stateCode: 'KD', lat: 10.5100, lng: 7.4200 },
  { name: 'Kawo Market', slug: 'kawo-market', type: StoreType.OPEN_MARKET, citySlug: 'kaduna-central', stateCode: 'KD', lat: 10.5500, lng: 7.4300 },
  { name: 'A.A. Rano Supermarket Kaduna', slug: 'aa-rano-kaduna', type: StoreType.SUPERMARKET, citySlug: 'kaduna-central', stateCode: 'KD', lat: 10.5050, lng: 7.4150 },
  { name: 'Zaria City Market', slug: 'zaria-market', type: StoreType.OPEN_MARKET, citySlug: 'zaria', stateCode: 'KD', lat: 11.0850, lng: 7.7100 },
  { name: 'Sabon Gari Market Zaria', slug: 'sabon-gari-market-zaria', type: StoreType.OPEN_MARKET, citySlug: 'zaria', stateCode: 'KD', lat: 11.0800, lng: 7.7050 },
  { name: 'Kafanchan Market', slug: 'kafanchan-market', type: StoreType.OPEN_MARKET, citySlug: 'kafanchan', stateCode: 'KD', lat: 9.5820, lng: 8.2980 },
  { name: 'Barnawa Market', slug: 'barnawa-market', type: StoreType.OPEN_MARKET, citySlug: 'barnawa', stateCode: 'KD', lat: 10.4820, lng: 7.4280 },
  { name: 'Kakuri Market', slug: 'kakuri-market', type: StoreType.OPEN_MARKET, citySlug: 'kakuri', stateCode: 'KD', lat: 10.4580, lng: 7.3980 },
];

// ── Category Data ───────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Grains & Cereals', slug: 'grains-cereals', icon: 'wheat', sortOrder: 1 },
  { name: 'Proteins & Meat', slug: 'proteins-meat', icon: 'drumstick', sortOrder: 2 },
  { name: 'Fish & Seafood', slug: 'fish-seafood', icon: 'fish', sortOrder: 3 },
  { name: 'Cooking Oils', slug: 'cooking-oils', icon: 'droplets', sortOrder: 4 },
  { name: 'Tubers & Roots', slug: 'tubers-roots', icon: 'carrot', sortOrder: 5 },
  { name: 'Vegetables', slug: 'vegetables', icon: 'salad', sortOrder: 6 },
  { name: 'Fruits', slug: 'fruits', icon: 'apple', sortOrder: 7 },
  { name: 'Legumes & Beans', slug: 'legumes-beans', icon: 'bean', sortOrder: 8 },
  { name: 'Dairy & Eggs', slug: 'dairy-eggs', icon: 'egg', sortOrder: 9 },
  { name: 'Beverages', slug: 'beverages', icon: 'cup-soda', sortOrder: 10 },
  { name: 'Seasoning & Spices', slug: 'seasoning-spices', icon: 'flame', sortOrder: 11 },
  { name: 'Household & Cleaning', slug: 'household-cleaning', icon: 'spray-can', sortOrder: 12 },
  { name: 'Baby Products', slug: 'baby-products', icon: 'baby', sortOrder: 13 },
  { name: 'Baking Supplies', slug: 'baking-supplies', icon: 'cake', sortOrder: 14 },
  { name: 'Snacks & Confectionery', slug: 'snacks-confectionery', icon: 'cookie', sortOrder: 15 },
  { name: 'Canned & Packaged Foods', slug: 'canned-packaged', icon: 'package', sortOrder: 16 },
  { name: 'Breakfast & Cereals', slug: 'breakfast-cereals', icon: 'sunrise', sortOrder: 17 },
  { name: 'Pasta & Noodles', slug: 'pasta-noodles', icon: 'utensils', sortOrder: 18 },
  { name: 'Frozen Foods', slug: 'frozen-foods', icon: 'snowflake', sortOrder: 19 },
  { name: 'Personal Care', slug: 'personal-care', icon: 'heart-pulse', sortOrder: 20 },
];

// ── Product Data (Core Nigerian Staples) ────────────────────────────────────

const PRODUCTS = [
  // Grains & Cereals
  { name: 'Local Rice (50kg)', slug: 'local-rice-50kg', category: 'grains-cereals', brand: null, unit: '50kg bag' },
  { name: 'Foreign Rice (50kg)', slug: 'foreign-rice-50kg', category: 'grains-cereals', brand: null, unit: '50kg bag' },
  { name: 'Local Rice', slug: 'local-rice-1kg', category: 'grains-cereals', brand: null, unit: '1kg' },
  { name: 'Foreign Rice', slug: 'foreign-rice-1kg', category: 'grains-cereals', brand: null, unit: '1kg' },
  { name: 'Garri (White)', slug: 'garri-white', category: 'grains-cereals', brand: null, unit: 'per derica' },
  { name: 'Garri (Yellow)', slug: 'garri-yellow', category: 'grains-cereals', brand: null, unit: 'per derica' },
  { name: 'Semovita', slug: 'semovita-2kg', category: 'grains-cereals', brand: 'Semovita', unit: '2kg' },
  { name: 'Golden Penny Semolina', slug: 'golden-penny-semolina', category: 'grains-cereals', brand: 'Golden Penny', unit: '1kg' },
  { name: 'Wheat Flour', slug: 'wheat-flour-2kg', category: 'grains-cereals', brand: null, unit: '2kg' },
  { name: 'Maize (Corn)', slug: 'maize-corn', category: 'grains-cereals', brand: null, unit: 'per derica' },

  // Proteins & Meat
  { name: 'Chicken (Whole)', slug: 'chicken-whole', category: 'proteins-meat', brand: null, unit: 'per kg' },
  { name: 'Beef (Boneless)', slug: 'beef-boneless', category: 'proteins-meat', brand: null, unit: 'per kg' },
  { name: 'Goat Meat', slug: 'goat-meat', category: 'proteins-meat', brand: null, unit: 'per kg' },
  { name: 'Turkey', slug: 'turkey', category: 'proteins-meat', brand: null, unit: 'per kg' },
  { name: 'Eggs (Crate)', slug: 'eggs-crate', category: 'proteins-meat', brand: null, unit: 'per crate (30)' },

  // Fish & Seafood
  { name: 'Catfish (Fresh)', slug: 'catfish-fresh', category: 'fish-seafood', brand: null, unit: 'per kg' },
  { name: 'Tilapia (Fresh)', slug: 'tilapia-fresh', category: 'fish-seafood', brand: null, unit: 'per kg' },
  { name: 'Stockfish', slug: 'stockfish', category: 'fish-seafood', brand: null, unit: 'per piece' },
  { name: 'Dried Fish (Eja Kika)', slug: 'dried-fish', category: 'fish-seafood', brand: null, unit: 'per piece' },
  { name: 'Crayfish', slug: 'crayfish', category: 'fish-seafood', brand: null, unit: 'per derica' },
  { name: 'Mackerel (Titus)', slug: 'mackerel-titus', category: 'fish-seafood', brand: 'Titus', unit: 'per tin' },

  // Cooking Oils
  { name: 'Palm Oil', slug: 'palm-oil', category: 'cooking-oils', brand: null, unit: 'per litre' },
  { name: 'Groundnut Oil', slug: 'groundnut-oil', category: 'cooking-oils', brand: null, unit: 'per litre' },
  { name: 'Kings Vegetable Oil', slug: 'kings-veg-oil-3l', category: 'cooking-oils', brand: 'Kings', unit: '3 litres' },
  { name: 'Devon Kings Olive Oil', slug: 'olive-oil-500ml', category: 'cooking-oils', brand: 'Devon Kings', unit: '500ml' },

  // Tubers & Roots
  { name: 'Yam', slug: 'yam-tuber', category: 'tubers-roots', brand: null, unit: 'per tuber' },
  { name: 'Sweet Potato', slug: 'sweet-potato', category: 'tubers-roots', brand: null, unit: 'per kg' },
  { name: 'Irish Potato', slug: 'irish-potato', category: 'tubers-roots', brand: null, unit: 'per kg' },
  { name: 'Plantain (Ripe)', slug: 'plantain-ripe', category: 'fruits', brand: null, unit: 'per bunch' },
  { name: 'Plantain (Unripe)', slug: 'plantain-unripe', category: 'fruits', brand: null, unit: 'per bunch' },

  // Vegetables
  { name: 'Tomatoes (Fresh)', slug: 'tomatoes-fresh', category: 'vegetables', brand: null, unit: 'per basket (small)' },
  { name: 'Pepper (Rodo)', slug: 'pepper-rodo', category: 'vegetables', brand: null, unit: 'per derica' },
  { name: 'Pepper (Tatashe)', slug: 'pepper-tatashe', category: 'vegetables', brand: null, unit: 'per derica' },
  { name: 'Onions', slug: 'onions', category: 'vegetables', brand: null, unit: 'per kg' },
  { name: 'Okra', slug: 'okra', category: 'vegetables', brand: null, unit: 'per derica' },
  { name: 'Spinach (Efo Tete)', slug: 'spinach-efo', category: 'vegetables', brand: null, unit: 'per bunch' },
  { name: 'Ugu (Pumpkin Leaves)', slug: 'ugu-leaves', category: 'vegetables', brand: null, unit: 'per bunch' },
  { name: 'Bitter Leaf', slug: 'bitter-leaf', category: 'vegetables', brand: null, unit: 'per bunch' },

  // Legumes
  { name: 'Beans (Honey)', slug: 'beans-honey', category: 'legumes-beans', brand: null, unit: 'per derica' },
  { name: 'Beans (Oloyin)', slug: 'beans-oloyin', category: 'legumes-beans', brand: null, unit: 'per derica' },
  { name: 'Beans (Drum / Iron)', slug: 'beans-drum', category: 'legumes-beans', brand: null, unit: 'per derica' },
  { name: 'Groundnut (Raw)', slug: 'groundnut-raw', category: 'legumes-beans', brand: null, unit: 'per derica' },

  // Dairy & Eggs
  { name: 'Peak Milk (Evaporated)', slug: 'peak-milk-evaporated', category: 'dairy-eggs', brand: 'Peak', unit: 'per tin (160g)' },
  { name: 'Peak Milk (Powdered)', slug: 'peak-milk-powdered-400g', category: 'dairy-eggs', brand: 'Peak', unit: '400g' },
  { name: 'Three Crowns Milk', slug: 'three-crowns-milk', category: 'dairy-eggs', brand: 'Three Crowns', unit: 'per tin' },
  { name: 'Hollandia Yoghurt', slug: 'hollandia-yoghurt-500ml', category: 'dairy-eggs', brand: 'Hollandia', unit: '500ml' },

  // Beverages
  { name: 'Milo (400g)', slug: 'milo-400g', category: 'beverages', brand: 'Nestlé Milo', unit: '400g' },
  { name: 'Bournvita (400g)', slug: 'bournvita-400g', category: 'beverages', brand: 'Cadbury Bournvita', unit: '400g' },
  { name: 'Lipton Tea', slug: 'lipton-tea-100', category: 'beverages', brand: 'Lipton', unit: '100 bags' },
  { name: 'Coca-Cola', slug: 'coca-cola-50cl', category: 'beverages', brand: 'Coca-Cola', unit: '50cl PET' },
  { name: 'Bottled Water (75cl)', slug: 'bottled-water-75cl', category: 'beverages', brand: null, unit: '75cl' },

  // Seasoning
  { name: 'Maggi Seasoning', slug: 'maggi-cubes', category: 'seasoning-spices', brand: 'Maggi', unit: 'per pack (50 cubes)' },
  { name: 'Knorr Cubes', slug: 'knorr-cubes', category: 'seasoning-spices', brand: 'Knorr', unit: 'per pack (50 cubes)' },
  { name: 'Salt', slug: 'salt-500g', category: 'seasoning-spices', brand: null, unit: '500g' },
  { name: 'Curry Powder', slug: 'curry-powder', category: 'seasoning-spices', brand: null, unit: '100g' },
  { name: 'Tomato Paste (Gino)', slug: 'tomato-paste-gino', category: 'seasoning-spices', brand: 'Gino', unit: '400g tin' },

  // Household
  { name: 'Omo Detergent', slug: 'omo-detergent-900g', category: 'household-cleaning', brand: 'Omo', unit: '900g' },
  { name: 'Mama Lemon Dish Wash', slug: 'mama-lemon', category: 'household-cleaning', brand: 'Mama Lemon', unit: '500ml' },
  { name: 'Cooking Gas (LPG)', slug: 'cooking-gas-12kg', category: 'household-cleaning', brand: null, unit: '12.5kg refill' },

  // Baking
  { name: 'Granulated Sugar', slug: 'sugar-500g', category: 'baking-supplies', brand: 'Dangote', unit: '500g' },
  { name: 'Dangote Sugar (50kg)', slug: 'sugar-50kg', category: 'baking-supplies', brand: 'Dangote', unit: '50kg bag' },
  { name: 'Blue Band Margarine', slug: 'blue-band-250g', category: 'baking-supplies', brand: 'Blue Band', unit: '250g' },

  // Pasta & Noodles
  { name: 'Golden Penny Spaghetti', slug: 'golden-penny-spaghetti-500g', category: 'pasta-noodles', brand: 'Golden Penny', unit: '500g' },
  { name: 'Indomie Noodles (Super Pack)', slug: 'indomie-super-pack', category: 'pasta-noodles', brand: 'Indomie', unit: 'per carton (40)' },
  { name: 'Indomie Noodles', slug: 'indomie-single', category: 'pasta-noodles', brand: 'Indomie', unit: 'per pack (70g)' },

  // Bread & Snacks
  { name: 'Bread (Sliced)', slug: 'bread-sliced', category: 'snacks-confectionery', brand: null, unit: 'per loaf' },
  { name: 'Cabin Biscuit', slug: 'cabin-biscuit', category: 'snacks-confectionery', brand: 'Cabin', unit: 'per pack' },
];

// ── Seed Function ───────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting PriceLens Nigeria database seed...\n');

  // Seed States & Cities
  console.log('📍 Seeding states and cities...');
  for (const stateData of STATES) {
    const state = await prisma.state.upsert({
      where: { code: stateData.code },
      update: {},
      create: {
        name: stateData.name,
        slug: stateData.slug,
        code: stateData.code,
        region: stateData.region,
        capital: stateData.capital,
        lat: stateData.lat,
        lng: stateData.lng,
        sortOrder: stateData.sortOrder,
      },
    });

    for (const cityData of stateData.cities) {
      await prisma.city.upsert({
        where: { slug_stateId: { slug: cityData.slug, stateId: state.id } },
        update: {},
        create: {
          name: cityData.name,
          slug: cityData.slug,
          stateId: state.id,
          lat: cityData.lat,
          lng: cityData.lng,
          population: cityData.population,
          sortOrder: cityData.sortOrder,
        },
      });
    }
    console.log(`  ✅ ${stateData.name}: ${stateData.cities.length} cities`);
  }

  // Seed Categories
  console.log('\n📦 Seeding categories...');
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
      },
    });
  }
  console.log(`  ✅ ${CATEGORIES.length} categories created`);

  // Seed Products
  console.log('\n🛒 Seeding products...');
  for (const prod of PRODUCTS) {
    const category = await prisma.category.findUnique({ where: { slug: prod.category } });
    if (!category) {
      console.log(`  ⚠️ Category not found for ${prod.name}: ${prod.category}`);
      continue;
    }
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: {
        name: prod.name,
        slug: prod.slug,
        categoryId: category.id,
        brand: prod.brand,
        unit: prod.unit,
      },
    });
  }
  console.log(`  ✅ ${PRODUCTS.length} products created`);

  // Seed Stores
  console.log('\n🏪 Seeding stores...');
  let storeCount = 0;
  for (const store of STORES) {
    // Find the state first
    const state = await prisma.state.findUnique({ where: { code: store.stateCode } });
    if (!state) {
      console.log(`  ⚠️ State not found for store ${store.name}: ${store.stateCode}`);
      continue;
    }

    // Find the city
    const city = await prisma.city.findUnique({
      where: { slug_stateId: { slug: store.citySlug, stateId: state.id } },
    });
    if (!city) {
      console.log(`  ⚠️ City not found for store ${store.name}: ${store.citySlug}`);
      continue;
    }

    await prisma.store.upsert({
      where: { slug: store.slug },
      update: {},
      create: {
        name: store.name,
        slug: store.slug,
        type: store.type,
        cityId: city.id,
        lat: store.lat,
        lng: store.lng,
        marketDays: store.type === StoreType.OPEN_MARKET ? 'Daily' : undefined,
        isVerified: true,
      },
    });
    storeCount++;
  }
  console.log(`  ✅ ${storeCount} stores created`);

  // Summary
  const totalStates = await prisma.state.count();
  const totalCities = await prisma.city.count();
  const totalStores = await prisma.store.count();
  const totalCategories = await prisma.category.count();
  const totalProducts = await prisma.product.count();

  console.log('\n══════════════════════════════════════');
  console.log('🎉 Seed completed!');
  console.log(`   📍 States:     ${totalStates}`);
  console.log(`   🏙️  Cities:     ${totalCities}`);
  console.log(`   🏪 Stores:     ${totalStores}`);
  console.log(`   📦 Categories: ${totalCategories}`);
  console.log(`   🛒 Products:   ${totalProducts}`);
  console.log('══════════════════════════════════════\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

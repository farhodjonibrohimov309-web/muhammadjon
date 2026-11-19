/* ==========================================================================
   FAST MARKET — Complete Vanilla JS Application Engine
   Features: Catalog, Search, Cart, Geolocation + Leaflet Map, Demo Checkout,
   Wishlist, Compare, Profile, Bonus/Referral, Reviews, Notifications, Admin Demo
   ========================================================================== */

"use strict";

const STORAGE_KEYS = {
  PRODUCTS: "fm_products_v1",
  CATEGORIES: "fm_categories_v1",
  CART: "fm_cart_v1",
  WISHLIST: "fm_wishlist_v1",
  COMPARE: "fm_compare_v1",
  ORDERS: "fm_orders_v1",
  PROFILE: "fm_profile_v1",
  SEARCH_HISTORY: "fm_search_history_v1",
  RECENTLY_VIEWED: "fm_recently_viewed_v1",
  NOTIFICATIONS: "fm_notifications_v1",
  THEME: "fm_theme_v1",
  APPLIED_PROMO: "fm_applied_promo_v1",
  CUSTOMERS: "fm_customers_v1"
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80";
const DELIVERY_FEE_BASE = 15000;
const FREE_DELIVERY_THRESHOLD = 150000;

const PROMO_CODES = {
  FAST20: { discountPercent: 20, label: "FAST20 (-20%)" },
  YANDEX15: { discountPercent: 15, label: "YANDEX15 (-15%)" },
  MARKET10: { discountPercent: 10, label: "MARKET10 (-10%)" }
};

const DEFAULT_CATEGORIES = [
  { id: "fast-food", name: "Fast Food", icon: "fa-burger" },
  { id: "burger", name: "Burger", icon: "fa-hamburger" },
  { id: "lavash", name: "Lavash", icon: "fa-wrap" },
  { id: "pizza", name: "Pizza", icon: "fa-pizza-slice" },
  { id: "sushi", name: "Sushi", icon: "fa-fish" },
  { id: "ichimliklar", name: "Ichimliklar", icon: "fa-glass-water" },
  { id: "shirinliklar", name: "Shirinliklar", icon: "fa-ice-cream" },
  { id: "mevalar", name: "Mevalar", icon: "fa-apple-whole" },
  { id: "sabzavotlar", name: "Sabzavotlar", icon: "fa-carrot" },
  { id: "gosht", name: "Go'sht mahsulotlari", icon: "fa-drumstick-bite" },
  { id: "sut", name: "Sut mahsulotlari", icon: "fa-cheese" },
  { id: "non", name: "Non mahsulotlari", icon: "fa-bread-slice" },
  { id: "oziq-ovqat", name: "Oziq-ovqat", icon: "fa-basket-shopping" },
  { id: "maishiy-texnika", name: "Maishiy texnika", icon: "fa-blender" },
  { id: "kiyim-kechak", name: "Kiyim-kechak", icon: "fa-shirt" },
  { id: "elektronika", name: "Elektronika", icon: "fa-laptop" }
];

const DEFAULT_PRODUCTS = [
  {
    id: "prd-101",
    name: "Double Smash Cheeseburger",
    category: "burger",
    brand: "FastGrill",
    price: 38000,
    oldPrice: 46000,
    rating: 4.9,
    soldCount: 1420,
    inStock: true,
    isNew: true,
    isRecommended: true,
    isDailyDeal: true,
    isFlashSale: true,
    flashSoldPercent: 78,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=80",
    description: "Ikki qavatli shirador mol go'shti kotleti, eritilgan cheddar pishloq, maxsus sous va yumshoq brioche bulochka.",
    specs: { "Og'irligi": "290 g", "Tayyorlanish vaqti": "15 daq", "Kaloriya": "640 kkal" },
    reviews: [{ author: "Javohir T.", rating: 5, text: "Juda mazali va issiq yetkazib berildi!", date: "2026-11-12" }]
  },
  {
    id: "prd-102",
    name: "Crispy Chicken Combo Box",
    category: "fast-food",
    brand: "FastGrill",
    price: 54000,
    oldPrice: 65000,
    rating: 4.8,
    soldCount: 1180,
    inStock: true,
    isNew: false,
    isRecommended: true,
    isDailyDeal: false,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=700&q=80",
    description: "Qarsildoq tovuq bo'laklari, oltinrang kartoshka fri va firmenniy sarimsoqli sous to'plami.",
    specs: { "Og'irligi": "420 g", "Tayyorlanish vaqti": "18 daq", "Kaloriya": "780 kkal" },
    reviews: [{ author: "Madina S.", rating: 5, text: "Kartoshkasi ham yumshoq, tovuq juda qarsildoq.", date: "2026-11-14" }]
  },
  {
    id: "prd-103",
    name: "Qirollik Mol Go'shtli Lavash",
    category: "lavash",
    brand: "LavashHouse",
    price: 34000,
    oldPrice: 40000,
    rating: 4.9,
    soldCount: 2150,
    inStock: true,
    isNew: false,
    isRecommended: true,
    isDailyDeal: true,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=700&q=80",
    description: "Yangi pishirilgan yupqa lavash, yumshoq mol go'shti, pishloq, kartoshka fri va pomidor-bodring.",
    specs: { "Og'irligi": "360 g", "Tayyorlanish vaqti": "15 daq", "Achchiqlik": "Me'yorida" },
    reviews: []
  },
  {
    id: "prd-104",
    name: "Pepperoni Supreme Pizza (33 sm)",
    category: "pizza",
    brand: "RomaSlice",
    price: 76000,
    oldPrice: 92000,
    rating: 4.8,
    soldCount: 980,
    inStock: true,
    isNew: true,
    isRecommended: true,
    isDailyDeal: false,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=700&q=80",
    description: "Yupqa italyan xamiri, ko'p miqdorda mozzarella pishloq, dudlangan pepperoni kolbasa va tomat sousi.",
    specs: { "Diametri": "33 sm", "Bo'laklar soni": "8 ta", "Og'irligi": "580 g" },
    reviews: []
  },
  {
    id: "prd-105",
    name: "Salmon Philadelphia Sushi Set",
    category: "sushi",
    brand: "TokyoRoll",
    price: 89000,
    oldPrice: 105000,
    rating: 4.9,
    soldCount: 640,
    inStock: true,
    isNew: true,
    isRecommended: false,
    isDailyDeal: false,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=700&q=80",
    description: "24 dona sara rollar: klassik Filadelfiya, lososli roll, vasabi, marinadlangan zanjabil va soya sousi.",
    specs: { "Miqdori": "24 dona", "Og'irligi": "620 g", "Tarkibi": "Losos, guruch, nori, krem-pishloq" },
    reviews: []
  },
  {
    id: "prd-106",
    name: "Muzdek Citrus & Berry Limonad",
    category: "ichimliklar",
    brand: "AquaFresh",
    price: 16000,
    oldPrice: 20000,
    rating: 4.7,
    soldCount: 1590,
    inStock: true,
    isNew: false,
    isRecommended: true,
    isDailyDeal: true,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=700&q=80",
    description: "Tabiiy apelsin, laym va yalpiz barglari qo'shilgan tetiklashtiruvchi uy limonadi.",
    specs: { "Hajmi": "0.5 L", "Harorati": "Sovutilgan (+4°C)", "Shakar": "Tabiiy sirop" },
    reviews: []
  },
  {
    id: "prd-107",
    name: "Belgian Chocolate Fondant & Cake",
    category: "shirinliklar",
    brand: "SweetArt",
    price: 29000,
    oldPrice: 35000,
    rating: 4.9,
    soldCount: 730,
    inStock: true,
    isNew: true,
    isRecommended: true,
    isDailyDeal: false,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=80",
    description: "Belgiya shokoladidan tayyorlangan nafis desert, ichi yumshoq va boy kakao ta'miga ega.",
    specs: { "Og'irligi": "165 g", "Brend": "SweetArt", "Saqlash": "+2°C .. +6°C" },
    reviews: []
  },
  {
    id: "prd-108",
    name: "Qizil Olma & Sitrus Savati (1 kg)",
    category: "mevalar",
    brand: "GreenValley",
    price: 22000,
    oldPrice: 27000,
    rating: 4.8,
    soldCount: 840,
    inStock: true,
    isNew: false,
    isRecommended: true,
    isDailyDeal: false,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=700&q=80",
    description: "Bog'lardan yangi uzilgan shirin va shirali qizil olma, vitaminlarga boy.",
    specs: { "Og'irligi": "1 kg", "Kelib chiqishi": "Mahalliy bog'", "Sinf": "Oliy nav" },
    reviews: []
  },
  {
    id: "prd-109",
    name: "Yangi Pomidor, Bodring va Ko'katlar",
    category: "sabzavotlar",
    brand: "GreenValley",
    price: 18500,
    oldPrice: 23000,
    rating: 4.7,
    soldCount: 910,
    inStock: true,
    isNew: false,
    isRecommended: false,
    isDailyDeal: true,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&q=80",
    description: "Salat va kundalik taomlar uchun saralangan yangi sabzavotlar to'plami.",
    specs: { "Og'irligi": "1.2 kg", "Holati": "Yangi uzilgan", "Qadoq": "Eko-quti" },
    reviews: []
  },
  {
    id: "prd-110",
    name: "Premium Mol Go'shti Lavlagi/Lahyagi (1 kg)",
    category: "gosht",
    brand: "HalalMeat",
    price: 94000,
    oldPrice: 108000,
    rating: 4.9,
    soldCount: 520,
    inStock: true,
    isNew: false,
    isRecommended: true,
    isDailyDeal: false,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=700&q=80",
    description: "Halol sertifikatiga ega, yumshoq va suyak-yog'siz saralangan mol go'shti.",
    specs: { "Og'irligi": "1 kg", "Sertifikat": "Halol Standart", "Saqlash": "0°C .. +4°C" },
    reviews: []
  },
  {
    id: "prd-111",
    name: "Tabiiy Fermer Suti (1 L, 3.2%)",
    category: "sut",
    brand: "BioSut",
    price: 14500,
    oldPrice: 17000,
    rating: 4.8,
    soldCount: 1310,
    inStock: true,
    isNew: false,
    isRecommended: true,
    isDailyDeal: false,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=700&q=80",
    description: "Pasterizatsiyalangan tabiiy sut, nonushta, qahva va pishiriqlar uchun ajoyib tanlov.",
    specs: { "Hajmi": "1 Litr", "Yog'liligi": "3.2%", "Yaroqlilik": "7 kun" },
    reviews: []
  },
  {
    id: "prd-112",
    name: "Issiq Tandir Non & Baget",
    category: "non",
    brand: "Nonvoyxona",
    price: 7500,
    oldPrice: 9000,
    rating: 4.9,
    soldCount: 1850,
    inStock: true,
    isNew: false,
    isRecommended: false,
    isDailyDeal: false,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700&q=80",
    description: "Har kuni yangi yopilgan yumshoq va xushbo'y non mahsuloti.",
    specs: { "Og'irligi": "450 g", "Turi": "Nonvoyxona", "Holati": "Yangi" },
    reviews: []
  },
  {
    id: "prd-113",
    name: "Zaytun Yog'i Extra Virgin (500 ml)",
    category: "oziq-ovqat",
    brand: "OleaGold",
    price: 68000,
    oldPrice: 80000,
    rating: 4.8,
    soldCount: 410,
    inStock: true,
    isNew: true,
    isRecommended: false,
    isDailyDeal: false,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=700&q=80",
    description: "Birinchi sovuq presslash usulida olingan tabiiy zaytun yog'i.",
    specs: { "Hajmi": "500 ml", "Turi": "Extra Virgin", "Shisha": "Qorong'i shisha" },
    reviews: []
  },
  {
    id: "prd-114",
    name: "Smart Air Fryer & Blender Pro",
    category: "maishiy-texnika",
    brand: "HomeTech",
    price: 790000,
    oldPrice: 980000,
    rating: 4.8,
    soldCount: 195,
    inStock: true,
    isNew: true,
    isRecommended: true,
    isDailyDeal: false,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=700&q=80",
    description: "Kam yog'da sog'lom taom tayyorlash uchun zamonaviy sensorli oshxona texnikasi.",
    specs: { "Quvvati": "1650 Vt", "Hajmi": "5.5 L", "Kafolat": "12 oy" },
    reviews: []
  },
  {
    id: "prd-115",
    name: "Unisex Hoodie & Urban Streetwear",
    category: "kiyim-kechak",
    brand: "UrbanWear",
    price: 245000,
    oldPrice: 310000,
    rating: 4.7,
    soldCount: 340,
    inStock: true,
    isNew: true,
    isRecommended: false,
    isDailyDeal: false,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700&q=80",
    description: "100% paxta matodan tikilgan zamonaviy va qulay kundalik xudi (hoodie).",
    specs: { "Material": "100% Paxta", "Mavsum": "Kuz / Bahor / Qish", "O'lcham": "M / L / XL" },
    reviews: []
  },
  {
    id: "prd-116",
    name: "Wireless Noise-Canceling Headphones",
    category: "elektronika",
    brand: "PulseAudio",
    price: 460000,
    oldPrice: 590000,
    rating: 4.9,
    soldCount: 485,
    inStock: true,
    isNew: true,
    isRecommended: true,
    isDailyDeal: false,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80",
    description: "35 soatgacha avtonom ishlovchi, tiniq ovoz va shovqinni kamaytiruvchi simsiz quloqchin.",
    specs: { "Batareya": "35 soat", "Ulanish": "Bluetooth 5.3", "Kafolat": "12 oy" },
    reviews: []
  }
];

const HERO_SLIDES = [
  {
    tag: "Yandex Food Tezligi + Market",
    title: "Issiq Fast Food va 1000+ Mahsulot 30 Daqiqada!",
    subtitle: "Burger, lavash, pizza va kundalik mahsulotlarni bir savatga jamlang. 150,000 so'mdan bepul yetkazib berish.",
    ctaText: "Hoziroq buyurtma berish",
    targetCategory: "fast-food",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80"
  },
  {
    tag: "Mega Aksiya — 20% gacha",
    title: "FAST20 Promokodi Bilan Barcha Xaridlarga Chegirma",
    subtitle: "Savatda FAST20 kodini kiriting va o'z bonus ballaringizni ko'paytiring.",
    ctaText: "Chegirmalarni ko'rish",
    targetCategory: "all",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80"
  },
  {
    tag: "Texnika va Elektronika",
    title: "Zamonaviy Gadjetlar va Oshxona Texnikasi",
    subtitle: "Rasmiy kafolat, tezkor yetkazish va qulay narxlar FAST MARKET'da.",
    ctaText: "Elektronikani ko'rish",
    targetCategory: "elektronika",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&q=80"
  }
];

// Application State
const state = {
  products: [],
  categories: [],
  cart: [],
  wishlist: [],
  compare: [],
  orders: [],
  searchHistory: [],
  recentlyViewed: [],
  notifications: [],
  customers: [],
  profile: {
    name: "Azizbek Karimov",
    phone: "+998 (90) 123-45-67",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80",
    bonusPoints: 1500,
    referralCode: "FAST-AZIZ26",
    savedAddresses: [
      { id: "addr-1", label: "Uy", address: "Toshkent sh., Chilonzor tumani, Bunyodkor ko'chasi, 12-uy", lat: 41.2858, lng: 69.2036 },
      { id: "addr-2", label: "Ofis", address: "Toshkent sh., Yunusobod tumani, Amir Temur shoh ko'chasi, 108", lat: 41.3385, lng: 69.2852 }
    ]
  },
  appliedPromo: null,
  filters: {
    search: "",
    category: "all",
    brand: "all",
    minPrice: null,
    maxPrice: null,
    inStockOnly: false,
    discountOnly: false,
    sort: "popular"
  },
  showAllProducts: false,
  newTabMode: "new", // "new" | "recommended"
  heroIndex: 0,
  adminAuthenticated: false,
  adminActiveTab: "dashboard"
};

let leafletMap = null;
let leafletMarker = null;
let selectedMapCoords = { lat: 41.311081, lng: 69.240562 };

// Safe LocalStorage Helpers
function loadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn("LocalStorage read error:", key, err);
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn("LocalStorage write error:", key, err);
  }
}

// Formatting Helpers
function formatPrice(num) {
  const safeNum = Number(num) || 0;
  return `${safeNum.toLocaleString("uz-UZ")} so'm`;
}

function getDiscountPercent(product) {
  if (!product.oldPrice || product.oldPrice <= product.price) return 0;
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
}

function getCategoryName(catId) {
  const found = state.categories.find((c) => c.id === catId);
  return found ? found.name : catId;
}

function showToast(message, type = "success") {
  try {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast-item ${type}`;
    const iconClass =
      type === "error"
        ? "fa-circle-exclamation"
        : type === "info"
        ? "fa-circle-info"
        : "fa-circle-check";
    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-20px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 260);
    }, 3200);
  } catch (e) {
    console.error(e);
  }
}

function addNotification(title, text) {
  state.notifications.unshift({
    id: "notif-" + Date.now(),
    title,
    text,
    time: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
    read: false
  });
  saveStorage(STORAGE_KEYS.NOTIFICATIONS, state.notifications);
  renderNotifications();
}

// Initialization
function initApp() {
  try {
    state.categories = loadStorage(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    state.products = loadStorage(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
    state.cart = loadStorage(STORAGE_KEYS.CART, []);
    state.wishlist = loadStorage(STORAGE_KEYS.WISHLIST, ["prd-101", "prd-116"]);
    state.compare = loadStorage(STORAGE_KEYS.COMPARE, []);
    state.orders = loadStorage(STORAGE_KEYS.ORDERS, []);
    state.searchHistory = loadStorage(STORAGE_KEYS.SEARCH_HISTORY, ["Burger", "Lavash", "Pizza", "Quloqchin"]);
    state.recentlyViewed = loadStorage(STORAGE_KEYS.RECENTLY_VIEWED, []);
    state.notifications = loadStorage(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: "n-1",
        title: "Xush kelibsiz FAST MARKET'ga!",
        text: "FAST20 promokodi bilan ilk buyurtmangizga 20% chegirma oling.",
        time: "Bugun",
        read: false
      }
    ]);
    state.profile = { ...state.profile, ...loadStorage(STORAGE_KEYS.PROFILE, {}) };
    state.appliedPromo = loadStorage(STORAGE_KEYS.APPLIED_PROMO, null);
    state.customers = loadStorage(STORAGE_KEYS.CUSTOMERS, [
      { name: "Azizbek Karimov", phone: "+998 (90) 123-45-67", ordersCount: 3, totalSpent: 345000 },
      { name: "Dilnoza Rustamova", phone: "+998 (93) 555-22-11", ordersCount: 2, totalSpent: 198000 }
    ]);

    initTheme();
    bindGlobalEvents();
    renderCategoryRibbon();
    renderCategoriesGrid();
    renderHeroSlider();
    startHeroAutoPlay();
    renderFlashSale();
    startFlashCountdown();
    populateFilterDropdowns();
    renderDiscountsCarousel();
    renderShowcasePanels();
    renderNewAndRecommended();
    renderBrandsGrid();
    renderRecentlyViewed();
    renderNotifications();
    updateAllBadges();
    renderCartDrawer();

    // Render main catalog with brief skeleton polish
    renderSkeletons("productsGrid", 8);
    setTimeout(() => {
      renderCatalogSection();
    }, 240);
  } catch (err) {
    console.error("App init error:", err);
    showToast("Ilovani yuklashda xatolik yuz berdi", "error");
  }
}

// Theme Management
function initTheme() {
  const savedTheme = loadStorage(STORAGE_KEYS.THEME, "light");
  applyTheme(savedTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  saveStorage(STORAGE_KEYS.THEME, theme);
  const icon = document.getElementById("themeIcon");
  if (icon) {
    icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
}

// Global & UI Event Bindings
function bindGlobalEvents() {
  // Theme toggle
  document.getElementById("themeToggleBtn")?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
    showToast(current === "dark" ? "Kunduzgi rejim yoqildi" : "Tungi rejim yoqildi", "info");
  });

  // Catalog button scrolls to catalog & opens category filter
  document.getElementById("catalogToggleBtn")?.addEventListener("click", () => {
    document.getElementById("categoriesSection")?.scrollIntoView({ behavior: "smooth" });
  });

  // Search inputs
  const searchInput = document.getElementById("globalSearchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const searchDropdown = document.getElementById("searchDropdown");

  searchInput?.addEventListener("focus", () => {
    renderSearchDropdown(searchInput.value.trim());
    searchDropdown.classList.remove("hidden");
  });

  searchInput?.addEventListener("input", (e) => {
    const val = e.target.value;
    clearSearchBtn.classList.toggle("hidden", val.length === 0);
    state.filters.search = val.trim();
    renderSearchDropdown(val.trim());
    renderCatalogSection();
  });

  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitSearch(searchInput.value.trim());
      searchDropdown.classList.add("hidden");
      document.getElementById("catalogSection")?.scrollIntoView({ behavior: "smooth" });
    }
  });

  document.getElementById("searchSubmitBtn")?.addEventListener("click", () => {
    const val = searchInput.value.trim();
    commitSearch(val);
    searchDropdown.classList.add("hidden");
    document.getElementById("catalogSection")?.scrollIntoView({ behavior: "smooth" });
  });

  clearSearchBtn?.addEventListener("click", () => {
    searchInput.value = "";
    state.filters.search = "";
    clearSearchBtn.classList.add("hidden");
    renderSearchDropdown("");
    renderCatalogSection();
  });

  document.addEventListener("click", (e) => {
    const wrapper = document.getElementById("searchWrapper");
    if (wrapper && !wrapper.contains(e.target)) {
      searchDropdown?.classList.add("hidden");
    }

    const notifWrap = document.querySelector(".notif-wrapper");
    if (notifWrap && !notifWrap.contains(e.target)) {
      document.getElementById("notifDropdown")?.classList.add("hidden");
    }
  });

  // Notifications
  document.getElementById("notifToggleBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("notifDropdown")?.classList.toggle("hidden");
  });

  document.getElementById("markAllReadBtn")?.addEventListener("click", () => {
    state.notifications.forEach((n) => (n.read = true));
    saveStorage(STORAGE_KEYS.NOTIFICATIONS, state.notifications);
    renderNotifications();
  });

  // Cart Drawer
  document.getElementById("openCartBtn")?.addEventListener("click", openCartDrawer);
  document.getElementById("mobCartBtn")?.addEventListener("click", openCartDrawer);
  document.getElementById("closeCartBtn")?.addEventListener("click", closeCartDrawer);
  document.getElementById("cartBackdrop")?.addEventListener("click", closeCartDrawer);
  document.getElementById("clearCartBtn")?.addEventListener("click", () => {
    state.cart = [];
    state.appliedPromo = null;
    saveStorage(STORAGE_KEYS.CART, state.cart);
    saveStorage(STORAGE_KEYS.APPLIED_PROMO, null);
    updateAllBadges();
    renderCartDrawer();
    showToast("Savat tozalandi", "info");
  });

  document.getElementById("applyPromoBtn")?.addEventListener("click", handleApplyPromo);

  // Checkout Modal
  document.getElementById("openCheckoutBtn")?.addEventListener("click", () => {
    if (state.cart.length === 0) {
      showToast("Savat bo'sh! Avval mahsulot qo'shing.", "error");
      return;
    }
    closeCartDrawer();
    openCheckoutModal();
  });

  // Phone mask (+998)
  const phoneInput = document.getElementById("coPhone");
  phoneInput?.addEventListener("input", (e) => {
    e.target.value = formatUzPhone(e.target.value);
  });

  // Geolocation
  document.getElementById("detectLocationBtn")?.addEventListener("click", handleGeolocation);

  // Payment method radio styling
  document.querySelectorAll(".payment-option").forEach((label) => {
    label.addEventListener("click", () => {
      document.querySelectorAll(".payment-option").forEach((l) => l.classList.remove("active"));
      label.classList.add("active");
    });
  });

  // Checkout submit
  document.getElementById("checkoutForm")?.addEventListener("submit", handleCheckoutSubmit);

  // Modals open/close
  document.querySelectorAll("[data-open-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-open-modal");
      openModal(id);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-close-modal");
      closeModal(id);
    });
  });

  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.classList.add("hidden");
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop:not(.hidden)").forEach((m) => m.classList.add("hidden"));
      closeCartDrawer();
    }
  });

  // Wishlist, Orders, Compare, Profile, Referral, Admin buttons
  document.getElementById("openWishlistBtn")?.addEventListener("click", openWishlistModal);
  document.getElementById("footerWishlistBtn")?.addEventListener("click", openWishlistModal);

  document.getElementById("openOrdersBtn")?.addEventListener("click", openOrdersHistoryModal);
  document.getElementById("mobOrdersBtn")?.addEventListener("click", openOrdersHistoryModal);
  document.getElementById("footerOrdersBtn")?.addEventListener("click", openOrdersHistoryModal);

  document.getElementById("openCompareBtn")?.addEventListener("click", openCompareModal);
  document.getElementById("footerCompareBtn")?.addEventListener("click", openCompareModal);
  document.getElementById("clearCompareBtn")?.addEventListener("click", () => {
    state.compare = [];
    saveStorage(STORAGE_KEYS.COMPARE, state.compare);
    updateAllBadges();
    openCompareModal();
    showToast("Solishtirish ro'yxati tozalandi", "info");
  });

  document.getElementById("openProfileBtn")?.addEventListener("click", openProfileModal);
  document.getElementById("mobProfileBtn")?.addEventListener("click", openProfileModal);
  document.getElementById("footerProfileBtn")?.addEventListener("click", openProfileModal);

  document.getElementById("openReferralBtn")?.addEventListener("click", openReferralModal);

  document.getElementById("openAdminBtn")?.addEventListener("click", openAdminModal);
  document.getElementById("footerAdminBtn")?.addEventListener("click", openAdminModal);

  // Mobile nav buttons
  document.getElementById("mobHomeBtn")?.addEventListener("click", () => {
    setActiveMobNav("mobHomeBtn");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.getElementById("mobSearchBtn")?.addEventListener("click", () => {
    setActiveMobNav("mobSearchBtn");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => document.getElementById("globalSearchInput")?.focus(), 250);
  });

  // Filters & Sorting
  document.getElementById("filterCategorySelect")?.addEventListener("change", (e) => {
    state.filters.category = e.target.value;
    renderCategoriesGrid();
    renderCategoryRibbon();
    renderCatalogSection();
  });

  document.getElementById("filterBrandSelect")?.addEventListener("change", (e) => {
    state.filters.brand = e.target.value;
    renderCatalogSection();
  });

  document.getElementById("minPriceInput")?.addEventListener("input", (e) => {
    state.filters.minPrice = e.target.value ? Number(e.target.value) : null;
    renderCatalogSection();
  });

  document.getElementById("maxPriceInput")?.addEventListener("input", (e) => {
    state.filters.maxPrice = e.target.value ? Number(e.target.value) : null;
    renderCatalogSection();
  });

  document.getElementById("inStockOnlyCheckbox")?.addEventListener("change", (e) => {
    state.filters.inStockOnly = e.target.checked;
    renderCatalogSection();
  });

  document.getElementById("discountOnlyCheckbox")?.addEventListener("change", (e) => {
    state.filters.discountOnly = e.target.checked;
    renderCatalogSection();
  });

  document.getElementById("sortSelect")?.addEventListener("change", (e) => {
    state.filters.sort = e.target.value;
    renderCatalogSection();
  });

  const resetAllFilters = () => {
    state.filters = {
      search: "",
      category: "all",
      brand: "all",
      minPrice: null,
      maxPrice: null,
      inStockOnly: false,
      discountOnly: false,
      sort: "popular"
    };
    document.getElementById("globalSearchInput").value = "";
    document.getElementById("clearSearchBtn").classList.add("hidden");
    document.getElementById("filterCategorySelect").value = "all";
    document.getElementById("filterBrandSelect").value = "all";
    document.getElementById("minPriceInput").value = "";
    document.getElementById("maxPriceInput").value = "";
    document.getElementById("inStockOnlyCheckbox").checked = false;
    document.getElementById("discountOnlyCheckbox").checked = false;
    document.getElementById("sortSelect").value = "popular";
    renderCategoriesGrid();
    renderCategoryRibbon();
    renderCatalogSection();
    showToast("Filtrlar tozalandi", "info");
  };

  document.getElementById("clearAllFiltersBtn")?.addEventListener("click", resetAllFilters);
  document.getElementById("resetFiltersBtn")?.addEventListener("click", resetAllFilters);

  // Show all toggle
  document.getElementById("toggleShowAllBtn")?.addEventListener("click", () => {
    state.showAllProducts = !state.showAllProducts;
    renderCatalogSection();
  });

  // New / Recommended tabs
  document.getElementById("tabNewArrivals")?.addEventListener("click", () => {
    state.newTabMode = "new";
    document.getElementById("tabNewArrivals").classList.add("active");
    document.getElementById("tabRecommended").classList.remove("active");
    renderNewAndRecommended();
  });

  document.getElementById("tabRecommended")?.addEventListener("click", () => {
    state.newTabMode = "recommended";
    document.getElementById("tabRecommended").classList.add("active");
    document.getElementById("tabNewArrivals").classList.remove("active");
    renderNewAndRecommended();
  });

  // Carousel scroll buttons
  document.getElementById("discPrevBtn")?.addEventListener("click", () => {
    document.getElementById("discountsCarousel")?.scrollBy({ left: -320, behavior: "smooth" });
  });
  document.getElementById("discNextBtn")?.addEventListener("click", () => {
    document.getElementById("discountsCarousel")?.scrollBy({ left: 320, behavior: "smooth" });
  });

  // Recently viewed clear
  document.getElementById("clearHistoryBtn")?.addEventListener("click", () => {
    state.recentlyViewed = [];
    saveStorage(STORAGE_KEYS.RECENTLY_VIEWED, []);
    renderRecentlyViewed();
    showToast("Ko'rish tarixi tozalandi", "info");
  });

  // Contact form
  document.getElementById("contactForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    closeModal("contactModal");
    showToast("Xabaringiz yuborildi! Tez orada aloqaga chiqamiz.", "success");
  });

  // Scroll to top & Online/Offline status
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => {
    scrollTopBtn?.classList.toggle("hidden", window.scrollY < 450);
  });
  scrollTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("online", () => {
    document.getElementById("offlineBanner")?.classList.add("hidden");
    showToast("Internet aloqasi tiklandi!", "success");
  });
  window.addEventListener("offline", () => {
    document.getElementById("offlineBanner")?.classList.remove("hidden");
    showToast("Internet aloqasi uzildi", "error");
  });
  if (!navigator.onLine) {
    document.getElementById("offlineBanner")?.classList.remove("hidden");
  }
}

function setActiveMobNav(activeId) {
  document.querySelectorAll(".mob-nav-item").forEach((el) => el.classList.remove("active"));
  document.getElementById(activeId)?.classList.add("active");
}

function openModal(id) {
  document.getElementById(id)?.classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id)?.classList.add("hidden");
}

// Category & Ribbon Rendering
function renderCategoryRibbon() {
  const ribbon = document.getElementById("categoryRibbon");
  if (!ribbon) return;
  ribbon.innerHTML = `
    <button type="button" class="ribbon-cat-btn ${state.filters.category === "all" ? "active" : ""}" onclick="selectCategoryFilter('all')">
      <i class="fa-solid fa-border-all"></i> Barchasi
    </button>
    ${state.categories
      .map(
        (cat) => `
      <button type="button" class="ribbon-cat-btn ${state.filters.category === cat.id ? "active" : ""}" onclick="selectCategoryFilter('${cat.id}')">
        <i class="fa-solid ${cat.icon}"></i> ${cat.name}
      </button>
    `
      )
      .join("")}
  `;
}

function renderCategoriesGrid() {
  const grid = document.getElementById("categoriesGrid");
  if (!grid) return;
  grid.innerHTML = state.categories
    .map(
      (cat) => `
    <button type="button" class="category-card ${state.filters.category === cat.id ? "active" : ""}" onclick="selectCategoryFilter('${cat.id}', true)">
      <div class="cat-icon-box"><i class="fa-solid ${cat.icon}"></i></div>
      <span>${cat.name}</span>
    </button>
  `
    )
    .join("");
}

window.selectCategoryFilter = function (catId, scrollToCatalog = false) {
  state.filters.category = catId;
  const select = document.getElementById("filterCategorySelect");
  if (select) select.value = catId;
  renderCategoriesGrid();
  renderCategoryRibbon();
  renderCatalogSection();
  if (scrollToCatalog) {
    document.getElementById("catalogSection")?.scrollIntoView({ behavior: "smooth" });
  }
};

// Hero Slider & Flash Sale
function renderHeroSlider() {
  const slidesEl = document.getElementById("heroSlides");
  const dotsEl = document.getElementById("heroDots");
  if (!slidesEl || !dotsEl) return;

  slidesEl.innerHTML = HERO_SLIDES.map(
    (s) => `
    <div class="hero-slide">
      <img src="${s.image}" alt="${s.title}" onerror="this.src='${FALLBACK_IMAGE}'" />
      <div class="hero-slide-content">
        <span class="hero-tag">${s.tag}</span>
        <h1>${s.title}</h1>
        <p>${s.subtitle}</p>
        <button type="button" class="btn-accent" onclick="selectCategoryFilter('${s.targetCategory}', true)">
          ${s.ctaText} <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `
  ).join("");

  dotsEl.innerHTML = HERO_SLIDES.map(
    (_, i) => `<button type="button" class="hero-dot ${i === state.heroIndex ? "active" : ""}" onclick="goToHeroSlide(${i})" aria-label="Banner ${i + 1}"></button>`
  ).join("");

  slidesEl.style.transform = `translateX(-${state.heroIndex * 100}%)`;

  document.getElementById("heroPrevBtn").onclick = () => {
    goToHeroSlide((state.heroIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };
  document.getElementById("heroNextBtn").onclick = () => {
    goToHeroSlide((state.heroIndex + 1) % HERO_SLIDES.length);
  };
}

window.goToHeroSlide = function (index) {
  state.heroIndex = index;
  renderHeroSlider();
};

function startHeroAutoPlay() {
  setInterval(() => {
    state.heroIndex = (state.heroIndex + 1) % HERO_SLIDES.length;
    const slidesEl = document.getElementById("heroSlides");
    const dots = document.querySelectorAll(".hero-dot");
    if (slidesEl) slidesEl.style.transform = `translateX(-${state.heroIndex * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === state.heroIndex));
  }, 5500);
}

function renderFlashSale() {
  const box = document.getElementById("flashSaleProductBox");
  if (!box) return;
  const flashProd = state.products.find((p) => p.isFlashSale) || state.products[0];
  if (!flashProd) return;

  const disc = getDiscountPercent(flashProd);
  const soldPct = flashProd.flashSoldPercent || 72;

  box.innerHTML = `
    <div class="flash-prod-top">
      <img src="${flashProd.image}" alt="${flashProd.name}" onerror="this.src='${FALLBACK_IMAGE}'" onclick="openProductDetail('${flashProd.id}')" style="cursor:pointer;" />
      <div>
        <strong style="font-size:0.95rem; cursor:pointer;" onclick="openProductDetail('${flashProd.id}')">${flashProd.name}</strong>
        <div style="margin-top:4px;">
          <span class="current-price">${formatPrice(flashProd.price)}</span>
          ${flashProd.oldPrice ? `<span class="old-price">${formatPrice(flashProd.oldPrice)}</span>` : ""}
          ${disc > 0 ? `<span class="discount-tag" style="position:static; margin-left:4px;">-${disc}%</span>` : ""}
        </div>
        <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:4px;">Sotildi: <strong>${soldPct}%</strong></div>
        <div class="flash-progress-bar"><div class="flash-progress-fill" style="width:${soldPct}%"></div></div>
      </div>
    </div>
    <button type="button" class="btn-accent btn-block" onclick="addToCart('${flashProd.id}', this)">
      <i class="fa-solid fa-bolt"></i> Aksiya narxida savatga qo'shish
    </button>
  `;
}

function startFlashCountdown() {
  let totalSec = 3 * 3600 + 45 * 60 + 20;
  const tick = () => {
    if (totalSec <= 0) totalSec = 4 * 3600;
    totalSec--;
    const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const s = String(totalSec % 60).padStart(2, "0");
    const elH = document.getElementById("cdHours");
    const elM = document.getElementById("cdMinutes");
    const elS = document.getElementById("cdSeconds");
    if (elH) elH.textContent = h;
    if (elM) elM.textContent = m;
    if (elS) elS.textContent = s;
  };
  tick();
  setInterval(tick, 1000);
}

// Product Card Builder
function createProductCardHTML(product) {
  const disc = getDiscountPercent(product);
  const isFav = state.wishlist.includes(product.id);
  const isCmp = state.compare.includes(product.id);

  return `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-img-wrap" onclick="openProductDetail('${product.id}')">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='${FALLBACK_IMAGE}'" />
        ${disc > 0 ? `<span class="discount-tag">-${disc}%</span>` : ""}
        <span class="stock-pill-top ${product.inStock ? "" : "out"}">
          ${product.inStock ? "Mavjud" : "Tugagan"}
        </span>
        <div class="card-top-actions" onclick="event.stopPropagation()">
          <button type="button" class="card-float-btn ${isFav ? "active-fav" : ""}" title="Sevimlilarga qo'shish" onclick="toggleWishlist('${product.id}', this)">
            <i class="${isFav ? "fa-solid" : "fa-regular"} fa-heart"></i>
          </button>
          <button type="button" class="card-float-btn ${isCmp ? "active-cmp" : ""}" title="Solishtirishga qo'shish" onclick="toggleCompare('${product.id}')">
            <i class="fa-solid fa-scale-balanced"></i>
          </button>
        </div>
      </div>

      <div class="product-card-body">
        <div class="product-meta-row">
          <span class="product-cat-label">${getCategoryName(product.category)}</span>
          <span class="rating-badge">
            <i class="fa-solid fa-star"></i> ${product.rating}
            <span>(${product.soldCount} sotilgan)</span>
          </span>
        </div>

        <h3 class="product-title" onclick="openProductDetail('${product.id}')">${product.name}</h3>
        <p class="product-desc">${product.description}</p>

        <div class="price-block">
          <span class="current-price">${formatPrice(product.price)}</span>
          ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ""}
        </div>

        <div class="product-card-footer">
          <button
            type="button"
            class="add-to-cart-btn"
            ${!product.inStock ? "disabled" : ""}
            onclick="addToCart('${product.id}', this)"
          >
            <i class="fa-solid fa-cart-plus"></i>
            <span>${product.inStock ? "Savatga" : "Mavjud emas"}</span>
          </button>
          <button type="button" class="quick-view-btn" title="Tezkor ko'rish" onclick="openProductDetail('${product.id}')">
            <i class="fa-regular fa-eye"></i>
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderSkeletons(containerId, count = 4) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = Array.from({ length: count })
    .map(
      () => `
    <div class="skeleton-card">
      <div class="skel skel-img"></div>
      <div class="skel skel-line"></div>
      <div class="skel skel-line short"></div>
    </div>
  `
    )
    .join("");
}

// Filtering, Sorting & Main Catalog Render
function populateFilterDropdowns() {
  const catSelect = document.getElementById("filterCategorySelect");
  const brandSelect = document.getElementById("filterBrandSelect");

  if (catSelect) {
    catSelect.innerHTML =
      `<option value="all">Barcha kategoriyalar</option>` +
      state.categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");
    catSelect.value = state.filters.category;
  }

  if (brandSelect) {
    const brands = [...new Set(state.products.map((p) => p.brand).filter(Boolean))];
    brandSelect.innerHTML =
      `<option value="all">Barcha brendlar</option>` +
      brands.map((b) => `<option value="${b}">${b}</option>`).join("");
    brandSelect.value = state.filters.brand;
  }
}

function getFilteredProducts() {
  const f = state.filters;
  let list = [...state.products];

  if (f.search) {
    const q = f.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        getCategoryName(p.category).toLowerCase().includes(q)
    );
  }

  if (f.category && f.category !== "all") {
    list = list.filter((p) => p.category === f.category);
  }

  if (f.brand && f.brand !== "all") {
    list = list.filter((p) => p.brand === f.brand);
  }

  if (f.minPrice !== null && !Number.isNaN(f.minPrice)) {
    list = list.filter((p) => p.price >= f.minPrice);
  }

  if (f.maxPrice !== null && !Number.isNaN(f.maxPrice)) {
    list = list.filter((p) => p.price <= f.maxPrice);
  }

  if (f.inStockOnly) {
    list = list.filter((p) => p.inStock);
  }

  if (f.discountOnly) {
    list = list.filter((p) => getDiscountPercent(p) > 0);
  }

  switch (f.sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "rating-desc":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "discount-desc":
      list.sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a));
      break;
    case "popular":
    default:
      list.sort((a, b) => b.soldCount - a.soldCount);
      break;
  }

  return list;
}

function renderActiveFilterChips() {
  const chipsEl = document.getElementById("activeFilterChips");
  if (!chipsEl) return;
  const chips = [];
  if (state.filters.category !== "all") chips.push(`Kategoriya: ${getCategoryName(state.filters.category)}`);
  if (state.filters.brand !== "all") chips.push(`Brend: ${state.filters.brand}`);
  if (state.filters.search) chips.push(`Qidiruv: "${state.filters.search}"`);
  if (state.filters.minPrice) chips.push(`Dan: ${formatPrice(state.filters.minPrice)}`);
  if (state.filters.maxPrice) chips.push(`Gacha: ${formatPrice(state.filters.maxPrice)}`);
  if (state.filters.inStockOnly) chips.push("Mavjudlari");
  if (state.filters.discountOnly) chips.push("Aksiyadagilar");

  chipsEl.innerHTML = chips.map((c) => `<span class="filter-chip">${c}</span>`).join("");
}

function renderCatalogSection() {
  const grid = document.getElementById("productsGrid");
  const countEl = document.getElementById("catalogResultCount");
  const titleEl = document.getElementById("catalogSectionTitle");
  const toggleBtn = document.getElementById("toggleShowAllBtn");
  if (!grid) return;

  renderActiveFilterChips();
  const filtered = getFilteredProducts();

  if (titleEl) {
    titleEl.innerHTML =
      state.filters.category !== "all"
        ? `<i class="fa-solid fa-store"></i> ${getCategoryName(state.filters.category)}`
        : `<i class="fa-solid fa-store"></i> Mashhur Mahsulotlar`;
  }

  if (countEl) {
    countEl.textContent = `${filtered.length} ta mahsulot topildi`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding: 42px 16px; background:var(--bg-surface); border-radius:var(--radius-md); border:1px solid var(--border-color);">
        <i class="fa-solid fa-magnifying-glass-minus" style="font-size:2.2rem; color:var(--text-muted); margin-bottom:10px;"></i>
        <h3>Mos mahsulot topilmadi</h3>
        <p style="color:var(--text-secondary); margin:6px 0 16px;">Boshqa kalit so'z kiriting yoki filtrlarni tozalang.</p>
        <button type="button" class="btn-primary" onclick="document.getElementById('clearAllFiltersBtn').click()">Filtrlarni tozalash</button>
      </div>
    `;
    toggleBtn?.classList.add("hidden");
    return;
  }

  const limit = state.showAllProducts ? filtered.length : 8;
  const visible = filtered.slice(0, limit);
  grid.innerHTML = visible.map(createProductCardHTML).join("");

  if (toggleBtn) {
    if (filtered.length > 8) {
      toggleBtn.classList.remove("hidden");
      toggleBtn.textContent = state.showAllProducts
        ? "Kamroq ko'rsatish"
        : `Barcha mahsulotlarni ko'rsatish (${filtered.length} ta)`;
    } else {
      toggleBtn.classList.add("hidden");
    }
  }
}

function renderDiscountsCarousel() {
  const carousel = document.getElementById("discountsCarousel");
  if (!carousel) return;
  const discounted = state.products.filter((p) => getDiscountPercent(p) > 0);
  carousel.innerHTML = discounted.map(createProductCardHTML).join("");
}

function renderShowcasePanels() {
  const dailyList = document.getElementById("dailyDealsList");
  const topList = document.getElementById("topSellingList");

  const dailyDeals = state.products.filter((p) => p.isDailyDeal).slice(0, 4);
  const topSelling = [...state.products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 4);

  const buildCompact = (items) =>
    items
      .map(
        (p) => `
      <div class="compact-item">
        <img src="${p.image}" alt="${p.name}" onclick="openProductDetail('${p.id}')" onerror="this.src='${FALLBACK_IMAGE}'" />
        <div class="compact-info">
          <strong onclick="openProductDetail('${p.id}')">${p.name}</strong>
          <span>${formatPrice(p.price)}</span>
        </div>
        <button type="button" class="btn-primary" style="padding:7px 11px; font-size:0.78rem;" onclick="addToCart('${p.id}', this)">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    `
      )
      .join("");

  if (dailyList) dailyList.innerHTML = buildCompact(dailyDeals);
  if (topList) topList.innerHTML = buildCompact(topSelling);
}

function renderNewAndRecommended() {
  const grid = document.getElementById("newAndRecommendedGrid");
  if (!grid) return;
  const items =
    state.newTabMode === "new"
      ? state.products.filter((p) => p.isNew).slice(0, 4)
      : state.products.filter((p) => p.isRecommended).slice(0, 4);
  grid.innerHTML = items.map(createProductCardHTML).join("");
}

function renderBrandsGrid() {
  const grid = document.getElementById("brandsGrid");
  if (!grid) return;
  const brands = [...new Set(state.products.map((p) => p.brand).filter(Boolean))];
  grid.innerHTML = brands
    .map(
      (b) => `
    <button type="button" class="brand-card" onclick="selectBrandFilter('${b}')">${b}</button>
  `
    )
    .join("");
}

window.selectBrandFilter = function (brand) {
  state.filters.brand = brand;
  const sel = document.getElementById("filterBrandSelect");
  if (sel) sel.value = brand;
  renderCatalogSection();
  document.getElementById("catalogSection")?.scrollIntoView({ behavior: "smooth" });
  showToast(`"${brand}" brendi mahsulotlari filtrlandi`, "info");
};

// Live Search System
function commitSearch(query) {
  if (!query) return;
  state.searchHistory = [query, ...state.searchHistory.filter((item) => item.toLowerCase() !== query.toLowerCase())].slice(0, 8);
  saveStorage(STORAGE_KEYS.SEARCH_HISTORY, state.searchHistory);
}

function renderSearchDropdown(query) {
  const dd = document.getElementById("searchDropdown");
  if (!dd) return;

  const historyHTML = state.searchHistory.length
    ? `
    <div class="search-section-label">
      <span>Qidiruv tarixi</span>
      <button type="button" class="text-btn" onclick="clearSearchHistory()">Tozalash</button>
    </div>
    <div class="search-history-chips">
      ${state.searchHistory
        .map(
          (h) => `
        <button type="button" class="history-chip" onclick="applyHistoryQuery('${h.replace(/'/g, "\\'")}')">
          <i class="fa-solid fa-clock-rotate-left"></i> ${h}
        </button>
      `
        )
        .join("")}
    </div>
  `
    : "";

  const matches = query
    ? state.products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            getCategoryName(p.category).toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6)
    : state.products.slice(0, 4);

  const resultsHTML = matches.length
    ? matches
        .map(
          (p) => `
      <div class="search-result-item" onclick="openProductDetail('${p.id}'); document.getElementById('searchDropdown').classList.add('hidden');">
        <img src="${p.image}" alt="${p.name}" onerror="this.src='${FALLBACK_IMAGE}'" />
        <div style="flex:1; min-width:0;">
          <div style="font-weight:700; font-size:0.86rem;">${p.name}</div>
          <div style="font-size:0.75rem; color:var(--text-secondary);">${getCategoryName(p.category)} • <strong>${formatPrice(p.price)}</strong></div>
        </div>
      </div>
    `
        )
        .join("")
    : `<p style="font-size:0.84rem; color:var(--text-secondary); padding:10px 0;">"${query}" bo'yicha mahsulot topilmadi.</p>`;

  dd.innerHTML = `${historyHTML}<div class="search-section-label"><span>${query ? "Taklif etiladigan natijalar" : "Ommabop tanlovlar"}</span></div>${resultsHTML}`;
}

window.applyHistoryQuery = function (q) {
  const input = document.getElementById("globalSearchInput");
  if (input) {
    input.value = q;
    input.dispatchEvent(new Event("input"));
  }
  document.getElementById("searchDropdown")?.classList.add("hidden");
  document.getElementById("catalogSection")?.scrollIntoView({ behavior: "smooth" });
};

window.clearSearchHistory = function () {
  state.searchHistory = [];
  saveStorage(STORAGE_KEYS.SEARCH_HISTORY, []);
  renderSearchDropdown(document.getElementById("globalSearchInput")?.value.trim() || "");
};

// Cart System & Flying Animation
window.addToCart = function (productId, sourceBtn = null) {
  try {
    const product = state.products.find((p) => p.id === productId);
    if (!product) return;
    if (!product.inStock) {
      showToast("Ushbu mahsulot hozircha mavjud emas", "error");
      return;
    }

    if (sourceBtn) {
      const card = sourceBtn.closest(".product-card") || sourceBtn.closest(".flash-sale-card");
      const img = card?.querySelector("img");
      if (img) animateFlyToCart(img);
    }

    const existing = state.cart.find((item) => item.productId === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({ productId, qty: 1 });
    }

    saveStorage(STORAGE_KEYS.CART, state.cart);
    updateAllBadges();
    renderCartDrawer();
    showToast(`"${product.name}" savatga qo'shildi`, "success");
  } catch (err) {
    console.error(err);
  }
};

function animateFlyToCart(imgElement) {
  const layer = document.getElementById("flyAnimationLayer");
  const cartBtn = document.getElementById("openCartBtn");
  if (!layer || !imgElement) return;

  const rect = imgElement.getBoundingClientRect();
  const targetRect =
    cartBtn && cartBtn.offsetParent !== null
      ? cartBtn.getBoundingClientRect()
      : { left: window.innerWidth - 60, top: window.innerHeight - 40 };

  const flyer = document.createElement("img");
  flyer.src = imgElement.src;
  flyer.className = "flying-img";
  flyer.style.left = `${rect.left}px`;
  flyer.style.top = `${rect.top}px`;
  layer.appendChild(flyer);

  requestAnimationFrame(() => {
    flyer.style.left = `${targetRect.left}px`;
    flyer.style.top = `${targetRect.top}px`;
    flyer.style.transform = "scale(0.25)";
    flyer.style.opacity = "0.3";
  });

  setTimeout(() => flyer.remove(), 680);
}

window.changeCartQty = function (productId, delta) {
  const item = state.cart.find((i) => i.productId === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter((i) => i.productId !== productId);
  }
  saveStorage(STORAGE_KEYS.CART, state.cart);
  updateAllBadges();
  renderCartDrawer();
};

window.removeFromCart = function (productId) {
  state.cart = state.cart.filter((i) => i.productId !== productId);
  saveStorage(STORAGE_KEYS.CART, state.cart);
  updateAllBadges();
  renderCartDrawer();
};

function calculateCartTotals(bonusToSpend = 0) {
  let subtotal = 0;
  let totalItems = 0;

  const detailedItems = state.cart
    .map((item) => {
      const prod = state.products.find((p) => p.id === item.productId);
      if (!prod) return null;
      const lineTotal = prod.price * item.qty;
      subtotal += lineTotal;
      totalItems += item.qty;
      return { ...item, product: prod, lineTotal };
    })
    .filter(Boolean);

  let promoDiscount = 0;
  if (state.appliedPromo && PROMO_CODES[state.appliedPromo]) {
    promoDiscount = Math.round((subtotal * PROMO_CODES[state.appliedPromo].discountPercent) / 100);
  }

  const maxSpendableBonus = Math.min(state.profile.bonusPoints || 0, Math.max(0, subtotal - promoDiscount));
  const spentBonus = Math.max(0, Math.min(Number(bonusToSpend) || 0, maxSpendableBonus));

  const afterDiscounts = Math.max(0, subtotal - promoDiscount - spentBonus);
  const deliveryFee = subtotal === 0 ? 0 : afterDiscounts >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE_BASE;
  const grandTotal = afterDiscounts + deliveryFee;
  const earnedBonus = Math.round(afterDiscounts * 0.05);

  return {
    detailedItems,
    totalItems,
    subtotal,
    promoDiscount,
    spentBonus,
    deliveryFee,
    grandTotal,
    earnedBonus
  };
}

function handleApplyPromo() {
  const input = document.getElementById("promoCodeInput");
  const statusEl = document.getElementById("promoStatusMsg");
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (!code) {
    state.appliedPromo = null;
    saveStorage(STORAGE_KEYS.APPLIED_PROMO, null);
    renderCartDrawer();
    return;
  }

  if (PROMO_CODES[code]) {
    state.appliedPromo = code;
    saveStorage(STORAGE_KEYS.APPLIED_PROMO, code);
    if (statusEl) statusEl.innerHTML = `<span class="text-success"><strong>${PROMO_CODES[code].label}</strong> promokodi faollashtirildi!</span>`;
    showToast(`Promokod qo'llandi: ${PROMO_CODES[code].label}`, "success");
    renderCartDrawer();
  } else {
    showToast("Noto'g'ri promokod! FAST20, YANDEX15 yoki MARKET10 sinab ko'ring.", "error");
  }
}

function renderCartDrawer() {
  const container = document.getElementById("cartItemsContainer");
  const countText = document.getElementById("drawerCartCountText");
  const progBox = document.getElementById("freeDeliveryProgress");
  if (!container) return;

  const totals = calculateCartTotals(0);
  if (countText) countText.textContent = `(${totals.totalItems} ta)`;

  if (progBox) {
    if (totals.subtotal === 0) {
      progBox.innerHTML = `<span>150,000 so'mdan boshlab yetkazib berish <strong>BEPUL</strong></span>`;
    } else if (totals.subtotal >= FREE_DELIVERY_THRESHOLD) {
      progBox.innerHTML = `<span class="text-success"><i class="fa-solid fa-circle-check"></i> Tabriklaymiz! Yetkazib berish <strong>BEPUL</strong>.</span><div class="progress-track"><div class="progress-fill" style="width:100%"></div></div>`;
    } else {
      const rem = FREE_DELIVERY_THRESHOLD - totals.subtotal;
      const pct = Math.min(100, Math.round((totals.subtotal / FREE_DELIVERY_THRESHOLD) * 100));
      progBox.innerHTML = `<span>Bepul yetkazishgacha yana <strong>${formatPrice(rem)}</strong> qoldi</span><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>`;
    }
  }

  if (totals.detailedItems.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 48px 16px; color:var(--text-secondary);">
        <i class="fa-solid fa-basket-shopping" style="font-size:2.4rem; opacity:0.4; margin-bottom:12px;"></i>
        <h4>Savatingiz hozircha bo'sh</h4>
        <p style="font-size:0.84rem; margin-top:4px;">Mazali taomlar yoki kerakli mahsulotlarni qo'shing.</p>
      </div>
    `;
  } else {
    container.innerHTML = totals.detailedItems
      .map(
        ({ product, qty, lineTotal }) => `
      <div class="cart-item-card">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='${FALLBACK_IMAGE}'" />
        <div class="cart-item-info">
          <h4>${product.name}</h4>
          <div class="cart-item-price">${formatPrice(lineTotal)}</div>
          <div class="qty-stepper">
            <button type="button" class="qty-btn" onclick="changeCartQty('${product.id}', -1)">-</button>
            <span class="qty-val">${qty}</span>
            <button type="button" class="qty-btn" onclick="changeCartQty('${product.id}', 1)">+</button>
          </div>
        </div>
        <button type="button" class="close-icon-btn" onclick="removeFromCart('${product.id}')" title="O'chirish">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>
    `
      )
      .join("");
  }

  document.getElementById("cartSubtotal").textContent = formatPrice(totals.subtotal);
  document.getElementById("cartDiscountAmount").textContent = `-${formatPrice(totals.promoDiscount)}`;
  document.getElementById("cartDeliveryFee").textContent =
    totals.subtotal === 0 ? "0 so'm" : totals.deliveryFee === 0 ? "BEPUL" : formatPrice(totals.deliveryFee);
  document.getElementById("cartGrandTotal").textContent = formatPrice(totals.grandTotal);
  document.getElementById("cartEarnedBonus").textContent = `+${totals.earnedBonus} ball`;
}

function openCartDrawer() {
  renderCartDrawer();
  document.getElementById("cartBackdrop")?.classList.remove("hidden");
  document.getElementById("cartDrawer")?.classList.add("open");
}

function closeCartDrawer() {
  document.getElementById("cartBackdrop")?.classList.add("hidden");
  document.getElementById("cartDrawer")?.classList.remove("open");
}

// Product Detail, Specs & Reviews Modal
window.openProductDetail = function (productId) {
  const product = state.products.find((p) => p.id === productId);
  if (!product) return;

  // Record recently viewed
  state.recentlyViewed = [productId, ...state.recentlyViewed.filter((id) => id !== productId)].slice(0, 10);
  saveStorage(STORAGE_KEYS.RECENTLY_VIEWED, state.recentlyViewed);
  renderRecentlyViewed();

  const disc = getDiscountPercent(product);
  const specsRows = product.specs
    ? Object.entries(product.specs)
        .map(([k, v]) => `<tr><td style="color:var(--text-secondary); padding:5px 0;">${k}</td><td style="font-weight:700; text-align:right;">${v}</td></tr>`)
        .join("")
    : "";

  const reviewsList = product.reviews && product.reviews.length
    ? product.reviews
        .map(
          (r) => `
      <div style="background:var(--bg-elevated); padding:10px 12px; border-radius:var(--radius-xs); margin-bottom:8px;">
        <div style="display:flex; justify-content:space-between; font-size:0.82rem; font-weight:700;">
          <span>${r.author}</span>
          <span style="color:#f59e0b;">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
        </div>
        <p style="font-size:0.84rem; margin-top:4px;">${r.text}</p>
        <small style="color:var(--text-muted);">${r.date}</small>
      </div>
    `
        )
        .join("")
    : `<p style="font-size:0.84rem; color:var(--text-secondary);">Hozircha sharhlar yo'q. Birinchi bo'lib fikr qoldiring!</p>`;

  const body = document.getElementById("productDetailBody");
  body.innerHTML = `
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:22px;">
      <div>
        <img src="${product.image}" alt="${product.name}" style="width:100%; border-radius:var(--radius-md); aspect-ratio:4/3; object-fit:cover;" onerror="this.src='${FALLBACK_IMAGE}'" />
      </div>
      <div>
        <span class="product-cat-label">${getCategoryName(product.category)} • ${product.brand}</span>
        <h2 style="font-size:1.45rem; font-weight:800; margin:4px 0 8px;">${product.name}</h2>
        <div style="display:flex; align-items:center; gap:14px; font-size:0.86rem; margin-bottom:12px;">
          <span class="rating-badge"><i class="fa-solid fa-star"></i> ${product.rating}</span>
          <span style="color:var(--text-secondary);">${product.soldCount} marta sotilgan</span>
          <span style="font-weight:700; color:${product.inStock ? "var(--brand-primary)" : "var(--danger)"};">
            ${product.inStock ? "Mavjud" : "Mavjud emas"}
          </span>
        </div>
        <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:14px;">${product.description}</p>
        <div style="display:flex; align-items:baseline; gap:10px; margin-bottom:16px;">
          <span class="current-price" style="font-size:1.35rem;">${formatPrice(product.price)}</span>
          ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ""}
          ${disc > 0 ? `<span class="discount-tag" style="position:static;">-${disc}%</span>` : ""}
        </div>
        <table style="width:100%; border-collapse:collapse; margin-bottom:16px; font-size:0.84rem;">${specsRows}</table>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button type="button" class="btn-primary" style="flex:1;" ${!product.inStock ? "disabled" : ""} onclick="addToCart('${product.id}', this); closeModal('productDetailModal');">
            <i class="fa-solid fa-cart-plus"></i> Savatga qo'shish
          </button>
          <button type="button" class="btn-secondary" onclick="toggleCompare('${product.id}')">
            <i class="fa-solid fa-scale-balanced"></i> Solishtirish
          </button>
        </div>
      </div>
    </div>

    <hr style="border:none; border-top:1px solid var(--border-color); margin:22px 0;" />

    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:20px;">
      <div>
        <h4 style="margin-bottom:10px;">Xaridorlar sharhlari</h4>
        ${reviewsList}
      </div>
      <div>
        <h4 style="margin-bottom:10px;">Sharh va baho qoldirish</h4>
        <form onsubmit="submitProductReview(event, '${product.id}')" class="stack-form">
          <div class="form-group">
            <label>Ismingiz</label>
            <input type="text" id="revAuthor" class="form-control" value="${state.profile.name}" required />
          </div>
          <div class="form-group">
            <label>Yulduzli reyting</label>
            <select id="revRating" class="form-control">
              <option value="5">★★★★★ (5 — A'lo)</option>
              <option value="4">★★★★☆ (4 — Yaxshi)</option>
              <option value="3">★★★☆☆ (3 — Qoniqarli)</option>
              <option value="2">★★☆☆☆ (2 — Past)</option>
              <option value="1">★☆☆☆☆ (1 — Yomon)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Fikringiz</label>
            <textarea id="revText" class="form-control" rows="2" placeholder="Mahsulot sifati va yetkazish haqida yozing..." required></textarea>
          </div>
          <button type="submit" class="btn-accent btn-block">Sharhni yuborish</button>
        </form>
      </div>
    </div>
  `;

  openModal("productDetailModal");
};

window.submitProductReview = function (e, productId) {
  e.preventDefault();
  const prod = state.products.find((p) => p.id === productId);
  if (!prod) return;
  const author = document.getElementById("revAuthor").value.trim() || "Xaridor";
  const rating = Number(document.getElementById("revRating").value) || 5;
  const text = document.getElementById("revText").value.trim();
  if (!text) return;

  prod.reviews = prod.reviews || [];
  prod.reviews.unshift({
    author,
    rating,
    text,
    date: new Date().toISOString().slice(0, 10)
  });

  const sum = prod.reviews.reduce((acc, r) => acc + r.rating, 0);
  prod.rating = Number((sum / prod.reviews.length).toFixed(1));

  saveStorage(STORAGE_KEYS.PRODUCTS, state.products);
  renderCatalogSection();
  showToast("Sharhingiz saqlandi!", "success");
  openProductDetail(productId);
};

// Wishlist & Compare
window.toggleWishlist = function (productId, btnEl = null) {
  const idx = state.wishlist.indexOf(productId);
  if (idx >= 0) {
    state.wishlist.splice(idx, 1);
    showToast("Sevimlilardan o'chirildi", "info");
  } else {
    state.wishlist.push(productId);
    if (btnEl) {
      btnEl.classList.add("heart-pop");
      setTimeout(() => btnEl.classList.remove("heart-pop"), 460);
    }
    showToast("Sevimlilarga qo'shildi", "success");
  }
  saveStorage(STORAGE_KEYS.WISHLIST, state.wishlist);
  updateAllBadges();
  renderCatalogSection();
  renderDiscountsCarousel();
  renderNewAndRecommended();
};

function openWishlistModal() {
  const body = document.getElementById("wishlistBody");
  const items = state.products.filter((p) => state.wishlist.includes(p.id));
  if (!items.length) {
    body.innerHTML = `<p style="text-align:center; padding:30px; color:var(--text-secondary);">Sevimli mahsulotlar ro'yxati bo'sh.</p>`;
  } else {
    body.innerHTML = `<div class="products-grid">${items.map(createProductCardHTML).join("")}</div>`;
  }
  openModal("wishlistModal");
}

window.toggleCompare = function (productId) {
  const idx = state.compare.indexOf(productId);
  if (idx >= 0) {
    state.compare.splice(idx, 1);
    showToast("Solishtirishdan olib tashlandi", "info");
  } else {
    if (state.compare.length >= 4) {
      showToast("Bir vaqtda maksimal 4 ta mahsulotni solishtirish mumkin", "error");
      return;
    }
    state.compare.push(productId);
    showToast("Solishtirish ro'yxatiga qo'shildi", "success");
  }
  saveStorage(STORAGE_KEYS.COMPARE, state.compare);
  updateAllBadges();
  renderCatalogSection();
};

function openCompareModal() {
  const body = document.getElementById("compareBody");
  const items = state.products.filter((p) => state.compare.includes(p.id));
  if (!items.length) {
    body.innerHTML = `<p style="text-align:center; padding:30px; color:var(--text-secondary);">Solishtirish uchun kamida 2 ta mahsulot tanlang.</p>`;
    openModal("compareModal");
    return;
  }

  body.innerHTML = `
    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Xususiyat</th>
            ${items.map((p) => `<th>${p.name}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Rasm</strong></td>
            ${items.map((p) => `<td><img src="${p.image}" alt="${p.name}" style="width:80px; height:64px; object-fit:cover; border-radius:8px;" onerror="this.src='${FALLBACK_IMAGE}'" /></td>`).join("")}
          </tr>
          <tr>
            <td><strong>Narxi</strong></td>
            ${items.map((p) => `<td><strong>${formatPrice(p.price)}</strong></td>`).join("")}
          </tr>
          <tr>
            <td><strong>Kategoriya</strong></td>
            ${items.map((p) => `<td>${getCategoryName(p.category)}</td>`).join("")}
          </tr>
          <tr>
            <td><strong>Brend</strong></td>
            ${items.map((p) => `<td>${p.brand}</td>`).join("")}
          </tr>
          <tr>
            <td><strong>Reyting</strong></td>
            ${items.map((p) => `<td>★ ${p.rating} (${p.soldCount} sotilgan)</td>`).join("")}
          </tr>
          <tr>
            <td><strong>Amal</strong></td>
            ${items.map((p) => `<td><button type="button" class="btn-primary" onclick="addToCart('${p.id}', this)">Savatga</button></td>`).join("")}
          </tr>
        </tbody>
      </table>
    </div>
  `;
  openModal("compareModal");
}

// Recently Viewed
function renderRecentlyViewed() {
  const sec = document.getElementById("recentlyViewedSection");
  const carousel = document.getElementById("recentlyViewedCarousel");
  if (!sec || !carousel) return;

  const items = state.recentlyViewed
    .map((id) => state.products.find((p) => p.id === id))
    .filter(Boolean);

  if (!items.length) {
    sec.classList.add("hidden");
    return;
  }

  sec.classList.remove("hidden");
  carousel.innerHTML = items.map(createProductCardHTML).join("");
}

// Checkout, Geolocation & Leaflet Map
function formatUzPhone(raw) {
  let digits = raw.replace(/\D/g, "");
  if (!digits.startsWith("998")) {
    digits = "998" + digits.replace(/^998/, "");
  }
  digits = digits.slice(0, 12);

  let res = "+998";
  if (digits.length > 3) res += " (" + digits.slice(3, 5);
  if (digits.length >= 5) res += ")";
  if (digits.length > 5) res += " " + digits.slice(5, 8);
  if (digits.length > 8) res += "-" + digits.slice(8, 10);
  if (digits.length > 10) res += "-" + digits.slice(10, 12);
  return res;
}

function openCheckoutModal() {
  document.getElementById("coFullName").value = state.profile.name || "";
  document.getElementById("coPhone").value = state.profile.phone || "+998 ";
  if (state.profile.savedAddresses.length) {
    document.getElementById("coAddress").value = state.profile.savedAddresses[0].address;
    selectedMapCoords = {
      lat: state.profile.savedAddresses[0].lat,
      lng: state.profile.savedAddresses[0].lng
    };
  }

  const bonusInput = document.getElementById("coUseBonus");
  const bonusHint = document.getElementById("availableBonusHint");
  if (bonusInput) {
    bonusInput.max = state.profile.bonusPoints || 0;
    bonusInput.value = 0;
    bonusInput.oninput = renderCheckoutSummary;
  }
  if (bonusHint) {
    bonusHint.textContent = `Mavjud: ${state.profile.bonusPoints || 0} ball (1 ball = 1 so'm)`;
  }

  // Saved addresses buttons
  const addrBar = document.getElementById("checkoutSavedAddresses");
  if (addrBar) {
    addrBar.innerHTML = state.profile.savedAddresses
      .map(
        (a) => `
      <button type="button" class="history-chip" onclick="applySavedAddress('${a.address.replace(/'/g, "\\'")}', ${a.lat}, ${a.lng})">
        <i class="fa-solid fa-bookmark"></i> ${a.label}: ${a.address.slice(0, 28)}...
      </button>
    `
      )
      .join("");
  }

  renderCheckoutSummary();
  openModal("checkoutModal");
  setTimeout(() => initLeafletMap(selectedMapCoords.lat, selectedMapCoords.lng), 120);
}

window.applySavedAddress = function (addr, lat, lng) {
  document.getElementById("coAddress").value = addr;
  selectedMapCoords = { lat, lng };
  updateCoordsText(lat, lng);
  if (leafletMap && leafletMarker) {
    leafletMap.setView([lat, lng], 15);
    leafletMarker.setLatLng([lat, lng]);
  }
};

function initLeafletMap(lat, lng) {
  const mapEl = document.getElementById("leafletMapContainer");
  if (!mapEl || typeof L === "undefined") return;

  if (!leafletMap) {
    leafletMap = L.map("leafletMapContainer").setView([lat, lng], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(leafletMap);

    leafletMarker = L.marker([lat, lng], { draggable: true }).addTo(leafletMap);

    leafletMap.on("click", (e) => {
      const { lat: cLat, lng: cLng } = e.latlng;
      selectedMapCoords = { lat: cLat, lng: cLng };
      leafletMarker.setLatLng([cLat, cLng]);
      updateCoordsText(cLat, cLng);
      reverseGeocodeCoords(cLat, cLng);
    });

    leafletMarker.on("dragend", () => {
      const pos = leafletMarker.getLatLng();
      selectedMapCoords = { lat: pos.lat, lng: pos.lng };
      updateCoordsText(pos.lat, pos.lng);
      reverseGeocodeCoords(pos.lat, pos.lng);
    });
  } else {
    leafletMap.invalidateSize();
    leafletMap.setView([lat, lng], 14);
    leafletMarker.setLatLng([lat, lng]);
  }
  updateCoordsText(lat, lng);
}

function updateCoordsText(lat, lng) {
  const el = document.getElementById("selectedCoordsText");
  if (el) el.textContent = `Koordinatalar: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

async function reverseGeocodeCoords(lat, lng) {
  try {
    if (!navigator.onLine) return;
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
    if (!res.ok) return;
    const data = await res.json();
    if (data && data.display_name) {
      const addrInput = document.getElementById("coAddress");
      if (addrInput && !addrInput.dataset.manualLock) {
        addrInput.value = data.display_name;
      }
    }
  } catch (_) {
    // Fallback silently to coordinates
  }
}

function handleGeolocation() {
  const statusBox = document.getElementById("geoStatusBox");
  if (!navigator.geolocation) {
    if (statusBox) {
      statusBox.classList.remove("hidden");
      statusBox.textContent = "Brauzeringiz Geolocation API'ni qo'llab-quvvatlamaydi. Manzilni qo'lda kiriting.";
    }
    return;
  }

  if (statusBox) {
    statusBox.classList.remove("hidden");
    statusBox.textContent = "Joylashuv aniqlanmoqda...";
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      selectedMapCoords = { lat: latitude, lng: longitude };
      if (statusBox) {
        statusBox.textContent = `Lokatsiya aniqlandi (${latitude.toFixed(5)}, ${longitude.toFixed(5)}). Manzilni tekshirib tasdiqlang.`;
      }
      initLeafletMap(latitude, longitude);
      reverseGeocodeCoords(latitude, longitude);
      showToast("GPS lokatsiya aniqlandi!", "success");
    },
    (err) => {
      if (statusBox) {
        statusBox.textContent = `Lokatsiyaga ruxsat berilmadi (${err.message}). Manzilni qo'lda yozing yoki xaritadan tanlang.`;
      }
      showToast("Lokatsiya olinmadi — manzilni qo'lda kiriting", "info");
    },
    { enableHighAccuracy: true, timeout: 9000 }
  );
}

function renderCheckoutSummary() {
  const box = document.getElementById("checkoutSummaryBox");
  if (!box) return;
  const spendBonus = Number(document.getElementById("coUseBonus")?.value) || 0;
  const t = calculateCartTotals(spendBonus);

  box.innerHTML = `
    <h4 style="margin-bottom:12px;">Buyurtma tarkibi (${t.totalItems} ta)</h4>
    <div style="display:flex; flex-direction:column; gap:8px; max-height:220px; overflow-y:auto; margin-bottom:14px;">
      ${t.detailedItems
        .map(
          (i) => `
        <div style="display:flex; justify-content:space-between; font-size:0.84rem; border-bottom:1px solid var(--border-color); padding-bottom:6px;">
          <span>${i.product.name} × <strong>${i.qty}</strong></span>
          <strong>${formatPrice(i.lineTotal)}</strong>
        </div>
      `
        )
        .join("")}
    </div>
    <div class="cart-summary-lines">
      <div class="summary-line"><span>Mahsulotlar:</span><strong>${formatPrice(t.subtotal)}</strong></div>
      <div class="summary-line discount-line"><span>Promokod chegirmasi:</span><strong>-${formatPrice(t.promoDiscount)}</strong></div>
      <div class="summary-line discount-line"><span>Bonus ballar:</span><strong>-${formatPrice(t.spentBonus)}</strong></div>
      <div class="summary-line"><span>Yetkazib berish:</span><strong>${t.deliveryFee === 0 ? "BEPUL" : formatPrice(t.deliveryFee)}</strong></div>
      <div class="summary-line total-line"><span>Jami to'lov:</span><strong>${formatPrice(t.grandTotal)}</strong></div>
      <div class="summary-line bonus-earned-line"><span>Qo'shiladigan bonus:</span><strong>+${t.earnedBonus} ball</strong></div>
    </div>
    <button type="submit" class="btn-primary btn-block btn-lg" style="margin-top:14px;">
      <i class="fa-solid fa-check-circle"></i> Buyurtmani tasdiqlash (Demo)
    </button>
  `;
}

function handleCheckoutSubmit(e) {
  e.preventDefault();
  try {
    const fullName = document.getElementById("coFullName").value.trim();
    const phone = document.getElementById("coPhone").value.trim();
    const address = document.getElementById("coAddress").value.trim();
    const deliveryTime = document.getElementById("coDeliveryTime").value;
    const note = document.getElementById("coNote").value.trim();
    const spendBonus = Number(document.getElementById("coUseBonus").value) || 0;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || "Naqd pul";

    if (!fullName || phone.replace(/\D/g, "").length < 12 || !address) {
      showToast("Ism-familiya, +998 telefon raqami va manzilni to'liq kiriting!", "error");
      return;
    }

    const totals = calculateCartTotals(spendBonus);
    if (totals.detailedItems.length === 0) {
      showToast("Savat bo'sh!", "error");
      return;
    }

    const orderNumber = "FM-" + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      orderNumber,
      createdAt: new Date().toLocaleString("uz-UZ"),
      customer: { fullName, phone, address, coords: { ...selectedMapCoords } },
      deliveryTime,
      note,
      paymentMethod,
      paymentMode: "DEMO",
      status: "Qabul qilindi",
      items: totals.detailedItems.map((i) => ({
        productId: i.productId,
        name: i.product.name,
        qty: i.qty,
        price: i.product.price
      })),
      subtotal: totals.subtotal,
      promoDiscount: totals.promoDiscount,
      spentBonus: totals.spentBonus,
      deliveryFee: totals.deliveryFee,
      total: totals.grandTotal,
      earnedBonus: totals.earnedBonus
    };

    // Update sold counts
    totals.detailedItems.forEach((i) => {
      const p = state.products.find((prod) => prod.id === i.productId);
      if (p) p.soldCount += i.qty;
    });

    // Update bonus & profile
    state.profile.name = fullName;
    state.profile.phone = phone;
    state.profile.bonusPoints = Math.max(0, (state.profile.bonusPoints || 0) - totals.spentBonus) + totals.earnedBonus;

    // Update customers list
    const existingCust = state.customers.find((c) => c.phone === phone);
    if (existingCust) {
      existingCust.name = fullName;
      existingCust.ordersCount += 1;
      existingCust.totalSpent += totals.grandTotal;
    } else {
      state.customers.push({ name: fullName, phone, ordersCount: 1, totalSpent: totals.grandTotal });
    }

    state.orders.unshift(newOrder);
    state.cart = [];
    state.appliedPromo = null;

    saveStorage(STORAGE_KEYS.ORDERS, state.orders);
    saveStorage(STORAGE_KEYS.PRODUCTS, state.products);
    saveStorage(STORAGE_KEYS.PROFILE, state.profile);
    saveStorage(STORAGE_KEYS.CUSTOMERS, state.customers);
    saveStorage(STORAGE_KEYS.CART, state.cart);
    saveStorage(STORAGE_KEYS.APPLIED_PROMO, null);

    addNotification(
      `Buyurtma #${orderNumber} rasmiylashtirildi`,
      `To'lov turi: ${paymentMethod} (Demo). Jami: ${formatPrice(totals.grandTotal)}.`
    );

    closeModal("checkoutModal");
    updateAllBadges();
    renderCartDrawer();
    renderCatalogSection();
    openOrderSuccessModal(orderNumber);
    showToast(`Buyurtma #${orderNumber} muvaffaqiyatli yaratildi!`, "success");
  } catch (err) {
    console.error(err);
    showToast("Buyurtmani saqlashda xatolik yuz berdi", "error");
  }
}

window.openOrderSuccessModal = function (orderNumber) {
  const order = state.orders.find((o) => o.orderNumber === orderNumber);
  if (!order) return;

  const steps = ["Qabul qilindi", "Tayyorlanmoqda", "Kuryer yo'lda", "Yetkazildi"];
  const currentStepIdx = Math.max(0, steps.indexOf(order.status));

  const body = document.getElementById("orderSuccessBody");
  body.innerHTML = `
    <div style="background:var(--brand-primary-soft); border:1px solid var(--brand-primary); padding:14px 16px; border-radius:var(--radius-md); margin-bottom:14px;">
      <strong>Buyurtma raqami: #${order.orderNumber}</strong> • <span style="font-size:0.84rem;">${order.createdAt}</span>
      <p style="font-size:0.86rem; margin-top:4px;">Buyurtmangiz qabul qilindi. To'lov usuli: <strong>${order.paymentMethod}</strong> (Demo rejim — haqiqiy bank tranzaksiyasi amalga oshirilmagan).</p>
    </div>

    <h4>Buyurtma holatini kuzatish (Hozir: <span class="text-success">${order.status}</span>)</h4>
    <div class="tracker-steps">
      ${steps
        .map(
          (st, idx) => `
        <div class="tracker-step ${idx <= currentStepIdx ? "done" : ""}">
          <i class="fa-solid ${idx <= currentStepIdx ? "fa-circle-check" : "fa-clock"}"></i>
          <div style="margin-top:4px;">${st}</div>
        </div>
      `
        )
        .join("")}
    </div>

    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:14px; background:var(--bg-elevated); padding:14px; border-radius:var(--radius-sm); font-size:0.86rem; margin-bottom:14px;">
      <div>
        <p><strong>Xaridor:</strong> ${order.customer.fullName}</p>
        <p><strong>Telefon:</strong> ${order.customer.phone}</p>
        <p><strong>Manzil:</strong> ${order.customer.address}</p>
      </div>
      <div>
        <p><strong>Vaqt:</strong> ${order.deliveryTime}</p>
        <p><strong>Koordinata:</strong> ${order.customer.coords.lat.toFixed(4)}, ${order.customer.coords.lng.toFixed(4)}</p>
        <p><strong>Izoh:</strong> ${order.note || "Yo'q"}</p>
      </div>
    </div>

    <h4 style="margin-bottom:8px;">Mahsulotlar</h4>
    ${order.items
      .map(
        (i) => `
      <div style="display:flex; justify-content:space-between; font-size:0.86rem; padding:6px 0; border-bottom:1px solid var(--border-color);">
        <span>${i.name} × ${i.qty}</span>
        <strong>${formatPrice(i.price * i.qty)}</strong>
      </div>
    `
      )
      .join("")}
    <div style="display:flex; justify-content:space-between; font-size:1.05rem; font-weight:800; margin-top:12px;">
      <span>Jami:</span>
      <span>${formatPrice(order.total)}</span>
    </div>
  `;
  openModal("orderSuccessModal");
};

function openOrdersHistoryModal() {
  const body = document.getElementById("ordersHistoryBody");
  if (!state.orders.length) {
    body.innerHTML = `<p style="text-align:center; padding:30px; color:var(--text-secondary);">Sizda hali buyurtmalar mavjud emas.</p>`;
  } else {
    body.innerHTML = state.orders
      .map(
        (o) => `
      <div style="background:var(--bg-elevated); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:14px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <strong>#${o.orderNumber}</strong>
          <span class="tag-pill green">${o.status}</span>
        </div>
        <div style="font-size:0.82rem; color:var(--text-secondary); margin:6px 0;">
          ${o.createdAt} • ${o.paymentMethod} (Demo) • <strong>${formatPrice(o.total)}</strong>
        </div>
        <div style="font-size:0.82rem; margin-bottom:8px;">Manzil: ${o.customer.address}</div>
        <button type="button" class="btn-outline-sm" onclick="closeModal('ordersHistoryModal'); openOrderSuccessModal('${o.orderNumber}');">
          <i class="fa-solid fa-location-dot"></i> Holatni kuzatish va tafsilotlar
        </button>
      </div>
    `
      )
      .join("");
  }
  openModal("ordersHistoryModal");
}

// User Profile & Referral
function openProfileModal() {
  const body = document.getElementById("profileBody");
  const p = state.profile;
  body.innerHTML = `
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:22px;">
      <div style="background:var(--bg-elevated); padding:18px; border-radius:var(--radius-md); text-align:center;">
        <img src="${p.avatar}" alt="${p.name}" style="width:88px; height:88px; border-radius:50%; object-fit:cover; margin:0 auto 10px;" onerror="this.src='${FALLBACK_IMAGE}'" />
        <h4>${p.name}</h4>
        <p style="font-size:0.84rem; color:var(--text-secondary);">${p.phone}</p>
        <div class="bonus-pill" style="margin:12px auto; font-size:0.9rem; padding:6px 14px;">
          <i class="fa-solid fa-coins"></i> ${p.bonusPoints} bonus ball
        </div>
        <div style="font-size:0.8rem; color:var(--text-secondary);">Buyurtmalar soni: <strong>${state.orders.length} ta</strong></div>
        <div style="font-size:0.8rem; color:var(--text-secondary);">Sevimlilar: <strong>${state.wishlist.length} ta</strong></div>
      </div>

      <div>
        <h4 style="margin-bottom:10px;">Profilni tahrirlash va sozlamalar</h4>
        <form onsubmit="saveProfileChanges(event)">
          <div class="form-group">
            <label>Ism va familiya</label>
            <input type="text" id="profNameInput" class="form-control" value="${p.name}" required />
          </div>
          <div class="form-group">
            <label>Telefon raqami</label>
            <input type="text" id="profPhoneInput" class="form-control" value="${p.phone}" required />
          </div>
          <div class="form-group">
            <label>Profil rasmi URL</label>
            <input type="text" id="profAvatarInput" class="form-control" value="${p.avatar}" />
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button type="submit" class="btn-primary">Saqlash</button>
            <button type="button" class="btn-secondary" onclick="applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')">
              <i class="fa-solid fa-circle-half-stroke"></i> Dark/Light Mode
            </button>
            <button type="button" class="btn-outline-sm" onclick="logoutDemoProfile()">
              <i class="fa-solid fa-right-from-bracket"></i> Chiqish (Demo)
            </button>
          </div>
        </form>

        <hr style="border:none; border-top:1px solid var(--border-color); margin:18px 0;" />
        <h4 style="margin-bottom:8px;">Saqlangan manzillar</h4>
        ${p.savedAddresses.map((a) => `<div style="font-size:0.84rem; padding:6px 0; border-bottom:1px solid var(--border-color);"><strong>${a.label}:</strong> ${a.address}</div>`).join("")}

        <hr style="border:none; border-top:1px solid var(--border-color); margin:18px 0;" />
        <h4 style="margin-bottom:8px;">Faol promokodlar</h4>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          ${Object.values(PROMO_CODES).map((pr) => `<span class="filter-chip">${pr.label}</span>`).join("")}
        </div>
      </div>
    </div>
  `;
  openModal("profileModal");
}

window.saveProfileChanges = function (e) {
  e.preventDefault();
  state.profile.name = document.getElementById("profNameInput").value.trim() || state.profile.name;
  state.profile.phone = formatUzPhone(document.getElementById("profPhoneInput").value.trim());
  state.profile.avatar = document.getElementById("profAvatarInput").value.trim() || state.profile.avatar;
  saveStorage(STORAGE_KEYS.PROFILE, state.profile);
  updateAllBadges();
  showToast("Profil ma'lumotlari saqlandi", "success");
  openProfileModal();
};

window.logoutDemoProfile = function () {
  showToast("Demo sessiyadan chiqildi (LocalStorage ma'lumotlari saqlangan)", "info");
  closeModal("profileModal");
};

function openReferralModal() {
  const body = document.getElementById("referralBody");
  body.innerHTML = `
    <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:12px;">
      Do'stingizni taklif qiling va har ikkingiz <strong>2,500 bonus ball</strong>ga ega bo'ling!
    </p>
    <div style="background:var(--bg-elevated); padding:12px; border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
      <strong style="font-size:1rem; letter-spacing:0.05em;">${state.profile.referralCode}</strong>
      <button type="button" class="btn-primary" onclick="claimReferralBonus()">
        <i class="fa-solid fa-gift"></i> Bonus olish (+2,500)
      </button>
    </div>
  `;
  openModal("referralModal");
}

window.claimReferralBonus = function () {
  state.profile.bonusPoints = (state.profile.bonusPoints || 0) + 2500;
  saveStorage(STORAGE_KEYS.PROFILE, state.profile);
  updateAllBadges();
  showToast("Tabriklaymiz! +2,500 bonus ball hisobingizga qo'shildi.", "success");
  openReferralModal();
};

// Admin Panel (Demo Only — Requires Backend for Real Auth & Security)
function openAdminModal() {
  const body = document.getElementById("adminBody");

  if (!state.adminAuthenticated) {
    body.innerHTML = `
      <div style="max-width:420px; margin:20px auto; background:var(--bg-elevated); padding:24px; border-radius:var(--radius-md); border:1px solid var(--border-color);">
        <h4 style="margin-bottom:8px;">Admin Panelga Kirish (Demo)</h4>
        <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:14px;">
          Demo kirish: email <code>admin@fastmarket.uz</code>, parol <code>admin123</code>.
          Haqiqiy loyihada login va rollar server (Backend) tomonidan tekshirilishi shart.
        </p>
        <form onsubmit="handleAdminLogin(event)">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="admEmail" class="form-control" value="admin@fastmarket.uz" required />
          </div>
          <div class="form-group">
            <label>Parol</label>
            <input type="password" id="admPass" class="form-control" value="admin123" required />
          </div>
          <button type="submit" class="btn-accent btn-block">Kirish</button>
        </form>
      </div>
    `;
    openModal("adminModal");
    return;
  }

  renderAdminContent();
  openModal("adminModal");
}

window.handleAdminLogin = function (e) {
  e.preventDefault();
  const email = document.getElementById("admEmail").value.trim();
  const pass = document.getElementById("admPass").value.trim();
  if (email === "admin@fastmarket.uz" && pass === "admin123") {
    state.adminAuthenticated = true;
    showToast("Admin panel (Demo) ochildi", "success");
    renderAdminContent();
  } else {
    showToast("Login yoki parol noto'g'ri!", "error");
  }
};

function renderAdminContent() {
  const body = document.getElementById("adminBody");
  const totalRevenue = state.orders.reduce((acc, o) => acc + (o.total || 0), 0);

  const tabsHTML = `
    <div class="admin-tabs">
      <button type="button" class="admin-tab-btn ${state.adminActiveTab === "dashboard" ? "active" : ""}" onclick="switchAdminTab('dashboard')">Statistika</button>
      <button type="button" class="admin-tab-btn ${state.adminActiveTab === "products" ? "active" : ""}" onclick="switchAdminTab('products')">Mahsulotlar (${state.products.length})</button>
      <button type="button" class="admin-tab-btn ${state.adminActiveTab === "add-product" ? "active" : ""}" onclick="switchAdminTab('add-product')">+ Mahsulot qo'shish</button>
      <button type="button" class="admin-tab-btn ${state.adminActiveTab === "categories" ? "active" : ""}" onclick="switchAdminTab('categories')">Kategoriyalar</button>
      <button type="button" class="admin-tab-btn ${state.adminActiveTab === "orders" ? "active" : ""}" onclick="switchAdminTab('orders')">Buyurtmalar (${state.orders.length})</button>
      <button type="button" class="admin-tab-btn ${state.adminActiveTab === "customers" ? "active" : ""}" onclick="switchAdminTab('customers')">Mijozlar (${state.customers.length})</button>
      <button type="button" class="btn-outline-sm" style="margin-left:auto;" onclick="state.adminAuthenticated=false; openAdminModal();">Chiqish</button>
    </div>
  `;

  let tabBody = "";

  if (state.adminActiveTab === "dashboard") {
    tabBody = `
      <div class="kpi-grid">
        <div class="kpi-card"><span>Umumiy savdo (Demo)</span><strong>${formatPrice(totalRevenue)}</strong></div>
        <div class="kpi-card"><span>Jami buyurtmalar</span><strong>${state.orders.length} ta</strong></div>
        <div class="kpi-card"><span>Mahsulotlar soni</span><strong>${state.products.length} ta</strong></div>
        <div class="kpi-card"><span>Mijozlar soni</span><strong>${state.customers.length} ta</strong></div>
      </div>
      <p style="font-size:0.84rem; color:var(--text-secondary);">
        <strong>Arxitektura izohi:</strong> Hozirgi o'zgarishlar brauzerning LocalStorage xotirasida saqlanadi. Haqiqiy ko'p foydalanuvchili biznes uchun REST/GraphQL API, JWT/Session autentifikatsiya va relatsion ma'lumotlar bazasi qo'shilishi kerak.
      </p>
    `;
  } else if (state.adminActiveTab === "products") {
    tabBody = `
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Rasm</th>
              <th>Nomi</th>
              <th>Kategoriya</th>
              <th>Narxi</th>
              <th>Eski narx</th>
              <th>Holat</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            ${state.products
              .map(
                (p) => `
              <tr>
                <td><img src="${p.image}" alt="${p.name}" style="width:46px; height:46px; object-fit:cover; border-radius:6px;" onerror="this.src='${FALLBACK_IMAGE}'" /></td>
                <td><strong>${p.name}</strong></td>
                <td>${getCategoryName(p.category)}</td>
                <td>${formatPrice(p.price)}</td>
                <td>${p.oldPrice ? formatPrice(p.oldPrice) : "—"}</td>
                <td>${p.inStock ? "Mavjud" : "Tugagan"}</td>
                <td style="display:flex; gap:6px;">
                  <button type="button" class="btn-outline-sm" onclick="adminQuickEditPrice('${p.id}')">Narx/Chegirma</button>
                  <button type="button" class="btn-outline-sm" onclick="adminDeleteProduct('${p.id}')">O'chirish</button>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  } else if (state.adminActiveTab === "add-product") {
    tabBody = `
      <form onsubmit="handleAdminAddProduct(event)" style="max-width:640px;">
        <div class="form-row-2">
          <div class="form-group">
            <label>Mahsulot nomi *</label>
            <input type="text" id="admProdName" class="form-control" required />
          </div>
          <div class="form-group">
            <label>Kategoriya *</label>
            <select id="admProdCat" class="form-control">
              ${state.categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-group">
            <label>Yangi narx (so'm) *</label>
            <input type="number" id="admProdPrice" class="form-control" required min="1000" />
          </div>
          <div class="form-group">
            <label>Eski narx (chegirma uchun, so'm)</label>
            <input type="number" id="admProdOldPrice" class="form-control" min="0" />
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-group">
            <label>Brend</label>
            <input type="text" id="admProdBrand" class="form-control" value="FastMarket" />
          </div>
          <div class="form-group">
            <label>Rasm yuklash (fayl) yoki URL</label>
            <input type="file" id="admProdFile" accept="image/*" class="form-control" />
          </div>
        </div>
        <div class="form-group">
          <label>Rasm URL (agar fayl tanlanmasa)</label>
          <input type="url" id="admProdImgUrl" class="form-control" placeholder="https://images.unsplash.com/..." />
        </div>
        <div class="form-group">
          <label>Tavsif *</label>
          <textarea id="admProdDesc" class="form-control" rows="2" required></textarea>
        </div>
        <button type="submit" class="btn-primary">Mahsulotni saqlash</button>
      </form>
    `;
  } else if (state.adminActiveTab === "categories") {
    tabBody = `
      <form onsubmit="handleAdminAddCategory(event)" style="display:flex; gap:10px; max-width:480px; margin-bottom:16px;">
        <input type="text" id="admNewCatName" class="form-control" placeholder="Yangi kategoriya nomi" required />
        <button type="submit" class="btn-primary">Qo'shish</button>
      </form>
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${state.categories.map((c) => `<span class="filter-chip"><i class="fa-solid ${c.icon}"></i> ${c.name}</span>`).join("")}
      </div>
    `;
  } else if (state.adminActiveTab === "orders") {
    const statuses = ["Qabul qilindi", "Tayyorlanmoqda", "Kuryer yo'lda", "Yetkazildi", "Bekor qilindi"];
    tabBody = `
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Raqam</th>
              <th>Mijoz</th>
              <th>Summa</th>
              <th>To'lov</th>
              <th>Holat</th>
            </tr>
          </thead>
          <tbody>
            ${state.orders
              .map(
                (o) => `
              <tr>
                <td><strong>#${o.orderNumber}</strong></td>
                <td>${o.customer.fullName} (${o.customer.phone})</td>
                <td>${formatPrice(o.total)}</td>
                <td>${o.paymentMethod}</td>
                <td>
                  <select class="filter-select" onchange="adminUpdateOrderStatus('${o.orderNumber}', this.value)">
                    ${statuses.map((s) => `<option value="${s}" ${o.status === s ? "selected" : ""}>${s}</option>`).join("")}
                  </select>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  } else if (state.adminActiveTab === "customers") {
    tabBody = `
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>Ism</th><th>Telefon</th><th>Buyurtmalar</th><th>Jami xarid</th></tr>
          </thead>
          <tbody>
            ${state.customers
              .map(
                (c) => `
              <tr>
                <td>${c.name}</td>
                <td>${c.phone}</td>
                <td>${c.ordersCount} ta</td>
                <td><strong>${formatPrice(c.totalSpent)}</strong></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  body.innerHTML = tabsHTML + tabBody;
}

window.switchAdminTab = function (tab) {
  state.adminActiveTab = tab;
  renderAdminContent();
};

window.adminQuickEditPrice = function (prodId) {
  const prod = state.products.find((p) => p.id === prodId);
  if (!prod) return;
  const newPriceStr = prompt(`"${prod.name}" uchun yangi narxni kiriting (hozir: ${prod.price}):`, prod.price);
  if (!newPriceStr) return;
  const newPrice = Number(newPriceStr);
  if (Number.isNaN(newPrice) || newPrice <= 0) return;

  const oldPriceStr = prompt("Eski narxni kiriting (chegirma uchun, 0 bo'lsa chegirmani olib tashlaydi):", prod.oldPrice || 0);
  const oldPrice = Number(oldPriceStr) || 0;

  prod.price = newPrice;
  prod.oldPrice = oldPrice > newPrice ? oldPrice : 0;
  saveStorage(STORAGE_KEYS.PRODUCTS, state.products);
  renderCatalogSection();
  renderDiscountsCarousel();
  renderAdminContent();
  showToast("Narx va chegirma yangilandi", "success");
};

window.adminDeleteProduct = function (prodId) {
  if (!confirm("Mahsulotni o'chirishni tasdiqlaysizmi?")) return;
  state.products = state.products.filter((p) => p.id !== prodId);
  saveStorage(STORAGE_KEYS.PRODUCTS, state.products);
  renderCatalogSection();
  renderAdminContent();
  showToast("Mahsulot o'chirildi", "info");
};

window.handleAdminAddProduct = function (e) {
  e.preventDefault();
  const name = document.getElementById("admProdName").value.trim();
  const category = document.getElementById("admProdCat").value;
  const price = Number(document.getElementById("admProdPrice").value);
  const oldPrice = Number(document.getElementById("admProdOldPrice").value) || 0;
  const brand = document.getElementById("admProdBrand").value.trim() || "FastMarket";
  const description = document.getElementById("admProdDesc").value.trim();
  const fileInput = document.getElementById("admProdFile");
  const urlInput = document.getElementById("admProdImgUrl").value.trim();

  const createObj = (imgSrc) => {
    const newProd = {
      id: "prd-" + Date.now(),
      name,
      category,
      brand,
      price,
      oldPrice: oldPrice > price ? oldPrice : 0,
      rating: 4.8,
      soldCount: 1,
      inStock: true,
      isNew: true,
      isRecommended: true,
      isDailyDeal: false,
      isFlashSale: false,
      image: imgSrc || FALLBACK_IMAGE,
      description,
      specs: { "Holat": "Yangi qo'shilgan" },
      reviews: []
    };
    state.products.unshift(newProd);
    saveStorage(STORAGE_KEYS.PRODUCTS, state.products);
    populateFilterDropdowns();
    renderCatalogSection();
    renderDiscountsCarousel();
    state.adminActiveTab = "products";
    renderAdminContent();
    showToast(`"${name}" mahsuloti qo'shildi!`, "success");
  };

  if (fileInput && fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = () => createObj(reader.result);
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    createObj(urlInput || FALLBACK_IMAGE);
  }
};

window.handleAdminAddCategory = function (e) {
  e.preventDefault();
  const name = document.getElementById("admNewCatName").value.trim();
  if (!name) return;
  const id = name.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, "-").replace(/^-|-$/g, "") || "cat-" + Date.now();
  if (!state.categories.some((c) => c.id === id)) {
    state.categories.push({ id, name, icon: "fa-tag" });
    saveStorage(STORAGE_KEYS.CATEGORIES, state.categories);
    renderCategoriesGrid();
    renderCategoryRibbon();
    populateFilterDropdowns();
  }
  renderAdminContent();
  showToast(`"${name}" kategoriyasi qo'shildi`, "success");
};

window.adminUpdateOrderStatus = function (orderNumber, newStatus) {
  const order = state.orders.find((o) => o.orderNumber === orderNumber);
  if (!order) return;
  order.status = newStatus;
  saveStorage(STORAGE_KEYS.ORDERS, state.orders);
  addNotification(`Buyurtma #${orderNumber} holati o'zgardi`, `Yangi holat: ${newStatus}`);
  showToast(`#${orderNumber} holati: ${newStatus}`, "info");
};

// Badges & Notifications Render
function updateAllBadges() {
  const totalCartItems = state.cart.reduce((sum, i) => sum + i.qty, 0);
  const cartBadge = document.getElementById("cartBadge");
  const mobCartBadge = document.getElementById("mobCartBadge");
  if (cartBadge) cartBadge.textContent = totalCartItems;
  if (mobCartBadge) mobCartBadge.textContent = totalCartItems;

  const wishBadge = document.getElementById("wishlistBadge");
  if (wishBadge) {
    wishBadge.textContent = state.wishlist.length;
    wishBadge.classList.toggle("hidden", state.wishlist.length === 0);
  }

  const cmpBadge = document.getElementById("compareBadge");
  if (cmpBadge) {
    cmpBadge.textContent = state.compare.length;
    cmpBadge.classList.toggle("hidden", state.compare.length === 0);
  }

  const ordBadge = document.getElementById("ordersBadge");
  if (ordBadge) {
    ordBadge.textContent = state.orders.length;
    ordBadge.classList.toggle("hidden", state.orders.length === 0);
  }

  const bonusEl = document.getElementById("headerBonusPoints");
  if (bonusEl) bonusEl.textContent = (state.profile.bonusPoints || 0).toLocaleString("uz-UZ");

  const profNameEl = document.getElementById("headerProfileName");
  if (profNameEl) profNameEl.textContent = (state.profile.name || "Profil").split(" ")[0];

  const profAvatarEl = document.getElementById("headerProfileAvatar");
  if (profAvatarEl && state.profile.avatar) profAvatarEl.src = state.profile.avatar;
}

function renderNotifications() {
  const list = document.getElementById("notifList");
  const badge = document.getElementById("notifBadge");
  if (!list || !badge) return;

  const unreadCount = state.notifications.filter((n) => !n.read).length;
  badge.textContent = unreadCount;
  badge.classList.toggle("hidden", unreadCount === 0);

  if (!state.notifications.length) {
    list.innerHTML = `<div style="padding:18px; text-align:center; font-size:0.82rem; color:var(--text-secondary);">Bildirishnomalar yo'q</div>`;
    return;
  }

  list.innerHTML = state.notifications
    .map(
      (n) => `
    <div class="notif-item ${n.read ? "" : "unread"}">
      <i class="fa-solid fa-bell" style="color:var(--brand-accent); margin-top:2px;"></i>
      <div>
        <strong style="display:block; font-size:0.82rem;">${n.title}</strong>
        <span style="color:var(--text-secondary);">${n.text}</span>
        <div style="font-size:0.7rem; color:var(--text-muted); margin-top:2px;">${n.time}</div>
      </div>
    </div>
  `
    )
    .join("");
}

// Start App on DOM Ready
document.addEventListener("DOMContentLoaded", initApp);
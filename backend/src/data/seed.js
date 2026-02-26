const products = [
  {
    id: "prod_001",
    name: "Sony WH-1000XM5 Headphones",
    category: "electronics",
    price: 349.99,
    originalPrice: 429.99,
    images: ["https://placehold.co/400x400/1a1a2e/ffffff?text=Sony+WH1000XM5"],
    description: "Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI, co-developed with Sony Music Studios Tokyo. Up to 30-hour battery life.",
    specs: { weight: "250g", battery: "30h", connectivity: "Bluetooth 5.2", driver: "30mm" },
    stock: 42,
    rating: 4.7,
    reviewCount: 128,
    featured: true,
    tags: ["wireless", "noise-cancelling", "premium"]
  },
  {
    id: "prod_002",
    name: "Apple MacBook Pro 14\"",
    category: "electronics",
    price: 1999.99,
    originalPrice: 1999.99,
    images: ["https://placehold.co/400x400/1a1a2e/ffffff?text=MacBook+Pro+14"],
    description: "Supercharged by M3 Pro chip, the MacBook Pro 14-inch transforms workflows with extraordinary performance, a stunning Liquid Retina XDR display, and all-day battery life.",
    specs: { chip: "M3 Pro", ram: "18GB", storage: "512GB SSD", display: "14.2-inch Liquid Retina XDR" },
    stock: 15,
    rating: 4.9,
    reviewCount: 89,
    featured: true,
    tags: ["laptop", "apple", "professional"]
  },
  {
    id: "prod_003",
    name: "Samsung 4K OLED TV 55\"",
    category: "electronics",
    price: 1299.99,
    originalPrice: 1499.99,
    images: ["https://placehold.co/400x400/1a1a2e/ffffff?text=Samsung+OLED+TV"],
    description: "Experience true blacks and vibrant colors with Samsung's S95C OLED TV. Powered by Neural Quantum Processor 4K for AI-enhanced picture quality.",
    specs: { size: "55-inch", resolution: "4K UHD", panelType: "QD-OLED", refresh: "144Hz" },
    stock: 8,
    rating: 4.6,
    reviewCount: 54,
    featured: true,
    tags: ["tv", "4k", "oled"]
  },
  {
    id: "prod_004",
    name: "Logitech MX Master 3S Mouse",
    category: "electronics",
    price: 99.99,
    originalPrice: 99.99,
    images: ["https://placehold.co/400x400/1a1a2e/ffffff?text=MX+Master+3S"],
    description: "Advanced wireless mouse with MagSpeed electromagnetic scrolling, 8K DPI sensor, and ergonomic design for all-day comfort.",
    specs: { dpi: "200-8000", battery: "70 days", connectivity: "Bluetooth + USB receiver", buttons: "7" },
    stock: 76,
    rating: 4.8,
    reviewCount: 203,
    featured: false,
    tags: ["mouse", "wireless", "ergonomic"]
  },
  {
    id: "prod_005",
    name: "iPad Pro 12.9\" M2",
    category: "electronics",
    price: 1099.99,
    originalPrice: 1099.99,
    images: ["https://placehold.co/400x400/1a1a2e/ffffff?text=iPad+Pro+12.9"],
    description: "The ultimate iPad experience with the M2 chip, Liquid Retina XDR display, and Apple Pencil hover.",
    specs: { chip: "M2", display: "12.9-inch Liquid Retina XDR", storage: "256GB", connectivity: "Wi-Fi 6E" },
    stock: 23,
    rating: 4.8,
    reviewCount: 67,
    featured: true,
    tags: ["tablet", "apple", "professional"]
  },
  {
    id: "prod_006",
    name: "Nike Air Max 270",
    category: "apparel",
    price: 150.00,
    originalPrice: 150.00,
    images: ["https://placehold.co/400x400/16213e/ffffff?text=Nike+Air+Max+270"],
    description: "The Nike Air Max 270 delivers a bold look and plush cushioning. The large Air unit in the heel provides maximum cushioning for all-day comfort.",
    specs: { material: "Mesh upper", sole: "Air Max unit", sizes: "US 6-15", weight: "310g" },
    stock: 55,
    rating: 4.4,
    reviewCount: 312,
    featured: true,
    tags: ["sneakers", "running", "nike"]
  },
  {
    id: "prod_007",
    name: "Levi's 501 Original Jeans",
    category: "apparel",
    price: 69.50,
    originalPrice: 89.50,
    images: ["https://placehold.co/400x400/16213e/ffffff?text=Levis+501"],
    description: "The original blue jean since 1873. Button fly, straight leg fit, signature 5-pocket styling. Made with Levi's signature denim fabric.",
    specs: { material: "100% Cotton Denim", fit: "Straight", closure: "Button Fly", sizes: "28-42 Waist" },
    stock: 130,
    rating: 4.5,
    reviewCount: 891,
    featured: false,
    tags: ["jeans", "denim", "classic"]
  },
  {
    id: "prod_008",
    name: "Patagonia Nano Puff Jacket",
    category: "apparel",
    price: 279.00,
    originalPrice: 279.00,
    images: ["https://placehold.co/400x400/16213e/ffffff?text=Patagonia+Nano+Puff"],
    description: "Ultralight, compressible, and water-resistant, the Patagonia Nano Puff Jacket is made with PrimaLoft Gold Insulation.",
    specs: { material: "100% recycled polyester", insulation: "PrimaLoft Gold", weight: "298g", sizes: "XS-XXL" },
    stock: 34,
    rating: 4.7,
    reviewCount: 156,
    featured: true,
    tags: ["jacket", "outdoor", "sustainable"]
  },
  {
    id: "prod_009",
    name: "Adidas Ultraboost 22",
    category: "apparel",
    price: 180.00,
    originalPrice: 220.00,
    images: ["https://placehold.co/400x400/16213e/ffffff?text=Ultraboost+22"],
    description: "Responsive running shoes featuring Boost midsole technology for incredible energy return and a Primeknit upper for a snug, adaptive fit.",
    specs: { material: "Primeknit upper", midsole: "Boost foam", sizes: "US 6-14", weight: "312g" },
    stock: 48,
    rating: 4.6,
    reviewCount: 445,
    featured: false,
    tags: ["running", "adidas", "performance"]
  },
  {
    id: "prod_010",
    name: "Champion Classic T-Shirt 3-Pack",
    category: "apparel",
    price: 35.00,
    originalPrice: 35.00,
    images: ["https://placehold.co/400x400/16213e/ffffff?text=Champion+Tee+3pk"],
    description: "Classic crew neck tees made from soft, durable cotton jersey. Available in multiple color combinations. Great for everyday wear.",
    specs: { material: "Cotton Jersey", fit: "Classic", neckline: "Crew", sizes: "XS-3XL" },
    stock: 200,
    rating: 4.3,
    reviewCount: 1205,
    featured: false,
    tags: ["basics", "casual", "value"]
  },
  {
    id: "prod_011",
    name: "Dyson V15 Detect Vacuum",
    category: "home",
    price: 749.99,
    originalPrice: 749.99,
    images: ["https://placehold.co/400x400/0f3460/ffffff?text=Dyson+V15"],
    description: "Dyson's most powerful and intelligent cordless vacuum. Laser dust detection reveals microscopic particles. Automatically adapts suction across floor types.",
    specs: { suction: "230 AW", runtime: "60 min", dustbin: "0.76L", weight: "3.1kg" },
    stock: 19,
    rating: 4.8,
    reviewCount: 78,
    featured: true,
    tags: ["vacuum", "cordless", "premium"]
  },
  {
    id: "prod_012",
    name: "Instant Pot Duo 7-in-1",
    category: "home",
    price: 89.99,
    originalPrice: 119.99,
    images: ["https://placehold.co/400x400/0f3460/ffffff?text=Instant+Pot+Duo"],
    description: "7-in-1 multi-use programmable pressure cooker: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and warmer.",
    specs: { capacity: "6 Quart", functions: "7-in-1", programs: "14 Smart Programs", material: "Stainless Steel" },
    stock: 88,
    rating: 4.7,
    reviewCount: 2341,
    featured: true,
    tags: ["kitchen", "appliance", "cooking"]
  },
  {
    id: "prod_013",
    name: "IKEA KALLAX Shelf Unit",
    category: "home",
    price: 129.00,
    originalPrice: 129.00,
    images: ["https://placehold.co/400x400/0f3460/ffffff?text=KALLAX+Shelf"],
    description: "Versatile shelf unit that can be used as a room divider, TV bench, or bookcase. 16 compartments for storage and display.",
    specs: { dimensions: "147x147cm", material: "Particleboard", finish: "White", weight: "57kg" },
    stock: 12,
    rating: 4.4,
    reviewCount: 567,
    featured: false,
    tags: ["storage", "furniture", "shelving"]
  },
  {
    id: "prod_014",
    name: "Philips Hue Starter Kit",
    category: "home",
    price: 199.99,
    originalPrice: 229.99,
    images: ["https://placehold.co/400x400/0f3460/ffffff?text=Philips+Hue+Kit"],
    description: "Smart lighting system with 4 color bulbs and a Bridge. Control via app, voice commands, or automation routines. 16 million colors.",
    specs: { bulbs: "4x E26", lumens: "800 lm each", colors: "16 million", compatibility: "Alexa, Google, HomeKit" },
    stock: 41,
    rating: 4.6,
    reviewCount: 234,
    featured: false,
    tags: ["smart-home", "lighting", "philips"]
  },
  {
    id: "prod_015",
    name: "Nespresso Vertuo Next Coffee",
    category: "home",
    price: 179.00,
    originalPrice: 199.00,
    images: ["https://placehold.co/400x400/0f3460/ffffff?text=Nespresso+Vertuo"],
    description: "Next-generation coffee maker with Centrifusion™ technology. Brews 5 cup sizes from espresso to alto. Wi-Fi and Bluetooth connected.",
    specs: { capacity: "37oz tank", cups: "5 sizes", warmup: "30 seconds", connectivity: "Wi-Fi + BT" },
    stock: 29,
    rating: 4.5,
    reviewCount: 388,
    featured: false,
    tags: ["coffee", "kitchen", "smart"]
  },
  {
    id: "prod_016",
    name: "JBL Flip 6 Speaker",
    category: "electronics",
    price: 129.95,
    originalPrice: 129.95,
    images: ["https://placehold.co/400x400/1a1a2e/ffffff?text=JBL+Flip+6"],
    description: "Powerful sound with 12 hours of playtime. IP67 waterproof and dustproof. Racetrack-shaped woofer and separate tweeter for clearer sound.",
    specs: { battery: "12h", waterproof: "IP67", weight: "550g", connectivity: "Bluetooth 5.1" },
    stock: 64,
    rating: 4.6,
    reviewCount: 876,
    featured: false,
    tags: ["speaker", "portable", "waterproof"]
  },
  {
    id: "prod_017",
    name: "Ray-Ban Aviator Classic",
    category: "apparel",
    price: 161.00,
    originalPrice: 161.00,
    images: ["https://placehold.co/400x400/16213e/ffffff?text=RayBan+Aviator"],
    description: "The original aviator sunglasses since 1937. Crystal lens with G-15 treatment, gold metal frame. UV protection.",
    specs: { frame: "Gold metal", lens: "Crystal G-15", protection: "UV400", size: "58mm" },
    stock: 37,
    rating: 4.7,
    reviewCount: 543,
    featured: false,
    tags: ["sunglasses", "classic", "premium"]
  },
  {
    id: "prod_018",
    name: "Kindle Paperwhite 5",
    category: "electronics",
    price: 139.99,
    originalPrice: 139.99,
    images: ["https://placehold.co/400x400/1a1a2e/ffffff?text=Kindle+Paperwhite"],
    description: "The thinnest, lightest Paperwhite yet, with 6.8-inch display, adjustable warm light, and weeks of battery life. Now with faster page turns.",
    specs: { display: "6.8-inch", resolution: "300 PPI", storage: "8GB", battery: "10 weeks", waterproof: "IPX8" },
    stock: 93,
    rating: 4.8,
    reviewCount: 1678,
    featured: false,
    tags: ["ereader", "kindle", "amazon"]
  },
  {
    id: "prod_019",
    name: "Weber Spirit II E-310 Grill",
    category: "home",
    price: 549.00,
    originalPrice: 549.00,
    images: ["https://placehold.co/400x400/0f3460/ffffff?text=Weber+Grill"],
    description: "3-burner propane gas grill with GS4 grilling system. 529 sq in total cooking area. Porcelain-enameled cast-iron grates.",
    specs: { burners: "3", area: "529 sq in", BTU: "30,000 per hour", fuel: "Propane" },
    stock: 7,
    rating: 4.6,
    reviewCount: 289,
    featured: false,
    tags: ["grill", "outdoor", "bbq"]
  },
  {
    id: "prod_020",
    name: "Canon EOS R50 Camera",
    category: "electronics",
    price: 679.99,
    originalPrice: 799.99,
    images: ["https://placehold.co/400x400/1a1a2e/ffffff?text=Canon+EOS+R50"],
    description: "Compact mirrorless camera with 24.2MP APS-C sensor, 4K video, Dual Pixel CMOS AF II, and in-camera content creation features.",
    specs: { sensor: "24.2MP APS-C CMOS", video: "4K UHD", autofocus: "Dual Pixel CMOS AF II", weight: "375g" },
    stock: 18,
    rating: 4.7,
    reviewCount: 134,
    featured: true,
    tags: ["camera", "mirrorless", "photography"]
  }
];

const categories = [
  { id: "cat_001", name: "Electronics", slug: "electronics", description: "Gadgets, devices, and tech essentials", icon: "💻" },
  { id: "cat_002", name: "Apparel", slug: "apparel", description: "Clothing, footwear, and accessories", icon: "👕" },
  { id: "cat_003", name: "Home & Garden", slug: "home", description: "Furniture, appliances, and home goods", icon: "🏠" },
  { id: "cat_004", name: "Deals", slug: "deals", description: "Limited-time offers and discounts", icon: "🏷️" }
];

const users = [
  { id: "user_001", email: "john@example.com", password: "password123", firstName: "John", lastName: "Doe", address: { street: "123 Main St", city: "San Francisco", state: "CA", zip: "94102", country: "USA" }, createdAt: "2024-01-15T10:00:00Z" },
  { id: "user_002", email: "jane@example.com", password: "password123", firstName: "Jane", lastName: "Smith", address: { street: "456 Oak Ave", city: "New York", state: "NY", zip: "10001", country: "USA" }, createdAt: "2024-02-20T14:30:00Z" },
  { id: "user_003", email: "test@test.com", password: "test123", firstName: "Test", lastName: "User", address: { street: "789 Test Blvd", city: "Austin", state: "TX", zip: "78701", country: "USA" }, createdAt: "2024-03-10T09:15:00Z" }
];

const reviews = [
  { id: "rev_001", productId: "prod_001", userId: "user_001", rating: 5, title: "Best headphones I've owned", body: "Incredible noise canceling, very comfortable for long sessions.", createdAt: "2024-06-01T10:00:00Z" },
  { id: "rev_002", productId: "prod_001", userId: "user_002", rating: 4, title: "Great but pricey", body: "Sound quality is top notch but the price is steep.", createdAt: "2024-06-05T12:00:00Z" },
  { id: "rev_003", productId: "prod_002", userId: "user_003", rating: 5, title: "Worth every penny", body: "The M3 Pro chip is blazing fast. Screen is gorgeous.", createdAt: "2024-06-10T09:00:00Z" },
  { id: "rev_004", productId: "prod_006", userId: "user_001", rating: 4, title: "Comfortable and stylish", body: "Great everyday shoe. Very comfortable right out of the box.", createdAt: "2024-06-12T15:00:00Z" },
  { id: "rev_005", productId: "prod_011", userId: "user_002", rating: 5, title: "Game changer for cleaning", body: "The laser detection is wild. You can see all the dust it picks up.", createdAt: "2024-06-15T11:00:00Z" },
  { id: "rev_006", productId: "prod_012", userId: "user_003", rating: 5, title: "Best kitchen appliance", body: "Use it every week. So many functions in one device.", createdAt: "2024-06-20T16:00:00Z" }
];

const orders = [
  {
    id: "ord_001", userId: "user_001",
    items: [{ productId: "prod_001", name: "Sony WH-1000XM5 Headphones", quantity: 1, unitPrice: 349.99 }, { productId: "prod_004", name: "Logitech MX Master 3S Mouse", quantity: 1, unitPrice: 99.99 }],
    subtotal: 449.98, tax: 36.00, shipping: 0, total: 485.98,
    status: "delivered",
    shippingAddress: { street: "123 Main St", city: "San Francisco", state: "CA", zip: "94102" },
    createdAt: "2024-05-10T10:00:00Z",
    timeline: [
      { status: "pending", timestamp: "2024-05-10T10:00:00Z", message: "Order placed" },
      { status: "processing", timestamp: "2024-05-10T14:00:00Z", message: "Payment confirmed" },
      { status: "shipped", timestamp: "2024-05-11T09:00:00Z", message: "Shipped via FedEx — tracking #FX123456" },
      { status: "delivered", timestamp: "2024-05-13T15:00:00Z", message: "Delivered to front door" }
    ]
  },
  {
    id: "ord_002", userId: "user_001",
    items: [{ productId: "prod_006", name: "Nike Air Max 270", quantity: 1, unitPrice: 150.00 }],
    subtotal: 150.00, tax: 12.00, shipping: 8.99, total: 170.99,
    status: "shipped",
    shippingAddress: { street: "123 Main St", city: "San Francisco", state: "CA", zip: "94102" },
    createdAt: "2024-06-01T08:00:00Z",
    timeline: [
      { status: "pending", timestamp: "2024-06-01T08:00:00Z", message: "Order placed" },
      { status: "processing", timestamp: "2024-06-01T12:00:00Z", message: "Payment confirmed" },
      { status: "shipped", timestamp: "2024-06-02T10:00:00Z", message: "Shipped via UPS — tracking #UP789012" }
    ]
  },
  {
    id: "ord_003", userId: "user_002",
    items: [{ productId: "prod_012", name: "Instant Pot Duo 7-in-1", quantity: 2, unitPrice: 89.99 }],
    subtotal: 179.98, tax: 14.40, shipping: 0, total: 194.38,
    status: "processing",
    shippingAddress: { street: "456 Oak Ave", city: "New York", state: "NY", zip: "10001" },
    createdAt: "2024-06-14T11:00:00Z",
    timeline: [
      { status: "pending", timestamp: "2024-06-14T11:00:00Z", message: "Order placed" },
      { status: "processing", timestamp: "2024-06-14T13:00:00Z", message: "Payment confirmed, preparing shipment" }
    ]
  },
  {
    id: "ord_004", userId: "user_003",
    items: [{ productId: "prod_002", name: "Apple MacBook Pro 14\"", quantity: 1, unitPrice: 1999.99 }],
    subtotal: 1999.99, tax: 160.00, shipping: 0, total: 2159.99,
    status: "pending",
    shippingAddress: { street: "789 Test Blvd", city: "Austin", state: "TX", zip: "78701" },
    createdAt: "2024-06-15T16:00:00Z",
    timeline: [
      { status: "pending", timestamp: "2024-06-15T16:00:00Z", message: "Order placed — awaiting payment" }
    ]
  },
  {
    id: "ord_005", userId: "user_001",
    items: [{ productId: "prod_008", name: "Patagonia Nano Puff Jacket", quantity: 1, unitPrice: 279.00 }, { productId: "prod_016", name: "JBL Flip 6 Speaker", quantity: 1, unitPrice: 129.95 }],
    subtotal: 408.95, tax: 32.72, shipping: 0, total: 441.67,
    status: "cancelled",
    shippingAddress: { street: "123 Main St", city: "San Francisco", state: "CA", zip: "94102" },
    createdAt: "2024-04-20T09:00:00Z",
    timeline: [
      { status: "pending", timestamp: "2024-04-20T09:00:00Z", message: "Order placed" },
      { status: "cancelled", timestamp: "2024-04-20T11:00:00Z", message: "Cancelled by customer" }
    ]
  }
];

module.exports = { products, categories, users, reviews, orders };

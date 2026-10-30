import type { Product, ProductCategory, StoreSettings, FaqItem } from "@/types";

// Source-of-truth product catalogue, mirroring the Stitch designs.
export const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "chocolate-truffle-cake",
    name: "Chocolate Truffle Cake",
    description:
      "Pure Belgian single-origin ganache with light cocoa crumb. A velvety, not-overly-sweet truffle layered with silky dark chocolate ganache and finished with cocoa crumble.",
    price: 599,
    category: "Cakes",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCPalD3fg6shekTmqWjf_jKoqs2apLrAisGz_aY0iuPNnOVGUhxh-LGpxRXeNoqeE7OXtMu3dkA3LGDPVrbHTUWmUMV74OSHnsqlJiD1lYLPyydNlyHvdTk_TW7kC3FH8sE7as508xF5Vz885Vi_684yRFLZQwGhveGObmWVk56RUZEFJ2SyFDwhP5_TWor0mr2HAV2ZEEz1027XEnUA3NOdowfqPZ1nl23T6V4A698",
    ],
    dietary: ["Eggless", "Vegetarian"],
    allergens: ["Gluten", "Dairy", "Soy", "Tree Nuts"],
    ingredients: ["Belgian cocoa", "cultured butter", "heirloom flour", "cocoa crumble", "ganache"],
    storage: "Keep refrigerated. Bring to room temperature 15 minutes before serving.",
    available: true,
    stock: 40,
    featured: true,
    bestseller: true,
    rating: 4.9,
    reviewCount: 340,
    weight: "500 g",
    variants: [
      { id: "p1-v1", label: "500 g", price: 599, stock: 40 },
      { id: "p1-v2", label: "1 kg", price: 1049, stock: 25 },
    ],
  },
  {
    id: "p2",
    slug: "red-velvet-cake",
    name: "Red Velvet Cake",
    description:
      "Classic cream cheese swirl with hints of madagascar vanilla. Moist crimson velvet sponge layered with whipped cream cheese frosting.",
    price: 649,
    category: "Cakes",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdjU3qT3p1Pdmf_ytS7VCft0Z9YuGVUGncihAEF-XIsEBv6AxIDx1u-pJ8jEI3MJuK3Y5pgPpzGjn_D8uM7L0htYvRYfm6eIpsxaM4lm7evQmBvfwkLL9VxuYPz33CCnT4ay-0u8TxlsA23QeYIpi9nYwvUlky5201A-8Gj_dngJ7JXLH4mCtZfUOU4XG4VL9X_uBqRkzxbxAGXQGYahCydi1ei0ZRJ7Bb6Gy6Ol78",
    ],
    dietary: ["Eggless", "Vegetarian"],
    allergens: ["Gluten", "Dairy"],
    ingredients: ["red velvet sponge", "cream cheese", "madagascar vanilla", "cultured butter"],
    storage: "Keep refrigerated until 30 minutes before serving.",
    available: true,
    stock: 32,
    featured: true,
    bestseller: true,
    rating: 4.8,
    reviewCount: 215,
    weight: "500 g",
    variants: [
      { id: "p2-v1", label: "500 g", price: 649, stock: 32 },
      { id: "p2-v2", label: "1 kg", price: 1199, stock: 18 },
    ],
  },
  {
    id: "p3",
    slug: "blueberry-cheesecake",
    name: "Blueberry Cheesecake",
    description:
      "Creamy Philadelphia cheese layer with tart blueberry compote over a buttery graham cracker crust. A chilled New York style bake.",
    price: 699,
    category: "Desserts",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGYbwmiUp8wXnMIgqBt6e7d23H0IiUiKXvotmroBQv9_3HrBpXMKDeonE4Z06I5-F5eucMnyEnRXj81y7lBKtfRh1XMdCmXqZ2vt28oBpzJ4fvAfpM1Rjjw50Tel6vi1qg7_FRDEJ07trwOHYUFLI_8qw8ChKCKjZSRAFbNlh38Kd84FHy-hQ44mJxCx6Sc73_B7byMyVgnou__m7lq--ViOM-c6gDj0cfDp87VCp_",
    ],
    dietary: ["Vegetarian", "Chilled Patisserie"],
    allergens: ["Gluten", "Dairy", "Egg"],
    ingredients: ["Philadelphia cheese", "blueberry compote", "graham cracker", "cream"],
    storage: "Store in a chiller. Serve within 4 hours of dispatch.",
    available: true,
    stock: 28,
    featured: true,
    bestseller: true,
    rating: 4.9,
    reviewCount: 180,
    weight: "Whole cake, 1.2 kg",
  },
  {
    id: "p4",
    slug: "classic-black-forest",
    name: "Classic Black Forest",
    description:
      "Maraschino cherries, dark chocolate curls, and light cream over layered chocolate sponge. A timeless gateau.",
    price: 549,
    category: "Cakes",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBCZU9i4SaEpK9-ffJfHXZc6wAtiKSNbhQg1ngUWR_BatQI7-1az3m7_Ckg-OV-tetpVWzVKwaqZc4xmv-_0Uj7nYlTHxZ32GnOqvnAg9R_GAlKWAyP-H9JoVtdw-2qwdcM1NCDWl9TrnIcgkp8da9lYFUJ7nzaC6DZoRb2bzrY9xvtRRgH0TzJgP2oSBcvF6dWGJiVXDLemAyd3_A2nj6Bts8ZC-7LeJ42aS1uTQMr",
    ],
    dietary: ["Vegetarian"],
    allergens: ["Gluten", "Dairy", "Egg", "Tree Nuts"],
    ingredients: ["chocolate sponge", "maraschino cherry", "chantilly cream", "dark chocolate"],
    storage: "Keep refrigerated.",
    available: true,
    stock: 35,
    featured: true,
    bestseller: true,
    rating: 4.7,
    reviewCount: 195,
    weight: "500 g",
  },
  {
    id: "p5",
    slug: "french-butter-croissant",
    name: "French Butter Croissant",
    description:
      "Golden, flaked layers of pure French AOP butter with a delicate honeycomb lamination. Baked fresh in the morning drop.",
    price: 110,
    category: "Breads",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC-DSTrGXtESETbIaKvnjSHi80IS0XxGXBCpJewVdB9XMiIRd67EEZuhknJZ-GCskMexOtktCdv-2jT4LyLg2lRijxh6UfhrvIE30QgEitmgNk-6h6pS1lQUjAkywhX4i_8c3xFihrlB9vo-aIsMySmkBl3V4J8k91Cfiaha1nUFB3ABSVfsJ_M3TbAWeTDCmtxv5Raia_dWZcQYTftklPTRPvkzCOGz41EzwCZPTj4",
    ],
    dietary: ["Vegetarian", "Eggless"],
    allergens: ["Gluten", "Dairy"],
    ingredients: ["French AOP butter", "heirloom flour", "yeast", "sea salt"],
    storage: "Best enjoyed same day. Warm gently for 30 seconds.",
    available: true,
    stock: 120,
    featured: true,
    bestseller: true,
    rating: 4.9,
    reviewCount: 512,
    weight: "1 pc",
  },
  {
    id: "p6",
    slug: "garlic-pull-apart-bread",
    name: "Garlic Pull-Apart Bread",
    description:
      "Confited garlic and rosemary folded into a soft artisan loaf, glistening with melted herb butter. Made to pull apart and share.",
    price: 120,
    category: "Breads",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAsvmrIrxEwCt2vr7cS4XpvpvXqIF_nzBU6jBuM-mE2OQ9iVfloF4PjZ6Jn5Q4rQSCUlhw_LG1_sAK7huSDcW-aB5LqcKzDRmT1xx4rWTdgGKXW6kJjilMogy9tM_VF9X7eZZsuR_X9fNtuO8sM_c7Ge_SQGGkpvffNEvfOs3sbae_zQVIVrmbHM6nTMl4NvIcEaSGeCzxyS7vULhEF1nB-imqt43_eyuSuugRBUeTw",
    ],
    dietary: ["Eggless", "Vegetarian"],
    allergens: ["Gluten", "Dairy"],
    ingredients: ["confit garlic", "rosemary", "herb butter", "heirloom flour"],
    storage: "Reheat at 150C for 5 minutes to restore warmth.",
    available: true,
    stock: 80,
    featured: true,
    bestseller: false,
    rating: 4.7,
    reviewCount: 143,
    weight: "300 g",
  },
  {
    id: "p7",
    slug: "fudgy-walnut-brownie",
    name: "Fudgy Walnut Brownie",
    description:
      "Thick, fudgy 70% Callebaut brownie with a crackly papery crust and toasted walnut pieces. Dense and rich.",
    price: 140,
    category: "Desserts",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBHu1y0yKcbcvaQO0r_-z37WJRMa5gm46rSH-26z5Em5-uHcnzAYIuBM-G3QXIyz4YkSwqULR7mvMk6d3GSPVWndpQwO02P_3w-MTokzJnYrPmsQXckxcFzq2IUzEY9IQXsT5Dj2y5Sv_pBTkSQQ09Bci6HXS3JqlCUuJv-VVcy9kLeNQuu2oRLKab6EU9WSrnd0wDhmH7PpdDPG6jnd3OlvpmWrIG5BlC7_1IPxWUm",
    ],
    dietary: ["Vegetarian"],
    allergens: ["Gluten", "Dairy", "Egg", "Tree Nuts"],
    ingredients: ["70% Callebaut chocolate", "walnut", "cultured butter", "heirloom flour"],
    storage: "Store airtight at room temperature. Best within 2 days.",
    available: true,
    stock: 90,
    featured: true,
    bestseller: false,
    rating: 4.8,
    reviewCount: 267,
    weight: "1 pc",
  },
  {
    id: "p8",
    slug: "sea-salt-chocochip-box",
    name: "Sea Salt Choco-Chip Box",
    description:
      "Chunky golden sea salt chocolate chip cookies, a box of four baked fresh. Crisp edges with a gooey center.",
    price: 150,
    category: "Cookies",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9rH5bM3n_AnLBug4-5VerxmIhRiZRcjMHB20yBVXw_hIuSqBcG3Qe2DD5tWga-A00Vs_s7IEukFgMfsbwXZBDdGHjhk2GdZG8byH46Y02hX6TJm0R5N6MHvCZIuokjQ2S2fEEXoHbpF_1Z1dhN7YJQXGG-2tdCa5Cl0XudrYJfxD0KM6P1zhnNYU3_iAAC1zW0kcabcjcLI40Tx67EXyIbkRprd_6W_aVv6dwyceD",
    ],
    dietary: ["Vegetarian", "Eggless"],
    allergens: ["Gluten", "Dairy"],
    ingredients: ["cultured butter", "Belgian chocolate", "sea salt", "heirloom flour"],
    storage: "Airtight tin, up to 5 days. Fresh from the 4 PM drop.",
    available: true,
    stock: 150,
    featured: true,
    bestseller: true,
    rating: 4.9,
    reviewCount: 401,
    weight: "Box of 4",
  },
  {
    id: "p9",
    slug: "pineapple-pastry",
    name: "Pineapple Pastry",
    description:
      "Classic light sponge layered with fresh vanilla diplomat cream and roasted caramelized pineapple compote, decorated with white chocolate curls.",
    price: 240,
    category: "Pastries",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDc32tc_iiDVfNW4IFRH_db-6k1yBVzoI-aEHZ6BuxhslUW7PvX7_aaoyVPLoktCgo613TaiIuUwVDQ5bV60gAnoq323jXRDhVLRHTLKZfEG_YWymaFJjtZdnVBuNAI-Yn5hezVdndIavO7_1RRGx60fDvxSDHufs3cm8byoGlIyNV4Kld78pf1mEYJQ4-eKwe-j66kY5QDUdLK0CUqQxX9vEtpbezPnbMKcX-io5iE",
    ],
    dietary: ["Vegetarian"],
    allergens: ["Gluten", "Dairy", "Egg"],
    ingredients: ["light sponge", "diplomat cream", "caramelized pineapple", "white chocolate"],
    storage: "Chilled. Serve within 4 hours of dispatch.",
    available: true,
    stock: 60,
    featured: true,
    bestseller: false,
    rating: 4.7,
    reviewCount: 98,
    weight: "Pack of 2",
  },
  {
    id: "p10",
    slug: "tiramisu-jar",
    name: "Espresso Tiramisu Jar",
    description:
      "Layers of espresso-soaked ladyfingers and mascarpone tiramisu, dusted with fine cocoa powder, in a handcrafted dessert jar.",
    price: 280,
    category: "Desserts",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCf0kEoLLRHZ_7rmPZX5GoqTxVxPGhu8v-w0JrcUiXQGNIFX6uic1X0ELnYwXngf_LYmn-_o7Zhmzup3gNvkir2ukqARFt4o-OnhWSKpTSdz7g1F7jI7iwnXYPOUAwvq7mDBdXLBYDSIyfj3ErFWoexfc5Y_MqL54Qp-scNSWF9_-YXArUtzyqIzAxRJJuIdrkq-DzRskXAXY_VqZ1X-j2icsOdz5IB-BBqfodLa7Ue",
    ],
    dietary: ["Vegetarian"],
    allergens: ["Gluten", "Dairy", "Egg"],
    ingredients: ["mascarpone", "espresso", "ladyfinger", "cocoa powder"],
    storage: "Chilled. Best served cold within 4 hours.",
    available: true,
    stock: 45,
    featured: true,
    bestseller: false,
    rating: 4.8,
    reviewCount: 76,
    weight: "300 ml jar",
  },
];

export const CATEGORIES: { name: ProductCategory; description: string; image: string }[] = [
  {
    name: "Cakes",
    description: "Tiers & Cheesecakes",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD17tB__ZxvnbwvtWPD3ifuAGuPrD5fIOh4LqSok7crT34W3L1k1o0pxxrUz7EyuMMY1VSeq5wvL-N9lw1_OCTx130UtzJzwxWMEnyZ1io0aa6Y7QVhMlGrUI65GwMZp2rq5JbQyARpYzqX7tl8GJDmQBBPUtxDmXMYSc9kvXqbJOnCdPhghLpRMadD3gyPyGNu6rWmmaElIcApnRHplUjnGGheOj28ijEW9VZsLk5I",
  },
  {
    name: "Pastries",
    description: "Éclairs & Fruit Tarts",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDCWELDhZxHU4wYXsN4Z6M-p500gCvCwGQ74Vj31tHlB9LeKi18J4Dmtna_a5t2Ubcm4vgXVUVgn0MKJEqjDe3KF7gNVDl-tFOfgSXNqgkjWa0fdf7W7OeDr3UkKou-ttAw-2GE1PMeCUTacsG9ikZVE_KFXpc2Sfeoc4vek9RMe-mCHY9UgNxsux8wY3RAgSQzunZEyqihCO2TC833k4-6TUSEtIEU2eoswV5q5wh5",
  },
  {
    name: "Cookies",
    description: "Sables & Choco Chunk",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDqUzhEc4MpX9vNpA96jXKyFHwQDl4HpfG9m3wVRSfmeP7Bt1zSfKr7GdBOkKk7gfDfkI_WMVyEiDU7gukyn-ANsqND6Y4H642cqHDTjjyUwfYwT_Rij-T1-_v3yNPLN0CMCO-iYdF32A54Fk3cMSSum1K4p4aNLZwGyEvaQu24gW8Uyrazfxp5-O5JeGVfiEitBGqkVwfFExUgLAWueJ5sW2kpGULjKEYZum8twu85",
  },
  {
    name: "Breads",
    description: "Sourdough & Brioche",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAg_AlxRr5vjShKqC12-dfZHNh-86y615vYPW0DOJ_bjO3LECKeGaiyr0IqeRFLylkm5PNQnse2lh_0ngG7vnyUZX0ALD2PT0K4TEWSjoZUhsPvr9XYXYIrud7vX3Up6cFcmKfnatnpveaQnBuHqx8lufsz1HazArjIOFjzblioNeYySDM7Um-xTCfckLHXwvzmdoybYx1A_DTD1c-3VQDxUcymasgaGEQjVEYDfYPO",
  },
  {
    name: "Desserts",
    description: "Mousse Jars & Brownies",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCf0kEoLLRHZ_7rmPZX5GoqTxVxPGhu8v-w0JrcUiXQGNIFX6uic1X0ELnYwXngf_LYmn-_o7Zhmzup3gNvkir2ukqARFt4o-OnhWSKpTSdz7g1F7jI7iwnXYPOUAwvq7mDBdXLBYDSIyfj3ErFWoexfc5Y_MqL54Qp-scNSWF9_-YXArUtzyqIzAxRJJuIdrkq-DzRskXAXY_VqZ1X-j2icsOdz5IB-BBqfodLa7Ue",
  },
  {
    name: "Custom",
    description: "Themed & Tiered Art",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDZdUUkd-B_qIMVlS3e9-t9kvJ7pkCpFj0j-Jac1JS7vvdW3G11GT7SJfAwaX0uB51SRISDL-_9XfidXRxyQyuCmzacZIhd1PWpYpTxqziNXSdqUE7TNozk08mFhunjzbM00tEn_Zlc8PFH5CRb_aGnCiS3w9y0tH57iJRrlxMaGsO2Ch315ZIA7KBTNMDZCkcbgWsUkSG1GfdZNIntbFV9uPWLbZV32aex7oZrQcWw",
  },
];

// Placeholder business details — clearly editable, per the brief's instruction
// not to invent real business contact data.
export const STORE_SETTINGS: StoreSettings = {
  deliveryFee: 50,
  freeDeliveryThreshold: 1500,
  phone: "[Your bakery phone number]",
  email: "hello@[yourdomain].com",
  address: "[Boutique address — Freeganj, Ujjain]",
  openingHours: "8:00 AM – 10:00 PM Daily",
  bakeDropTimes: "Fresh Bake Drops: 9:00 AM & 4:00 PM",
};

export const FAQS: FaqItem[] = [
  {
    question: "How far in advance should I order a custom cake?",
    answer:
      "For bespoke tiered and themed cakes, we recommend 7–10 days so our pâtissiers can craft your design. For same-day signature cakes, call us and we will confirm availability.",
  },
  {
    question: "Do you offer eggless and vegan options?",
    answer:
      "Yes. Our signature cakes, red velvet and several daily bakes are available eggless. We label every product clearly. Ask your concierge for our current eggless and vegan list.",
  },
  {
    question: "How does delivery and payment work?",
    answer:
      "There is no advance online payment. After you place a request, our master patissier calls or WhatsApps within 30 minutes to confirm your slot and payment — Cash on Delivery or UPI upon delivery.",
  },
  {
    question: "Where do you deliver?",
    answer:
      "We deliver city-wide via refrigerated vans. Refrigerated doorstep delivery is complimentary on orders above the free-delivery threshold; a small courier fee applies below it.",
  },
  {
    question: "Can I customise the cake message?",
    answer:
      "Absolutely. Add your preferred message during checkout, or mention it in the baker's special instructions and your concierge will confirm the wording with you.",
  },
  {
    question: "What if my cake arrives in poor condition?",
    answer:
      "If texture or taste is not exceptional, we replace it instantly — our 100% satisfaction guarantee. Please photograph the item and contact us right away.",
  },
];
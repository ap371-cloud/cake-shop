export type ProductCategory =
  | "Cakes"
  | "Pastries"
  | "Cookies"
  | "Breads"
  | "Desserts"
  | "Custom";

export type DietaryTag = "Eggless" | "Contains Egg" | "Vegan" | "Vegetarian" | "Chilled Patisserie";

export type ProductVariant = {
  id: string;
  label: string;
  price: number;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  images: string[];
  dietary: DietaryTag[];
  allergens: string[];
  ingredients: string[];
  storage: string;
  available: boolean;
  stock: number;
  variants?: ProductVariant[];
  featured: boolean;
  bestseller: boolean;
  rating?: number;
  reviewCount?: number;
  weight?: string;
  occasion?: string;
};

export type CartItem = {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "baking"
  | "dispatched"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  deliveryMethod: "delivery" | "pickup";
  deliveryDate: string;
  deliverySlot: string;
  deliveryNotes?: string;
  paymentMethod: "cash_on_delivery" | "upi_on_delivery";
  items: { name: string; price: number; quantity: number; variant?: string }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; at: string; note?: string }[];
  createdAt: string;
  updatedAt: string;
};

export type CustomCakeRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  flavour: string;
  size: string;
  shape: string;
  occasion: string;
  designDescription: string;
  preferredDate: string;
  budgetRange: string;
  referenceImageUrl?: string;
  status: "new" | "reviewing" | "quoted" | "accepted" | "declined";
  createdAt: string;
};

export type UserProfile = {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: "customer" | "admin";
};

export type StoreSettings = {
  deliveryFee: number;
  freeDeliveryThreshold: number;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  bakeDropTimes: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};
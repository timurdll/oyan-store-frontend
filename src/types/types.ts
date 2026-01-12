// src/types.ts

export interface User {
  id: number;
  email: string;
  password: string;
  role: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  profileImage?: string;
  phoneNumber?: string;
  basket?: Basket;
  ratings: Rating[];
  favorites: Favorite[];
  orders: Order[];
  bonuses: number;
  holdingBonuses: number;
  notifications: Notification[];
  preOrders: PreOrder[];
}

export interface Basket {
  id: number;
  user_id: number;
  user: User;
  products: BasketProduct[];
}

export interface BasketProduct {
  id: number;
  basket_id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

export interface Product {
  id: number;
  name: string;
  originalName?: string; // Оригинальное название на русском языке
  price: number;
  rating?: number;
  cover_image: string;
  images: string[];
  typeId: number;
  stock: number;
  type: Type;
  basketProducts: BasketProduct[];
  productInfo?: ProductInfo;
  ratings: Rating[];
  favorites: Favorite[];
  productCharacteristics: ProductCharacteristic[];
  translations?: ProductTranslation[];

  // Новые поля для ссылок на маркетплейсы
  halyqLink?: string;
  kaspiLink?: string;
  satuLink?: string;
  driverLink?: string;
}

export interface ProductInfo {
  id: number;
  product_id: number;
  product: Product;
  title: string;
  description: string;
  translations?: ProductInfoTranslation[];
}

export interface ProductTranslation {
  id: number;
  productId: number;
  language: string;
  name: string;
}

export interface ProductInfoTranslation {
  id: number;
  productInfoId: number;
  language: string;
  title: string;
  description: string;
}

export interface Rating {
  id: number;
  user_id: number;
  product_id: number;
  user: User;
  product: Product;
  rate: number;
}

export interface Type {
  id: number;
  name: string;
  products: Product[];
  characteristics: Characteristic[];
}

export interface Characteristic {
  id: number;
  name: string;
  typeId: number;
  type: Type;
  productCharacteristics: ProductCharacteristic[];
}

export interface ProductCharacteristic {
  id: number;
  description: string;
  characteristic: {
    id: number;
    name: string;
    translation?: {
      name: string;
    };
  };
  translation?: {
    description: string;
  };
}

export interface Favorite {
  id: number;
  user_id: number;
  product_id: number;
  user: User;
  product: Product;
}

export interface Order {
  id: number;
  userId: number;
  user: User;
  status: OrderStatus;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  products: OrderProduct[];
  phoneNumber: string;
}

export interface OrderProduct {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  order: Order;
  product: Product;
}

export enum OrderStatus {
  PENDING = "PENDING", // Ожидает обработки
  CONFIRMED = "CONFIRMED", // Подтвержден менеджером
  PAID = "PAID", // Оплачен
  COMPLETED = "COMPLETED", // Завершен
  CANCELED = "CANCELED", // Отменен
}

export interface PreOrder {
  id: number;
  userId: number;
  productId: number;
  user: User;
  product: Product;
  createdAt: Date;
}

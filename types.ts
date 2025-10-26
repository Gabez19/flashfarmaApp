export type Role = 'cliente' | 'entregador' | 'adm' | 'farmaceutico';

export interface UserBase {
  id: string;
  name: string;
  role: Role;
}

export interface Cliente extends UserBase {
  cpf: string;
  phone?: string;
  address?: string;
}

export interface Entregador extends UserBase {
  cpf: string;
  vehicleType: string;
  plate: string;
}

export interface Farmacia {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  phone?: string;
  admUserId: string; // id do adm
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  farmaciaId: string;
  stock: number;
  category?: string;
  discount?: number; // ex: 0.2 = 20%
}

export type OrderStatus =
  | 'novo'
  | 'analise'
  | 'preparo'
  | 'pronto_envio'
  | 'rota'
  | 'entregue'
  | 'cancelado';

export interface OrderItem {
  productId: string;
  qty: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  code: string; // código visível ao cliente
  clientId: string;
  farmaciaId: string;
  items: OrderItem[];
  deliveryFee: number;
  status: OrderStatus;
  total: number;
  assignedTo?: string; // entregador id
}

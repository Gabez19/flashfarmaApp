import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { CartItem } from './CartContext'; // Importando a tipagem de CartItem

// --- 1. Tipagens para o Pedido ---

// O Pedido completo
export type Order = {
  id: string;
  status: 'Aguardando aceitação' | 'Farmácia aceitou' | 'Em preparo' | 'Em entrega' | 'Entregue' | 'Cancelado';
  items: CartItem[];
  subtotal: number;
  frete: number;
  total: number;
  paymentMethod: string;
  address: string;
  createdAt: string; // Data no formato string (ex: ISO string)
  is_active: boolean;
};

// Dados necessários para criar um pedido a partir do carrinho
type OrderCreationData = {
  paymentMethod: string;
  address: string;
  freteValue: number;
};

// Tipagem para o Contexto
type OrdersContextType = {
  orders: Order[];
  // Função que CRIA e PERSISTE o pedido (a regra: "só vai existir pedido se foi feito")
  createOrderFromCart: (cart: CartItem[], orderData: OrderCreationData) => string;
  // Função para buscar um pedido por ID (usada na tela de detalhes)
  getOrderById: (id: string) => Order | undefined;
  // (Opcional) Função para atualizar o status (para simulação ou backend)
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
};

// Criação do Contexto
const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

// --- 2. Provedor de Pedidos ---

// Função auxiliar para gerar um ID único
const generateUniqueId = () => Math.random().toString(36).substring(2, 10).toUpperCase();

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  // 1. Cria o Pedido (Regra de Negócio)
  const createOrderFromCart = useCallback((
    cart: CartItem[], 
    { paymentMethod, address, freteValue }: OrderCreationData
  ): string => {
    if (cart.length === 0) {
      throw new Error("Não é possível criar um pedido com o carrinho vazio.");
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalPagar = subtotal + freteValue;

    const newOrder: Order = {
      id: generateUniqueId(),
      items: cart.map(item => ({ 
        id: item.id, 
        name: item.name, 
        qty: item.qty, 
        price: item.price,
        image: item.image // Mantém a imagem, se existir
      })),
      address: address,
      subtotal: subtotal,
      frete: freteValue,
      total: totalPagar,
      paymentMethod: paymentMethod,
      status: 'Aguardando aceitação', // Status inicial após a finalização da compra
      is_active: true,
      createdAt: new Date().toISOString(),
    };

    // Persiste o novo pedido no estado
    setOrders(prev => [newOrder, ...prev]);
    return newOrder.id;
  }, []);
  
  // 2. Busca Pedido por ID
  const getOrderById = useCallback((id: string) => {
    return orders.find(order => order.id === id);
  }, [orders]);

  // 3. Atualiza Status
  const updateOrderStatus = useCallback((orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  }, []);
  
  const contextValue = useMemo(() => ({ 
      orders, 
      createOrderFromCart, 
      getOrderById, 
      updateOrderStatus 
  }), [orders, createOrderFromCart, getOrderById, updateOrderStatus]);

  return (
    <OrdersContext.Provider value={contextValue}>
      {children}
    </OrdersContext.Provider>
  );
}

// --- 3. Hook Customizado ---

export function useOrders(): OrdersContextType {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }

  return context;
}
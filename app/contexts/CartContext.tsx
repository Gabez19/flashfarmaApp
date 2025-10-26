import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

// --- Tipagens ---

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
};

type CartContextType = {
  cart: CartItem[];
  total: number;
  add: (item: CartItem) => void;
  remove: (itemId: string) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  clear: () => void; // <--- ALTERADO: De 'clearCart' para 'clear'
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// --- Provedor do Contexto ---

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Calcula o total
  const total = useMemo(() => 
    cart.reduce((sum, item) => sum + item.price * item.qty, 0), 
    [cart]
  );

  // Adiciona item ao carrinho (ou incrementa a quantidade se já existir)
  const add = useCallback((item: CartItem) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(i => i.id === item.id);
      
      if (existingItemIndex > -1) {
        // Item existe: incrementa a quantidade
        return prevCart.map((i, index) => 
          index === existingItemIndex ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        // Item novo: adiciona ao carrinho
        return [...prevCart, { ...item, qty: 1 }];
      }
    });
  }, []);

  // Remove item ou diminui quantidade
  const remove = useCallback((itemId: string) => {
    setCart(prevCart => {
      const item = prevCart.find(i => i.id === itemId);

      if (item && item.qty > 1) {
        // Diminui a quantidade
        return prevCart.map(i => 
          i.id === itemId ? { ...i, qty: i.qty - 1 } : i
        );
      } else {
        // Remove totalmente (qty é 1 ou menos)
        return prevCart.filter(i => i.id !== itemId);
      }
    });
  }, []);

  // Atualiza quantidade para um valor específico
  const updateQuantity = useCallback((itemId: string, newQty: number) => {
    setCart(prevCart => {
      if (newQty <= 0) {
        return prevCart.filter(i => i.id !== itemId);
      }
      return prevCart.map(i => 
        i.id === itemId ? { ...i, qty: newQty } : i
      );
    });
  }, []);
  
  // Limpa o carrinho
  const clear = useCallback(() => { // <--- ALTERADO: De 'clearCart' para 'clear'
    setCart([]);
  }, []);

  const contextValue = useMemo(() => ({
    cart,
    total,
    add,
    remove,
    updateQuantity,
    clear, // <--- ALTERADO: De 'clearCart' para 'clear'
  }), [cart, total, add, remove, updateQuantity, clear]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// --- Hook Customizado ---

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

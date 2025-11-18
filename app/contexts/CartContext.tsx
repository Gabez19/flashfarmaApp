import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

// ============================================================================
// TIPAGENS
// ============================================================================

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
  clear: () => void;
};

// ============================================================================
// CONTEXTO
// ============================================================================

const CartContext = createContext<CartContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // --------------------------------------------------------------------------
  // COMPUTED: Total do carrinho
  // --------------------------------------------------------------------------
  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  // --------------------------------------------------------------------------
  // ACTIONS: Manipulação do carrinho
  // --------------------------------------------------------------------------

  const add = useCallback((item: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((i) => i.id === item.id);

      if (existingItemIndex > -1) {
        return prevCart.map((i, index) =>
          index === existingItemIndex ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        return [...prevCart, { ...item, qty: 1 }];
      }
    });
  }, []);

  const remove = useCallback((itemId: string) => {
    setCart((prevCart) => prevCart.filter((i) => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, newQty: number) => {
    setCart((prevCart) => {
      if (newQty <= 0) {
        return prevCart.filter((i) => i.id !== itemId);
      }
      return prevCart.map((i) => (i.id === itemId ? { ...i, qty: newQty } : i));
    });
  }, []);

  const clear = useCallback(() => {
    setCart([]);
  }, []);

  // --------------------------------------------------------------------------
  // CONTEXT VALUE
  // --------------------------------------------------------------------------

  const contextValue = useMemo(
    () => ({
      cart,
      total,
      add,
      remove,
      updateQuantity,
      clear,
    }),
    [cart, total, add, remove, updateQuantity, clear]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// ============================================================================
// HOOK CUSTOMIZADO
// ============================================================================

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
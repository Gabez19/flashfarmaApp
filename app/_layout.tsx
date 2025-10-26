import { Stack } from 'expo-router';
import { CartProvider } from './contexts/CartContext';
import { OrdersProvider } from './contexts/OrdersContext'; // Importe o seu OrdersProvider

export default function RootLayout() {
  return (
    // Aninhamos os Provedores aqui, garantindo que QUALQUER tela
    // que use useCart ou useOrders tenha acesso aos dados.
    <OrdersProvider> 
      <CartProvider>
        {/* O componente Stack renderiza suas páginas (Home, OrderList, etc.) */}
        <Stack>
          {/* Defina suas rotas aqui, se necessário, ou deixe-o vazio para a configuração padrão */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="cliente/Orders/OrderList" options={{ title: 'Meus Pedidos' }} />
          {/* ... outras telas */}
        </Stack>
      </CartProvider>
    </OrdersProvider>
  );
}
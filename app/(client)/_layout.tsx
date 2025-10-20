import { Stack } from 'expo-router';
import React from 'react';

// Este layout é responsável por gerenciar a navegação entre todas as telas do cliente.
// Ele esconde a barra de navegação superior para as telas de tabs.
export default function ClientLayout() {
  return (
    <Stack>
      {/* Rota principal de abas, não mostra o header padrão aqui, pois o header é customizado dentro da Home (index.tsx) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Rota de detalhe de produto. */}
      <Stack.Screen name="product-detail" options={{ title: 'Detalhes do Produto' }} />

      {/* Rota de seleção do método de pagamento (checkout) */}
      <Stack.Screen name="payment-methods" options={{ title: 'Forma de Pagamento' }} />

      {/* Rota para o subgrupo do fluxo de acompanhamento de pedidos */}
      <Stack.Screen name="(order-flow)" options={{ headerShown: false }} />
    </Stack>
  );
}
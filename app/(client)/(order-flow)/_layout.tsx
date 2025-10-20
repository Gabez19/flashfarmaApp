import { Stack } from 'expo-router';
import React from 'react';

// Este Stack gerencia as rotas dentro do fluxo de acompanhamento de pedido.
export default function OrderFlowLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      {/* Tela de visualização dos detalhes do pedido ativo */}
      <Stack.Screen 
        name="order-details" 
        options={{ 
          title: 'Detalhes do Pedido', 
          headerBackTitle: 'Voltar',
        }} 
      />
      {/* Tela de confirmação e avaliação após a entrega */}
      <Stack.Screen 
        name="order-delivered" 
        options={{ 
          title: 'Avaliar Entrega', 
          // Ocultar o botão de voltar para forçar o usuário a ir para Home/Pedidos
          headerLeft: () => null, 
        }} 
      />
    </Stack>
  );
}
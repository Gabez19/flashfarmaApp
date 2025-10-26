import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
// Ícones do React Native
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// Importa o Hook do Contexto (Caminho corrigido)
import { useCart, CartItem } from '../contexts/CartContext'; 

// =======================================================
// MAPA DE IMAGENS: Necessário para carregar as imagens do JSON
// =======================================================
const ProductImages: { [key: string]: any } = {
  "assets/images/image_medicamento_1.webp": require('../../assets/images/image_medicamento_1.webp'),
  "assets/images/image_medicamento_2.webp": require('../../assets/images/image_medicamento_2.webp'),
  "assets/images/image_medicamento_3.webp": require('../../assets/images/image_medicamento_3.webp'),
  "assets/images/image_medicamento_4.webp": require('../../assets/images/image_medicamento_4.webp'),
  "assets/images/image_medicamento_5.webp": require('../../assets/images/image_medicamento_5.webp'),
  "assets/images/image_medicamento_6.webp": require('../../assets/images/image_medicamento_6.webp'),
};

// Componente para renderizar cada item do carrinho
const CartItemCard = ({ item }: { item: CartItem }) => {
  const { updateQuantity, remove } = useCart();

  const handleUpdate = (amount: number) => {
    // Garante que a quantidade mínima seja 0. O CartProvider remove se for <= 0.
    const newQty = item.qty + amount; 
    updateQuantity(item.id, newQty);
  };

  // Ajustado o path das imagens para corresponder à estrutura
  const imageSource = ProductImages[item.image || ''] || { uri: 'placeholder' };

  return (
    <View style={cartStyles.card}>
      {/* Imagem */}
      <View style={cartStyles.imageContainer}>
        <Image 
            source={imageSource} 
            style={cartStyles.image} 
            resizeMode="contain" 
        />
      </View>

      {/* Detalhes do Produto */}
      <View style={cartStyles.detailsContainer}>
        <Text style={cartStyles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={cartStyles.productPrice}>
          R$ {(item.price * item.qty).toFixed(2)}
        </Text>
      </View>

      {/* Controles de Quantidade e Remoção */}
      <View style={cartStyles.controlsContainer}>
        <TouchableOpacity onPress={() => remove(item.id)} style={cartStyles.removeButton}>
          <Ionicons name="trash-outline" size={20} color="#D32F2F" />
        </TouchableOpacity>
        
        <View style={cartStyles.quantityBox}>
          <TouchableOpacity onPress={() => handleUpdate(-1)} style={cartStyles.qtyButton}>
            <Text style={cartStyles.qtyButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={cartStyles.qtyText}>{item.qty}</Text>
          <TouchableOpacity onPress={() => handleUpdate(1)} style={cartStyles.qtyButton}>
            <Text style={cartStyles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


export default function Cart() {
  const router = useRouter();
  const { cart, total } = useCart();

  const handleCheckout = () => {
    // Navega para a tela de Checkout
    router.push('/cliente/Checkout/CheckoutMain');
  };

  return (
    <View style={cartStyles.container}>
      {/* Header */}
      <View style={cartStyles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={cartStyles.headerTitle}>Minha Cesta ({cart.length} {cart.length === 1 ? 'item' : 'itens'})</Text>
      </View>

      {/* Conteúdo Principal */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {cart.length === 0 ? (
          <View style={cartStyles.emptyCart}>
            <MaterialCommunityIcons name="basket-off-outline" size={80} color="#ccc" />
            <Text style={cartStyles.emptyCartText}>Sua cesta está vazia!</Text>
            <TouchableOpacity 
                onPress={() => router.push('/cliente')}
                style={cartStyles.backToHomeButton}
            >
                <Text style={cartStyles.backToHomeText}>Voltar para a Loja</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CartItemCard item={item} />}
            scrollEnabled={false} // Desabilita o scroll da FlatList dentro da ScrollView
            contentContainerStyle={cartStyles.list}
          />
        )}
      </ScrollView>

      {/* Footer Fixo com Total e Botão */}
      {cart.length > 0 && (
        <View style={cartStyles.footer}>
          <View style={cartStyles.totalRow}>
            <Text style={cartStyles.totalLabel}>Total dos Produtos:</Text>
            <Text style={cartStyles.totalValue}>R$ {total.toFixed(2)}</Text>
          </View>
          
          <TouchableOpacity 
            style={cartStyles.checkoutButton} 
            onPress={handleCheckout}
          >
            <Text style={cartStyles.checkoutButtonText}>Fazer Pedido</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// --- ESTILOS ---

const cartStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FFF6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  
  // Cart Item Card
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  image: {
    width: '90%',
    height: '90%',
    borderRadius: 6,
  },
  detailsContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#24BF38',
    marginTop: 4,
  },
  controlsContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 70,
  },
  removeButton: {
    padding: 5,
  },
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  qtyButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#eee',
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  qtyText: {
    paddingHorizontal: 10,
    fontSize: 14,
  },

  // Footer
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#24BF38',
  },
  checkoutButton: {
    backgroundColor: '#24BF38',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Carrinho Vazio
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#888',
    marginTop: 10,
    marginBottom: 20,
  },
  backToHomeButton: {
    backgroundColor: '#24BF38',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backToHomeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

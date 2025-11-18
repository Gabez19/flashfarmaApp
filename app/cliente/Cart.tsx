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
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCart, CartItem } from '../contexts/CartContext';

// ============================================================================
// MAPA DE IMAGENS
// ============================================================================

const ProductImages: { [key: string]: any } = {
  'assets/images/image_medicamento_1.webp': require('../../assets/images/image_medicamento_1.webp'),
  'assets/images/image_medicamento_2.webp': require('../../assets/images/image_medicamento_2.webp'),
  'assets/images/image_medicamento_3.webp': require('../../assets/images/image_medicamento_3.webp'),
  'assets/images/image_medicamento_4.webp': require('../../assets/images/image_medicamento_4.webp'),
  'assets/images/image_medicamento_5.webp': require('../../assets/images/image_medicamento_5.webp'),
  'assets/images/image_medicamento_6.webp': require('../../assets/images/image_medicamento_6.webp'),
};

// ============================================================================
// COMPONENTE: CART ITEM CARD
// ============================================================================

const CartItemCard = ({ item }: { item: CartItem }) => {
  const { updateQuantity, remove } = useCart();

  const handleUpdate = (amount: number) => {
    const newQty = item.qty + amount;

    if (newQty <= 0) {
      remove(item.id);
      return;
    }

    updateQuantity(item.id, newQty);
  };

  const imageSource =
    ProductImages[item.image || ''] || {
      uri: 'https://placehold.co/60x60/cccccc/333333?text=Imagem',
    };

  return (
    <View style={styles.card}>
      {/* Imagem */}
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} resizeMode="contain" />
      </View>

      {/* Detalhes do Produto */}
      <View style={styles.detailsContainer}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>
          R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}
        </Text>
      </View>

      {/* Controles de Quantidade e Remoção */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={() => remove(item.id)}
          style={styles.removeButton}
        >
          <Ionicons name="trash-outline" size={20} color="#D32F2F" />
        </TouchableOpacity>

        <View style={styles.quantityBox}>
          <TouchableOpacity
            onPress={() => handleUpdate(-1)}
            style={[styles.qtyButton, styles.qtyButtonLeft]}
          >
            <Text style={styles.qtyButtonText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.qtyText}>{item.qty}</Text>

          <TouchableOpacity
            onPress={() => handleUpdate(1)}
            style={[styles.qtyButton, styles.qtyButtonRight]}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL: CART
// ============================================================================

export default function Cart() {
  const router = useRouter();
  const { cart, total } = useCart();

  const handleCheckout = () => {
    router.push('/cliente/Checkout/CheckoutMain');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Minha Cesta ({cart.length} {cart.length === 1 ? 'item' : 'itens'})
        </Text>
      </View>

      {/* Conteúdo Principal */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {cart.length === 0 ? (
          <View style={styles.emptyCart}>
            <MaterialCommunityIcons
              name="basket-off-outline"
              size={80}
              color="#ccc"
            />
            <Text style={styles.emptyCartText}>Sua cesta está vazia!</Text>
            <TouchableOpacity
              onPress={() => router.push('/cliente')}
              style={styles.backToHomeButton}
            >
              <Text style={styles.backToHomeText}>Voltar para a Loja</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CartItemCard item={item} />}
            scrollEnabled={false}
            contentContainerStyle={styles.list}
          />
        )}
      </ScrollView>

      {/* Footer Fixo com Total e Botão */}
      {cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total dos Produtos:</Text>
            <Text style={styles.totalValue}>
              R$ {total.toFixed(2).replace('.', ',')}
            </Text>
          </View>

          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Fazer Pedido</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ============================================================================
// ESTILOS
// ============================================================================

const styles = StyleSheet.create({
  // --------------------------------------------------------------------------
  // Container Principal
  // --------------------------------------------------------------------------
  container: {
    flex: 1,
    backgroundColor: '#F6FFF6',
  },

  // --------------------------------------------------------------------------
  // Header
  // --------------------------------------------------------------------------
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
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },

  // --------------------------------------------------------------------------
  // Scroll e Lista
  // --------------------------------------------------------------------------
  scrollContent: {
    flexGrow: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  // --------------------------------------------------------------------------
  // Cart Item Card
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // Controles
  // --------------------------------------------------------------------------
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
    borderRadius: 5,
    overflow: 'hidden',
  },
  qtyButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#eee',
  },
  qtyButtonLeft: {
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  qtyButtonRight: {
    borderLeftWidth: 1,
    borderColor: '#ccc',
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

  // --------------------------------------------------------------------------
  // Footer
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // Carrinho Vazio
  // --------------------------------------------------------------------------
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
  },
});
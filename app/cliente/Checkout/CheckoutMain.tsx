import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useCart, CartItem } from '../../contexts/CartContext';

const windowWidth = Dimensions.get('window').width;

// ============================================================================
// COMPONENTE: CHECKOUT PRODUCT CARD
// ============================================================================

const CheckoutProductCard = ({ item }: { item: CartItem }) => {
  const imageSource = {
    uri: 'https://placehold.co/60x60/f0f0f0/333333?text=ITEM',
  };

  return (
    <View style={styles.productCard}>
      <View style={styles.productImagePlaceholder}>
        <Image source={imageSource} style={styles.productImage} resizeMode="contain" />
      </View>
      <Text style={styles.productCardText} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.productCardTextSmall}>
        {item.qty} x R$ {item.price.toFixed(2).replace('.', ',')}
      </Text>
    </View>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL: CHECKOUT MAIN
// ============================================================================

export default function CheckoutMain() {
  const router = useRouter();
  const { cart, total, clear } = useCart();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const freteValue = 10.0;
  const totalPagar = total + freteValue;
  const maxParcelas = 2;

  const enderecoInfo = 'Rua das Flores, 123 - Centro, São Paulo - SP. (12345-678)';
  const hasAddress = true;

  // --------------------------------------------------------------------------
  // HANDLERS
  // --------------------------------------------------------------------------

  const handleSelectPaymentMethod = (method: string) => {
    setSelectedPaymentMethod(method);
    if (method === 'PIX') {
      console.log('PIX selecionado, navegaria para a tela de geração de QR Code.');
    }
  };

  const handleFinalizarCompra = () => {
    if (cart.length === 0) {
      console.log('Carrinho vazio! Não é possível finalizar a compra.');
      return;
    }

    if (!selectedPaymentMethod) {
      setShowErrorModal(true);
      return;
    }

    // 🔥 Preparar dados do pedido com TODOS os produtos do carrinho
    const orderData = {
      id: Math.floor(Math.random() * 10000).toString(),
      total: totalPagar,
      deliveryCode: Math.floor(1000 + Math.random() * 9000).toString(),
      deliveryName: 'João Silva',
      deliveryVehicle: 'Bicicleta',
      deliveryPlate: 'ABC-1234',
      items: cart.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
      })),
    };

    // Serializar para JSON
    const orderJSON = JSON.stringify(orderData);
    
    console.log('📦 Pedido criado:', orderData);

    // Limpar carrinho
    clear();

    // 🚀 Navegar para DeliveryStatus passando os dados
    router.replace({
      pathname: '/cliente/Orders/DeliveryStatus',
      params: { order: orderJSON },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header Fixo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Informações do Pedido</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Seção de Produtos */}
        <Text style={styles.sectionTitle}>Produtos ({cart.length} itens)</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.productScroll}
        >
          {cart.map((item: CartItem) => (
            <CheckoutProductCard key={item.id} item={item} />
          ))}
          {cart.length === 0 && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyProductText}>
                Nenhum item na cesta para checkout.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Seção de Entrega */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Entrega</Text>
          <View style={styles.deliveryRow}>
            <TouchableOpacity style={styles.deliveryInfoButton}>
              <Text style={styles.deliveryInfoText}>Informações de entrega</Text>
            </TouchableOpacity>
            <View style={styles.freteBox}>
              <Text style={styles.freteText}>Frete:</Text>
              <Text style={styles.freteValue}>
                R$ {freteValue.toFixed(2).replace('.', ',')}
              </Text>
            </View>
          </View>
        </View>

        {/* Seção de Endereço */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          <View style={styles.addressBox}>
            <Text style={styles.addressText} numberOfLines={2}>
              {hasAddress ? enderecoInfo : 'Nenhuma informação de endereço cadastrada.'}
            </Text>
            <TouchableOpacity style={styles.changeAddressButton}>
              <Text style={styles.changeAddressText}>Alterar endereço</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seção de Cupons */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Cupons</Text>
          <TextInput
            placeholder="digite o cupom"
            style={styles.cupomInput}
            placeholderTextColor="#999"
          />
        </View>

        {/* Seção de Pagamento */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Selecionar Forma de Pagamento:</Text>
          <View style={styles.paymentMethodsRow}>
            {['Cartão', 'PIX', 'Boleto', 'Dinheiro'].map((method, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.paymentMethodBox,
                  selectedPaymentMethod === method && styles.paymentMethodSelected,
                ]}
                onPress={() => handleSelectPaymentMethod(method)}
              >
                <Ionicons
                  name={
                    method === 'Cartão'
                      ? 'card-outline'
                      : method === 'PIX'
                      ? 'qr-code-outline'
                      : method === 'Boleto'
                      ? 'document-text-outline'
                      : 'cash-outline'
                  }
                  size={24}
                  color={selectedPaymentMethod === method ? '#24BF38' : '#555'}
                />
                <Text
                  style={[
                    styles.paymentMethodTextSmall,
                    selectedPaymentMethod === method &&
                      styles.paymentMethodTextSelected,
                  ]}
                >
                  {method}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedPaymentMethod && (
            <Text style={styles.selectedMethodInfo}>
              Forma de Pagamento selecionada: **{selectedPaymentMethod}**.{' '}
              {selectedPaymentMethod === 'PIX'
                ? ' O código será gerado na próxima etapa.'
                : ' Clique em Finalizar Compra.'}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Total a Pagar e Finalizar Compra (Footer Fixo) */}
      <View style={styles.footer}>
        <View style={styles.totalPayableRow}>
          <Text style={styles.totalPayableLabel}>Total a pagar:</Text>
          <View style={styles.totalPayableValues}>
            <Text style={styles.totalPayableValue}>
              R$ {totalPagar.toFixed(2).replace('.', ',')}
            </Text>
            <Text style={styles.installmentText}>
              ou em até {maxParcelas}x de R${' '}
              {(totalPagar / maxParcelas).toFixed(2).replace('.', ',')}
            </Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.couponButtonSmall}>
            <Text style={styles.couponButtonText}>Cupom(?)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.finalizarButton,
              (cart.length === 0 || !selectedPaymentMethod) && { opacity: 0.6 },
            ]}
            onPress={handleFinalizarCompra}
            disabled={cart.length === 0 || !selectedPaymentMethod}
          >
            <Text style={styles.finalizarButtonText}>Finalizar Compra</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de Erro de Seleção de Pagamento */}
      {showErrorModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Ionicons name="alert-circle-outline" size={50} color="#D32F2F" />
            <Text style={styles.modalTitle}>Atenção!</Text>
            <Text style={styles.modalMessage}>
              Por favor, selecione uma **forma de pagamento** antes de finalizar a
              compra.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowErrorModal(false)}
            >
              <Text style={styles.modalButtonText}>Entendi</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#24BF38',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#fff',
  },

  // --------------------------------------------------------------------------
  // Scroll Content
  // --------------------------------------------------------------------------
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  // --------------------------------------------------------------------------
  // Seções
  // --------------------------------------------------------------------------
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 15,
    marginBottom: 8,
    color: '#333',
  },
  sectionBlock: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },

  // --------------------------------------------------------------------------
  // Produtos
  // --------------------------------------------------------------------------
  productScroll: {
    paddingBottom: 10,
  },
  productCard: {
    width: 90,
    height: 120,
    marginRight: 10,
    alignItems: 'center',
  },
  emptyCard: {
    width: windowWidth - 32,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  productImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productImage: {
    width: '90%',
    height: '90%',
  },
  productCardText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
    color: '#555',
  },
  productCardTextSmall: {
    fontSize: 10,
    textAlign: 'center',
    color: '#888',
  },
  emptyProductText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    padding: 10,
  },

  // --------------------------------------------------------------------------
  // Entrega
  // --------------------------------------------------------------------------
  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryInfoButton: {
    backgroundColor: '#24BF38',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  deliveryInfoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  freteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fff0',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#24BF3855',
  },
  freteText: {
    fontSize: 14,
    color: '#555',
  },
  freteValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#24BF38',
    marginLeft: 5,
  },

  // --------------------------------------------------------------------------
  // Endereço
  // --------------------------------------------------------------------------
  addressBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 5,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginRight: 10,
  },
  changeAddressButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#24BF38',
  },
  changeAddressText: {
    fontSize: 12,
    color: '#24BF38',
    fontWeight: '600',
  },

  // --------------------------------------------------------------------------
  // Cupons
  // --------------------------------------------------------------------------
  cupomInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    fontSize: 14,
  },

  // --------------------------------------------------------------------------
  // Pagamento
  // --------------------------------------------------------------------------
  paymentMethodsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentMethodBox: {
    flex: 1,
    height: 70,
    marginHorizontal: 4,
    backgroundColor: '#eee',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  paymentMethodSelected: {
    borderColor: '#24BF38',
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
  },
  paymentMethodTextSmall: {
    fontSize: 11,
    fontWeight: '600',
    color: '#555',
    marginTop: 5,
  },
  paymentMethodTextSelected: {
    color: '#24BF38',
    fontWeight: '700',
  },
  selectedMethodInfo: {
    marginTop: 10,
    fontSize: 12,
    color: '#24BF38',
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 5,
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
  totalPayableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  totalPayableLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPayableValues: {
    alignItems: 'flex-end',
  },
  totalPayableValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#24BF38',
  },
  installmentText: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  couponButtonSmall: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '40%',
    alignItems: 'center',
  },
  couponButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: '600',
  },
  finalizarButton: {
    backgroundColor: '#24BF38',
    padding: 12,
    borderRadius: 8,
    width: '55%',
    alignItems: 'center',
  },
  finalizarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // --------------------------------------------------------------------------
  // Modal
  // --------------------------------------------------------------------------
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 15,
  },
  modalButton: {
    backgroundColor: '#D32F2F',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
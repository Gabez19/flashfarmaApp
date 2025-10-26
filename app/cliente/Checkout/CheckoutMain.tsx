import React, { useState } from 'react';
import { // Adicionado useState
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
// CAMINHO CORRIGIDO: Voltando dois níveis para acessar 'contexts'
import { useCart, CartItem } from '../../contexts/CartContext'; 

// =======================================================
// MAPA DE IMAGENS (reutilizado)
// =======================================================
// NOTA: Em um ambiente real, 'require' funcionaria para assets locais. 
// Neste contexto de visualização única, as imagens locais serão ignoradas, 
// mas o mapeamento é mantido como no seu código original.
const ProductImages: { [key: string]: any } = {
  "assets/images/image_medicamento_1.webp": require('../../../assets/images/image_medicamento_1.webp'),
  "assets/images/image_medicamento_2.webp": require('../../../assets/images/image_medicamento_2.webp'),
  "assets/images/image_medicamento_3.webp": require('../../../assets/images/image_medicamento_3.webp'),
  "assets/images/image_medicamento_4.webp": require('../../../assets/images/image_medicamento_4.webp'),
  "assets/images/image_medicamento_5.webp": require('../../../assets/images/image_medicamento_5.webp'),
  "assets/images/image_medicamento_6.webp": require('../../../assets/images/image_medicamento_6.webp'),
};

const windowWidth = Dimensions.get('window').width;

// Componente para exibir um produto no resumo do checkout
const CheckoutProductCard = ({ item }: { item: CartItem }) => {
  // Tenta carregar a imagem local ou usa um placeholder para o web/preview
  const imageSource = ProductImages[item.image || ''] || { uri: 'https://placehold.co/60x60/f0f0f0/333333?text=IMG' };
    
  return (
    <View style={checkoutStyles.productCard}>
      <View style={checkoutStyles.productImagePlaceholder}>
        <Image 
          source={imageSource} 
          style={checkoutStyles.productImage} 
          resizeMode="contain" 
        />
      </View>
      <Text style={checkoutStyles.productCardText} numberOfLines={1}>
        {item.name}
      </Text>
      {/* Assumindo que CartItem tem 'qty' e 'price' conforme seu código original */}
      <Text style={checkoutStyles.productCardTextSmall}>
        {item.qty} x R$ {item.price.toFixed(2)}
      </Text>
    </View>
  );
};


export default function CheckoutMain() {
  const router = useRouter();
  const { cart, total } = useCart();
  
  // NOVO ESTADO: Controla a forma de pagamento selecionada
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null); 
  
  // Estado original para modal de confirmação (agora usado para erro de seleção)
  const [showErrorModal, setShowErrorModal] = useState(false); 

  const freteValue = 10.00; // Valor fixo de frete para o exemplo
  const totalPagar = total + freteValue;
  const maxParcelas = 2; // Simulação de parcelamento

  // Simulação de endereço
  const enderecoInfo = 'Rua das Flores, 123 - Centro, São Paulo - SP. (12345-678)';
  const hasAddress = true; // Para controle visual

  // Função para lidar com a seleção do método de pagamento
  const handleSelectPaymentMethod = (method: string) => {
    setSelectedPaymentMethod(method);
    // Para simplificar, vamos redirecionar imediatamente para a tela específica 
    // após a seleção, se for PIX, ou apenas marcar para outros métodos.
    if (method === 'PIX') {
        router.push('/cliente/Checkout/PaymentPix');
    }
    // Outros métodos como 'Cartão' e 'Boleto' poderiam ter telas próprias.
  };

  // Simulação de Pedido (Apenas um placeholder para a ação final)
  const handleFinalizarCompra = () => {
    if (cart.length === 0) {
      console.log("Carrinho vazio! Não é possível finalizar a compra.");
      return;
    }
    
    // NOVO: Verificar se um método de pagamento foi selecionado
    if (!selectedPaymentMethod) {
        setShowErrorModal(true);
        return;
    }
    
    // Ação Principal: Navegar para a tela de Status de Entrega
    // CORREÇÃO: Vamos para a nova rota que irá exibir as etapas do pedido.
    router.replace('/cliente/Orders/DeliveryStatus'); 
  };

  return (
    <View style={checkoutStyles.container}>
      {/* Header Fixo */}
      <View style={checkoutStyles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={checkoutStyles.headerTitle}>Informações do Pedido</Text>
      </View>

      <ScrollView contentContainerStyle={checkoutStyles.scrollContent}>
        
        {/* Seção de Produtos */}
        <Text style={checkoutStyles.sectionTitle}>Produtos ({cart.length} itens)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={checkoutStyles.productScroll}>
          {cart.map((item: CartItem) => (
            <CheckoutProductCard key={item.id} item={item} />
          ))}
          {/* Se o carrinho estiver vazio, exibe um placeholder */}
          {cart.length === 0 && (
            <View style={[checkoutStyles.emptyCard]}>
              <Text style={checkoutStyles.emptyProductText}>Nenhum item na cesta para checkout.</Text>
            </View>
          )}
        </ScrollView>
        
        {/* Seção de Entrega */}
        <View style={checkoutStyles.sectionBlock}>
          <Text style={checkoutStyles.sectionTitle}>Entrega</Text>
          <View style={checkoutStyles.deliveryRow}>
            <TouchableOpacity style={checkoutStyles.deliveryInfoButton}>
              <Text style={checkoutStyles.deliveryInfoText}>Informações de entrega</Text>
            </TouchableOpacity>
            <View style={checkoutStyles.freteBox}>
              <Text style={checkoutStyles.freteText}>Frete:</Text>
              <Text style={checkoutStyles.freteValue}>R$ {freteValue.toFixed(2)}</Text>
            </View>
          </View>
        </View>


        {/* Seção de Endereço */}
        <View style={checkoutStyles.sectionBlock}>
          <Text style={checkoutStyles.sectionTitle}>Endereço</Text>
          <View style={checkoutStyles.addressBox}>
            <Text style={checkoutStyles.addressText} numberOfLines={2}>
              {hasAddress ? enderecoInfo : 'Nenhuma informação de endereço cadastrada.'}
            </Text>
            <TouchableOpacity style={checkoutStyles.changeAddressButton}>
              <Text style={checkoutStyles.changeAddressText}>Alterar endereço</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seção de Cupons */}
        <View style={checkoutStyles.sectionBlock}>
          <Text style={checkoutStyles.sectionTitle}>Cupons</Text>
          <TextInput
            placeholder="digite o cupom"
            style={checkoutStyles.cupomInput}
            placeholderTextColor="#999"
          />
        </View>

        {/* Seção de Pagamento ATUALIZADA */}
        <View style={checkoutStyles.sectionBlock}>
          <Text style={checkoutStyles.sectionTitle}>Selecionar Forma de Pagamento:</Text>
          <View style={checkoutStyles.paymentMethodsRow}>
            {['Cartão', 'PIX', 'Boleto', 'Dinheiro'].map((method, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                    checkoutStyles.paymentMethodBox,
                    // Adiciona estilo de seleção
                    selectedPaymentMethod === method && checkoutStyles.paymentMethodSelected 
                ]}
                onPress={() => handleSelectPaymentMethod(method)}
              >
                {/* Usando ícones genéricos para simular as opções */}
                <Ionicons 
                    name={
                        method === 'Cartão' ? 'card-outline' :
                        method === 'PIX' ? 'qr-code-outline' :
                        method === 'Boleto' ? 'document-text-outline' :
                        'cash-outline'
                    } 
                    size={24} // Aumentado o tamanho do ícone
                    color={selectedPaymentMethod === method ? '#24BF38' : '#555'}
                />
                <Text style={[
                    checkoutStyles.paymentMethodTextSmall,
                    selectedPaymentMethod === method && checkoutStyles.paymentMethodTextSelected
                ]}>{method}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Mostra o método selecionado (apenas visualmente, exceto PIX que navega) */}
          {selectedPaymentMethod && selectedPaymentMethod !== 'PIX' && (
              <Text style={checkoutStyles.selectedMethodInfo}>
                  Forma selecionada: {selectedPaymentMethod}. Clique em Finalizar Compra.
              </Text>
          )}
        </View>

      </ScrollView>

      {/* Total a Pagar e Finalizar Compra (Footer Fixo) */}
      <View style={checkoutStyles.footer}>
        <View style={checkoutStyles.totalPayableRow}>
          <Text style={checkoutStyles.totalPayableLabel}>Total a pagar:</Text>
          <View style={checkoutStyles.totalPayableValues}>
            <Text style={checkoutStyles.totalPayableValue}>R$ {totalPagar.toFixed(2)}</Text>
            <Text style={checkoutStyles.installmentText}>
              ou em até {maxParcelas}x de R$ {(totalPagar / maxParcelas).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={checkoutStyles.actionRow}>
          <TouchableOpacity style={checkoutStyles.couponButtonSmall}>
            <Text style={checkoutStyles.couponButtonText}>Cupom(?)</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
                checkoutStyles.finalizarButton, 
                (cart.length === 0 || !selectedPaymentMethod) && { opacity: 0.6 } // Desabilita se não tiver item OU não tiver pagamento
            ]} 
            onPress={handleFinalizarCompra}
            disabled={cart.length === 0 || !selectedPaymentMethod}
          >
            <Text style={checkoutStyles.finalizarButtonText}>Finalizar Compra</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de Erro de Seleção de Pagamento */}
      {showErrorModal && (
          <View style={checkoutStyles.modalOverlay}>
              <View style={checkoutStyles.modalContainer}>
                  <Ionicons name="alert-circle-outline" size={50} color="#D32F2F" />
                  <Text style={checkoutStyles.modalTitle}>Atenção!</Text>
                  <Text style={checkoutStyles.modalMessage}>Por favor, selecione uma forma de pagamento antes de finalizar a compra.</Text>
                  <TouchableOpacity 
                      style={[checkoutStyles.modalButton, { backgroundColor: '#D32F2F' }]}
                      onPress={() => setShowErrorModal(false)}
                  >
                      <Text style={checkoutStyles.modalButtonText}>Entendi</Text>
                  </TouchableOpacity>
              </View>
          </View>
      )}

    </View>
  );
}

// --- ESTILOS ---

const checkoutStyles = StyleSheet.create({
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
    backgroundColor: '#24BF38', // Cor de destaque para o header
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20, 
  },
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

  // Produtos
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
  
  // Entrega
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

  // Endereço
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

  // Cupons
  cupomInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    fontSize: 14,
  },

  // Pagamento
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
    borderColor: '#24BF38', // Borda verde para selecionado
    backgroundColor: '#E8F5E9', // Fundo mais claro
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

  // Footer (Total e Ação)
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

  // Estilos do Modal (Substitui alert())
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
    backgroundColor: '#24BF38',
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

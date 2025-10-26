import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  // Alert removido para usar modal/console no ambiente de visualização
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Importa o Hook do Contexto real (Caminho correto se CartContext está em ../../contexts)
import { useCart } from '../../contexts/CartContext'; 

export default function PaymentCard() {
  const router = useRouter();
  const { total, clear } = useCart();
  const freteValue = 10.00;
  const totalPagar = total + freteValue;
  const maxParcelas = 2; // Simulação

  // Estados para os campos do formulário (simulados)
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [installments, setInstallments] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // Novo estado para o modal

  // Função auxiliar para simular Alert (já que Alert não funciona em alguns ambientes RN/Web)
  const showAlert = (title: string, message: string, onConfirm?: () => void) => {
    if (onConfirm) {
        setShowConfirmation(true);
        // O restante da lógica de navegação é movida para o botão do modal.
    } else {
        console.log(`ALERTA: ${title} - ${message}`);
    }
  };

  // Função para simular a conclusão do pagamento
  const handleConcluirPagamento = () => {
    // Simulação de validação básica
    if (cardNumber.length < 16 || cardName.length < 3 || expiryDate.length < 4 || cvv.length < 3) {
        showAlert('Dados Incompletos', 'Por favor, preencha todos os campos do cartão.');
        return;
    }

    setIsProcessing(true);

    // Simula o processamento do pagamento
    setTimeout(() => {
        setIsProcessing(false);
        showAlert(
            'Pagamento Aprovado!', 
            `Seu pagamento de R$ ${totalPagar.toFixed(2)} em ${installments}x foi aprovado. Você será redirecionado para o acompanhamento do pedido.`,
            // Função de callback para navegação no sucesso:
            () => {
                clear();
                router.replace('/cliente'); // Redireciona para a home do cliente
            }
        );
    }, 1500); // 1.5 segundos de delay para simular o processamento
  };

  const getInstallmentOptions = () => {
    const options = [];
    for (let i = 1; i <= maxParcelas; i++) {
        options.push(
            <TouchableOpacity 
                key={i} 
                style={[
                    cardStyles.installmentOption, 
                    installments === i && cardStyles.installmentSelected
                ]}
                onPress={() => setInstallments(i)}
            >
                <Text style={[
                    cardStyles.installmentText,
                    installments === i && { color: '#fff' }
                ]}>
                    {i}x de R$ {(totalPagar / i).toFixed(2)}
                </Text>
            </TouchableOpacity>
        );
    }
    return options;
  };

  return (
    <View style={cardStyles.container}>
      {/* Header Fixo */}
      <View style={cardStyles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={cardStyles.headerTitle}>Forma de Pagamento</Text>
      </View>

      <ScrollView contentContainerStyle={cardStyles.scrollContent}>
        
        <Text style={cardStyles.sectionTitle}>Cartão</Text>
        
        {/* Campo Número do Cartão */}
        <TextInput
            style={cardStyles.input}
            placeholder="Número do Cartão"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={setCardNumber}
            maxLength={16}
        />
        
        {/* Campo Nome no Cartão */}
        <TextInput
            style={cardStyles.input}
            placeholder="Nome (como está no cartão)"
            placeholderTextColor="#999"
            autoCapitalize="characters"
            value={cardName}
            onChangeText={setCardName}
        />
        
        <View style={cardStyles.row}>
            {/* Campo Validade */}
            <TextInput
                style={[cardStyles.input, cardStyles.halfInput, { marginRight: 10 }]}
                placeholder="MM/AA"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={expiryDate}
                onChangeText={setExpiryDate}
                maxLength={5}
            />
            {/* Campo CVV */}
            <TextInput
                style={[cardStyles.input, cardStyles.halfInput]}
                placeholder="CVV"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={cvv}
                onChangeText={setCvv}
                maxLength={4}
            />
        </View>

        <Text style={cardStyles.sectionTitle}>Parcelamento</Text>
        <View style={cardStyles.installmentsContainer}>
            {getInstallmentOptions()}
        </View>

        <View style={cardStyles.infoBox}>
            <Text style={cardStyles.infoText}>
                Total do Pedido: R$ {totalPagar.toFixed(2)}
            </Text>
            <Text style={cardStyles.infoTextSmall}>
                {installments}x de R$ {(totalPagar / installments).toFixed(2)}
            </Text>
        </View>

        <Text style={cardStyles.infoSecurity}>
            <Ionicons name="lock-closed-outline" size={14} color="#888" /> Suas informações de cartão são criptografadas e seguras.
        </Text>

      </ScrollView>

      {/* Botão Concluir */}
      <View style={cardStyles.footer}>
        <TouchableOpacity 
            style={[
                cardStyles.concluirButton, 
                isProcessing && cardStyles.concluirButtonDisabled
            ]}
            onPress={handleConcluirPagamento}
            disabled={isProcessing}
        >
          <Text style={cardStyles.concluirButtonText}>
            {isProcessing ? 'Processando...' : 'Concluir'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Confirmação Modal (Substitui Alert.alert) */}
      {showConfirmation && (
          <View style={cardStyles.modalOverlay}>
              <View style={cardStyles.modalContainer}>
                  <Ionicons name="checkmark-circle-outline" size={50} color="#24BF38" />
                  <Text style={cardStyles.modalTitle}>Pagamento Aprovado!</Text>
                  <Text style={cardStyles.modalMessage}>
                      Seu pagamento de R$ {totalPagar.toFixed(2)} em {installments}x foi aprovado. Você será redirecionado.
                  </Text>
                  <TouchableOpacity 
                      style={cardStyles.modalButton}
                      onPress={() => {
                          clear();
                          router.replace('/cliente');
                      }}
                  >
                      <Text style={cardStyles.modalButtonText}>OK</Text>
                  </TouchableOpacity>
              </View>
          </View>
      )}
      
    </View>
  );
}

// --- ESTILOS ---

const cardStyles = StyleSheet.create({
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
    backgroundColor: '#24BF38',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
  },
  
  // Parcelamento
  installmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  installmentOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    marginBottom: 8,
  },
  installmentSelected: {
    backgroundColor: '#24BF38',
    borderColor: '#24BF38',
  },
  installmentText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },

  // Info Box
  infoBox: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#24BF38',
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  infoTextSmall: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  infoSecurity: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },

  // Footer
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  concluirButton: {
    backgroundColor: '#24BF38',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  concluirButtonDisabled: {
    opacity: 0.6,
  },
  concluirButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
    // Estilos do Modal (Substitui Alert.alert)
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
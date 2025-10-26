import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  // Alert removido, pois pode causar problemas de ambiente
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Importa o Hook do Contexto real (Ajuste o caminho se necessário)
import { useCart } from '../../contexts/CartContext'; 

// URL do QR Code de teste (Apenas uma referência, usamos o ícone abaixo)
// const QR_CODE_SIMULADO = require('../../../assets/images/qr-code-placeholder.png');

export default function PaymentPix() {
  const router = useRouter();
  const { total, clear } = useCart();
  const freteValue = 10.00;
  const totalPagar = total + freteValue;
  
  const [showConfirmation, setShowConfirmation] = useState(false); // Estado para o modal
  
  // Função para simular o "Copiar Chave PIX"
  const handleCopyPixKey = () => {
    // Em um app real, você usaria 'Clipboard.setString('...')'
    console.log("Chave PIX copiada para a área de transferência!");
  }

  // Função para simular a conclusão do pagamento
  const handleConcluirPagamento = () => {
    // 1. Mostrar o modal de confirmação
    setShowConfirmation(true);
  };
  
  // 2. Lógica de navegação após a confirmação do modal
  const handleConfirmNavigation = () => {
    setShowConfirmation(false);
    // Limpa o carrinho
    clear(); 
    
    // CORREÇÃO: Usar a rota raiz do cliente, sem o /index
    router.replace('/cliente'); 
  }

  return (
    <View style={pixStyles.container}>
      {/* Header Fixo */}
      <View style={pixStyles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={pixStyles.headerTitle}>Pagamento via PIX</Text>
      </View>

      <ScrollView contentContainerStyle={pixStyles.scrollContent}>
        
        <View style={pixStyles.sectionBlock}>
          <Text style={pixStyles.sectionTitle}>1. Resumo do Pagamento</Text>
          
          <View style={pixStyles.infoRow}>
            <Text style={pixStyles.infoLabel}>Total dos Produtos:</Text>
            <Text style={pixStyles.infoValue}>R$ {total.toFixed(2)}</Text>
          </View>
          <View style={pixStyles.infoRow}>
            <Text style={pixStyles.infoLabel}>Frete:</Text>
            <Text style={pixStyles.infoValue}>R$ {freteValue.toFixed(2)}</Text>
          </View>
          <View style={pixStyles.infoRowTotal}>
            <Text style={pixStyles.infoLabelTotal}>Total a Pagar:</Text>
            <Text style={pixStyles.infoValueTotal}>R$ {totalPagar.toFixed(2)}</Text>
          </View>
        </View>

        <View style={pixStyles.sectionBlock}>
          <Text style={pixStyles.sectionTitle}>2. Faça o pagamento com o QR Code</Text>
          
          {/* Área do QR Code Simulado */}
          <View style={pixStyles.qrCodeArea}>
            <MaterialCommunityIcons name="qrcode-scan" size={150} color="#333" />
            <Text style={pixStyles.qrCodeInstructions}>
              Escaneie este código em seu app do banco. O valor expira em 30 minutos.
            </Text>
          </View>
          
          <Text style={pixStyles.pixKeyTitle}>Ou copie e cole a chave:</Text>
          <View style={pixStyles.pixKeyBox}>
            <Text style={pixStyles.pixKeyText} numberOfLines={1}>
              00020126580014BR.GOV.BCB.PIX...
            </Text>
            <TouchableOpacity style={pixStyles.copyButton} onPress={handleCopyPixKey}>
              <Ionicons name="copy-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={pixStyles.disclaimerText}>
          <Ionicons name="warning-outline" size={14} color="#D32F2F" /> Após o pagamento, clique no botão abaixo para concluir o processo em nosso app.
        </Text>

      </ScrollView>

      {/* Botão Fixo de Ação */}
      <View style={pixStyles.footer}>
        <TouchableOpacity 
          style={pixStyles.concluirButton} 
          onPress={handleConcluirPagamento}
        >
          <Text style={pixStyles.concluirButtonText}>Concluir Pagamento</Text>
        </TouchableOpacity>
      </View>
      
      {/* Confirmação Modal */}
      {showConfirmation && (
          <View style={pixStyles.modalOverlay}>
              <View style={pixStyles.modalContainer}>
                  <Ionicons name="checkmark-circle-outline" size={50} color="#24BF38" />
                  <Text style={pixStyles.modalTitle}>Pagamento Concluído!</Text>
                  <Text style={pixStyles.modalMessage}>
                      Seu pedido foi aceito e será processado. Você será redirecionado para a home.
                  </Text>
                  <TouchableOpacity 
                      style={pixStyles.modalButton}
                      onPress={handleConfirmNavigation}
                  >
                      <Text style={pixStyles.modalButtonText}>OK</Text>
                  </TouchableOpacity>
              </View>
          </View>
      )}
      
    </View>
  );
}

// --- ESTILOS ---

const pixStyles = StyleSheet.create({
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
    paddingVertical: 10,
  },
  sectionBlock: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
    color: '#333',
  },

  // Resumo
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: '#555',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  infoRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  infoLabelTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoValueTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#24BF38',
  },

  // QR Code
  qrCodeArea: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  qrCodeImage: {
    width: 150,
    height: 150,
  },
  qrCodeInstructions: {
    fontSize: 12,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  pixKeyTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  pixKeyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pixKeyText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    paddingHorizontal: 10,
  },
  copyButton: {
    backgroundColor: '#24BF38',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
    fontWeight: '500',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 18,
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
  concluirButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
    // Estilos do Modal
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

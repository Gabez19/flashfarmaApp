import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DeliveryFlow() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;

  const [codigo, setCodigo] = useState('');
  const [etapa, setEtapa] = useState<'aceito' | 'coletado' | 'acaminho' | 'entregue'>('acaminho');

  const handleConfirmarEntrega = () => {
    if (codigo === '0391') {
      setEtapa('entregue');
      alert('Entrega confirmada com sucesso!');
      router.push('/entregador');
    } else {
      alert('Código incorreto!');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Botão Voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#24BF38" />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Status da Entrega</Text>
        <Text style={styles.orderId}>#ENT-001 - Farmácia São João</Text>
      </View>

      {/* Status principal */}
      <View style={styles.statusCard}>
        <Ionicons name="bicycle-outline" size={50} color="#24BF38" style={{ marginBottom: 10 }} />
        <Text style={styles.statusText}>A Caminho</Text>
        <Text style={styles.statusSubText}>Pedido coletado e em rota de entrega</Text>
      </View>

      {/* Progresso */}
      <View style={styles.progressCard}>
        <Text style={styles.sectionTitle}>📦 Progresso da Entrega</Text>

        <View style={styles.progressItem}>
          <View style={styles.progressLeft}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={16} color="#fff" />
            </View>
            <View style={styles.line} />
          </View>
          <View style={styles.progressRight}>
            <Text style={styles.progressStep}>Pedido Aceito</Text>
            <Text style={styles.progressSub}>Entrega aceita pelo entregador</Text>
          </View>
        </View>

        <View style={styles.progressItem}>
          <View style={styles.progressLeft}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={16} color="#fff" />
            </View>
            <View style={styles.line} />
          </View>
          <View style={styles.progressRight}>
            <Text style={styles.progressStep}>Coletado</Text>
            <Text style={styles.progressSub}>Pedido retirado na farmácia</Text>
          </View>
        </View>

        <View style={styles.progressItem}>
          <View style={styles.progressLeft}>
            <View style={styles.activeCircle}>
              <Ionicons name="bicycle" size={16} color="#fff" />
            </View>
            <View style={styles.line} />
          </View>
          <View style={styles.progressRight}>
            <Text style={styles.progressStep}>A Caminho</Text>
            <Text style={styles.progressSub}>Em rota para o cliente</Text>
          </View>
        </View>

        <View style={styles.progressItem}>
          <View style={styles.progressLeft}>
            <View style={styles.emptyCircle} />
          </View>
          <View style={styles.progressRight}>
            <Text style={styles.progressStep}>Entregue</Text>
            <Text style={styles.progressSub}>Aguardando confirmação</Text>
          </View>
        </View>
      </View>

      {/* Resumo */}
      <View style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>🧾 Resumo da Entrega</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Cliente:</Text>
          <Text style={styles.value}>Maria Silva Santos</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Endereço:</Text>
          <Text style={styles.value}>Av. Paulista, 456</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Distância:</Text>
          <Text style={styles.value}>3,2 km</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Valor da Corrida:</Text>
          <Text style={styles.value}>R$ 18,50</Text>
        </View>
      </View>

      {/* Código do pedido */}
      <View style={styles.codeCard}>
        <Text style={styles.codeLabel}>CÓDIGO DO PEDIDO :</Text>
        <TextInput
          placeholder="Ex: 0391"
          style={styles.input}
          value={codigo}
          onChangeText={setCodigo}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmarEntrega}>
          <Text style={styles.confirmText}>Confirmar Entrega</Text>
        </TouchableOpacity>

        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call-outline" size={18} color="#fff" />
            <Text style={styles.callText}>Ligar Cliente</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.problemButton}>
            <Ionicons name="alert-circle-outline" size={18} color="#fff" />
            <Text style={styles.problemText}>Reportar Problema</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8', padding: 16 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  backText: { color: '#24BF38', marginLeft: 6, fontWeight: '600' },

  headerCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  orderId: { color: '#777', fontSize: 13 },

  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  statusText: { fontSize: 18, fontWeight: '700', color: '#000' },
  statusSubText: { color: '#777', fontSize: 13, textAlign: 'center' },

  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  sectionTitle: { fontWeight: '700', fontSize: 16, marginBottom: 10 },
  progressItem: { flexDirection: 'row', marginBottom: 12 },
  progressLeft: { alignItems: 'center', width: 30 },
  progressRight: { flex: 1 },
  checkCircle: {
    backgroundColor: '#24BF38',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCircle: {
    backgroundColor: '#007AFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  line: { width: 2, height: 24, backgroundColor: '#ccc' },
  progressStep: { fontWeight: '700', color: '#000' },
  progressSub: { color: '#777', fontSize: 13 },

  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 },
  label: { color: '#555', fontWeight: '600' },
  value: { color: '#000', fontWeight: '700' },

  codeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    alignItems: 'center',
  },
  codeLabel: { fontWeight: '700', color: '#444', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    width: '70%',
    textAlign: 'center',
    marginBottom: 14,
  },
  confirmButton: {
    backgroundColor: '#24BF38',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '70%',
    marginBottom: 14,
  },
  confirmText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  callText: { color: '#fff', fontWeight: '700' },
  problemButton: {
    flex: 1,
    backgroundColor: '#E74C3C',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  problemText: { color: '#fff', fontWeight: '700' },
});

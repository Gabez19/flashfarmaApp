import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DeliveryDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;

  const handleAccept = () => {
    router.push({
      pathname: '/entregador/DeliveryFlow',
      params: { id },
    });
  };

  const handleReject = () => {
    router.push('/entregador');
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
        <Text style={styles.farmName}>Farmácia São João</Text>
        <Text style={styles.orderId}>#ENT-001</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Aceito</Text>
        </View>
      </View>

      {/* Rota (Mapa Estático) */}
      <View style={styles.routeCard}>
        <Text style={styles.sectionTitle}>📍 Rota da Entrega</Text>
        <Image
          source={{
            uri: 'https://i.sstatic.net/L1WnE.png',
          }}
          style={styles.mapImage}
          resizeMode="cover"
        />
        <View style={styles.routeInfo}>
          <Ionicons name="navigate-outline" size={16} color="#24BF38" />
          <Text style={styles.routeText}> 3.2 km • 8–10 min</Text>
        </View>
      </View>

      {/* Retirada e Entrega */}
      <View style={styles.addressContainer}>
        <View style={styles.addressBox}>
          <Text style={styles.addressTitle}>📦 Retirada</Text>
          <Text style={styles.addressSub}>Farmácia São João</Text>
          <Text style={styles.addressText}>Rua das Flores, 123</Text>
          <Text style={styles.addressText}>Centro - São Paulo/SP</Text>
          <Text style={styles.addressText}>CEP: 01324-567</Text>
        </View>

        <View style={styles.addressBox}>
          <Text style={styles.addressTitle}>🏠 Entrega</Text>
          <Text style={styles.addressSub}>Maria Silva</Text>
          <Text style={styles.addressText}>Av. Paulista, 456 - Apto 302</Text>
          <Text style={styles.addressText}>Bela Vista - São Paulo/SP</Text>
          <Text style={styles.addressText}>CEP: 01310-900</Text>
        </View>
      </View>

      {/* Detalhes do Pedido */}
      <View style={styles.orderDetails}>
        <Text style={styles.sectionTitle}>📋 Detalhes do Pedido</Text>

        <Text style={styles.customerName}>Maria Silva Santos</Text>
        <Text style={styles.customerPhone}>(11) 99812-5432</Text>

        <View style={styles.itemBox}>
          <Text style={styles.itemName}>Dipirona Sódica 500mg</Text>
          <Text style={styles.itemQty}>x2</Text>
        </View>

        <View style={styles.itemBox}>
          <Text style={styles.itemName}>Vitamina C 1000mg</Text>
          <Text style={styles.itemQty}>x1</Text>
        </View>

        <View style={styles.itemBox}>
          <Text style={styles.itemName}>Álcool Gel 70%</Text>
          <Text style={styles.itemQty}>x1</Text>
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total do Pedido:</Text>
          <Text style={styles.totalValue}>R$ 127,80</Text>
        </View>
      </View>

      {/* Botões Aceitar / Recusar */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
          <Text style={styles.rejectText}>Recusar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
          <Text style={styles.acceptText}>Aceitar</Text>
        </TouchableOpacity>
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
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  farmName: { fontSize: 18, fontWeight: '700', color: '#000' },
  orderId: { fontSize: 13, color: '#777' },
  statusBadge: {
    backgroundColor: '#E6F8EB',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  statusText: { color: '#24BF38', fontWeight: '600' },

  routeCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#000' },
  mapImage: { width: '100%', height: 160, borderRadius: 10 },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  routeText: { color: '#555', fontWeight: '500' },

  addressContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  addressBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  addressTitle: { fontWeight: '700', color: '#000' },
  addressSub: { color: '#24BF38', fontWeight: '600', marginVertical: 4 },
  addressText: { color: '#555', fontSize: 13 },

  orderDetails: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  customerName: { fontWeight: '700', color: '#000', marginTop: 4 },
  customerPhone: { color: '#777', marginBottom: 8 },
  itemBox: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  itemName: { color: '#000' },
  itemQty: { color: '#555', fontWeight: '600' },
  totalBox: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  totalLabel: { fontWeight: '700', color: '#000' },
  totalValue: { fontWeight: '700', color: '#24BF38' },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#E74C3C',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  rejectText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  acceptButton: {
    flex: 1,
    backgroundColor: '#24BF38',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  acceptText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

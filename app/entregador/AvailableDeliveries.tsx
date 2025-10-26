import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Entrega {
  id: string;
  cliente: string;
  itens: number;
  tempo: string;
  valor: string;
  status: string;
}

export default function AvailableDeliveries() {
  const router = useRouter();
  const [entregas] = useState<Entrega[]>([
    {
      id: '#103',
      cliente: 'Jandrei',
      itens: 2,
      tempo: '6 min atrás',
      valor: 'R$ 125,00',
      status: 'Concluído',
    },
    {
      id: '#104',
      cliente: 'João Silva',
      itens: 3,
      tempo: '33 min atrás',
      valor: 'R$ 125,00',
      status: 'Concluído',
    },
  ]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#24BF38" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lista de Entregas</Text>
      </View>

      <FlatList
        data={entregas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>{item.id}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            <Text style={styles.clientText}>Cliente: {item.cliente}</Text>
            <Text style={styles.infoText}>
              {item.itens} itens | {item.tempo}
            </Text>

            <Text style={styles.valorText}>{item.valor}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    color: '#24BF38',
    fontWeight: '700',
    fontSize: 14,
  },
  statusBadge: {
    backgroundColor: '#24BF38',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  clientText: {
    marginTop: 6,
    fontSize: 14,
    color: '#333',
  },
  infoText: {
    color: '#666',
    fontSize: 13,
    marginTop: 2,
  },
  valorText: {
    marginTop: 6,
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'right',
    color: '#000',
  },
});

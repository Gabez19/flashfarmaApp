// app/entregador/ResgateSaldo.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function ResgateSaldo() {
  const router = useRouter();

  const [saldo, setSaldo] = useState(250); // saldo atual
  const [historico, setHistorico] = useState([
    { id: 'R-001', valor: 50, status: 'Concluído', data: '10/11/2025' },
    { id: 'R-002', valor: 100, status: 'Pendente', data: '12/11/2025' },
  ]);

  const solicitarResgate = () => {
    // exemplo simples de adicionar resgate pendente
    const novoResgate = {
      id: `R-${historico.length + 1}`,
      valor: saldo, // resgatar tudo
      status: 'Pendente',
      data: new Date().toLocaleDateString('pt-BR'),
    };
    setHistorico([novoResgate, ...historico]);
    setSaldo(0);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Resgatar Saldo</Text>
          <Text style={styles.headerSubtitle}>Saldo disponível: R$ {saldo}</Text>
        </View>

        <TouchableOpacity
          style={[styles.resgateButton, saldo === 0 && { backgroundColor: '#ccc' }]}
          disabled={saldo === 0}
          onPress={solicitarResgate}
        >
          <Text style={styles.resgateButtonText}>Solicitar Resgate</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Histórico de Resgates</Text>
        <FlatList
          data={historico}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardValor}>R$ {item.valor}</Text>
              <Text style={styles.cardStatus}>{item.status}</Text>
              <Text style={styles.cardData}>{item.data}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </ScrollView>

      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push('/entregador')}>
          <Ionicons name="home-outline" size={28} color="#24BF38" />
          <Text style={styles.navbarLabel}>Início</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6FFF6', padding: 16 },
  header: { alignItems: 'center', marginVertical: 20 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#24BF38' },
  headerSubtitle: { fontSize: 16, color: '#555', marginTop: 4 },

  resgateButton: {
    backgroundColor: '#24BF38',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  resgateButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10, color: '#000' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  cardValor: { fontWeight: '700', fontSize: 16, color: '#24BF38' },
  cardStatus: { color: '#555', marginTop: 2 },
  cardData: { color: '#777', fontSize: 12, marginTop: 2 },

  navbar: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  navbarLabel: { fontSize: 10, color: '#888', marginTop: 2, textAlign: 'center' },
});

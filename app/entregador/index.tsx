import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const NavbarButton = ({
  iconName,
  label,
  isActive = false,
  onPress,
}: {
  iconName: string;
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.navbarButton} onPress={onPress}>
    <Ionicons
      name={isActive ? iconName.replace('-outline', '') : iconName}
      size={24}
      color={isActive ? '#24BF38' : '#888'}
    />
    <Text
      style={[
        styles.navbarLabel,
        isActive && { color: '#24BF38', fontWeight: 'bold' },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default function DashboardEntregador() {
  const router = useRouter();

  const [entregas] = useState([
    {
      id: 'ENT-001',
      farmacia: 'Farmácia São João',
      retirada: 'Rua das Flores, 123 - Centro',
      entrega: 'Av. Paulista, 456 - Bela Vista',
      distancia: '3.2 km',
      tempo: '16 min',
      valor: 'R$ 15,50',
      urgente: true,
    },
    {
      id: 'ENT-002',
      farmacia: 'Drogaria Popular',
      retirada: 'Rua Augusta, 789 - Vl. Madalena',
      entrega: 'Rua dos Pinheiros, 321 - Pinheiros',
      distancia: '4.0 km',
      tempo: '14 min',
      valor: 'R$ 18,00',
      urgente: false,
    },
    {
      id: 'ENT-003',
      farmacia: 'Farmácia Natural',
      retirada: 'Av. Rebouças, 854 - Jardins',
      entrega: 'Rua Oscar Freire, 1027 - Jardins',
      distancia: '2.4 km',
      tempo: '10 min',
      valor: 'R$ 12,25',
      urgente: false,
    },
  ]);

  const handleLogout = () => {
    router.push('/'); // volta para tela inicial
  };

  return (
    <View style={styles.fullScreenContainer}>
      <ScrollView style={styles.container}>
        {/* Header principal */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard do Entregador</Text>
          <Text style={styles.headerSubtitle}>
            Entregas disponíveis para aceitar
          </Text>
        </View>

        {/* Cards de resumo */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>5</Text>
            <Text style={styles.summaryLabel}>Disponíveis</Text>
          </View>

          <TouchableOpacity
            style={styles.summaryCard}
            onPress={() => router.push('/entregador/AvailableDeliveries')}
          >
            <Text style={styles.summaryNumber}>19</Text>
            <Text style={styles.summaryLabel}>Hoje</Text>
          </TouchableOpacity>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>R$ 250</Text>
            <Text style={styles.summaryLabel}>Ganhos</Text>
          </View>
        </View>

        {/* Título + botão atualizar */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Entregas Disponíveis</Text>
          <TouchableOpacity style={styles.refreshButton}>
            <Ionicons name="refresh" size={18} color="#fff" />
            <Text style={styles.refreshText}>Atualizar</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de entregas */}
        <FlatList
          data={entregas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: '/entregador/DeliveryDetails',
                  params: { id: item.id },
                })
              }
            >
              <View style={styles.cardHeader}>
                <Text style={styles.farmaciaName}>{item.farmacia}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: item.urgente ? '#ff3b30' : '#007AFF' },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {item.urgente ? 'Urgente' : 'Normal'}
                  </Text>
                </View>
              </View>

              {/* Endereços */}
              <View style={styles.locationRow}>
                <Ionicons name="storefront-outline" size={18} color="#24BF38" />
                <Text style={styles.locationText}>{item.retirada}</Text>
              </View>

              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={18} color="#24BF38" />
                <Text style={styles.locationText}>{item.entrega}</Text>
              </View>

              {/* Rodapé do card */}
              <View style={styles.cardFooter}>
                <View style={styles.footerLeft}>
                  <Text style={styles.valor}>{item.valor}</Text>
                  <Text style={styles.footerInfo}>
                    {item.distancia} • {item.tempo}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() =>
                    router.push({
                      pathname: '/entregador/DeliveryFlow',
                      params: { id: item.id },
                    })
                  }
                >
                  <Text style={styles.acceptText}>Aceitar Entrega</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      {/* Navbar inferior */}
      <View style={styles.navbar}>
        <NavbarButton
          iconName="home-outline"
          label="Início"
          isActive={true}
          onPress={() => router.push('/entregador')}
        />
        <NavbarButton
          iconName="bicycle-outline"
          label="Entregas"
          onPress={() => router.push('/entregador/AvailableDeliveries')}
        />
        <NavbarButton
          iconName="log-out-outline"
          label="Sair"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: { flex: 1, backgroundColor: '#F6FFF6' },
  container: { flex: 1, padding: 16 },

  header: { alignItems: 'center', marginTop: 10, marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#24BF38' },
  headerSubtitle: { color: '#555', fontSize: 14, marginTop: 4 },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    elevation: 2,
  },
  summaryNumber: { fontSize: 18, fontWeight: '700', color: '#24BF38' },
  summaryLabel: { fontSize: 13, color: '#555' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#000' },
  refreshButton: {
    backgroundColor: '#24BF38',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  refreshText: { color: '#fff', marginLeft: 4, fontWeight: '700' },

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
    marginBottom: 8,
  },
  farmaciaName: { fontSize: 15, fontWeight: '700' },
  statusBadge: { borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  locationRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 3 },
  locationText: { fontSize: 13, color: '#555', marginLeft: 6 },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  valor: { fontWeight: '700', color: '#000' },
  footerInfo: { color: '#777', fontSize: 12, marginTop: 2 },

  acceptButton: {
    backgroundColor: '#24BF38',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  acceptText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  footerLeft: { flexDirection: 'column' },

  // --- Navbar ---
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: 5,
  },
  navbarButton: { alignItems: 'center', padding: 5 },
  navbarLabel: { fontSize: 10, color: '#888', marginTop: 2 },
});

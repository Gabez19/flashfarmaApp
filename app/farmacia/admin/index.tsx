// app/farmacia/admin/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const LOGO_IMAGE = require("../../../assets/images/logo-flashfarma.png");

type Order = {
  id: string;
  client: string;
  total: string;
  status: "Em Preparo" | "Pendente" | "Concluído";
};

const MOCK_ORDERS: Order[] = [
  { id: "#103", client: "João Silva", total: "R$ 89,90", status: "Em Preparo" },
  { id: "#104", client: "Antonio F.", total: "R$ 321,30", status: "Pendente" },
  { id: "#105", client: "Carlos", total: "R$ 12,50", status: "Concluído" },
];

export default function AdminIndex() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Visão Geral</Text>
        <TouchableOpacity style={styles.hamburger} onPress={() => setMenuOpen(true)}>
          <View style={styles.bar} />
          <View style={[styles.bar, { width: 18 }]} />
          <View style={[styles.bar, { width: 14 }]} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Vendas de hoje:</Text>
          <Text style={styles.cardValue}>R$ 1.542,50</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Pedidos Concluídos</Text>
          <Text style={styles.cardValue}>48</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Faturamento Mensal</Text>
          <Text style={styles.cardValue}>R$ 28.980,00</Text>
        </View>

        <Text style={styles.sectionTitle}>Lista de Pedidos</Text>
        <FlatList
          data={MOCK_ORDERS}
          horizontal
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <Text style={styles.orderId}>{item.id}</Text>
              <Text style={styles.orderClient}>Cliente: {item.client}</Text>
              <Text style={styles.orderTotal}>{item.total}</Text>
              <View
                style={[
                  styles.statusPill,
                  {
                    backgroundColor:
                      item.status === "Em Preparo"
                        ? "#FFB84D"
                        : item.status === "Pendente"
                        ? "#FFD96B"
                        : "#9AE6B4",
                  },
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
        />

        <TouchableOpacity
          style={{ marginTop: 16, alignSelf: "center" }}
          onPress={() => router.push("/farmacia/admin/order-list")}
        >
          <Text style={{ fontSize: 14, color: "#13856B", textDecorationLine: "underline" }}>
            Clique para ver outros
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {menuOpen && (
        <>
          <TouchableOpacity style={styles.backdrop} onPress={() => setMenuOpen(false)} />
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuClose} onPress={() => setMenuOpen(false)}>
              <Text style={styles.closeX}>✕</Text>
            </TouchableOpacity>

            <Image source={LOGO_IMAGE} style={styles.menuLogo} resizeMode="contain" />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                router.push("/farmacia/admin/manage-catalog");
              }}
            >
              <Text style={styles.menuItemText}>Gerenciar Catálogo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                router.push("/farmacia/admin/manage-catalog");
              }}
            >
              <Text style={styles.menuItemText}>Adicionar/Editar Produto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                router.push("/farmacia/admin/order-list");
              }}
            >
              <Text style={styles.menuItemText}>Gerenciar Pedidos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                router.push("/farmacia/admin/manage-users");
              }}
            >
              <Text style={styles.menuItemText}>Gerenciar Usuários</Text>
            </TouchableOpacity>

            {/* BOTÃO DE SAIR ADICIONADO AQUI */}
            <TouchableOpacity
              style={[styles.menuItem, { marginTop: 18 }]}
              onPress={() => {
                setMenuOpen(false);
                router.push("/"); // volta para app/index.tsx
              }}
            >
              <Text style={[styles.menuItemText, { color: "red", fontWeight: "600" }]}>
                Sair da Conta
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const { width } = Dimensions.get("window");
const MENU_WIDTH = Math.min(320, Math.round(width * 0.72));

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", paddingTop: 18, paddingHorizontal: 18 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  hamburger: { width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  bar: { width: 22, height: 2, backgroundColor: "#2D2D2D", marginVertical: 2, borderRadius: 2 },
  content: { paddingBottom: 40 },
  card: { backgroundColor: "#F3F6F5", padding: 16, borderRadius: 10, marginBottom: 12 },
  cardLabel: { fontSize: 13, color: "#666" },
  cardValue: { marginTop: 8, fontSize: 20, fontWeight: "700", color: "#13856B" },
  sectionTitle: { fontSize: 15, fontWeight: "600", marginBottom: 8, marginTop: 10 },
  orderCard: { width: 150, backgroundColor: "#FAFAFA", borderRadius: 10, padding: 12, marginRight: 12 },
  orderId: { fontSize: 12, fontWeight: "700", color: "#2F7A7A", marginBottom: 6 },
  orderClient: { fontSize: 12, color: "#666" },
  orderTotal: { marginTop: 6, fontSize: 12, color: "#333" },
  statusPill: { marginTop: 8, alignSelf: "flex-start", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: "600" },
  backdrop: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.18)" },
  menu: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: MENU_WIDTH,
    backgroundColor: "#FFF",
    paddingTop: 18,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  menuClose: { alignSelf: "flex-end" },
  closeX: { fontSize: 20 },
  menuLogo: { width: 70, height: 70, marginTop: 6, marginBottom: 20 },
  menuItem: { width: "100%", paddingVertical: 14, marginTop: 8, alignItems: "center" },
  menuItemText: { fontSize: 15, color: "#333" },
});

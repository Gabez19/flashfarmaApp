// app/farmacia/admin/manage-users.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Dimensions,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

const LOGO_IMAGE = require("../../../assets/images/logo-flashfarma.png");

export default function ManageUsers() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar Usuários</Text>

        <TouchableOpacity style={styles.hamburger} onPress={() => setMenuOpen(true)}>
          <View style={styles.bar} />
          <View style={[styles.bar, { width: 18 }]} />
          <View style={[styles.bar, { width: 14 }]} />
        </TouchableOpacity>
      </View>

      {/* SEARCH + ADD */}
      <View style={styles.searchRow}>
        <TextInput placeholder="Buscar usuário..." style={styles.searchInput} />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/farmacia/admin/add-employee")}
        >
          <Text style={styles.addButtonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* LISTA DE USUÁRIOS MOCKADA */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {[
          { nome: "Marta Oliveira", funcao: "Farmacêutica", status: "ativo" },
          { nome: "Ricardo Souza", funcao: "Farmacêutico", status: "ativo" },
          { nome: "Bruno Lima", funcao: "Estoquista", status: "ativo" },
          { nome: "Carlos Costa", funcao: "Estoquista", status: "inativo" },
        ].map((u, idx) => (
          <View
            key={idx}
            style={[
              styles.userCard,
              { opacity: u.status === "inativo" ? 0.5 : 1 },
            ]}
          >
            <View style={styles.statusDotWrapper}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: u.status === "ativo" ? "#3ECB5F" : "#E64F4F" },
                ]}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{u.nome}</Text>
              <Text style={styles.userRole}>Função: {u.funcao}</Text>
            </View>

            <TouchableOpacity onPress={() => router.push("/farmacia/admin/edit-employee")}>
                <Text style={{ fontSize: 16 }}>⋮</Text>
            </TouchableOpacity>

          </View>
        ))}
      </ScrollView>

      {/* MENU LATERAL IGUAL AO INDEX */}
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
  searchRow: { flexDirection: "row", alignItems: "center", marginTop: 14 },
  searchInput: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 6,
  },
  addButton: { backgroundColor: "#13856B", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 6 },
  addButtonText: { color: "#FFF", fontWeight: "600" },
  userCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#FAFAFA", padding: 14, borderRadius: 8, marginTop: 10 },
  statusDotWrapper: { marginRight: 12 },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  userName: { fontSize: 15, fontWeight: "600" },
  userRole: { fontSize: 13, color: "#666" },
  backdrop: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.18)" },
  menu: { position: "absolute", top: 0, right: 0, bottom: 0, width: MENU_WIDTH, backgroundColor: "#FFF", paddingTop: 18, paddingHorizontal: 18, alignItems: "center" },
  menuClose: { alignSelf: "flex-end" },
  closeX: { fontSize: 20 },
  menuLogo: { width: 70, height: 70, marginTop: 6, marginBottom: 20 },
  menuItem: { width: "100%", paddingVertical: 14, marginTop: 8, alignItems: "center" },
  menuItemText: { fontSize: 15, color: "#333" },
});

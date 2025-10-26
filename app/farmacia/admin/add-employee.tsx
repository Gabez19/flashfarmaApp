import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const LOGO_IMAGE = require("../../../assets/images/logo-flashfarma.png");

export default function AddEmployee() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Adicionar Funcionário</Text>

        <TouchableOpacity style={styles.hamburger} onPress={() => setMenuOpen(true)}>
          <View style={styles.bar} />
          <View style={[styles.bar, { width: 18 }]} />
          <View style={[styles.bar, { width: 14 }]} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.card}>
          <TextInput placeholder="Nome do Funcionário" style={styles.input} />
          <TextInput placeholder="E-mail" style={styles.input} keyboardType="email-address" />

          <View style={styles.row}>
            <TextInput placeholder="Matrícula" style={[styles.input, styles.half]} />
            <TextInput placeholder="Senha Inicial" secureTextEntry style={[styles.input, styles.half]} />
          </View>

          <Text style={styles.label}>Foto do Funcionário</Text>
          <View style={styles.photoBox} />

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* SIDE MENU IGUAL AOS OUTROS */}
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
                router.push("/farmacia/admin");
              }}
            >
              <Text style={styles.menuItemText}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                router.push("/farmacia/admin/ManageCatalog");
              }}
            >
              <Text style={styles.menuItemText}>Gerenciar Catálogo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                router.push("/farmacia/admin/OrderList");
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

  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  input: {
    backgroundColor: "#F3F3F3",
    padding: 12,
    borderRadius: 6,
    marginBottom: 14,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  half: { width: "48%" },
  label: { fontSize: 14, color: "#444", marginBottom: 6, marginTop: 6 },
  photoBox: {
    width: "100%",
    height: 160,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cancelText: { color: "#666", fontSize: 15 },
  saveButton: { backgroundColor: "#13856B", paddingVertical: 12, paddingHorizontal: 26, borderRadius: 6 },
  saveText: { color: "#FFF", fontWeight: "600" },

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
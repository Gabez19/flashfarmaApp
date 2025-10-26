// app/farmacia/funcionario/exclue-product.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const LOGO_IMAGE = require("../../../assets/images/logo-flashfarma.png");
const { width } = Dimensions.get("window");
const MENU_WIDTH = Math.min(320, Math.round(width * 0.72));

export default function ExclueProductFuncionario() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Excluir Produto</Text>

        <TouchableOpacity style={styles.hamburger} onPress={() => setMenuOpen(true)}>
          <View style={styles.bar} />
          <View style={[styles.bar, { width: 18 }]} />
          <View style={[styles.bar, { width: 14 }]} />
        </TouchableOpacity>
      </View>

      {/* CONFIRMAÇÃO */}
      <View style={styles.card}>
        <Text style={styles.textoMaior}>Tem certeza que deseja excluir este produto?</Text>
        <Text style={styles.textoMenor}>Esta ação não poderá ser desfeita.</Text>

        <View style={styles.buttonsRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelar}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoExcluir}
            onPress={() => router.push("/farmacia/funcionario/edit-product")}
          >
            <Text style={styles.txtExcluir}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SIDE MENU */}
      {menuOpen && (
        <>
          <TouchableOpacity style={styles.backdrop} onPress={() => setMenuOpen(false)} />
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuClose} onPress={() => setMenuOpen(false)}>
              <Text style={styles.closeX}>✕</Text>
            </TouchableOpacity>

            <Image source={LOGO_IMAGE} style={styles.menuLogo} resizeMode="contain" />

            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push("/farmacia/funcionario"); }}>
              <Text style={styles.menuItemText}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push("/farmacia/funcionario/add-product"); }}>
              <Text style={styles.menuItemText}>Adicionar Produto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push("/farmacia/funcionario/edit-product"); }}>
              <Text style={styles.menuItemText}>Editar Produto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push("/farmacia/funcionario/order-list"); }}>
              <Text style={styles.menuItemText}>Lista de Pedidos</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", paddingTop: 18, paddingHorizontal: 18 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  hamburger: { width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  bar: { width: 22, height: 2, backgroundColor: "#2D2D2D", marginVertical: 2, borderRadius: 2 },

  card: { marginTop: 40, padding: 24, borderRadius: 12, borderWidth: 1, borderColor: "#E5E5E5" },
  textoMaior: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  textoMenor: { fontSize: 14, color: "#555", marginBottom: 30 },
  buttonsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  cancelar: { fontSize: 16, color: "#666" },
  botaoExcluir: { backgroundColor: "#E53935", paddingVertical: 12, paddingHorizontal: 28, borderRadius: 6 },
  txtExcluir: { color: "#FFF", fontWeight: "600" },

  backdrop: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.18)" },
  menu: { position: "absolute", top: 0, right: 0, bottom: 0, width: MENU_WIDTH, backgroundColor: "#FFF", paddingTop: 18, paddingHorizontal: 18, alignItems: "center" },
  menuClose: { alignSelf: "flex-end" },
  closeX: { fontSize: 20 },
  menuLogo: { width: 70, height: 70, marginTop: 6, marginBottom: 20 },
  menuItem: { width: "100%", paddingVertical: 14, marginTop: 8, alignItems: "center" },
  menuItemText: { fontSize: 15, color: "#333" },
});

// app/farmacia/funcionario/edit-product.tsx
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
const { width } = Dimensions.get("window");
const MENU_WIDTH = Math.min(320, Math.round(width * 0.72));

export default function EditProduct() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const [name, setName] = useState("Dipirona Sódica");
  const [description, setDescription] = useState("Medicamento para dor e febre");
  const [price, setPrice] = useState("12,50");
  const [stock, setStock] = useState("200");
  const [image, setImage] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Editar Produto</Text>

        <TouchableOpacity style={styles.hamburger} onPress={() => setMenuOpen(true)}>
          <View style={styles.bar} />
          <View style={[styles.bar, { width: 18 }]} />
          <View style={[styles.bar, { width: 14 }]} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.card}>
          <TextInput
            placeholder="Nome do Produto"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Descrição"
            style={[styles.input, { height: 80, textAlignVertical: "top" }]}
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <View style={styles.row}>
            <TextInput
              placeholder="Preço"
              keyboardType="decimal-pad"
              style={[styles.input, styles.half]}
              value={price}
              onChangeText={setPrice}
            />
            <TextInput
              placeholder="Estoque"
              keyboardType="numeric"
              style={[styles.input, styles.half]}
              value={stock}
              onChangeText={setStock}
            />
          </View>

          <TextInput
            placeholder="URL da Imagem"
            style={styles.input}
            value={image}
            onChangeText={setImage}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => router.push("/farmacia/funcionario/exclue-product")}
            >
              <Text style={styles.deleteText}>Excluir</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
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
                router.push("/farmacia/funcionario");
              }}
            >
              <Text style={styles.menuItemText}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                router.push("/farmacia/funcionario/add-product");
              }}
            >
              <Text style={styles.menuItemText}>Adicionar Produto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                router.push("/farmacia/funcionario/edit-product");
              }}
            >
              <Text style={styles.menuItemText}>Editar Produto</Text>
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
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  input: { backgroundColor: "#F3F3F3", padding: 12, borderRadius: 6, marginBottom: 14 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  half: { width: "48%" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cancelText: { color: "#666", fontSize: 15 },
  deleteButton: { backgroundColor: "#E64F4F", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 6 },
  deleteText: { color: "#FFF", fontWeight: "600" },
  saveButton: { backgroundColor: "#13856B", paddingVertical: 12, paddingHorizontal: 26, borderRadius: 6 },
  saveText: { color: "#FFF", fontWeight: "600" },
  backdrop: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.18)" },
  menu: { position: "absolute", top: 0, right: 0, bottom: 0, width: MENU_WIDTH, backgroundColor: "#FFF", paddingTop: 18, paddingHorizontal: 18, alignItems: "center" },
  menuClose: { alignSelf: "flex-end" },
  closeX: { fontSize: 20 },
  menuLogo: { width: 70, height: 70, marginTop: 6, marginBottom: 20 },
  menuItem: { width: "100%", paddingVertical: 14, marginTop: 8, alignItems: "center" },
  menuItemText: { fontSize: 15, color: "#333" },
});

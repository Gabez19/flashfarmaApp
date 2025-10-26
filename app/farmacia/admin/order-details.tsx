// app/farmacia/admin/OrderDetails.tsx
import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function OrderDetails() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Pedido Detalhado</Text>

      {/* INFORMAÇÕES DO CLIENTE */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Informações do Cliente</Text>
        <View style={styles.rowSpaceBetween}>
          <Text style={styles.label}>Nome do Cliente:</Text>
          <Text style={styles.value}>Jandrei Costa</Text>
        </View>
        <View style={styles.rowSpaceBetween}>
          <Text style={styles.label}>Endereço:</Text>
          <Text style={styles.value}>Rua Exemplo, 123</Text>
        </View>
        <View style={styles.rowSpaceBetween}>
          <Text style={styles.label}>Telefone:</Text>
          <Text style={styles.value}>(61) 99876-5432</Text>
        </View>
        <View style={styles.rowSpaceBetween}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.value, styles.status]}>Novo Pedido</Text>
        </View>
      </View>

      {/* ITENS DO PEDIDO */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Itens do Pedido (2)</Text>

        <View style={styles.item}>
          <View style={styles.fakeImage} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.itemName}>Dipirona 500mg (20 Comprimidos)</Text>
            <Text style={styles.price}>R$ 42,90</Text>
            <Text style={styles.subInfo}>Qtd 2 | Preço Unitário: R$ 21,45</Text>
          </View>
        </View>

        <View style={styles.item}>
          <View style={styles.fakeImage} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.itemName}>Vitamina C Efervescente</Text>
            <Text style={styles.price}>R$ 47,00</Text>
            <Text style={styles.subInfo}>Qtd 2 | Preço Unitário: R$ 23,50</Text>
          </View>
        </View>
      </View>

      {/* RESUMO FINANCEIRO */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Resumo Financeiro</Text>
        <View style={styles.rowSpaceBetween}>
          <Text style={styles.label}>Subtotal:</Text>
          <Text style={styles.value}>R$ 89,90</Text>
        </View>
        <View style={styles.rowSpaceBetween}>
          <Text style={styles.label}>Taxa de Serviço:</Text>
          <Text style={styles.value}>R$ 0,00</Text>
        </View>
        <View style={styles.rowSpaceBetween}>
          <Text style={styles.label}>Taxa de Entrega:</Text>
          <Text style={styles.value}>R$ 0,00</Text>
        </View>

        <View style={[styles.rowSpaceBetween, { marginTop: 12 }]}>
          <Text style={styles.totalText}>Valor Total:</Text>
          <Text style={styles.totalPrice}>R$ 89,90</Text>
        </View>
      </View>

      {/* BOTÕES DE AÇÃO */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, styles.greenButton]}>
          <Text style={styles.buttonText}>Aceitar Pedido</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.yellowButton]}>
          <Text style={styles.buttonText}>Em Preparo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.blueButton]}>
          <Text style={styles.buttonText}>Pronto Para Envio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.redButton]}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FFFFFF" },
  header: { fontSize: 20, fontWeight: "600", marginBottom: 10 },
  card: { backgroundColor: "#F8F9FA", borderRadius: 10, padding: 16, marginBottom: 14 },
  sectionTitle: { fontSize: 15, fontWeight: "600", marginBottom: 10 },
  rowSpaceBetween: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  label: { color: "#555" },
  value: { fontWeight: "600", color: "#333" },
  status: { color: "#24A8FF" },
  item: { flexDirection: "row", marginBottom: 14, alignItems: "center" },
  fakeImage: { width: 50, height: 50, backgroundColor: "#E0E0E0", borderRadius: 8 },
  itemName: { fontSize: 14, fontWeight: "600" },
  price: { fontSize: 14, fontWeight: "bold", marginTop: 2 },
  subInfo: { fontSize: 12, color: "#666" },
  totalText: { fontSize: 15, fontWeight: "bold" },
  totalPrice: { fontSize: 15, fontWeight: "bold" },
  actions: { marginTop: 20 },
  button: { paddingVertical: 14, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  greenButton: { backgroundColor: "#24BF38" },
  yellowButton: { backgroundColor: "#FFCE00" },
  blueButton: { backgroundColor: "#007AFF" },
  redButton: { backgroundColor: "#FF3B30" },
  buttonText: { color: "#FFF", fontWeight: "600" },
});

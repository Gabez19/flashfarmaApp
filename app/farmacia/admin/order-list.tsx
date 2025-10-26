// app/farmacia/admin/OrderList.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const LOGO_IMAGE = require("../../../assets/images/logo-flashfarma.png");
const { width } = Dimensions.get("window");
const MENU_WIDTH = Math.min(320, Math.round(width * 0.72));

const ORDERS = [
  { id: "#103", client: "Jandrei", time: "2 itens | 5 min atrás", total: "R$ 89,90", status: "Novo Pedido" },
  { id: "#104", client: "João Silva", time: "3 itens | 33 min atrás", total: "R$ 89,90", status: "Em Progresso" },
  { id: "#105", client: "Fernanda", time: "6 itens | 1h atrás", total: "R$ 321,30", status: "Pendente" },
];

export default function OrderList() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const getTagStyle = (status: string) => {
    switch (status) {
      case "Novo Pedido": return { backgroundColor: "#E5F6EF", color: "#13856B" };
      case "Em Progresso": return { backgroundColor: "#FFF5D1", color: "#C68A00" };
      case "Pendente": return { backgroundColor: "#FFE5E5", color: "#B71C1C" };
      default: return { backgroundColor: "#EEE", color: "#333" };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lista de Pedidos</Text>
        <TouchableOpacity style={styles.hamburger} onPress={() => setMenuOpen(true)}>
          <View style={styles.bar} />
          <View style={[styles.bar, { width: 18 }]} />
          <View style={[styles.bar, { width: 14 }]} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={ORDERS}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingTop: 20 }}
        renderItem={({ item }) => {
          const tag = getTagStyle(item.status);
          return (
            <TouchableOpacity style={styles.orderCard} onPress={() => router.push("/farmacia/admin/order-details")}> 
              <View>
                <Text style={styles.orderId}>{item.id}</Text>
                <Text style={styles.orderClient}>Cliente: {item.client}</Text>
                <Text style={styles.orderTime}>{item.time}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.status, { backgroundColor: tag.backgroundColor, color: tag.color }]}>{item.status}</Text>
                <Text style={styles.orderTotal}>{item.total}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {menuOpen && (
        <>
          <TouchableOpacity style={styles.backdrop} onPress={() => setMenuOpen(false)} />
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuClose} onPress={() => setMenuOpen(false)}>
              <Text style={styles.closeX}>✕</Text>
            </TouchableOpacity>
            <Image source={LOGO_IMAGE} style={styles.menuLogo} resizeMode="contain" />
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push("/farmacia/admin"); }}>
              <Text style={styles.menuItemText}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push("/farmacia/admin/manage-catalog"); }}>
              <Text style={styles.menuItemText}>Gerenciar Catálogo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push("/farmacia/admin/order-list"); }}>
              <Text style={styles.menuItemText}>Gerenciar Pedidos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push("/farmacia/admin/manage-users"); }}>
              <Text style={styles.menuItemText}>Gerenciar Usuários</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#FFF', paddingTop:18, paddingHorizontal:18 },
  header:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  backArrow:{ fontSize:22 },
  headerTitle:{ fontSize:18, fontWeight:'600' },
  hamburger:{ width:36, height:36, justifyContent:'center', alignItems:'center' },
  bar:{ width:22, height:2, backgroundColor:'#2D2D2D', marginVertical:2, borderRadius:2 },
  orderCard:{ flexDirection:'row', justifyContent:'space-between', backgroundColor:'#FAFAFA', padding:16, borderRadius:10, marginBottom:12 },
  orderId:{ fontSize:14, fontWeight:'700', color:'#13856B' },
  orderClient:{ fontSize:12, color:'#333' },
  orderTime:{ fontSize:12, color:'#888', marginTop:2 },
  status:{ fontSize:13, fontWeight:'700', paddingHorizontal:10, paddingVertical:4, borderRadius:6, overflow:'hidden', marginBottom:6 },
  orderTotal:{ fontSize:14, fontWeight:'600' },
  backdrop:{ position:'absolute', top:0, bottom:0, left:0, right:0, backgroundColor:'rgba(0,0,0,0.18)' },
  menu:{ position:'absolute', top:0, right:0, bottom:0, width:MENU_WIDTH, backgroundColor:'#FFF', paddingTop:18, paddingHorizontal:18, alignItems:'center' },
  menuClose:{ alignSelf:'flex-end' },
  closeX:{ fontSize:20 },
  menuLogo:{ width:70, height:70, marginTop:6, marginBottom:20 },
  menuItem:{ width:'100%', paddingVertical:14, marginTop:8, alignItems:'center' },
  menuItemText:{ fontSize:15, color:'#333' }
});

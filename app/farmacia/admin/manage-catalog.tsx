// app/farmacia/admin/manage-catalog.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Dimensions,
  Image,
  Alert,
  ActivityIndicator, // Adicionado
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

const LOGO_IMAGE = require("../../../assets/images/logo-flashfarma.png");

// !!! ATUALIZE ESTE IP !!!
const API_URL = 'http://192.168.0.182:3000/produtos';

// Interface do Produto baseado na sua API de backend
interface Product {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  quantidade: number; // Mapeado para Estoque
  criado_em: string;
}

export default function ManageCatalog() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Função para buscar os produtos da API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data.produtos || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      Alert.alert("Erro", "Não foi possível carregar o catálogo.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Garante que os produtos sejam recarregados ao focar na tela (após adicionar/editar/excluir)
  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );
  
  // Lógica de filtro (simplificada para o nome)
  const filteredProducts = products.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#13856B" />
        <Text style={{ marginTop: 10, color: '#555' }}>Carregando catálogo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar Catálogo ({products.length})</Text>
        <TouchableOpacity style={styles.hamburger} onPress={() => setMenuOpen(true)}>
          <View style={styles.bar} />
          <View style={[styles.bar, { width: 18 }]} />
          <View style={[styles.bar, { width: 14 }]} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <TextInput 
          placeholder="Buscar produto..." 
          style={styles.searchInput} 
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/farmacia/admin/add-product")}>
          <Text style={styles.addButtonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>
      
      {/* Filtros (Deixado como MOCK visual, pois a API simples não suporta) */}
      <TouchableOpacity onPress={()=>setFilterOpen(!filterOpen)}>
        <Text style={{marginTop:8, color: '#666'}}>Filtrar por...</Text>
      </TouchableOpacity>
      {filterOpen && (
        <View style={styles.filterBox}>
          <TextInput placeholder="Categoria" style={styles.filterInput} />
          <View style={styles.row}>
            <TextInput placeholder="Estoque" style={[styles.filterInput,styles.half]} />
            <TextInput placeholder="Preço" style={[styles.filterInput,styles.half]} />
          </View>
        </View>
      )}

      {/* LISTA DE PRODUTOS DA API */}
      <ScrollView contentContainerStyle={{paddingBottom:40}}>
        {filteredProducts.length === 0 ? (
          <Text style={{marginTop: 20, textAlign: 'center', color: '#888'}}>Nenhum produto encontrado.</Text>
        ) : (
          filteredProducts.map((p, idx) => (
            <View key={p.id} style={styles.itemCard}>
              <View style={styles.thumb}/> {/* Placeholder para Thumb */}
              <View style={{flex:1}}>
                <Text style={styles.itemName}>{p.nome}</Text>
                <Text style={styles.itemInfo}>
                  R$ {p.preco.toFixed(2).replace('.', ',')} | Estoque: {p.quantidade}
                </Text>
              </View>
              
              {/* Botão de Editar */}
              <TouchableOpacity 
                style={{paddingHorizontal: 10}}
                onPress={() => router.push(`/farmacia/admin/edit-product?id=${p.id}&name=${p.nome}`)}
              > 
                <Text style={{fontSize:16}}>✎</Text>
              </TouchableOpacity>

              {/* Botão de Excluir */}
              <TouchableOpacity 
                style={{paddingLeft: 10}}
                onPress={() => router.push(`/farmacia/admin/exclue-product?id=${p.id}&name=${p.nome}`)}
              > 
                <Text style={{fontSize:16, color: '#E53935'}}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* SIDE MENU (inalterado) */}
      {menuOpen && (
        <>
          <TouchableOpacity style={styles.backdrop} onPress={() => setMenuOpen(false)} />
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuClose} onPress={() => setMenuOpen(false)}>
              <Text style={styles.closeX}>✕</Text>
            </TouchableOpacity>
            <Image source={LOGO_IMAGE} style={styles.menuLogo} resizeMode="contain" />
            <TouchableOpacity style={styles.menuItem} onPress={() => {setMenuOpen(false);router.push("/farmacia/admin");}}>
              <Text style={styles.menuItemText}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => {setMenuOpen(false);router.push("/farmacia/admin/manage-catalog");}}>
              <Text style={styles.menuItemText}>Gerenciar Catálogo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => {setMenuOpen(false);router.push("/farmacia/admin/order-list");}}>
              <Text style={styles.menuItemText}>Gerenciar Pedidos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => {setMenuOpen(false);router.push("/farmacia/admin/manage-users");}}>
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
  container:{flex:1,backgroundColor:"#FFF",paddingTop:18,paddingHorizontal:18},
  header:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
  headerTitle:{fontSize:18,fontWeight:"600"},
  hamburger:{width:36,height:36,justifyContent:"center",alignItems:"center"},
  bar:{width:22,height:2,backgroundColor:"#2D2D2D",marginVertical:2,borderRadius:2},
  searchRow:{flexDirection:"row",alignItems:"center",marginTop:14},
  searchInput:{flex:1,backgroundColor:"#F3F3F3",borderRadius:6,paddingHorizontal:12,paddingVertical:10,marginRight:6},
  addButton:{backgroundColor:"#13856B",paddingVertical:10,paddingHorizontal:14,borderRadius:6},
  addButtonText:{color:"#FFF",fontWeight:"600"},
  filterBox:{backgroundColor:"#FFF",borderWidth:1,borderColor:"#E5E5E5",padding:12,borderRadius:8,marginTop:8},
  filterInput:{backgroundColor:"#F3F3F3",padding:10,borderRadius:6,marginBottom:8},
  row:{flexDirection:"row",justifyContent:"space-between"},
  half:{width:"48%"},
  itemCard:{flexDirection:"row",alignItems:"center",backgroundColor:"#FAFAFA",padding:14,borderRadius:8,marginTop:10},
  thumb:{width:50,height:50,backgroundColor:"#EEE",borderRadius:8,marginRight:12},
  itemName:{fontSize:15,fontWeight:"600"},
  itemInfo:{fontSize:13,color:"#666"},
  backdrop:{position:"absolute",top:0,bottom:0,left:0,right:0,backgroundColor:"rgba(0,0,0,0.18)"},
  menu:{position:"absolute",top:0,right:0,bottom:0,width:MENU_WIDTH,backgroundColor:"#FFF",paddingTop:18,paddingHorizontal:18,alignItems:"center"},
  menuClose:{alignSelf:"flex-end"},
  closeX:{fontSize:20},
  menuLogo:{width:70,height:70,marginTop:6,marginBottom:20},
  menuItem:{width:"100%",paddingVertical:14,marginTop:8,alignItems:"center"},
  menuItemText:{fontSize:15,color:"#333"},
});
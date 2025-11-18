import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Dimensions, Alert, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const LOGO_IMAGE = require("../../../assets/images/logo-flashfarma.png");
// !!! ATUALIZE ESTE IP !!!
const API_URL = 'http://192.168.0.182:3000/produtos';

// Interface do Produto (simplificada)
interface Produto {
  id: number;
  nome: string;
  nome_farmacia: string;
  descricao: string;
  preco: number;
  quantidade_estoque: number;
  imagem_url: string;
}

export default function EditProduct() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = params.id as string; // Assume que o ID vem como string (Ex: /edit-product?id=1)
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estados dos campos, inicializados com strings vazias
  const [nome, setNome] = useState("");
  const [farmaciaName, setFarmaciaName] = useState(""); // NOVO CAMPO
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidadeEstoque, setQuantidadeEstoque] = useState(""); // RENOMEADO (era 'estoque')
  const [imagem, setImagem] = useState("");

  // 1. FUNÇÃO PARA CARREGAR DADOS EXISTENTES (GET)
  const fetchProduct = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`);
      const data = await response.json();

      if (response.ok && data.id) {
        // Preencher os estados com os dados da API
        setNome(data.nome);
        setFarmaciaName(data.nome_farmacia || "");
        setDescricao(data.descricao || "");
        setPreco(data.preco.toFixed(2).replace('.', ',')); // Formatar para exibição
        setQuantidadeEstoque(data.quantidade_estoque.toString());
        setImagem(data.imagem_url || "");
      } else {
        Alert.alert("Erro", data.erro || "Produto não encontrado.");
        router.back();
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      Alert.alert("Erro", "Não foi possível carregar os dados do produto.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados ao iniciar a tela, se o ID existir
  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    } else {
      Alert.alert("Erro", "ID do produto não fornecido.");
      router.back();
    }
  }, [productId]);

  // 2. FUNÇÃO PARA ATUALIZAR DADOS (PUT)
  const handleUpdateProduct = async () => {
    const precoFloat = parseFloat(preco.replace(',', '.'));
    const estoqueInt = parseInt(quantidadeEstoque, 10);

    if (!nome || !farmaciaName || !preco || isNaN(precoFloat)) {
      Alert.alert("Erro", "Nome, Nome da Farmácia e Preço são obrigatórios.");
      return;
    }

    const updatedProduct = {
      nome,
      nome_farmacia: farmaciaName,
      descricao,
      preco: precoFloat,
      quantidade_estoque: isNaN(estoqueInt) ? 0 : estoqueInt,
      imagem_url: imagem || null,
    };

    try {
      const response = await fetch(`${API_URL}/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", `Produto atualizado!`);
        router.back(); 
      } else {
        Alert.alert("Erro", data.erro || "Falha ao atualizar produto.");
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  };


  if (loading) {
     return (
        <View style={styles.centerContainer}>
           <ActivityIndicator size="large" color="#13856B" />
           <Text style={{ marginTop: 10 }}>Carregando produto ID: {productId}...</Text>
        </View>
     );
  }


  return (
    <View style={styles.container}>
      {/* ... Header e Menu (sem alterações no layout) ... */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Editar Produto (ID: {productId})</Text>
        <TouchableOpacity style={styles.hamburger} onPress={() => setMenuOpen(true)}>
          <View style={styles.bar} />
          <View style={[styles.bar, { width: 18 }]} />
          <View style={[styles.bar, { width: 14 }]} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.card}>
          <TextInput placeholder="Nome do Produto" style={styles.input} value={nome} onChangeText={setNome} />
          {/* NOVO CAMPO: NOME DA FARMÁCIA */}
          <TextInput placeholder="Nome da Farmácia" style={styles.input} value={farmaciaName} onChangeText={setFarmaciaName} /> 
          
          <TextInput 
            placeholder="Descrição" 
            style={[styles.input,{height:100,textAlignVertical:"top"}]} 
            multiline 
            value={descricao} 
            onChangeText={setDescricao} 
          />
          <View style={styles.row}>
            <TextInput 
              placeholder="Preço" 
              style={[styles.input, styles.half]} 
              keyboardType="numeric"
              value={preco} 
              onChangeText={setPreco} 
            />
            <TextInput 
              placeholder="Estoque" 
              style={[styles.input, styles.half]} 
              keyboardType="numeric"
              value={quantidadeEstoque} // ESTADO ATUALIZADO
              onChangeText={setQuantidadeEstoque} 
            />
          </View>
          {/* CAMPO 'Categoria' REMOVIDO, pois não está na API */}
          {/* <TextInput placeholder="Categoria" style={styles.input} value={categoria} onChangeText={setCategoria} /> */}
          <Text style={styles.label}>URL da Imagem do Produto</Text>
          <TextInput 
            placeholder="URL da Imagem" 
            style={styles.input} 
            value={imagem} // ESTADO ATUALIZADO
            onChangeText={setImagem} 
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => router.back()}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={() => router.push({ pathname: "/farmacia/admin/exclue-product", params: { id: productId } })}
            > 
              <Text style={styles.deleteText}>Excluir</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProduct}>
               <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ... CÓDIGO DO MENU (sem alterações) ... */}
       {menuOpen && (
         <>
           <TouchableOpacity style={styles.backdrop} onPress={() => setMenuOpen(false)} />
           <View style={styles.menu}>
             <TouchableOpacity style={styles.menuClose} onPress={() => setMenuOpen(false)}><Text style={styles.closeX}>✕</Text></TouchableOpacity>
             <Image source={LOGO_IMAGE} style={styles.menuLogo} resizeMode="contain" />
             <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push("/farmacia/admin/manage-catalog");}}><Text style={styles.menuItemText}>Gerenciar Catálogo</Text></TouchableOpacity>
             <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push("/farmacia/admin/order-list");}}><Text style={styles.menuItemText}>Gerenciar Pedidos</Text></TouchableOpacity>
             <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push("/farmacia/admin/manage-users");}}><Text style={styles.menuItemText}>Gerenciar Usuários</Text></TouchableOpacity>
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
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }, // NOVO ESTILO
  header:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
  headerTitle:{fontSize:18,fontWeight:"600"},
  hamburger:{width:36,height:36,justifyContent:"center",alignItems:"center"},
  bar:{width:22,height:2,backgroundColor:"#2D2D2D",marginVertical:2,borderRadius:2},
  card:{backgroundColor:"#FFF",padding:20,borderRadius:12,marginTop:20,borderWidth:1,borderColor:"#E5E5E5"},
  input:{backgroundColor:"#F3F3F3",padding:12,borderRadius:6,marginBottom:14},
  row:{flexDirection:"row",justifyContent:"space-between"},
  half:{width:"48%"},
  label:{fontSize:14,color:"#444",marginBottom:6,marginTop:6},
  buttonRow:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
  cancelText:{color:"#666",fontSize:15},
  deleteButton:{backgroundColor:"#E64F4F",paddingVertical:12,paddingHorizontal:20,borderRadius:6},
  deleteText:{color:"#FFF",fontWeight:"600"},
  saveButton:{backgroundColor:"#13856B",paddingVertical:12,paddingHorizontal:26,borderRadius:6},
  saveText:{color:"#FFF",fontWeight:"600"},
  backdrop:{position:"absolute",top:0,bottom:0,left:0,right:0,backgroundColor:"rgba(0,0,0,0.18)"},
  menu:{position:"absolute",top:0,right:0,bottom:0,width:MENU_WIDTH,backgroundColor:"#FFF",paddingTop:18,paddingHorizontal:18,alignItems:"center"},
  menuClose:{alignSelf:"flex-end"},
  closeX:{fontSize:20},
  menuLogo:{width:70,height:70,marginTop:6,marginBottom:20},
  menuItem:{width:"100%",paddingVertical:14,marginTop:8,alignItems:"center"},
  menuItemText:{fontSize:15,color:"#333"}
});
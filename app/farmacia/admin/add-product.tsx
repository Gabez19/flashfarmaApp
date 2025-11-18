import React, { useState } from "react"; // CORRIGIDO: => trocado por from
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  Alert
} from "react-native";
import { useRouter } from "expo-router";

const LOGO_IMAGE = require("../../../assets/images/logo-flashfarma.png");
// !!! ATUALIZE ESTE IP !!!
const API_URL = 'http://192.168.0.182:3000/produtos';

export default function AddProduct() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // ESTADOS ATUALIZADOS para campos da API
  const [name, setName] = useState("");
  const [farmaciaName, setFarmaciaName] = useState(""); 
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [quantidadeEstoque, setQuantidadeEstoque] = useState(""); 
  const [imageData, setImageData] = useState("");
  
  // FUNÇÃO DE CRIAÇÃO (POST)
  const handleSaveProduct = async () => {
    // 2.1. Sanitização e Validação
    const precoFloat = parseFloat(price.replace(',', '.'));
    const estoqueInt = parseInt(quantidadeEstoque, 10);

    if (!name || !farmaciaName || !price || isNaN(precoFloat)) {
      Alert.alert("Erro", "Nome, Nome da Farmácia e Preço são obrigatórios.");
      return;
    }

    const newProduct = {
      nome: name,
      nome_farmacia: farmaciaName,
      descricao: desc,
      preco: precoFloat,
      quantidade_estoque: isNaN(estoqueInt) ? 0 : estoqueInt,
      imagem_url: imageData || null,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();

      if (response.ok && data.id) {
        Alert.alert("Sucesso", `Produto "${name}" criado com sucesso!`);
        // Limpar formulário ou voltar
        router.back(); 
      } else {
        Alert.alert("Erro", data.erro || "Falha ao cadastrar produto.");
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor. Verifique o IP e se a API está rodando.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <Text style={styles.headerTitle}>Adicionar Produto</Text>
         <TouchableOpacity style={styles.hamburger} onPress={() => setMenuOpen(true)}>
           <View style={styles.bar} />
           <View style={[styles.bar, { width: 18 }]} />
           <View style={[styles.bar, { width: 14 }]} />
         </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.card}>
          <TextInput 
            placeholder="Nome Do Produto" 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
          />
          {/* NOVO CAMPO: NOME DA FARMÁCIA */}
          <TextInput 
            placeholder="Nome Da Farmácia" 
            style={styles.input} 
            value={farmaciaName} 
            onChangeText={setFarmaciaName} 
          />
          
          <TextInput
            placeholder="Descrição"
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            multiline
            value={desc}
            onChangeText={setDesc}
          />
          <View style={styles.row}>
            <TextInput 
              placeholder="Preço" 
              style={[styles.input, styles.half]} 
              keyboardType="numeric"
              value={price} 
              onChangeText={setPrice} 
            />
            <TextInput 
              placeholder="Estoque" 
              style={[styles.input, styles.half]} 
              keyboardType="numeric"
              value={quantidadeEstoque}
              onChangeText={setQuantidadeEstoque} 
            />
          </View>
          <Text style={styles.label}>URL da Imagem Do Produto</Text>
          <TextInput
            placeholder="URL da Imagem (Ex: https://...)"
            style={styles.input}
            value={imageData}
            onChangeText={setImageData}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            {/* CONECTANDO A FUNÇÃO DE SALVAR */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProduct}> 
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* CÓDIGO DO MENU (sem alterações) */}
      {menuOpen && (
         <>
           <TouchableOpacity style={styles.backdrop} onPress={() => setMenuOpen(false)} />
           <View style={styles.menu}>
             <TouchableOpacity style={styles.menuClose} onPress={() => setMenuOpen(false)}>
               <Text style={styles.closeX}>✕</Text>
             </TouchableOpacity>
             <Image source={LOGO_IMAGE} style={styles.menuLogo} resizeMode="contain" />
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

// ... CÓDIGO DOS STYLES ...
const { width } = Dimensions.get("window");
const MENU_WIDTH = Math.min(320, Math.round(width * 0.72));

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", paddingTop: 18, paddingHorizontal: 18 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  hamburger: { width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  bar: { width: 22, height: 2, backgroundColor: "#2D2D2D", marginVertical: 2, borderRadius: 2 },
  card: { backgroundColor: "#FFF", padding: 20, borderRadius: 12, marginTop: 20, borderWidth: 1, borderColor: "#E5E5E5" },
  input: { backgroundColor: "#F3F3F3", padding: 12, borderRadius: 6, marginBottom: 14 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  half: { width: "48%" },
  label: { fontSize: 14, color: "#444", marginBottom: 6, marginTop: 6 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cancelText: { color: "#666", fontSize: 15 },
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
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

// Importando as imagens diretamente
const BANNER_IMAGE = require('../../assets/images/banner_flashfarma_inicial.png');

// Array com os dados completos dos produtos
const PRODUTOS = [
  {
    name: "Tiras-teste de Glicemia Accu-Chek Active 150 unidades",
    farmacy: "Farmácia A",
    price: "R$ 179,90",
    image: require('../../assets/images/image_medicamento_1.webp')
  },
  {
    name: "Desodorante Antitranspirante Roll-On Perspirex Sem Perfume 20ml",
    farmacy: "Farmácia B",
    price: "R$ 99.99",
    image: require('../../assets/images/image_medicamento_2.webp')
  },
  {
    name: "Tylenol Paracetamol 750mg Dor no Corpo 30 comprimidos",
    farmacy: "Farmácia C",
    price: "R$ 58,79",
    image: require('../../assets/images/image_medicamento_3.webp')
  },
  {
    name: "Doril Acido Acetilsalicilico 500mg + Cafeína 30mg 6 comprimidos",
    farmacy: "Farmácia D",
    price: "R$ 12,30",
    image: require('../../assets/images/image_medicamento_4.webp')
  },
  {
    name: "Soro Fisiológico Cloreto de Sódio 0,9% Needs 250ml",
    farmacy: "Farmácia E",
    price: "R$ 5,90",
    image: require('../../assets/images/image_medicamento_5.webp')
  },
  {
    name: "Polivitamínico Folifer Tutti-Frutti e Caramelo Gotas 30ml",
    farmacy: "Farmácia F",
    price: "R$ 75,30",
    image: require('../../assets/images/image_medicamento_6.webp')
  },
];

// Componente para a seção de produtos
const ProductCard = ({ imageSource, name, farmacy, price }: { imageSource: any, name: string, farmacy: string, price: string }) => (
  <View style={styles.productCard}>
    <Image source={imageSource} style={styles.productImage} />
    {/* Contêiner de informações que vai expandir */}
    <View style={styles.productInfo}>
      <Text style={styles.productName}>{name}</Text>
      <Text style={styles.productFarmacia}>{farmacy}</Text>
      {/* View espaçador que empurra o conteúdo para baixo */}
      <View style={{ flex: 1 }} />
      <View style={styles.productPriceContainer}>
        <Text style={styles.productPrice}>{price}</Text>
        <TouchableOpacity style={styles.buttonBuy}>
          <Text style={styles.buttonBuyText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        {/* Header e Search */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="flash-sharp" size={24} color={Colors.flashGreen} />
            <Text style={styles.logoText}>FlashFarma</Text>
          </View>
          <View style={styles.cartContainer}>
            <Text style={styles.cartText}>Cesta R$ 0,00</Text>
            <Ionicons name="cart-outline" size={24} color="#666" />
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="O que deseja buscar?"
            placeholderTextColor="#C4C4C4"
          />
        </View>

        <View style={styles.zipCodeContainer}>
          <Text style={styles.zipCodeText}>Insira seu CEP</Text>
        </View>

        {/* Categorias */}
        <ScrollView horizontal style={styles.categoriesContainer} showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>Medicamentos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButtonInactive}>
            <Text style={styles.categoryTextInactive}>Suas Ofertas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButtonInactive}>
            <Text style={styles.categoryTextInactive}>Descontos</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image source={BANNER_IMAGE} style={styles.bannerImage} />
        </View>

        {/* Mais Comprados */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Mais comprados</Text>
          <ScrollView horizontal style={styles.productRow} showsHorizontalScrollIndicator={false}>
            {PRODUTOS.slice(0, 3).map((produto, index) => (
              <ProductCard
                key={index}
                imageSource={produto.image}
                name={produto.name}
                farmacy={produto.farmacy}
                price={produto.price}
              />
            ))}
          </ScrollView>
        </View>

        {/* Descontos */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Descontos</Text>
          <ScrollView horizontal style={styles.productRow} showsHorizontalScrollIndicator={false}>
            {PRODUTOS.slice(3, 6).map((produto, index) => (
              <ProductCard
                key={index}
                imageSource={produto.image}
                name={produto.name}
                farmacy={produto.farmacy}
                price={produto.price}
              />
            ))}
          </ScrollView>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.greyBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 5,
  },
  cartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartText: {
    fontSize: 16,
    color: '#666',
    marginRight: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  zipCodeContainer: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  zipCodeText: {
    fontSize: 14,
    color: '#666',
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  categoryButton: {
    backgroundColor: Colors.flashGreen,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryButtonInactive: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  categoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryTextInactive: {
    color: '#666',
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
    height: 120, 
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  sectionContainer: {
    marginTop: 20,
    paddingLeft: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkGreyText,
    marginBottom: 10,
  },
  productRow: {
    flexDirection: 'row',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 150,
    marginRight: 15,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  productInfo: {
    padding: 10,
    // NOVIDADE: Ocupa todo o espaço vertical disponível no card
    flex: 1, 
    // NOVIDADE: A propriedade justifyContent garante que o espaçador faça a mágica.
    justifyContent: 'space-between',
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  productFarmacia: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  productPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  productPrice: {
    fontSize: 16,
    color: Colors.darkGreyText,
    fontWeight: 'bold',
  },
  buttonBuy: {
    backgroundColor: Colors.flashGreen,
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBuyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
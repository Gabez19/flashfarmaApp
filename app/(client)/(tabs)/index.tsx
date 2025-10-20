import React from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { Link } from 'expo-router';

// Dados mockados de categorias e produtos
const MOCKED_CATEGORIES = ['Analgésicos', 'Vitaminas', 'Cuidados Pessoais', 'Higiene', 'Infantil'];
const MOCKED_PRODUCTS = [
    { id: 1, name: "Dipirona Sódica", price: 15.00, pharmacy: "Farmácia A" },
    { id: 2, name: "Vitamina C", price: 37.80, pharmacy: "Farmácia B" },
    { id: 3, name: "Protetor Solar FPS 50", price: 55.90, pharmacy: "Farmácia C" },
    { id: 4, name: "Shampoo Anticaspa", price: 29.99, pharmacy: "Farmácia D" },
];

const CategoryChip = ({ name }: { name: string }) => (
    <TouchableOpacity style={styles.categoryChip}>
        <Text style={styles.categoryText}>{name}</Text>
    </TouchableOpacity>
);

const ProductCard = ({ product }: { product: typeof MOCKED_PRODUCTS[0] }) => (
    <Link href="/product-detail" asChild>
        <TouchableOpacity style={styles.productCard}>
            <View style={styles.productImagePlaceholder}>
                <Ionicons name="medkit-outline" size={30} color="#999" />
            </View>
            <Text style={styles.productCardName} numberOfLines={2}>{product.name}</Text>
            <Text style={styles.productCardPrice}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
        </TouchableOpacity>
    </Link>
);

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Header Fixo - Endereço e Busca */}
            <View style={styles.header}>
                <View style={styles.addressBar}>
                    <Ionicons name="location-outline" size={20} color={Colors.flashGreen} />
                    <Text style={styles.addressText}>Rua das Flores, 123, Centro...</Text>
                    <Ionicons name="chevron-down" size={16} color="#333" />
                </View>
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={20} color="#999" />
                    <TextInput 
                        style={styles.searchInput} 
                        placeholder="Busque por medicamento ou farmácia" 
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Seção de Categorias */}
                <Text style={styles.sectionTitle}>Navegue por Categorias</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                    {MOCKED_CATEGORIES.map(cat => <CategoryChip key={cat} name={cat} />)}
                </ScrollView>

                {/* Destaques */}
                <Text style={styles.sectionTitle}>Destaques da Semana</Text>
                <View style={styles.productsGrid}>
                    {MOCKED_PRODUCTS.slice(0, 2).map(product => <ProductCard key={product.id} product={product} />)}
                </View>

                {/* Produtos em Oferta */}
                <Text style={styles.sectionTitle}>Farmácias Próximas</Text>
                <View style={styles.productsGrid}>
                    {MOCKED_PRODUCTS.map(product => <ProductCard key={product.id} product={product} />)}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 15,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    addressBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingTop: 5,
    },
    addressText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 15,
        fontWeight: 'bold',
        color: Colors.darkGreyText,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.greyBackground,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
    },
    scrollContent: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.darkGreyText,
        marginBottom: 10,
        marginTop: 10,
    },
    categoriesContainer: {
        marginBottom: 20,
    },
    categoryChip: {
        backgroundColor: Colors.flashGreen,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
    },
    categoryText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    productCard: {
        width: '48%', // Quase metade para ter 2 por linha com espaço
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
        padding: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    productImagePlaceholder: {
        height: 100,
        backgroundColor: Colors.greyBackground,
        borderRadius: 6,
        marginBottom: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    productCardName: {
        fontSize: 14,
        fontWeight: '500',
        height: 40, // Altura fixa para nome de 2 linhas
        color: Colors.darkGreyText,
    },
    productCardPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.flashGreen,
        marginTop: 5,
    },
});
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useCart, CartItem } from './../contexts/CartContext';

// !!! ATUALIZE ESTE IP com o seu IP local ou URL do servidor !!!
const API_URL = 'http://192.168.0.182:3000/produtos';

// =======================================================
// CONSTANTES (Apenas imagens locais de UI, sem ProductImages)
// =======================================================
const BANNER_IMAGE = require('../../assets/images/banner_flashfarma_inicial.png');
const LOGO_IMAGE = require('../../assets/images/logo-flashfarma.png');

interface Product {
    id: string;
    // Campos da API:
    name: string; // Mapeado de 'nome'
    price: number; // Mapeado de 'preco'
    descricao: string;
    nome_farmacia: string; // CAMPO DA API
    quantidade_estoque: number; // CAMPO DA API
    imagem_url: string; // CAMPO DA API (URL para a imagem)
    // Campos MOCK para UI (Mantidos para fins de filtro/desconto)
    category: string;
    discount?: number;
}

const ProductCard = ({ item, router }: { item: Product, router: any }) => {
    const { add } = useCart();
    // O desconto é um mock, mas o preço base é da API
    const finalPrice = item.discount ? item.price * (1 - item.discount) : item.price;
    // URL padrão caso a API retorne null ou vazio
    const imageUrl = item.imagem_url || 'https://via.placeholder.com/200/cccccc/333333?text=Sem+Imagem';

    const handleAddToCart = () => {
        const cartItem: CartItem = {
            id: String(item.id),
            name: item.name,
            price: finalPrice,
            image: imageUrl, // USANDO AGORA A URL DA API
            qty: 1,
        };
        add(cartItem);
    };

    return (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => router.push(`/cliente/ProductDetails?id=${item.id}`)}
        >
            <View style={styles.productImagePlaceholder}>
                <Image
                    // CORRIGIDO: Usa a URL diretamente, sem require, como {{ uri: ... }}
                    source={{ uri: imageUrl }}
                    style={styles.productImage}
                    resizeMode="contain"
                />
            </View>
            <Text style={styles.productName}>{item.name}</Text>
            {/* CORRIGIDO: Usa nome_farmacia da API */}
            <Text style={styles.productFarmacia}>{item.nome_farmacia}</Text>
            <View style={styles.priceRow}>
                <Text style={styles.productPrice}>R$ {finalPrice.toFixed(2).replace('.', ',')}</Text>
                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                    <Ionicons name="add-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const NavbarButton = ({
    iconName,
    label,
    isActive = false,
    onPress,
}: {
    iconName: string;
    label: string;
    isActive?: boolean;
    onPress?: () => void;
}) => (
    <TouchableOpacity style={styles.navbarButton} onPress={onPress}>
        <Ionicons
            name={isActive ? iconName.replace('-outline', '') : iconName}
            size={24}
            color={isActive ? '#24BF38' : '#888'}
        />
        <Text style={[styles.navbarLabel, isActive && { color: '#24BF38', fontWeight: 'bold' }]}>
            {label}
        </Text>
    </TouchableOpacity>
);

export default function Index() {
    const router = useRouter();
    const { total } = useCart();
    const [produtos, setProdutos] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProductsFromApi = async () => {
            setLoading(true);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                const data = await response.json();
                
                // Mapeia os dados da API para a interface de Produto da UI
                const mappedProducts: Product[] = (data.produtos || []).map((p: any, index: number) => {
                    const productId = Number(p.id); 
                    
                    return {
                        id: String(p.id),
                        name: p.nome,
                        price: p.preco,
                        descricao: p.descricao,
                        nome_farmacia: p.nome_farmacia || 'Farmácia Local', // Campo da API
                        quantidade_estoque: p.quantidade_estoque, // Campo da API
                        imagem_url: p.imagem_url, // Campo da API
                        // MOCKS mantidos apenas para fins de filtro e UI visual (category/discount):
                        category: productId % 2 === 0 ? 'higiene' : 'medicamentos',
                        discount: productId % 3 === 0 ? 0.15 : undefined,
                    };
                });

                setProdutos(mappedProducts);

            } catch (error) {
                console.error('Erro ao carregar produtos da API:', error);
                Alert.alert("Erro de Conexão", "Não foi possível carregar os produtos. Verifique se o servidor da API está rodando.");
            } finally {
                setLoading(false);
            }
        };
        loadProductsFromApi();
    }, []);

    if (loading) {
        return (
            <View style={[styles.fullScreenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#24BF38" />
                <Text style={{ fontSize: 18, color: '#24BF38', marginTop: 10 }}>Carregando produtos...</Text>
            </View>
        );
    }

    const listaMaisComprados = produtos.slice(0, 3);
    const comDesconto = produtos.filter(p => p.discount);
    const medicamentos = produtos.filter(p => p.category === 'medicamentos');
    const screenWidth = Dimensions.get('window').width;

    const handleLogout = () => {
        router.push('/'); 
    };

    return (
        <View style={styles.fullScreenContainer}>
            <ScrollView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image source={LOGO_IMAGE} style={styles.logoIcon} />
                        <Text style={styles.logo}>FlashFarma</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.cartContainer}
                        onPress={() => router.push('/cliente/Cart')}
                    >
                        <Text style={styles.cartText}>Cesta</Text>
                        <Text style={styles.cartValue}>R$ {total.toFixed(2).replace('.', ',')}</Text>
                        <Ionicons name="basket-outline" size={20} color="#24BF38" style={styles.cartIcon} />
                    </TouchableOpacity>
                </View>

                {/* Busca */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
                    <TextInput
                        placeholder="O que deseja buscar?"
                        style={styles.search}
                        placeholderTextColor="#888"
                    />
                </View>

                {/* CEP */}
                <TextInput
                    placeholder="Insira seu CEP"
                    style={styles.cep}
                    keyboardType="numeric"
                    placeholderTextColor="#555"
                />

                {/* Botões de categoria */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.buttonsRow}>
                    <TouchableOpacity style={styles.categoryButton}>
                        <Text style={styles.categoryText}>Medicamentos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.categoryButton}>
                        <Text style={styles.categoryText}>Suas Ofertas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.categoryButton}>
                        <Text style={styles.categoryText}>Descontos</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Banner */}
                <View style={styles.bannerContainer}>
                    <Image
                        source={BANNER_IMAGE}
                        style={[styles.bannerImage, { width: screenWidth - 32 }]}
                        resizeMode="cover"
                    />
                </View>

                {/* Mais comprados */}
                <Text style={styles.sectionTitle}>Mais comprados</Text>
                <FlatList
                    horizontal
                    data={listaMaisComprados}
                    keyExtractor={item => 'mc-' + item.id}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <ProductCard
                            item={item}
                            router={router}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                />

                {/* Descontos */}
                <Text style={styles.sectionTitle}>Descontos</Text>
                <FlatList
                    horizontal
                    data={comDesconto}
                    keyExtractor={item => 'desc-' + item.id}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <ProductCard
                            item={item}
                            router={router}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                />

                {/* Medicamentos */}
                <Text style={styles.sectionTitle}>Medicamentos em Destaque</Text>
                <FlatList
                    horizontal
                    data={medicamentos}
                    keyExtractor={item => 'med-' + item.id}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <ProductCard
                            item={item}
                            router={router}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            </ScrollView>

            {/* Navbar */}
            <View style={styles.navbar}>
                <NavbarButton
                    iconName="home-outline"
                    label="Início"
                    isActive={true}
                    onPress={() => router.push('/cliente')}
                />
                <NavbarButton
                    iconName="receipt-outline"
                    label="Pedidos"
                    onPress={() => router.push('/cliente/Orders/OrderList')}
                />
                <NavbarButton
                    iconName="log-out-outline"
                    label="Sair"
                    onPress={handleLogout}
                />
            </View>
        </View>
    );
}

// --- ESTILOS (inalterados) ---
const styles = StyleSheet.create({
    fullScreenContainer: { flex: 1, backgroundColor: '#F6FFF6' },
    container: { flex: 1, paddingHorizontal: 16 },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 40,
        marginBottom: 10,
    },
    logoContainer: { flexDirection: 'row', alignItems: 'center' },
    logoIcon: { width: 24, height: 24, marginRight: 4 },
    logo: { fontSize: 22, fontWeight: '900', color: '#24BF38' },
    cartContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cartText: { fontSize: 12, color: '#000', marginRight: 4 },
    cartValue: { fontSize: 14, fontWeight: 'bold', color: '#24BF38' },
    cartIcon: { marginLeft: 6 },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    searchIcon: { marginRight: 8 },
    search: { flex: 1, padding: 0, fontSize: 16 },
    cep: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },

    buttonsRow: { marginBottom: 16 },
    categoryButton: {
        backgroundColor: '#24BF38',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginRight: 10,
    },
    categoryText: { color: '#fff', fontWeight: 'bold' },

    bannerContainer: {
        height: 120,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#24BF3833',
    },
    bannerImage: { height: '100%' },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
        marginTop: 15,
    },
    listContent: { paddingBottom: 10 },
    productCard: {
        width: 140,
        padding: 10,
        marginRight: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
        marginBottom: 5,
    },
    productImagePlaceholder: {
        height: 80,
        backgroundColor: '#fff',
        borderRadius: 6,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    productImage: { width: '100%', height: '100%', borderRadius: 6 },
    productName: { fontSize: 13, fontWeight: '600', height: 32, overflow: 'hidden' },
    productFarmacia: { fontSize: 11, color: '#888', marginBottom: 4 },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
    },
    productPrice: { fontSize: 15, fontWeight: 'bold', color: '#24BF38' },
    addToCartButton: {
        backgroundColor: '#24BF38',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },

    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 60,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingBottom: 5,
    },
    navbarButton: { alignItems: 'center', padding: 5 },
    navbarLabel: { fontSize: 10, color: '#888', marginTop: 2 },
});
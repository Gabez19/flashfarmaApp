import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
// Importa ícones para um visual mais rico
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// CORREÇÃO AQUI: Ajuste no caminho para subir um nível (..) e acessar a pasta contexts
import { useCart, CartItem } from '../contexts/CartContext';

// =======================================================
// INTERFACES E CONFIGURAÇÃO (Duplicado de HomeCliente.tsx para tipagem)
// =======================================================

interface DataModule {
    products: Product[];
    farmacias: Farmacia[];
    users: any[];
    orders: any[];
}

interface Product {
    id: string;
    name: string;
    price: number;
    farmaciaId: string;
    stock: number;
    image: string; // Caminho da imagem no data.json
    category: string;
    description?: string; // Adicionado para garantir tipagem da descrição
    discount?: number;
}

interface Farmacia {
    id: string;
    name: string;
}

// Mapeamento de imagens (Importante para React Native com require)
const ProductImages: { [key: string]: any } = {
    "assets/images/image_medicamento_1.webp": require('../../assets/images/image_medicamento_1.webp'),
    "assets/images/image_medicamento_2.webp": require('../../assets/images/image_medicamento_2.webp'),
    "assets/images/image_medicamento_3.webp": require('../../assets/images/image_medicamento_3.webp'),
    "assets/images/image_medicamento_4.webp": require('../../assets/images/image_medicamento_4.webp'),
    "assets/images/image_medicamento_5.webp": require('../../assets/images/image_medicamento_5.webp'),
    "assets/images/image_medicamento_6.webp": require('../../assets/images/image_medicamento_6.webp'),
};

export default function ProductDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { add } = useCart(); // Hook para adicionar ao carrinho

    const [produto, setProduto] = useState<Product | null>(null);
    const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Carrega o data.json de forma assíncrona
                const module = await import('../../data/data.json');
                const data = module.default as unknown as DataModule;

                // Encontra o produto e as farmácias
                const foundProduct = data.products.find(p => p.id === id);
                setProduto(foundProduct || null);
                setFarmacias(data.farmacias);

            } catch (error) {
                console.error('Erro ao carregar dados do produto:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadData();
        } else {
            setLoading(false);
        }
    }, [id]);

    const getFarmaciaName = (farmaciaId: string): string => {
        const farmacia = farmacias.find(f => f.id === farmaciaId);
        return farmacia ? farmacia.name : 'Farmácia Desconhecida';
    };

    // --- Lógica de Carregamento e Erro ---
    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center' } as ViewStyle]}>
                <ActivityIndicator size="large" color="#24BF38" />
                <Text style={{ marginTop: 10, color: '#555' }}>Buscando detalhes...</Text>
            </View>
        );
    }

    if (!produto) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Produto não encontrado ou ID inválido.</Text>
                <TouchableOpacity style={[styles.button, { marginTop: 20, backgroundColor: '#FF6F00' } as ViewStyle]} onPress={() => router.back()}>
                    <Text style={styles.buttonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // --- Lógica de Preços e Desconto ---
    const precoOriginal = produto.price;
    const precoFinal = produto.discount
        ? produto.price * (1 - produto.discount)
        : produto.price;

    // --- Lógica do Carrinho ---
    const handleAddToCart = () => {
        const cartItem: CartItem = {
            id: produto.id,
            name: produto.name,
            price: precoFinal,
            image: produto.image,
            qty: 1, // Adiciona 1 unidade por padrão
        };
        add(cartItem);
        // Opcional: Feedback ao usuário ou navegação
        router.push('/cliente/Cart');
    };

    // --- Renderização Principal ---
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.imageContainer as ViewStyle}>
                <Image
                    // Usa o mapeamento de require para carregar a imagem local
                    source={ProductImages[produto.image] || { uri: 'https://placehold.co/200x200/cccccc/333333?text=Sem+Imagem' }}
                    style={styles.image as ImageStyle}
                    resizeMode="contain"
                />
                {produto.discount && (
                    <View style={styles.badgeDiscount as ViewStyle}>
                        <Text style={styles.badgeText as TextStyle}>-{Math.round(produto.discount * 100)}%</Text>
                    </View>
                )}
            </View>

            <View style={styles.detailsBlock as ViewStyle}>
                <Text style={styles.name as TextStyle}>{produto.name}</Text>
                
                {/* Informações da Farmácia */}
                <View style={styles.farmaciaRow as ViewStyle}>
                    <Ionicons name="storefront-outline" size={16} color="#666" />
                    <Text style={styles.farmacia as TextStyle}>{getFarmaciaName(produto.farmaciaId)}</Text>
                </View>

                {/* Bloco de Preço */}
                <View style={styles.priceBlock as ViewStyle}>
                    {produto.discount ? (
                        <View style={styles.priceRow as ViewStyle}>
                            <Text style={styles.priceOriginal as TextStyle}>R$ {precoOriginal.toFixed(2)}</Text>
                            <Text style={styles.price as TextStyle}>R$ {precoFinal.toFixed(2)}</Text>
                        </View>
                    ) : (
                        <Text style={[styles.price, { fontSize: 24, fontWeight: '700' } as TextStyle]}>R$ {precoFinal.toFixed(2)}</Text>
                    )}
                    <View style={styles.stockRow as ViewStyle}>
                        <MaterialCommunityIcons name="check-circle" size={14} color="#24BF38" />
                        <Text style={styles.stockText as TextStyle}> {produto.stock} unidades em estoque</Text>
                    </View>
                </View>

                {/* Descrição */}
                <Text style={styles.sectionTitle as TextStyle}>Detalhes do Produto</Text>
                <Text style={styles.description as TextStyle}>
                    {produto.description || 'Sem descrição detalhada disponível.'}
                </Text>
            </View>


            <TouchableOpacity
                style={styles.button as ViewStyle}
                onPress={handleAddToCart}
            >
                <Ionicons name="cart-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText as TextStyle}>Adicionar à cesta</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

// =======================================================
// ESTILOS
// =======================================================
const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#F6FFF6',
        flexGrow: 1,
    },
    
    // Imagem e Badge
    imageContainer: {
        width: '100%',
        height: 250,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '80%',
        height: '80%',
        borderRadius: 8,
    },
    badgeDiscount: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#FF6F00',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },

    // Detalhes
    detailsBlock: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    name: {
        fontSize: 24,
        fontWeight: '900',
        color: '#333',
        marginBottom: 8,
        textAlign: 'left',
    },

    // Farmácia
    farmaciaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    farmacia: {
        fontSize: 15,
        color: '#666',
        marginLeft: 8,
        fontWeight: '500',
    },

    // Preços e Estoque
    priceBlock: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 15,
        marginBottom: 20,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 4,
    },
    priceOriginal: {
        fontSize: 18,
        color: '#999',
        textDecorationLine: 'line-through',
        marginRight: 10,
        fontWeight: '500',
    },
    price: {
        fontSize: 24,
        color: '#24BF38',
        fontWeight: 'bold',
    },
    stockRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    stockText: {
        fontSize: 13,
        color: '#24BF38',
        marginLeft: 4,
    },

    // Descrição
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
        marginTop: 5,
    },
    description: {
        fontSize: 15,
        color: '#444',
        lineHeight: 22,
        marginBottom: 10,
        textAlign: 'left',
    },

    // Botão Principal
    button: {
        backgroundColor: '#24BF38',
        paddingVertical: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 18,
    },
    
    // Erro
    error: {
        fontSize: 18,
        color: '#FF6347',
        textAlign: 'center',
        marginTop: 50,
    },
});

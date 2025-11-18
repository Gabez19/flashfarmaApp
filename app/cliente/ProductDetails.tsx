import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useCart, CartItem } from '../contexts/CartContext';

// !!! ATUALIZE ESTE IP com o seu IP local ou URL do servidor !!!
const API_URL = 'http://192.168.0.182:3000/produtos';

// =======================================================
// INTERFACES E CONFIGURAÇÃO (API-DRIVEN)
// =======================================================

interface Product {
    id: string; 
    name: string; // Mapeado de 'nome'
    price: number; // Mapeado de 'preco'
    descricao: string; // Mapeado de 'descricao'
    
    // CAMPOS DA API:
    nome_farmacia: string; // Nome da farmácia
    quantidade_estoque: number; // Estoque
    imagem_url: string; // URL da imagem
    
    // Mapeamento e Mocks de UI:
    description: string; 
    discount?: number; 
}

export default function ProductDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { add } = useCart(); 

    const [produto, setProduto] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    // NOVO ESTADO: Quantidade selecionada pelo usuário
    const [selectedQty, setSelectedQty] = useState(1);

    useEffect(() => {
        const loadProductDetails = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/${id}`);
                if (response.status === 404) {
                    setProduto(null); 
                    return;
                }
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                const data = await response.json();

                const productId = Number(data.id);
                const estoqueInicial = data.quantidade_estoque || 0;

                const mappedProduct: Product = {
                    id: String(data.id),
                    name: data.nome,
                    price: data.preco,
                    descricao: data.descricao || 'Sem descrição detalhada.',
                    nome_farmacia: data.nome_farmacia || 'Farmácia Indisponível',
                    quantidade_estoque: estoqueInicial,
                    imagem_url: data.imagem_url, 
                    description: data.descricao || 'Sem descrição detalhada disponível.', 
                    discount: productId % 2 === 0 ? 0.10 : undefined, 
                };
                
                setProduto(mappedProduct);
                // Define a quantidade inicial para 1, se houver estoque
                setSelectedQty(estoqueInicial > 0 ? 1 : 0);

            } catch (error) {
                console.error('Erro ao buscar detalhes do produto:', error);
                Alert.alert("Erro de Conexão", "Não foi possível carregar os detalhes do produto.");
            } finally {
                setLoading(false);
            }
        };

        loadProductDetails();
    }, [id]);

    // NOVO: Lógica para alterar a quantidade selecionada
    const handleQtyChange = (delta: number) => {
        setSelectedQty(prevQty => {
            const newQty = prevQty + delta;
            const maxStock = produto?.quantidade_estoque || 0;
            
            // Não permite quantidade menor que 1
            if (newQty < 1) return 1;
            // Não permite quantidade maior que o estoque
            if (newQty > maxStock) return maxStock;
            
            return newQty;
        });
    };

    // --- Lógica de Carregamento e Erro ---
    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color="#24BF38" />
                <Text style={{ marginTop: 10, color: '#555' }}>Buscando detalhes...</Text>
            </View>
        );
    }

    if (!produto) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.error}>Produto não encontrado ou ID inválido ({id}).</Text>
                <TouchableOpacity style={[styles.button, { marginTop: 20, backgroundColor: '#FF6F00', width: '80%' }]} onPress={() => router.back()}>
                    <Text style={styles.buttonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const precoOriginal = produto.price;
    const precoFinal = produto.discount
        ? produto.price * (1 - produto.discount)
        : produto.price;
        
    const imageUrl = produto.imagem_url || 'https://via.placeholder.com/200/cccccc/333333?text=Sem+Imagem';
    const estoque = produto.quantidade_estoque;

    // --- Lógica do Carrinho CORRIGIDA ---
    const handleAddToCart = () => {
        if (selectedQty < 1) {
             Alert.alert("Erro", "Selecione pelo menos 1 item para adicionar à cesta.");
             return;
        }

        const cartItem: CartItem = {
            id: produto.id,
            name: produto.name,
            price: precoFinal,
            image: imageUrl, 
            qty: selectedQty, // USANDO A QUANTIDADE SELECIONADA
        };
        add(cartItem);
        Alert.alert("Sucesso", `${selectedQty}x ${produto.name} adicionado(s) à cesta!`);
        
        // NOVO: Navega para o carrinho após adicionar
        router.push('/cliente/Cart'); 
    };

    // --- Renderização Principal ---
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="contain"
                />
                {produto.discount && (
                    <View style={styles.badgeDiscount}>
                        <Text style={styles.badgeText}>-{Math.round(produto.discount * 100)}%</Text>
                    </View>
                )}
            </View>

            <View style={styles.detailsBlock}>
                <Text style={styles.name}>{produto.name}</Text>
                
                {/* Informações da Farmácia */}
                <View style={styles.farmaciaRow}>
                    <Ionicons name="storefront-outline" size={16} color="#666" />
                    <Text style={styles.farmacia}>{produto.nome_farmacia}</Text>
                </View>

                {/* Bloco de Preço e Estoque */}
                <View style={styles.priceBlock}>
                    {produto.discount ? (
                        <View style={styles.priceRow}>
                            <Text style={styles.priceOriginal}>R$ {precoOriginal.toFixed(2).replace('.', ',')}</Text>
                            <Text style={styles.price}>R$ {precoFinal.toFixed(2).replace('.', ',')}</Text>
                        </View>
                    ) : (
                        <Text style={[styles.price, { fontSize: 24, fontWeight: '700' }]}>R$ {precoFinal.toFixed(2).replace('.', ',')}</Text>
                    )}
                    
                    {/* Estoque */}
                    <View style={styles.stockRow}>
                        <MaterialCommunityIcons name="check-circle" size={14} color={estoque > 0 ? "#24BF38" : "#FF6F00"} />
                        <Text style={[styles.stockText, { color: estoque > 0 ? "#24BF38" : "#FF6F00" }]}> 
                            {estoque} unidades em estoque
                        </Text>
                    </View>
                </View>

                {/* NOVO: Controles de Quantidade */}
                {estoque > 0 && (
                    <View style={styles.quantityControlContainer}>
                        <Text style={styles.sectionTitle}>Quantidade</Text>
                        <View style={styles.quantitySelector}>
                            <TouchableOpacity 
                                style={[styles.quantityButton, selectedQty <= 1 && {backgroundColor: '#ccc'}]} 
                                onPress={() => handleQtyChange(-1)} 
                                disabled={selectedQty <= 1}
                            >
                                <Text style={styles.quantityButtonText}>-</Text>
                            </TouchableOpacity>
                            
                            <Text style={styles.quantityText}>{selectedQty}</Text>
                            
                            <TouchableOpacity 
                                style={[styles.quantityButton, selectedQty >= estoque && {backgroundColor: '#ccc'}]}
                                onPress={() => handleQtyChange(1)} 
                                disabled={selectedQty >= estoque}
                            >
                                <Text style={styles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Descrição */}
                <Text style={styles.sectionTitle}>Detalhes do Produto</Text>
                <Text style={styles.description}>
                    {produto.description}
                </Text>
            </View>

            <TouchableOpacity
                // Cor do botão baseada na disponibilidade
                style={[styles.button, { backgroundColor: estoque > 0 ? '#24BF38' : '#ccc' }]}
                onPress={handleAddToCart}
                disabled={estoque === 0 || selectedQty === 0}
            >
                <Ionicons name="cart-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>
                    {estoque > 0 ? `Adicionar ${selectedQty} à cesta` : "Produto indisponível"}
                </Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

// =======================================================
// ESTILOS (Adicionado estilos para a seção de quantidade)
// =======================================================
const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#F6FFF6',
        flexGrow: 1,
    },
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
        marginLeft: 4,
    },
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
    // NOVOS ESTILOS PARA QUANTIDADE
    quantityControlContainer: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 15,
        marginBottom: 20,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 150, // Limita a largura do seletor
        marginTop: 5,
    },
    quantityButton: {
        backgroundColor: '#24BF38',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    quantityText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    // BOTÃO PRINCIPAL
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
    error: {
        fontSize: 18,
        color: '#FF6347',
        textAlign: 'center',
        marginTop: 50,
    },
});
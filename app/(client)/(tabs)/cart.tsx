import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';

// Dados mockados para simular um carrinho
const MOCKED_CART_ITEMS = [
    { id: 1, name: "Dipirona Sódica 500mg", price: 15.00, qty: 1 },
    { id: 2, name: "Vitamina C 1000mg", price: 37.80, qty: 2 },
];

const CartItem = ({ item }: { item: typeof MOCKED_CART_ITEMS[0] }) => (
    <View style={styles.cartItem}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}</Text>
    </View>
);

export default function CartScreen() {
    // Estado para simular se o carrinho está vazio ou cheio (baseado nas suas imagens)
    const [cartState] = useState<'empty' | 'full'>('full'); // Altere para 'empty' para testar a outra tela
    
    const isCartEmpty = cartState === 'empty';
    const totalValue = MOCKED_CART_ITEMS.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Carrinho ({isCartEmpty ? 0 : MOCKED_CART_ITEMS.length})</Text>
            </View>

            {isCartEmpty ? (
                // Layout de carrinho vazio (Image 3f1ca2)
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={80} color={Colors.flashGreen} />
                    <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>
                    <Text style={styles.emptySubtitle}>Vá às compras!</Text>
                    <Link href="/" asChild>
                        <TouchableOpacity style={styles.buttonEmpty}>
                            <Text style={styles.buttonText}>Ver Produtos</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            ) : (
                // Layout de carrinho cheio (Image 3f1ca3)
                <View style={{ flex: 1 }}>
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.cartList}>
                            {MOCKED_CART_ITEMS.map(item => <CartItem key={item.id} item={item} />)}
                        </View>
                        
                        <View style={styles.summaryContainer}>
                            <Text style={styles.summaryTitle}>Resumo do Pedido</Text>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Subtotal</Text>
                                <Text style={styles.summaryValue}>R$ {totalValue.toFixed(2).replace('.', ',')}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Desconto (10%)</Text>
                                <Text style={[styles.summaryValue, { color: 'red' }]}>- R$ {(totalValue * 0.1).toFixed(2).replace('.', ',')}</Text>
                            </View>
                            <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10, marginTop: 10 }]}>
                                <Text style={styles.totalLabel}>Total a pagar</Text>
                                <Text style={styles.totalValue}>R$ {(totalValue * 0.9).toFixed(2).replace('.', ',')}</Text>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Botão de Finalizar Pedido */}
                    <View style={styles.footer}>
                        <Link href="/payment-methods" asChild>
                            <TouchableOpacity style={styles.buttonCheckout}>
                                <Text style={styles.buttonText}>Finalizar Pedido</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.greyBackground,
    },
    header: {
        padding: 15,
        backgroundColor: Colors.flashGreen,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    // Estilos para Carrinho Vazio
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        color: Colors.darkGreyText,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    buttonEmpty: {
        backgroundColor: Colors.flashGreen,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    // Estilos para Carrinho Cheio
    scrollView: {
        flex: 1,
        padding: 15,
    },
    cartList: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    cartItemName: {
        fontSize: 16,
        color: Colors.darkGreyText,
        flexShrink: 1,
        paddingRight: 10,
    },
    cartItemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.darkGreyText,
    },
    summaryContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.darkGreyText,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.darkGreyText,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.flashGreen,
    },
    footer: {
        padding: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    buttonCheckout: {
        backgroundColor: Colors.flashGreen,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
});
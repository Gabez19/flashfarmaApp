import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
// Ícones do React Native
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// Importa o Hook e a Tipagem do seu novo Contexto de Pedidos
import { useOrders, Order } from './../../contexts/OrdersContext';
import { CartItem } from './../../contexts/CartContext'; // Importando CartItem
import { useRouter } from 'expo-router'; // Importa useRouter

// --- 1. Tipagem e Mapeamento de Status (RN) ---

// Mapeamento de Status para Ícones e Cores
const getStatusInfo = (status: Order['status']) => {
    switch (status) {
        case 'Aguardando aceitação':
            return { icon: 'timer-outline', color: '#9CA3AF', name: 'Ionicons' };
        case 'Farmácia aceitou':
            return { icon: 'checkbox-marked-circle-outline', color: '#3B82F6', name: 'MaterialCommunityIcons' };
        case 'Em preparo':
            return { icon: 'package-variant-closed', color: '#4F46E5', name: 'MaterialCommunityIcons' };
        case 'Em entrega':
            return { icon: 'truck-fast-outline', color: '#F59E0B', name: 'MaterialCommunityIcons' };
        case 'Entregue':
            return { icon: 'home-outline', color: '#10B981', name: 'MaterialCommunityIcons' };
        case 'Cancelado':
            return { icon: 'close-circle-outline', color: '#EF4444', name: 'MaterialCommunityIcons' };
        default:
            return { icon: 'cube-outline', color: '#4B5563', name: 'Ionicons' };
    }
};

// --- 2. Componente de Item do Pedido (Novo) ---
const OrderItemRow = ({ item }: { item: CartItem }) => (
    <View style={styles.orderItemRow}>
        <Text style={styles.orderItemQty}>{item.qty}x</Text>
        <Text style={styles.orderItemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.orderItemPrice}>R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}</Text>
    </View>
);


// --- 3. Componente Individual do Cartão de Pedido (Atualizado) ---

const OrderCard = ({ order, router }: { order: Order, router: any }) => {
    const statusInfo = getStatusInfo(order.status);
    
    // Seleciona o componente de ícone correto baseado no nome
    const IconComponent = statusInfo.name === 'Ionicons' ? Ionicons : MaterialCommunityIcons;

    // Função de navegação para a tela de status
    const handlePress = () => {
        // Se você usar o expo-router para passar o objeto completo do pedido
        // Você pode serializar o objeto para a rota ou passar apenas o ID
        router.push({
            pathname: '/cliente/Orders/DeliveryStatus',
            params: { 
                orderId: order.id,
                status: order.status,
                total: order.total.toFixed(2),
                // Aqui você passaria o objeto OrderData se quisesse evitar o mock:
                // orderData: JSON.stringify(order) 
            },
        });
    };

    return (
        <TouchableOpacity
            style={[styles.card, { borderLeftColor: statusInfo.color }]}
            onPress={handlePress} // Navega para a tela de status
        >
            <View style={styles.header}>
                <Text style={styles.orderId}>Pedido #{order.id.substring(0, 8)}</Text>
                <IconComponent name={statusInfo.icon} size={28} color={statusInfo.color} />
            </View>

            <View style={styles.statusContainer}>
                <Text style={styles.statusLabel}>Status:</Text>
                <Text style={[styles.statusText, { color: statusInfo.color }]}>
                    {order.status}
                </Text>
            </View>

            <Text style={styles.itemsTitle}>Itens do Pedido ({order.items.length})</Text>

            {/* Lista de Produtos */}
            <View style={styles.itemsListContainer}>
                {order.items.map((item, index) => (
                    <OrderItemRow key={index} item={item} />
                ))}
            </View>
            
            <Text style={styles.addressText}>
                Entrega em: {order.address.split(' - ')[0]}
            </Text>
            
            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total Pago</Text>
                <Text style={styles.totalValue}>R$ {order.total.toFixed(2).replace('.', ',')}</Text>
            </View>
        </TouchableOpacity>
    );
};

// --- 4. Componente Principal (Lista) ---

export default function OrderList() {
    const router = useRouter(); 
    const { orders } = useOrders();

    const renderItem = ({ item }: { item: Order }) => (
        <OrderCard order={item} router={router} />
    );

    return (
        <View style={styles.container}>
            {/* Cabeçalho */}
            <View style={styles.headerBar}>
                <Text style={styles.headerTitle}>Meus Pedidos ({orders.length})</Text>
            </View>

            {/* Lista de Pedidos */}
            {orders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="receipt-outline" size={60} color="#D1D5DB" /> 
                    <Text style={styles.emptyTitle}>Nenhum Pedido Encontrado</Text>
                    <Text style={styles.emptySubtitle}>Faça sua primeira compra para acompanhar!</Text>
                    <TouchableOpacity 
                        style={styles.homeButton} 
                        onPress={() => router.push('/cliente')}
                    >
                        <Text style={styles.homeButtonText}>Ir para a Home</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
}

// --- 5. Estilização (RN) ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // Cor de fundo suave
    },
    headerBar: {
        padding: 15,
        backgroundColor: '#10B981', // Verde
        paddingTop: 40, // Espaço para status bar
        alignItems: 'center',
        marginBottom: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    listContent: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        borderLeftWidth: 5, // Destaque lateral pela cor do status
        borderLeftColor: '#4B5563', 
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 8,
        marginBottom: 8,
    },
    orderId: {
        fontSize: 14,
        fontWeight: '700',
        color: '#374151',
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#374151',
    },
    statusText: {
        fontSize: 16,
        fontWeight: '900',
    },
    
    // Estilos da Lista de Itens 
    itemsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 5,
    },
    itemsListContainer: {
        paddingLeft: 5,
        marginBottom: 10,
        borderLeftWidth: 2,
        borderLeftColor: '#E5E7EB',
    },
    orderItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 3,
    },
    orderItemQty: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#10B981',
        marginRight: 8,
        minWidth: 20,
    },
    orderItemName: {
        flex: 1,
        fontSize: 14,
        color: '#4B5563',
    },
    orderItemPrice: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    // Fim dos Estilos da Lista de Itens

    addressText: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 8,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        marginTop: 4,
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#374151',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#059669', // Verde mais escuro
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 50,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4B5563',
        marginTop: 15,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: 20,
    },
    homeButton: {
        backgroundColor: '#10B981',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginTop: 10,
        elevation: 2,
    },
    homeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
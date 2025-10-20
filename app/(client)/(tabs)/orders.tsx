import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { Link } from 'expo-router';

// Dados mockados de pedidos
const MOCKED_ORDERS = [
    { id: 101, status: "Em Preparação", farmacy: "Farmácia A", total: 149.90, date: "20/10/2025" },
    { id: 102, status: "Em Rota", farmacy: "Farmácia B", total: 75.30, date: "18/10/2025" },
    { id: 103, status: "Entregue", farmacy: "Farmácia C", total: 58.79, date: "15/10/2025" },
    { id: 104, status: "Cancelado", farmacy: "Farmácia D", total: 12.30, date: "10/10/2025" },
];

const OrderCard = ({ order }: { order: typeof MOCKED_ORDERS[0] }) => {
    let statusColor = '#333';
    if (order.status === "Em Rota") statusColor = Colors.flashGreen;
    if (order.status === "Entregue") statusColor = 'green';
    if (order.status === "Cancelado") statusColor = 'red';

    return (
        <Link href={`/(client)/(order-flow)/order-details?id=${order.id}`} asChild>
            <TouchableOpacity style={styles.orderCard}>
                <View>
                    <Text style={styles.orderId}>Pedido # {order.id}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                    <Text style={[styles.orderStatus, { color: statusColor }]}>{order.status}</Text>
                </View>
                <View style={styles.orderInfoRight}>
                    <Text style={styles.orderTotal}>R$ {order.total.toFixed(2).replace('.', ',')}</Text>
                    <Ionicons name="chevron-forward-outline" size={20} color="#999" />
                </View>
            </TouchableOpacity>
        </Link>
    );
};

export default function OrdersScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Seus Pedidos</Text>
            </View>
            <ScrollView style={styles.scrollView}>
                {MOCKED_ORDERS.map(order => (
                    <OrderCard key={order.id} order={order} />
                ))}
                
                {MOCKED_ORDERS.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Você ainda não fez nenhum pedido.</Text>
                    </View>
                )}
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
        padding: 15,
        backgroundColor: Colors.flashGreen,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    scrollView: {
        padding: 15,
    },
    orderCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.darkGreyText,
    },
    orderDate: {
        fontSize: 12,
        color: '#999',
    },
    orderStatus: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 5,
    },
    orderInfoRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
        color: Colors.darkGreyText,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    }
});
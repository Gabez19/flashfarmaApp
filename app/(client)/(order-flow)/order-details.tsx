import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';

// Componente para a seção de Acompanhamento
const TrackingStep = ({ title, description, isActive }: { title: string, description: string, isActive: boolean }) => (
    <View style={styles.trackingStep}>
        <View style={[styles.stepDot, { backgroundColor: isActive ? Colors.flashGreen : '#ccc' }]} />
        <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { fontWeight: isActive ? 'bold' : 'normal' }]}>{title}</Text>
            <Text style={styles.stepDescription}>{description}</Text>
        </View>
    </View>
);

export default function OrderDetailsScreen() {
    const { id } = useLocalSearchParams();
    const orderId = Array.isArray(id) ? id[0] : id;
    const router = useRouter();

    // Mock de dados do pedido com status de rastreamento (Baseado na Image 3f1ca2)
    const MOCKED_ORDER_DETAIL = {
        orderId: orderId || '102',
        status: 'Em Rota',
        farmacy: 'Farmácia B',
        deliveryCode: '0391',
        total: 107.80,
        address: 'Rua das Flores, 123, Centro - Cidade',
        items: [
            { name: "Dipirona Sódica 500mg", price: 15.00, qty: 1 },
            { name: "Vitamina C 1000mg", price: 37.80, qty: 2 },
        ],
        tracking: [
            { title: "Pedido Recebido", description: "Obrigado! Seu pedido foi confirmado.", active: true },
            { title: "Em Preparação", description: "O pedido está sendo separado na Farmácia B.", active: true },
            { title: "Em Rota de Entrega", description: "Seu entregador está a caminho. Código: 0391", active: true },
            { title: "Entregue", description: "Seu pedido foi finalizado com sucesso.", active: false },
        ]
    };

    // Função que simula o cancelamento e redireciona (Image 3f1ca2)
    const handleCancelOrder = () => {
        // Lógica de Cancelamento do Pedido no Backend
        alert('Pedido cancelado com sucesso!');
        router.push('/(client)/(tabs)/orders');
    };

    // Função que simula a entrega para ir para a tela de avaliação
    const handleSimulateDelivery = () => {
        router.push({ pathname: '/(client)/(order-flow)/order-delivered', params: { id: MOCKED_ORDER_DETAIL.orderId } });
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.sectionTitle}>Detalhes do Pedido #{MOCKED_ORDER_DETAIL.orderId}</Text>
                
                {/* Status e Acompanhamento */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Status Atual: {MOCKED_ORDER_DETAIL.status}</Text>
                    <View style={styles.trackingContainer}>
                        {MOCKED_ORDER_DETAIL.tracking.map((step, index) => (
                            <TrackingStep 
                                key={index} 
                                title={step.title} 
                                description={step.description} 
                                isActive={step.active} 
                            />
                        ))}
                    </View>
                    
                    {MOCKED_ORDER_DETAIL.status === 'Em Rota' && (
                        <View style={styles.deliveryInfo}>
                            <Text style={styles.deliveryText}>Detalhes do Entregador</Text>
                            <Text style={styles.deliveryCode}>Código de Entrega: {MOCKED_ORDER_DETAIL.deliveryCode}</Text>
                            <TouchableOpacity onPress={handleSimulateDelivery} style={styles.buttonSimulate}>
                                <Text style={styles.buttonText}>Simular Entrega</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Itens do Pedido */}
                <Text style={styles.sectionTitle}>Produtos</Text>
                <View style={styles.card}>
                    {MOCKED_ORDER_DETAIL.items.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemQty}>x{item.qty}</Text>
                            <Text style={styles.itemPrice}>R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}</Text>
                        </View>
                    ))}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total do Pedido</Text>
                        <Text style={styles.totalValue}>R$ {MOCKED_ORDER_DETAIL.total.toFixed(2).replace('.', ',')}</Text>
                    </View>
                </View>

                {/* Botão de Cancelar Pedido (visível dependendo do status) */}
                {MOCKED_ORDER_DETAIL.status !== 'Entregue' && MOCKED_ORDER_DETAIL.status !== 'Cancelado' && (
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={handleCancelOrder} style={styles.buttonCancel}>
                            <Text style={styles.buttonCancelText}>Cancelar Pedido</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Exibição do Mapa (Simulada, como na Image 3f1ca2) */}
                <Text style={styles.sectionTitle}>Localização da Farmácia e Entrega</Text>
                <View style={styles.mapContainer}>
                    <Image 
                        source={{ uri: 'https://placehold.co/600x200/cccccc/ffffff?text=Mapa+de+Localizacao+Simulado' }} 
                        style={styles.mapImage}
                    />
                    <Text style={styles.addressText}>{MOCKED_ORDER_DETAIL.farmacy}</Text>
                    <Text style={styles.addressText}>{MOCKED_ORDER_DETAIL.address}</Text>
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
    scrollView: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.darkGreyText,
        marginBottom: 10,
        marginTop: 5,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.darkGreyText,
    },
    // Rastreamento (Tracking)
    trackingContainer: {
        paddingLeft: 10,
        borderLeftWidth: 2,
        borderLeftColor: '#f0f0f0',
        marginLeft: 10,
    },
    trackingStep: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    stepDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginTop: 5,
        marginRight: 10,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 14,
        color: Colors.darkGreyText,
    },
    stepDescription: {
        fontSize: 12,
        color: '#666',
    },
    // Itens
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    itemName: {
        flex: 3,
        fontSize: 14,
        color: Colors.darkGreyText,
    },
    itemQty: {
        flex: 0.5,
        textAlign: 'right',
        fontSize: 14,
        color: '#666',
    },
    itemPrice: {
        flex: 1.5,
        textAlign: 'right',
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.flashGreen,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        marginTop: 5,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.darkGreyText,
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.flashGreen,
    },
    // Botões
    footer: {
        paddingTop: 10,
        paddingBottom: 20,
        alignItems: 'center',
    },
    buttonCancel: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'red',
        backgroundColor: '#fff',
    },
    buttonCancelText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 16,
    },
    // Informações de Entrega
    deliveryInfo: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'center',
    },
    deliveryText: {
        fontSize: 14,
        color: Colors.darkGreyText,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    deliveryCode: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.flashGreen,
        marginBottom: 10,
    },
    buttonSimulate: {
        backgroundColor: '#007bff', // Cor diferente para simulação
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    // Mapa
    mapContainer: {
        marginBottom: 20,
    },
    mapImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 10,
    },
    addressText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    }
});
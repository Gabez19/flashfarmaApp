import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ViewStyle,
    TextStyle,
    DimensionValue,
    Image,
    ImageStyle,
    Alert, // Importar Alert para feedback
} from 'react-native';
// Ícones
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// --- TIPAGENS DE DADOS ---
interface OrderItem {
    name: string;
    qty: number;
    price: number;
}

interface OrderData {
    id: string;
    total: number;
    deliveryCode: string;
    items: OrderItem[];
}

// Interface para os estágios de entrega
interface DeliveryStage {
    key: string;
    title: string;
    message: string;
    barFill: DimensionValue;
    color: string;
}

// --- CONFIGURAÇÃO DE ESTÁGIOS DE ENTREGA ---
const DELIVERY_STAGES: DeliveryStage[] = [
    { key: 'analisando', title: 'Pedido em Análise', message: 'A farmácia está analisando o seu pedido.', barFill: '25%', color: '#007BFF' },
    { key: 'preparando', title: 'Em Preparo', message: 'O pedido será separado e embalado.', barFill: '50%', color: '#FFC107' },
    { key: 'emrota', title: 'Pedido em Rota', message: 'O entregador está a caminho do seu endereço.', barFill: '75%', color: '#FF6F00' },
    { key: 'entregue', title: 'Pedido Entregue', message: 'O pedido foi entregue com sucesso.', barFill: '100%', color: '#24BF38' },
];

// --- DADOS DE MOCK (FALLBACK) ---
const mockOrderData: OrderData = {
    id: '987654',
    total: 155.50,
    deliveryCode: '0391',
    items: [
        { name: 'Dipirona Sódica 500mg', qty: 2, price: 15.50 },
        { name: 'Vitamina C 1000mg', qty: 1, price: 55.00 },
        { name: 'Álcool Gel 70%', qty: 3, price: 23.00 },
    ],
};

// --- URL do Mapa Estático Simulado ---
const STATIC_MAP_URL = 'https://placehold.co/800x300/c7e8c7/38761d?text=Rota+de+Entrega+em+Tempo+Real';

// --- ESTILOS (MOVIDO PARA O TOPO) ---
const statusStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6FFF6',
    } as ViewStyle,
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: '#24BF38',
    } as ViewStyle,
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 10,
    } as TextStyle,
    scrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    } as ViewStyle,
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
        color: '#333',
    } as TextStyle,

    // Detalhes
    detailBlock: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    } as ViewStyle,
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    } as ViewStyle,
    itemName: {
        flex: 3,
        fontSize: 14,
        color: '#555',
    } as TextStyle,
    itemQty: {
        flex: 0.5,
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
    } as TextStyle,
    itemPrice: {
        flex: 1.5,
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'right',
    } as TextStyle,
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    } as ViewStyle,
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    } as TextStyle,
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#24BF38',
    } as TextStyle,
    totalValueCode: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF6F00',
    } as TextStyle,

    // Status Card e Barra de Progresso
    statusCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftWidth: 5,
    } as ViewStyle,
    stageTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    } as TextStyle,
    stageMessage: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    } as TextStyle,
    progressBarContainer: {
        height: 8,
        backgroundColor: '#eee',
        borderRadius: 4,
        marginTop: 8,
    } as ViewStyle,
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    } as ViewStyle,

    // Info do Entregador
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
    } as ViewStyle,
    infoLabel: {
        fontSize: 14,
        color: '#555',
        marginLeft: 8,
        width: 80,
    } as TextStyle,
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    } as TextStyle,

    // Mapa Placeholder
    mapImage: {
        height: 150,
        width: '100%',
        borderRadius: 8,
        marginBottom: 20,
        resizeMode: 'cover',
    } as ImageStyle,

    // Botão Cancelar
    cancelButton: {
        backgroundColor: '#D32F2F',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    } as ViewStyle,
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    } as TextStyle,
    
    // --- ESTILOS DA TELA DE AVALIAÇÃO (ReviewScreen) ---
    reviewContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 50,
        alignItems: 'center',
    } as ViewStyle,
    reviewTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
        marginBottom: 5,
    } as TextStyle,
    reviewSubtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    } as TextStyle,
    reviewBlock: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    } as ViewStyle,
    reviewSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    } as TextStyle,
    starContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    } as ViewStyle,
    reviewButton: {
        backgroundColor: '#24BF38',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    } as ViewStyle,
    reviewButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    } as TextStyle
});

// Componente para exibir o produto no resumo
const OrderItemRow = ({ item }: { item: OrderItem }) => (
    <View style={statusStyles.itemRow}>
        <Text style={statusStyles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={statusStyles.itemQty}>x{item.qty}</Text>
        <Text style={statusStyles.itemPrice}>R$ {(item.qty * item.price).toFixed(2)}</Text>
    </View>
);

// --- NOVO Componente de Avaliação por Estrelas ---
interface StarRatingProps {
    rating: number; // A nota atual (1 a 5)
    setRating: (newRating: number) => void; // Função para atualizar a nota
}

const StarRating = ({ rating, setRating }: StarRatingProps) => {
    const totalStars = 5;
    const starColor = "#FFC107"; // Amarelo para as estrelas

    return (
        <View style={statusStyles.starContainer}>
            {/* Mapeia de 1 a 5 para criar as estrelas */}
            {[...Array(totalStars)].map((_, index) => {
                const starValue = index + 1;
                const starIcon = starValue <= rating ? "star" : "star-o"; // 'star' se for menor ou igual à nota

                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setRating(starValue)} // Define a nota ao tocar
                        activeOpacity={0.7}
                        style={{ marginHorizontal: 5 }}
                    >
                        <FontAwesome name={starIcon} size={30} color={starColor} />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};


// --- Componente de Avaliação (Nova Tela) ATUALIZADO ---
const ReviewScreen = ({ orderId, onSendReview }: { orderId: string, onSendReview: (farmacia: number, entrega: number) => void }) => {
    // Estados para as notas
    const [farmaciaRating, setFarmaciaRating] = useState(0);
    const [deliveryRating, setDeliveryRating] = useState(0);

    const handleSendReview = () => {
        if (farmaciaRating === 0 || deliveryRating === 0) {
            Alert.alert("Avaliação Incompleta", "Por favor, avalie tanto a farmácia quanto a entrega antes de enviar.");
            return;
        }
        
        // Simula o envio
        onSendReview(farmaciaRating, deliveryRating);
    };

    return (
        <ScrollView contentContainerStyle={statusStyles.reviewContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#24BF38" />
            <Text style={statusStyles.reviewTitle}>Seu pedido foi entregue</Text>
            <Text style={statusStyles.reviewSubtitle}>Avalie sua experiência para o pedido #{orderId}:</Text>

            <View style={statusStyles.reviewBlock}>
                <Text style={statusStyles.reviewSectionTitle}>Avaliar Farmácia</Text>
                <StarRating rating={farmaciaRating} setRating={setFarmaciaRating} />
            </View>

            <View style={statusStyles.reviewBlock}>
                <Text style={statusStyles.reviewSectionTitle}>Avaliar Entrega</Text>
                <StarRating rating={deliveryRating} setRating={setDeliveryRating} />
            </View>
            
            <TouchableOpacity 
                style={[statusStyles.reviewButton, (farmaciaRating === 0 || deliveryRating === 0) && { backgroundColor: '#AAAAAA' } as ViewStyle]}
                onPress={handleSendReview}
                disabled={farmaciaRating === 0 || deliveryRating === 0}
            >
                <Text style={statusStyles.reviewButtonText}>Enviar Avaliação</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};


interface DeliveryStatusProps {
    onGoBack: () => void; // Função para voltar à lista
    order?: OrderData;
}

export default function DeliveryStatus({ onGoBack, order }: DeliveryStatusProps) {
    const currentOrder = order || mockOrderData;
    // Estado para rastrear o índice do estágio atual
    const [currentStageIndex, setCurrentStageIndex] = useState(2); 
    const currentStage = DELIVERY_STAGES[currentStageIndex];
    const isDelivered = currentStage.key === 'entregue';
    const isInRouteOrLater = currentStageIndex >= DELIVERY_STAGES.findIndex(s => s.key === 'emrota');

    // Novo estado para controlar se a avaliação foi enviada
    const [reviewSent, setReviewSent] = useState(false);

    useEffect(() => {
        // Se já foi entregue ou a avaliação foi enviada, não faz nada
        if (isDelivered || reviewSent) {
            return;
        }

        // Configura o intervalo para avançar o estágio a cada 10 segundos
        const intervalId = setInterval(() => {
            setCurrentStageIndex(prevIndex => {
                const nextIndex = prevIndex + 1;
                // Para o intervalo quando atingir o último estágio (Entregue)
                if (nextIndex >= DELIVERY_STAGES.length) {
                    clearInterval(intervalId);
                    return prevIndex;
                }
                return nextIndex;
            });
        }, 10000); // 10 segundos

        return () => clearInterval(intervalId);
    }, [isDelivered, reviewSent]);

    const handleReviewSubmit = (farmaciaRating: number, deliveryRating: number) => {
        // Lógica para enviar as notas (API, banco de dados, etc.)
        console.log(`Avaliação enviada para Pedido #${currentOrder.id}`);
        console.log(`Nota da Farmácia: ${farmaciaRating}`);
        console.log(`Nota da Entrega: ${deliveryRating}`);

        Alert.alert("Obrigado!", "Sua avaliação foi enviada com sucesso!");
        setReviewSent(true); // Marca como enviado para mudar a tela
    };


    // Renderiza a tela de avaliação se o pedido foi entregue e a avaliação ainda não foi enviada
    if (isDelivered && !reviewSent) {
        return (
            <View style={statusStyles.container}>
                {/* Header */}
                <View style={statusStyles.header}>
                    <TouchableOpacity onPress={onGoBack} style={{ padding: 5 }}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={statusStyles.headerTitle}>Avaliar Pedido #{currentOrder.id}</Text>
                </View>
                <ReviewScreen orderId={currentOrder.id} onSendReview={handleReviewSubmit} />
            </View>
        );
    }
    
    // Renderiza a mensagem de agradecimento pós-avaliação
    if (reviewSent) {
         return (
            <View style={statusStyles.container}>
                <View style={statusStyles.header}>
                    <TouchableOpacity onPress={onGoBack} style={{ padding: 5 }}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={statusStyles.headerTitle}>Avaliação Enviada</Text>
                </View>
                <View style={[statusStyles.reviewContainer, { paddingTop: 100 }]}>
                    <Ionicons name="heart-circle" size={80} color="#FF6F00" />
                    <Text style={statusStyles.reviewTitle}>Obrigado por sua avaliação!</Text>
                    <Text style={statusStyles.reviewSubtitle}>Sua opinião nos ajuda a melhorar a cada entrega.</Text>
                     <TouchableOpacity style={[statusStyles.reviewButton, { backgroundColor: '#007BFF', marginTop: 50 } as ViewStyle]} onPress={onGoBack}>
                        <Text style={statusStyles.reviewButtonText}>Voltar para Meus Pedidos</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Renderiza a tela de status em andamento
    return (
        <View style={statusStyles.container}>
            {/* Header */}
            <View style={statusStyles.header}>
                <TouchableOpacity onPress={onGoBack} style={{ padding: 5 }}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={statusStyles.headerTitle}>Status do Pedido #{currentOrder.id}</Text>
            </View>

            <ScrollView contentContainerStyle={statusStyles.scrollContent}>

                {/* --- LÓGICA DE STATUS DINÂMICA --- */}
                <View style={[statusStyles.statusCard, { borderLeftColor: currentStage.color }]}>
                    <Text style={[statusStyles.stageTitle, { color: currentStage.color }]}>
                        Status Atual: {currentStage.title}
                    </Text>
                    <View style={statusStyles.progressBarContainer}>
                        {/* A barra de preenchimento deve refletir a porcentagem do estágio */}
                        <View style={[statusStyles.progressBarFill, 
                            { 
                                width: currentStage.barFill,
                                backgroundColor: currentStage.color 
                            }
                        ]} />
                    </View>
                    <Text style={statusStyles.stageMessage}>{currentStage.message}</Text>
                </View>

                {/* Detalhes dos Itens */}
                <View style={statusStyles.detailBlock}>
                    <Text style={statusStyles.sectionTitle}>Detalhes dos Itens ({currentOrder.items.length})</Text>
                    {currentOrder.items.map((item, index) => (
                        <OrderItemRow key={index} item={item} />
                    ))}
                    <View style={statusStyles.totalRow}>
                        <Text style={statusStyles.totalLabel}>Código de Entrega</Text>
                        <Text style={statusStyles.totalValueCode}>{currentOrder.deliveryCode}</Text>
                    </View>
                    <View style={statusStyles.totalRow}>
                        <Text style={statusStyles.totalLabel}>Total do Pedido</Text>
                        <Text style={statusStyles.totalValue}>R$ {currentOrder.total.toFixed(2)}</Text>
                    </View>
                </View>

                {/* --- DETALHES DO ENTREGADOR (Mostra somente de "Em Rota" em diante) --- */}
                {isInRouteOrLater && (
                    <View style={[statusStyles.detailBlock, { marginTop: 20 }]}>
                        <Text style={statusStyles.sectionTitle}>Detalhes do Entregador</Text>
                        <View style={statusStyles.infoRow}>
                            <Ionicons name="person-outline" size={20} color="#333" />
                            <Text style={statusStyles.infoLabel}>Nome:</Text>
                            <Text style={statusStyles.infoValue}>Pedro Aguiar</Text>
                        </View>
                        <View style={statusStyles.infoRow}>
                            <MaterialCommunityIcons name="motorbike" size={20} color="#333" />
                            <Text style={statusStyles.infoLabel}>Veículo:</Text>
                            <Text style={statusStyles.infoValue}>Moto (Placa XXX-1234)</Text>
                        </View>
                    </View>
                )}

                {/* Mapa de Entrega (Mostra somente de "Em Rota" em diante) */}
                {isInRouteOrLater && (
                    <Image
                        source={{ uri: STATIC_MAP_URL }}
                        style={statusStyles.mapImage}
                        accessibilityLabel="Mapa de rota de entrega simulado"
                    />
                )}

                {/* Botão Cancelar Pedido (Não funcional) */}
                <TouchableOpacity style={statusStyles.cancelButton}>
                    <Text style={statusStyles.cancelButtonText}>Cancelar Pedido</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}
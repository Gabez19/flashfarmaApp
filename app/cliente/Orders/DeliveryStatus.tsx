import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// ============================================================================
// TIPAGENS
// ============================================================================

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface OrderData {
  id: string;
  total: number;
  deliveryCode: string;
  deliveryName: string;
  deliveryVehicle: string;
  deliveryPlate: string;
  items: OrderItem[];
}

// ============================================================================
// ESTÁGIOS DE ENTREGA
// ============================================================================

const deliveryStages = [
  {
    id: 1,
    label: 'Pedido Recebido',
    icon: 'clipboard-list-outline',
    status: 'pending',
    time: '10:00',
  },
  {
    id: 2,
    label: 'Preparando Itens',
    icon: 'bag-check-outline',
    status: 'pending',
    time: '10:15',
  },
  {
    id: 3,
    label: 'Saiu para Entrega',
    icon: 'bicycle',
    status: 'pending',
    time: '10:35',
  },
  { id: 4, label: 'Entregue', icon: 'home-outline', status: 'pending', time: '10:50' },
];

// ============================================================================
// COMPONENTE: PROGRESS BAR
// ============================================================================

const ProgressBar = ({ currentStage }: { currentStage: number }) => {
  const getStageStatus = (stageId: number) => {
    if (stageId < currentStage) return 'completed';
    if (stageId === currentStage) return 'current';
    return 'pending';
  };

  return (
    <View style={styles.progressContainer}>
      {deliveryStages.map((stage, index) => {
        const status = getStageStatus(stage.id);
        const isLast = index === deliveryStages.length - 1;

        const circleStyle = [
          styles.progressCircle,
          status === 'completed'
            ? styles.completedCircle
            : status === 'current'
            ? styles.currentCircle
            : styles.pendingCircle,
        ];

        const lineStyle = [
          styles.progressLine,
          status === 'completed' ? styles.completedLine : styles.pendingLine,
        ];

        const textStyle = [
          styles.stageText,
          status === 'completed'
            ? styles.completedText
            : status === 'current'
            ? styles.currentText
            : styles.pendingText,
        ];

        return (
          <React.Fragment key={stage.id}>
            <View style={styles.stageItem}>
              <View style={circleStyle}>
                {stage.icon.includes('-outline') || stage.icon.includes('home') ? (
                  <Ionicons
                    name={stage.icon as any}
                    size={18}
                    color={status === 'completed' ? '#fff' : '#24BF38'}
                  />
                ) : (
                  <FontAwesome5
                    name={stage.icon as any}
                    size={18}
                    color={status === 'completed' ? '#fff' : '#24BF38'}
                    solid
                  />
                )}
              </View>
              <Text style={textStyle}>{stage.label}</Text>
            </View>

            {!isLast && (
              <View style={styles.lineWrapper}>
                <View style={lineStyle} />
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL: DELIVERY STATUS
// ============================================================================

export default function DeliveryStatus() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [currentStage, setCurrentStage] = useState(1);

  // --------------------------------------------------------------------------
  // EFFECT: Carregar dados do pedido
  // --------------------------------------------------------------------------

  useEffect(() => {
    const orderParam = Array.isArray(params.order) ? params.order[0] : params.order;

    if (orderParam && typeof orderParam === 'string') {
      try {
        const parsedOrder = JSON.parse(orderParam) as OrderData;
        setOrder(parsedOrder);
        console.log('✅ Pedido carregado com sucesso:', parsedOrder);
      } catch (e) {
        console.error('❌ Erro ao parsear dados do pedido:', e);
        Alert.alert(
          'Erro de Parâmetro',
          'Não foi possível carregar os detalhes do pedido. JSON inválido.'
        );
      }
    } else {
      console.warn('⚠️ Nenhum dado de pedido foi recebido nos parâmetros');
    }
  }, [params.order]);

  // --------------------------------------------------------------------------
  // EFFECT: Simulação do progresso (muda a cada 7 segundos)
  // --------------------------------------------------------------------------

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prevStage) => {
        if (prevStage < deliveryStages.length) {
          console.log(`📍 Status atualizado: ${deliveryStages[prevStage]?.label}`);
          return prevStage + 1;
        }
        // Quando chegar no último estágio, para de atualizar
        clearInterval(interval);
        return prevStage;
      });
    }, 7000); // 7 segundos

    return () => clearInterval(interval);
  }, []);

  // --------------------------------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------------------------------

  if (!order) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Ionicons name="hourglass-outline" size={50} color="#24BF38" />
        <Text style={styles.loadingText}>Carregando detalhes do pedido...</Text>
      </View>
    );
  }

  // --------------------------------------------------------------------------
  // VARIÁVEIS DE ESTADO
  // --------------------------------------------------------------------------

  const isDeliveryOut = currentStage >= 3;
  const isDelivered = currentStage === 4;

  return (
    <View style={styles.container}>
      {/* Header Fixo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Status do Pedido #{order.id}</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status Principal */}
        <View style={[styles.card, styles.mainStatusCard]}>
          <Text style={styles.currentStatusLabel}>STATUS ATUAL:</Text>
          <Text style={styles.currentStatusText}>
            {deliveryStages.find((s) => s.id === currentStage)?.label ||
              'Aguardando Confirmação'}
          </Text>
          <Text style={styles.estimatedTime}>Entrega estimada: 11:30 - 12:00</Text>
        </View>

        {/* Linha do Tempo de Progresso */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Progresso da Entrega</Text>
          <ProgressBar currentStage={currentStage} />
        </View>

        {/* Informações do Entregador */}
        {isDeliveryOut && !isDelivered && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Seu Entregador</Text>
            <View style={styles.deliveryManInfo}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{
                    uri: 'https://placehold.co/60x60/24BF38/FFFFFF?text=J',
                  }}
                  style={styles.avatar}
                />
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#fff" />
                  <Text style={styles.ratingText}>4.9</Text>
                </View>
              </View>
              <View style={styles.deliveryDetails}>
                <Text style={styles.deliveryName}>{order.deliveryName}</Text>
                <View style={styles.vehicleRow}>
                  <FontAwesome5
                    name={order.deliveryVehicle === 'Bicicleta' ? 'bicycle' : 'motorcycle'}
                    size={14}
                    color="#888"
                  />
                  <Text style={styles.vehicleText}>
                    {order.deliveryVehicle} ({order.deliveryPlate})
                  </Text>
                </View>
                <Text style={styles.deliveryCode}>
                  Cód. de Entrega: {order.deliveryCode}
                </Text>
              </View>
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="chatbubbles-outline" size={24} color="#24BF38" />
                <Text style={styles.contactText}>Chat</Text>
              </TouchableOpacity>
            </View>

            {/* Simulação de Mapa */}
            <View style={styles.mapContainer}>
              <Image
                source={{
                  uri: 'https://placehold.co/300x150/E6FFE9/24BF38?text=RASTREIO+EM+TEMPO+REAL',
                }}
                style={styles.mapImage}
              />
              <Text style={styles.mapDisclaimer}>
                Localização ao vivo: O entregador está a caminho!
              </Text>
            </View>
          </View>
        )}

        {/* Resumo do Pedido */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Resumo do Pedido ({order.items.length} itens)
          </Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemQty}>{item.qty}x</Text>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemPrice}>
                R$ {(item.qty * item.price).toFixed(2).replace('.', ',')}
              </Text>
            </View>
          ))}

          {/* Linha de Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Pago (Frete Incluído):</Text>
            <Text style={styles.totalValue}>
              R$ {order.total.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        </View>

        {/* Botão de Ação Final */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            isDelivered ? styles.deliveredButton : styles.trackButton,
          ]}
          onPress={() => {
            if (isDelivered) {
              Alert.alert('Obrigado!', 'Por favor, avalie sua experiência!');
            } else {
              Alert.alert('Ajuda', 'Entrando em contato com o suporte...');
            }
          }}
        >
          <Text style={styles.actionButtonText}>
            {isDelivered
              ? 'Avaliar Pedido e Entregador'
              : 'Ainda não chegou? Fale conosco'}
          </Text>
          <Ionicons
            name={isDelivered ? 'star-outline' : 'chatbox-ellipses-outline'}
            size={20}
            color="#fff"
            style={styles.actionButtonIcon}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ============================================================================
// ESTILOS
// ============================================================================

const styles = StyleSheet.create({
  // --------------------------------------------------------------------------
  // Container Principal
  // --------------------------------------------------------------------------
  container: {
    flex: 1,
    backgroundColor: '#F6FFF6',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#555',
    fontSize: 16,
    marginTop: 15,
  },

  // --------------------------------------------------------------------------
  // Header
  // --------------------------------------------------------------------------
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#24BF38',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpButton: {
    padding: 5,
  },

  // --------------------------------------------------------------------------
  // Scroll Content
  // --------------------------------------------------------------------------
  scrollContent: {
    padding: 15,
    paddingBottom: 100,
  },

  // --------------------------------------------------------------------------
  // Cards
  // --------------------------------------------------------------------------
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },

  // --------------------------------------------------------------------------
  // Status Principal
  // --------------------------------------------------------------------------
  mainStatusCard: {
    backgroundColor: '#E6FFE9',
    alignItems: 'center',
    paddingVertical: 25,
    borderWidth: 1,
    borderColor: '#24BF38',
  },
  currentStatusLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  currentStatusText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#24BF38',
    marginVertical: 5,
  },
  estimatedTime: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },

  // --------------------------------------------------------------------------
  // Progress Bar
  // --------------------------------------------------------------------------
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  stageItem: {
    alignItems: 'center',
    width: `${100 / deliveryStages.length}%`,
  },
  progressCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  pendingCircle: {
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  currentCircle: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#24BF38',
    transform: [{ scale: 1.15 }],
  },
  completedCircle: {
    backgroundColor: '#24BF38',
    borderWidth: 1,
    borderColor: '#1e9b2f',
  },
  lineWrapper: {
    position: 'absolute',
    top: 15,
    left: `${(100 / deliveryStages.length) / 2}%`,
    right: `${(100 / deliveryStages.length) / 2}%`,
    height: 4,
    zIndex: -1,
  },
  progressLine: {
    height: '100%',
    borderRadius: 2,
  },
  pendingLine: {
    backgroundColor: '#ddd',
  },
  completedLine: {
    backgroundColor: '#24BF38',
  },
  stageText: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    width: '100%',
  },
  pendingText: {
    color: '#999',
  },
  currentText: {
    color: '#24BF38',
  },
  completedText: {
    color: '#555',
  },

  // --------------------------------------------------------------------------
  // Entregador
  // --------------------------------------------------------------------------
  deliveryManInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 15,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#24BF38',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 0,
    right: -5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFC107',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#fff',
  },
  ratingText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  deliveryDetails: {
    flex: 1,
    marginLeft: 15,
  },
  deliveryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  vehicleText: {
    fontSize: 13,
    color: '#888',
    marginLeft: 5,
  },
  deliveryCode: {
    fontSize: 12,
    color: '#D32F2F',
    fontWeight: '600',
  },
  contactButton: {
    alignItems: 'center',
    padding: 5,
  },
  contactText: {
    fontSize: 12,
    color: '#24BF38',
    fontWeight: '600',
    marginTop: 3,
  },

  // --------------------------------------------------------------------------
  // Mapa
  // --------------------------------------------------------------------------
  mapContainer: {
    alignItems: 'center',
  },
  mapImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  mapDisclaimer: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },

  // --------------------------------------------------------------------------
  // Resumo do Pedido
  // --------------------------------------------------------------------------
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  itemQty: {
    fontSize: 14,
    color: '#999',
    width: 30,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#555',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 10,
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#24BF38',
  },

  // --------------------------------------------------------------------------
  // Botão de Ação
  // --------------------------------------------------------------------------
  actionButton: {
    position: 'absolute',
    bottom: 0,
    left: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
  },
  trackButton: {
    backgroundColor: '#FF9800',
  },
  deliveredButton: {
    backgroundColor: '#1E88E5',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonIcon: {
    marginLeft: 10,
  },
});
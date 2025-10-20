import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';

// Componente de Classificação (Estrelas)
const Rating = ({ label, rating, setRating }: { label: string, rating: number, setRating: (r: number) => void }) => (
    <View style={ratingStyles.container}>
        <Text style={ratingStyles.label}>{label}</Text>
        <View style={ratingStyles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Ionicons 
                        name={star <= rating ? "star" : "star-outline"} 
                        size={30} 
                        color={star <= rating ? "#FFC107" : "#ccc"} 
                        style={ratingStyles.star} 
                    />
                </TouchableOpacity>
            ))}
        </View>
    </View>
);

const ratingStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.darkGreyText,
    },
    starsContainer: {
        flexDirection: 'row',
    },
    star: {
        marginHorizontal: 5,
    }
});

export default function OrderDeliveredScreen() {
    const router = useRouter();
    const [farmacyRating, setFarmacyRating] = useState(0);
    const [deliveryRating, setDeliveryRating] = useState(0);

    const handleFinish = () => {
        // Lógica de envio das avaliações para o backend
        alert('Obrigado por avaliar!');
        // Redireciona para a tela de Pedidos (ou Home)
        router.push('/(client)/(tabs)/orders'); 
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* Confirmação (Baseado na Image 3f1ca2) */}
                <View style={styles.confirmationBox}>
                    <Ionicons name="checkmark-circle-outline" size={80} color={Colors.flashGreen} />
                    <Text style={styles.confirmationTitle}>Seu pedido foi entregue</Text>
                    <Text style={styles.confirmationSubtitle}>Aguardamos sua avaliação!</Text>
                </View>

                {/* Seção de Avaliação */}
                <View style={styles.ratingSection}>
                    <Rating 
                        label="Avaliar Farmácia" 
                        rating={farmacyRating} 
                        setRating={setFarmacyRating} 
                    />
                    <Rating 
                        label="Avaliar Entrega" 
                        rating={deliveryRating} 
                        setRating={setDeliveryRating} 
                    />
                </View>

            </ScrollView>

            {/* Botão de Finalizar */}
            <View style={styles.footer}>
                <TouchableOpacity 
                    onPress={handleFinish} 
                    style={styles.buttonFinish}
                    disabled={farmacyRating === 0 || deliveryRating === 0} // Desabilitar se não avaliou
                >
                    <Text style={styles.buttonText}>
                        {farmacyRating === 0 || deliveryRating === 0 ? 'Avalie para finalizar' : 'Enviar Avaliação'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.greyBackground,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
        alignItems: 'center',
    },
    // Confirmação
    confirmationBox: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        marginBottom: 30,
    },
    confirmationTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
        color: Colors.darkGreyText,
    },
    confirmationSubtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    // Avaliação
    ratingSection: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    // Footer
    footer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        width: '100%',
    },
    buttonFinish: {
        backgroundColor: Colors.flashGreen,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';

const PAYMENT_METHODS = [
    { id: '1', name: 'Cartão de Crédito', icon: 'card-outline' },
    { id: '2', name: 'PIX', icon: 'qr-code-outline' },
    { id: '3', name: 'Dinheiro (Pagamento na Entrega)', icon: 'cash-outline' },
];

const PaymentCard = ({ method }: { method: typeof PAYMENT_METHODS[0] }) => (
    <TouchableOpacity style={styles.paymentCard}>
        <Ionicons name={method.icon as any} size={24} color={Colors.flashGreen} />
        <Text style={styles.paymentText}>{method.name}</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="#999" />
    </TouchableOpacity>
);

export default function PaymentMethodsScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.sectionTitle}>Selecione a Forma de Pagamento</Text>
                
                <View style={styles.listContainer}>
                    {PAYMENT_METHODS.map(method => (
                        <PaymentCard key={method.id} method={method} />
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Outras Opções</Text>
                {/* Correção: Usando 'as any' para contornar o erro de tipagem do expo-router na rota /(tabs)/profile */}
                <Link href={"/(tabs)/profile" as any} asChild> 
                    <TouchableOpacity style={styles.addCardButton}>
                        <Ionicons name="add-circle-outline" size={24} color={Colors.flashGreen} />
                        <Text style={styles.addCardText}>Adicionar Novo Cartão</Text>
                    </TouchableOpacity>
                </Link>
                
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.buttonConfirm}>
                    <Text style={styles.buttonText}>Confirmar e Pagar</Text>
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
    scrollView: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.darkGreyText,
        marginBottom: 10,
        marginTop: 10,
    },
    listContainer: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        overflow: 'hidden',
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGreyBorder,
        justifyContent: 'space-between',
    },
    paymentText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        color: Colors.darkGreyText,
    },
    addCardButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 15,
        borderRadius: 8,
    },
    addCardText: {
        marginLeft: 15,
        fontSize: 16,
        color: Colors.flashGreen,
        fontWeight: 'bold',
    },
    footer: {
        padding: 15,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: Colors.lightGreyBorder,
    },
    buttonConfirm: {
        backgroundColor: Colors.flashGreen,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
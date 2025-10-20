import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { Link } from 'expo-router';

// Mock de dados e opções do perfil
const USER_INFO = {
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321"
};

const PROFILE_OPTIONS = [
    { title: "Meus Dados", icon: "person-circle-outline", href: "/profile-details" },
    { title: "Endereços de Entrega", icon: "map-outline", href: "/delivery-addresses" },
    { title: "Formas de Pagamento", icon: "card-outline", href: "/payment-methods" },
    { title: "Notificações", icon: "notifications-outline", href: "/notifications-settings" },
    { title: "Ajuda e Suporte", icon: "help-circle-outline", href: "/support" },
];

const OptionItem = ({ option }: { option: typeof PROFILE_OPTIONS[0] }) => (
    <Link href={option.href as any} asChild>
        <TouchableOpacity style={styles.optionItem}>
            <Ionicons name={option.icon as any} size={24} color={Colors.darkGreyText} />
            <Text style={styles.optionText}>{option.title}</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
        </TouchableOpacity>
    </Link>
);

export default function ProfileScreen() {
    // Simula a função de logout
    const handleLogout = () => {
        alert('Sessão encerrada! Redirecionando para Login.');
        // router.replace('/login');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <ScrollView style={styles.scrollView}>
                
                {/* Cartão de Perfil */}
                <View style={styles.profileCard}>
                    <Ionicons name="person-circle-outline" size={80} color={Colors.flashGreen} />
                    <Text style={styles.nameText}>{USER_INFO.name}</Text>
                    <Text style={styles.emailText}>{USER_INFO.email}</Text>
                </View>

                {/* Opções de Menu */}
                <View style={styles.optionsContainer}>
                    {PROFILE_OPTIONS.map(option => (
                        <OptionItem key={option.title} option={option} />
                    ))}
                </View>

                {/* Botão de Logout */}
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Sair da Conta</Text>
                    <Ionicons name="log-out-outline" size={24} color="#f00" />
                </TouchableOpacity>

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
    // Cartão de Perfil
    profileCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    nameText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        color: Colors.darkGreyText,
    },
    emailText: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    // Opções
    optionsContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        justifyContent: 'space-between',
    },
    optionText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        color: Colors.darkGreyText,
    },
    // Logout
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#f00',
    },
    logoutButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f00',
    },
});
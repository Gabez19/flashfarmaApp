import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';

const MOCKED_PRODUCT = {
    id: 1,
    name: "Dipirona Sódica 500mg - 10 Comprimidos",
    description: "Analgésico e antitérmico indicado para o tratamento de dores e febre. Uso adulto e pediátrico. Leia a bula antes de usar.",
    price: 15.00,
    pharmacy: "Farmácia Central",
    rating: 4.5,
    reviews: 124,
    imageUri: 'https://placehold.co/400x400/cccccc/ffffff?text=Produto+Farmaceutico'
};

export default function ProductDetailScreen() {
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        console.log(`Adicionado ${quantity}x ${MOCKED_PRODUCT.name} ao carrinho!`);
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView style={styles.scrollView}>
                <Image source={{ uri: MOCKED_PRODUCT.imageUri }} style={styles.productImage} />
                
                <View style={styles.contentContainer}>
                    <Text style={styles.productName}>{MOCKED_PRODUCT.name}</Text>
                    
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={18} color="#FFC107" />
                        <Text style={styles.ratingText}>{MOCKED_PRODUCT.rating} ({MOCKED_PRODUCT.reviews} avaliações)</Text>
                    </View>

                    <Text style={styles.pharmacyText}>Vendido por: {MOCKED_PRODUCT.pharmacy}</Text>

                    <View style={styles.descriptionCard}>
                        <Text style={styles.descriptionTitle}>Descrição</Text>
                        <Text style={styles.descriptionText}>{MOCKED_PRODUCT.description}</Text>
                    </View>
                    
                    <View style={styles.quantityControl}>
                        <Text style={styles.quantityLabel}>Quantidade:</Text>
                        <View style={styles.qtyButtons}>
                            <TouchableOpacity 
                                onPress={() => setQuantity(q => Math.max(1, q - 1))} 
                                style={styles.qtyButton}
                            >
                                <Text style={styles.qtyButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.qtyValue}>{quantity}</Text>
                            <TouchableOpacity 
                                onPress={() => setQuantity(q => q + 1)} 
                                style={styles.qtyButton}
                            >
                                <Text style={styles.qtyButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Preço Total:</Text>
                    <Text style={styles.priceValue}>R$ {(MOCKED_PRODUCT.price * quantity).toFixed(2).replace('.', ',')}</Text>
                </View>
                <TouchableOpacity onPress={handleAddToCart} style={styles.addToCartButton}>
                    <Ionicons name="cart-outline" size={24} color={Colors.white} style={{ marginRight: 5 }} />
                    <Text style={styles.addToCartText}>Adicionar à Cesta</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollView: {
        flex: 1,
    },
    productImage: {
        width: '100%',
        height: 250,
        resizeMode: 'contain',
        backgroundColor: Colors.greyBackground,
    },
    contentContainer: {
        padding: 15,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.darkGreyText,
        marginBottom: 10,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    ratingText: {
        marginLeft: 5,
        fontSize: 14,
        color: Colors.mediumGrey,
    },
    pharmacyText: {
        fontSize: 16,
        color: Colors.flashGreen,
        fontWeight: '500',
        marginBottom: 20,
    },
    descriptionCard: {
        backgroundColor: Colors.greyBackground,
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
    },
    descriptionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: Colors.darkGreyText,
    },
    descriptionText: {
        fontSize: 14,
        color: Colors.darkGreyText,
        lineHeight: 20,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.lightGreyBorder,
    },
    quantityLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.darkGreyText,
    },
    qtyButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qtyButton: {
        backgroundColor: Colors.flashGreen,
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    qtyButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 20,
    },
    qtyValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.darkGreyText,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: Colors.lightGreyBorder,
        backgroundColor: Colors.white,
    },
    priceContainer: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 14,
        color: Colors.mediumGrey,
    },
    priceValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.flashGreen,
    },
    addToCartButton: {
        flexDirection: 'row',
        backgroundColor: Colors.flashGreen,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    addToCartText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
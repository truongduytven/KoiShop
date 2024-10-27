import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, FlatList } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Toast from "react-native-toast-message";
import { formatPrice } from "../lib/utils";
import FishCardInCart from '../components/FishCardInCart';
import { CartContext } from '../context/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CheckoutScreen({ route }) {
    const { deleteItemFromCart } = useContext(CartContext);
    const [shippingAddress, setShippingAddress] = useState("");
    const [note, setNote] = useState("");
    const { selectedFish } = route.params;
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0)

    // Fetch purchase fish data on component mount
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const jwtToken = await AsyncStorage.getItem("jwtToken");
                if (!jwtToken) {
                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    "https://koi-api.uydev.id.vn/api/v1/users/me/wallets",
                    {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`,
                        },
                    }
                );
                setBalance(response.data.data.balance);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching balance data:", error);
                setLoading(false);
            }
        }
        fetchBalance();
    }, []);

    const handleCheckout = () => {
        console.log('haha')
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center bg-primary items-center">
                <ActivityIndicator size="large" color="#faeaa3" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={{ flex: 1, padding: 16 }}>
            <Text className="text-xl font-bold mb-4">Your balance: {formatPrice(balance)}</Text>
            <Text className="font-semibold mb-4">Your products:</Text>
            <>
                {selectedFish.map((fish) => (
                    <FishCardInCart
                        item={fish}
                        deleteItemFromCart={deleteItemFromCart}
                        isAvailableCart={true}
                        isSelected={true}
                        toggleSelect={() => toggleSelectFish(fish)}
                        isCheckout={true}
                    />
                ))}

                <Text className="font-semibold my-2">Shipping Address</Text>
                <TextInput
                    placeholder="Enter your shipping address"
                    value={shippingAddress}
                    onChangeText={setShippingAddress}
                    style={{
                        borderColor: '#ddd',
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 8,
                        marginBottom: 16,
                        backgroundColor: '#fff',
                    }}
                />

                <Text className="font-semibold my-2">Note</Text>
                <TextInput
                    placeholder="Add any additional notes"
                    value={note}
                    onChangeText={setNote}
                    multiline
                    style={{
                        borderColor: '#ddd',
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 8,
                        marginBottom: 16,
                        backgroundColor: '#fff',
                    }}
                />

                <Text className="font-bold text-lg">Total Price: {formatPrice(selectedFish.reduce((sum, fish) => sum + fish.price, 0))}</Text>

                <TouchableOpacity
                    onPress={handleCheckout}
                    style={{
                        backgroundColor: '#6d1a1a',
                        padding: 16,
                        borderRadius: 8,
                        alignItems: 'center',
                        marginTop: 16,
                    }}
                >
                    <Text className="text-white font-semibold">Pay with Wallet</Text>
                </TouchableOpacity>
            </>
        </ScrollView>
    );
}

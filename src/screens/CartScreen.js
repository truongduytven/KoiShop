import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import FishCardInCart from "../components/FishCardInCart";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Provider, Portal, Dialog, Button } from 'react-native-paper';

const CartScreen = () => {
  const { carts, addToCart, deleteItemFromCart, clearAllCarts } = useContext(CartContext);
  const [fishes, setFishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const handleNavigateHome = () => navigation.navigate("FishesAll");

  useEffect(() => {
    const fetchFishes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://koi-api.uydev.id.vn/api/v1/koi-fishes"
        );
        setFishes(response.data.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFishes();
  }, []);

  const isCartAvailable = (item) => {
    const fishInCart = fishes.find((fish) => fish.id === item.id);
    return fishInCart && !fishInCart.isSold;
  };

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleClearAllCarts = () => {
    clearAllCarts();
    hideDialog();
  };

  return (
    <Provider>
      <View className="flex-1 p-4 justify-between">
        {loading ? (
          <ActivityIndicator size="large" color="#f00530" />
        ) : carts.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="fish-outline" size={80} color="#6d1a1a" />
            <Text className="text-lg text-gray-700 my-2">No carts yet!</Text>
            <TouchableOpacity
              className="bg-[#6d1a1a] p-2 rounded"
              onPress={handleNavigateHome}
            >
              <Text className="text-white text-base">Shop Now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={carts}
            renderItem={({ item }) => {
              const available = isCartAvailable(item);
              return (
                <View className={`${available ? "opacity-100" : "opacity-50"}`}>
                  <FishCardInCart
                    item={item}
                    deleteItemFromCart={deleteItemFromCart}
                    isAvailableCart={available}
                  />
                </View>
              );
            }}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}

        {carts.length > 1 && (
          <TouchableOpacity
            className="bg-[#6d1a1a] my-2 p-4 rounded absolute bottom-2 left-4 right-4 items-center"
            onPress={showDialog}
          >
            <Text className="text-lg text-white text-center">
              Remove all carts ({carts.length})
            </Text>
          </TouchableOpacity>
        )}

        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Confirm Remove all </Dialog.Title>
            <Dialog.Content>
              <Text>Are you sure you want to remove all fishes from your cart?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cancel</Button>
              <Button onPress={handleClearAllCarts}>Yes, Remove All</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
};

export default CartScreen;

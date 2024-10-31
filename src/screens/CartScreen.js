import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import FishCardInCart from "../components/FishCardInCart";
import Entypo from '@expo/vector-icons/Entypo';
import { Provider, Portal, Dialog, Button, Menu, Checkbox } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CheckoutScreen from "./CheckoutScreen";
import { formatPrice } from "../lib/utils";
import Ionicons from "@expo/vector-icons/Ionicons";

const Stack = createNativeStackNavigator();

export default function CartScreen({ navigation, route }) {
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === "Checkout") {
      navigation.setOptions({ headerShown: false });
    } else {
      navigation.setOptions({ headerShown: true });
    }
  }, [navigation, route]);
  return (
    <Stack.Navigator>
      <Stack.Screen name="CartScreen" component={CartScreenDetail} options={{ headerShown: false }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{
        title: "Checkout",
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#470101" },
        headerTintColor: "#faeaa3",
      }} />
    </Stack.Navigator>
  )
}

const CartScreenDetail = () => {
  const { carts, addToCart, deleteItemFromCart, clearAllCarts, setCarts } = useContext(CartContext);
  const [fishes, setFishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedFish, setSelectedFish] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <Entypo name="dots-three-vertical" size={24} color="#faeaa3" />
              </TouchableOpacity>
            }
          >
            <Menu.Item onPress={handleSelectAll} title={selectedFish.length === carts.length ? "Deselect All" : "Select All"} />
          </Menu>
        ),
      });
    }, [navigation, menuVisible, selectedFish])
  );

  const handleNavigateHome = () => {
    navigation.reset({ index: 0, routes: [{ name: 'HomePage' }] })
    navigation.navigate("Fishes", { screen: 'FishesAll' })
  };

  const toggleSelectFish = (item) => {
    setSelectedFish((prevSelected) =>
      prevSelected.find(fish => fish.id === item.id)
        ? prevSelected.filter(selected => selected.id !== item.id)
        : [...prevSelected, item]
    );
  };

  const handleDeleteSelected = async () => {
    const remainingItems = carts.filter((cartItem) =>
      !selectedFish.some((selectedItem) => selectedItem.id === cartItem.id)
    );

    try {
      await AsyncStorage.setItem("carts", JSON.stringify(remainingItems));
      setCarts(remainingItems);
      setSelectedFish([]);
      hideDialog();
      Toast.show({
        type: "success",
        text1: "Remove fish to cart successfully!",
        text1Style: { color: "green" },
        position: "bottom",
      });
    } catch (error) {
      console.error("Failed to delete selected items from cart:", error);
    }
  };

  const handleCheckoutSelected = async () => {
    
    const jwtToken = await AsyncStorage.getItem("jwtToken");
    if (!jwtToken) {
      Toast.show({
        type: "error",
        text1: "Please login to app before checkout!!",
        text1Style: { color: "green" },
        position: "bottom",
      });
      navigation.navigate('Login');
      return
    }

    try {
      const response = await axios.get(
        "https://koi-api.uydev.id.vn/api/v1/users/me",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Please login to app before checkout!!",
        text1Style: { color: "green" },
        position: "bottom",
      });
      navigation.navigate('Login');
      return
    }
    navigation.navigate("Checkout", { selectedFish });
    setSelectedFish([]);
  };

  const handleSelectAll = () => {
    if (selectedFish.length === carts.length) {
      setMenuVisible(false);
      setSelectedFish([]);
    } else {
      setMenuVisible(false);
      setSelectedFish(carts);
    }
  };

  useEffect(() => {
    const fetchFishes = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://koi-api.uydev.id.vn/api/v1/koi-fishes");
        setFishes(response.data.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFishes();
  }, []);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const isCartAvailable = (item) => {
    const fishInCart = fishes.find((fish) => fish.id === item.id);
    return fishInCart && !fishInCart.isSold;
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
          <View>
            <FlatList
              data={carts}
              renderItem={({ item }) => {
                const available = isCartAvailable(item);
                const isSelected = selectedFish.some(fish => fish.id === item.id);
                return (
                  <FishCardInCart
                    item={item}
                    deleteItemFromCart={deleteItemFromCart}
                    isAvailableCart={available}
                    isSelected={isSelected}
                    toggleSelect={() => toggleSelectFish(item)}
                    isCheckout={false}
                  />
                );
              }}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }}
            />
          </View>
        )}
        <View className="absolute bg-white bottom-0 left-0 px-4 pb-4 right-0 flex-col gap-y-2">
          <View className='flex-row justify-between items-center'>
            <View className='flex-row items-center'>
              <Checkbox
                status={selectedFish.length === carts.length ? 'checked' : 'unchecked'}
                onPress={handleSelectAll}
                color="#6d1a1a"
              />
              <Text className="text-sm text-gray-700">Selected all</Text>
            </View>
            <Text className="text-lg font-bold text-red-500">Total price {formatPrice(selectedFish.reduce((sum, fish) => sum + fish.price, 0))}</Text>
          </View>
          <View className='flex-row gap-x-4'>
            <TouchableOpacity
              disabled={selectedFish.length === 0}
              className={`p-2 rounded items-center gap-x-1 flex-row justify-center flex-1 ${selectedFish.length === 0 ? 'bg-gray-300 opacity-50' : 'bg-white border border-primary'}`}
              onPress={() => showDialog()}
            >
              <Text className="text-lg text-primary text-center">Delete ({selectedFish.length})</Text>
              {/* <MaterialCommunityIcons name="trash-can-outline" size={24} color="#6f1a1a" /> */}
            </TouchableOpacity>
            <TouchableOpacity
              disabled={selectedFish.length === 0}
              className={` p-2 rounded items-center flex-row justify-center gap-x-1 flex-1 ${selectedFish.length === 0 ? 'bg-primary opacity-50' : 'bg-primary'}`}
              onPress={handleCheckoutSelected}
            >
              <Text className="text-lg text-white text-center">Checkout ({selectedFish.length})</Text>
              {/* <MaterialCommunityIcons name="cash" size={24} color="white" /> */}
            </TouchableOpacity>
          </View>
        </View>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Confirm Remove</Dialog.Title>
            <Dialog.Content>
              <Text>Are you sure you want to remove selected fishes from your cart?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cancel</Button>
              <Button onPress={handleDeleteSelected}>Yes, Remove</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
};

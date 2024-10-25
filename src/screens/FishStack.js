import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListShowAllFishes from "./ListShowAllFishes";
import FishDetailScreen from "./FishDetailScreen";
import { CartContext } from "../context/CartContext"; // Import the FavouriteContext
import CartScreen from "./CartScreen";

const Stack = createNativeStackNavigator();

const FishStack = ({ navigation, route }) => {
  const { carts } = useContext(CartContext);
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === "FishDetail" || routeName === "Cart") {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({
        tabBarStyle: { display: "flex", backgroundColor: "#6d1a1a" },
      });
    }
  }, [navigation, route]);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FishesAll"
        component={ListShowAllFishes}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FishDetail"
        component={FishDetailScreen}
        options={{
          title: "Fish Detail",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#470101" },
          headerTintColor: "#faeaa3",
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
              <Feather name="shopping-cart" size={24} color="#faeaa3" />
              <View className="h-4 w-4 rounded-full bg-[#faeaa3] flex justify-center items-center absolute -top-1.5 -right-1">
                <Text className="text-[12px] text-secondary font-bold ">
                  {carts?.length}
                </Text>
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: "Your Cart",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#470101" },
          headerTintColor: "#faeaa3",
        }}
      />
      
    </Stack.Navigator>
  );
};

export default FishStack;

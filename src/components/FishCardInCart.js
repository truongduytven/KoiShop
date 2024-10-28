import { Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import Foundation from "@expo/vector-icons/Foundation";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Checkbox } from 'react-native-paper';
import { formatPrice } from "../lib/utils";

const FishCardInCart = ({ item, deleteItemFromCart, isAvailableCart, isSelected, toggleSelect, isCheckout }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("FishDetail", { fishID: item.id });
      }}
    >
      <View
        className={`flex-row items-center p-3 rounded-lg shadow-lg bg-white my-3 ${isAvailableCart ? "opacity-100" : "opacity-50"
          }`}
      >
        {!isCheckout && (
          <Checkbox
            status={isSelected ? 'checked' : 'unchecked'}
            onPress={() => toggleSelect(item.id)}
            color="#6d1a1a"
          />
        )}
        {item.koiFishImages && item.koiFishImages.length > 0 ? (
          <Image
            className="h-24 w-24 rounded-lg mr-3"
            source={{ uri: item.koiFishImages[0] }}
            resizeMode="cover"
          />
        ) : (
          <Image
            className="h-24 w-24 rounded-lg mr-3"
            source={{
              uri: "https://sanvuonadong.vn/wp-content/uploads/2021/02/ca-koi-buom-01.jpg",
            }}
            resizeMode="cover"
          />
        )}
        <View className="flex-1 mx-3">
          <View className="flex-row justify-between items-start">
            <View className="flex-row gap-3">
              <Text className="text-lg font-medium text-gray-700">{item.name}</Text>
              {item.gender === "Male" ? (
                <Foundation name="male-symbol" size={24} color="blue" />
              ) : (
                <Foundation name="female-symbol" size={24} color="pink" />
              )}
            </View>

            {!isCheckout && (
              <TouchableOpacity onPress={() => deleteItemFromCart(item)}>
                <FontAwesome name="trash-o" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-red-600">{formatPrice(item.price)}</Text>
          </View>

          <View className="mt-1">
            <Text>
              Origin: <Text className="font-bold text-gray-700">{item.origin}</Text>
            </Text>
            <View className="flex-row justify-between">
              <Text>
                Length: <Text className="font-bold text-gray-700">{item.length} cm</Text>
              </Text>
              <Text>
                Weight: <Text className="font-bold text-gray-700">{item.weight} g</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
      {!isAvailableCart && (
        <Text className="text-center text-red-600 font-bold mt-1">
          This fish is not available.
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default FishCardInCart;

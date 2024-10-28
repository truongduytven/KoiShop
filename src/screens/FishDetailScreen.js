import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import axios from "axios";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { CartContext } from "../context/CartContext"; // Import the FavouriteContext
import Foundation from "@expo/vector-icons/Foundation";
import { formatDate } from "../lib/utils";
const FishDetailScreen = ({ route }) => {
  const { carts, addToCart, deleteItemFromCart } = useContext(CartContext); // Use the context
  const { fishID } = route.params;
  const [fishDetails, setFishDetails] = useState(null);

  useEffect(() => {
    const fetchFishDetails = async () => {
      try {
        const response = await axios.get(
          `https://koi-api.uydev.id.vn/api/v1/koi-fishes/${fishID}`
        );
        setFishDetails(response.data.data);
        // console.log("Data của cá mẹ : " + response.data.data);
      } catch (error) {
        console.log("Error fetching fish details:", error);
      }
    };

    fetchFishDetails();
  }, [fishID]);

  function formatNumber(number) {
    return number.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const handleAddToCart = () => {
    if (fishDetails) {
      addToCart(fishDetails); // Add the fish details to the cart
    }
  };

  return (
    <ScrollView className="flex-1 p-5 bg-primary">
      {fishDetails && (
        <>
          <View className="flex-column justify-between items-center gap-y-5 mb-5">
            {fishDetails.imageUrl ? (
              <Image
                className="w-1/2 h-60 rounded-lg"
                source={{ uri: fishDetails.imageUrl }}
                resizeMode="cover"
              />
            ) : (
              <Image
                className="w-1/2 h-60 rounded-lg"
                source={{
                  uri: "https://sanvuonadong.vn/wp-content/uploads/2021/02/ca-koi-buom-01.jpg",
                }}
                resizeMode="cover"
              />
            )}
            <View className="flex-row justify-between items-center w-1/2">
              <Text className="text-3xl text-center font-bold text-tertiari">
                {fishDetails.name}
              </Text>
              <TouchableOpacity onPress={handleAddToCart}>
                <MaterialCommunityIcons
                  name="cart-plus"
                  size={30}
                  color="#faeaa3"
                  style={{ marginRight: 0 }} // Ensure marginRight is 0
                />
              </TouchableOpacity>
            </View>
            <Text className="text-sm font-bold text-white">
              Price:
              <Text className="text-2xl font-bold text-tertiari mb-3">
                {" "}
                {formatNumber(fishDetails.price)}
              </Text>
            </Text>
          </View>

          <Text className="text-2xl font-bold text-white mb-2">
            Basic Information
          </Text>
          <View className="p-2 border border-gray-500 border-b-opacity-50 mb-5">
            {fishDetails.ownerId ? (
              <Text className="text-sm font-bold text-white ">
                OwnerID:
                <Text className="text-lg"> {fishDetails.ownerId}</Text>
              </Text>
            ) : (
              <></>
            )}
            <Text className="text-sm font-bold text-white mb-2">
              Origin:
              <Text className="text-lg"> {fishDetails.origin}</Text>
            </Text>
            <Text className="text-sm font-bold text-white mb-2">
              Gender:
              {"  "}
              {fishDetails.gender === "Male" ? (
                <Foundation name="male-symbol" size={24} color="blue" />
              ) : (
                <Foundation name="female-symbol" size={24} color="pink" />
              )}
              {/* <Text className="text-lg"> {fishDetails.gender}</Text> */}
            </Text>
            <Text className="text-sm font-bold text-white mb-2">
              Length:
              <Text className="text-lg"> {fishDetails.length} cm</Text>
            </Text>
            <Text className="text-sm font-bold text-white mb-2">
              Weight:
              <Text className="text-lg"> {fishDetails.weight} gr</Text>
            </Text>
            <Text className="text-sm font-bold text-white mb-2">
              DOB:
              <Text className="text-lg">{fishDetails.dob}</Text>
            </Text>
            {fishDetails.koiCertificates.id ? (
              <Text className="text-sm font-bold text-white ">
                Certificates:
                <Text className="text-lg"> {fishDetails.koiCertificates}</Text>
              </Text>
            ) : (
              <></>
            )}
          </View>

          <Text className="text-2xl font-bold text-white mb-2">
            Detail Information
          </Text>
          <View className="p-2 border border-gray-500 border-b-opacity-50 mb-5">
            <Text className="text-sm font-bold text-white mb-2">
              Personality Traits:
              <Text className="text-lg"> {fishDetails.personalityTraits}</Text>
            </Text>
            <Text className="text-sm font-bold text-white mb-2">
              Daily Feed Amount:
              <Text className="text-lg">
                {" "}
                {fishDetails.dailyFeedAmount} gr/day
              </Text>
            </Text>
            <Text className="text-sm font-bold text-white mb-2">
              Last Health Check:
              <Text className="text-lg"> {formatDate(fishDetails.lastHealthCheck)}</Text>
            </Text>
          </View>

          <Text className="text-2xl font-bold text-white mb-2">Status</Text>
          <View className="p-2 border border-gray-500 border-b-opacity-50 mb-10">
            <Text className="text-sm font-bold text-white mb-2">
              Status in stock:
              <Text className="text-lg">
                {" "}
                {fishDetails.isAvailableForSale ? "Available" : "Unavailable"}
              </Text>
            </Text>
            <Text className="mb-2">
              <Text className="text-sm font-bold text-tertiari">
                {fishDetails.isConsigned ? "Consigned" : "Unconsigned"}
              </Text>
              <Text className="text-sm font-bold text-white"> - </Text>
              <Text className="text-lg font-bold text-tertiari">
                {fishDetails.isSold ? "Sold" : "Selling"}
              </Text>
            </Text>
          </View>

          <Text className="text-2xl font-bold text-white mb-2">Hybrid:</Text>
          <View className="flex-row justify-center p-2 border border-gray-500 border-b-opacity-50 mb-10">
            {fishDetails.koiBreeds.map((item) => (
              <View key={item.id} className="p-2 mb-2 rounded-xl shadow-lg overflow-hidden w-50">
                {item.imageUrl ? (
                      <Image
                        className="w-30 h-60 rounded-lg"
                        source={{ uri: item.imageUrl }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Image
                        className="w-40 h-60 rounded-lg"
                        source={{
                          uri: "https://sanvuonadong.vn/wp-content/uploads/2021/02/ca-koi-buom-01.jpg",
                        }}
                        resizeMode="cover"
                      />
                    )}
                <Text className="text-sm font-bold text-tertiari text-center mt-2">
                  {item.name}
                </Text>
              </View>
            ))}
          </View>

        </>
      )}
    </ScrollView>
  );
};

export default FishDetailScreen;

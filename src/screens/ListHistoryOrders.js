import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ListHistoryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const handleNavigateHome = () => {
    navigation.reset({ index: 0, routes: [{ name: 'HomePage' }] })
    navigation.navigate("Fishes", { screen: 'FishesAll' })
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        if (!jwtToken) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "https://koi-api.uydev.id.vn/api/v1/users/me/orders",
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setOrders(response.data.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  function formatNumber(number) {
    return number.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  function formatDateToDMY(isoDate) {
    const date = new Date(isoDate);
    const minute = date.getMinutes().toString().padStart(2, '0');
    const hour = date.getHours();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year} ${hour}:${minute}`;
  };

  const renderOrders = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("OrderDetail", {
          orderStatus: item.orderStatus,
          shippingAddress: item.shippingAddress,
          orderDate: item.orderDate,
          totalAmount: item.totalAmount,
          paymentMethod: item.paymentMethod,
          note: item.note,
          orderDetail: item.orderDetails
        });
      }}
    >
      <View
        className={`m-2 p-2 rounded-lg shadow-lg my-3`}
        style={{ backgroundColor: '#fef8ff' }}
      >
        <View className="flex-row justify-between items-start pb-2 border-b border-gray-300 border-b-opacity-50 mb-2">
          <Text className="text-lg font-medium text-gray-300">
            {/* {item.orderStatus === "COMPLETED" ? (
              <Text className="text-md font-bold text-green-700">
                {item.orderStatus}
              </Text>
            ) : (
              <Text className="text-lg font-bold text-red-800 pt-3">{item.orderStatus}</Text>

            )} */}
            <Text
              className={`text-lg ${item.orderStatus === 'COMPLETED'
                  ? 'text-white font-bold bg-green-500'
                  : item.orderStatus === 'PENDING'
                    ? 'text-white font-bold bg-orange-700'
                    : item.orderStatus === 'CANCELLED'
                      ? 'text-white font-bold bg-red-800'
                      : 'text-white font-bold bg-gray-500'
                }`}
            >
              {item.orderStatus}
            </Text>
          </Text>
          <Text className="text-sm text-gray-500">{formatDateToDMY(item.orderDate)}</Text>

        </View>

        <View>
          {item.orderDetails.map((item) => (
            <View key={item.id} className={`flex-row mb-5`} >
              {item.koiFish.koiFishImages && item.koiFish.koiFishImages.length > 0 ? (
                <Image
                  className="h-24 w-24 rounded-lg mr-3"
                  source={{ uri: item.koiFish.koiFishImages[0] }}
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
                    <Text className="text-lg font-medium text-gray-700"> {item.koiFish.name}</Text>
                  </View>
                  <Text className="text-sm font-medium text-orange-400">{formatNumber(item.koiFish.price)}</Text>
                </View>
                <Text className="text-sm text-gray-400">{item.koiFish.origin}, {item.koiFish.gender}</Text>
              </View>
            </View>
          ))}

          <View className="items-end border-t border-gray-300 border-b-opacity-50 mt-2">
            {/* <Text className="text-lg font-bold text-red-600">100000 VNĐ</Text> */}
            <Text className="text-lg">Total:
              <Text className="text-lg font-bold text-red-600"> {formatNumber(item.totalAmount)}</Text>
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 justify-between">
      {loading ? (
        <ActivityIndicator size="large" color="#f00530" />
      ) : orders.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <MaterialIcons name="local-shipping" size={80} color="#6d1a1a" />

          <Text className="text-lg text-gray-700 my-2">No orders yet!</Text>
          <TouchableOpacity
            className="bg-[#6d1a1a] p-2 rounded"
            onPress={handleNavigateHome}
          >
            <Text className="text-white text-base">Shopping Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrders}
          keyExtractor={(item) => item.id.toString()}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ListHistoryOrders;

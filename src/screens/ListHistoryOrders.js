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
        const response = await axios.get(
          "https://koi-api.uydev.id.vn/api/v1/users/me/orders"
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

  const renderOrders = ({ item }) => (
    //   <TouchableOpacity
    //   onPress={() => {
    //     navigation.navigate("FishDetail", { fishID: item.id });
    //   }}
    // >
    <View
        className={`p-3 rounded-lg shadow-lg bg-white my-3`}
      > 
        <View className="flex-row justify-between items-start pb-2">
            <Text className="text-lg font-medium text-gray-700">Mã đơn hàng</Text>
            <Text className="text-lg font-medium text-gray-300">trạng thái</Text>
        </View>
        <View className={`flex-row items-center`}>
        
          {/* {item.koiFishImages && item.koiFishImages.length > 0 ? (
          <Image
            className="h-24 w-24 rounded-lg mr-3"
            source={{ uri: item.koiFishImages[0] }}
            resizeMode="cover"
          />
        ) : ( */}
          <Image
            className="h-24 w-24 rounded-lg mr-3"
            source={{
              uri: "https://sanvuonadong.vn/wp-content/uploads/2021/02/ca-koi-buom-01.jpg",
            }}
            resizeMode="cover"
          />
          {/* )} */}
          <View className="flex-1 mx-3">
            <View className="flex-row justify-between items-start">
              <View className="flex-row gap-3">
                <Text className="text-lg font-medium text-gray-700">Kohaku</Text>
              </View>
              <Text className="text-lg font-medium text-gray-300">x1</Text>
            </View>

            <View className="items-end">
              <Text className="text-lg font-bold text-red-600">100000 VNĐ</Text>
              <Text className="text-lg font-bold text-red-600">Total: 100000 VNĐ</Text>
            </View>
          </View>
        </View>
      </View>
    // </TouchableOpacity>
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
        keyExtractor={(item) => item.Id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
      )}            
    </View>
  );
};

export default ListHistoryOrders;

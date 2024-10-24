import React, { useEffect, useState, useContext } from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { Searchbar } from "react-native-paper";
import Feather from "@expo/vector-icons/Feather";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { CartContext } from "../context/CartContext"; // Import the FavouriteContext

const HomeScreen = () => {
  const { carts, addToCart, deleteItemFromCart } = useContext(CartContext); // Use the context

  const [breeds, setBreeds] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await axios.get(
          "https://koi-api.uydev.id.vn/api/v1/odata/koi-breeds"
        );
        setBreeds(response.data.value);
        console.log("Cho coi data giống cá nè " + response.data.value);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchBreeds();
  }, []);

  const renderBreedCard = ({ item }) => (
    <TouchableOpacity
      className="w-1/2 p-2"
      onPress={() => navigation.navigate("BreedDetail", { breedID: item.Id })}
    >
      <View>
        <View className="bg-white rounded-xl shadow-lg overflow-hidden">
          {item.ImageUrl ? (
            <Image
              className="w-full h-60"
              source={{ uri: item.ImageUrl }}
              resizeMode="cover"
            />
          ) : (
            <Image
              className="w-full h-60"
              source={{
                uri: "https://sanvuonadong.vn/wp-content/uploads/2021/02/ca-koi-buom-01.jpg",
              }}
              resizeMode="cover"
            />
          )}
          <View className="p-3 flex-row justify-center">
            <Text className="text-lg font-bold text-black">{item.Name}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 justify-start bg-primary p-3 gap-y-5">
      <View className="flex flex-row justify-between items-center gap-5 ">
        <View className="flex-1">
          <Searchbar placeholder="Search" />
        </View>
        <TouchableOpacity
          style={{ position: "relative" }}
          onPress={() => navigation.navigate("Cart")}
        >
          <Feather name="shopping-cart" size={24} color="white" />
          <View className="h-4 w-4 rounded-full bg-white flex justify-center items-center absolute -top-1.5 -right-1">
            <Text className="text-[12px] text-secondary font-bold ">
              {carts?.length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <FlatList
        data={breeds}
        renderItem={renderBreedCard}
        keyExtractor={(item) => item.Id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 5 }}
        ListHeaderComponent={
          <>
            <View className="w-full h-60 mb-5">
              <Image
                className="w-full h-full rounded-xl"
                source={require("../../assets/Banner.png")}
                resizeMode="cover"
              />
            </View>
            <View className="w-full flex-row mb-5">
              <View className="w-2/3">
                <Text className="text-lg font-bold mb-2 text-tertiari">
                  Welcome to Koi Shop
                </Text>
                <Text className="text-base text-justify pr-5 text-white">
                  Koi Shop specializes in selling high-quality Koi fish of
                  various breeds. We offer the best selection to meet your
                  needs, ensuring beautiful and healthy Koi for your pond.
                </Text>
              </View>
              <View className="w-1/3 h-60">
                <Image
                  className="w-full h-full rounded-xl"
                  source={{
                    uri: "https://minhxuankoifarm.com/wp-content/uploads/2020/09/1-1-1.jpg",
                  }}
                  resizeMode="cover"
                />
              </View>
            </View>
            <Text className="text-xl font-bold text-tertiari mb-3">
              Our Koi Breeds
            </Text>
          </>
        }
      />
    </View>
  );
};

export default HomeScreen;

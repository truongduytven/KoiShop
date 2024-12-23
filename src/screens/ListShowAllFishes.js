
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import { useNavigation,useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { ActivityIndicator, Searchbar } from "react-native-paper";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { CartContext } from "../context/CartContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function ListShowAllFishes() {
  const [fishes, setFishes] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation();
  const [uniqueOrigins, setUniqueOrigins] = useState([]); // Step 2: State for unique origins
  const [selectedOrigin, setSelectedOrigin] = useState(''); 
  const { carts, addToCart, deleteItemFromCart } = useContext(CartContext); // Use the context
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFishes = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://koi-api.uydev.id.vn/api/v1/koi-fishes?PageSize=990"
        );
        // https://koi-api.uydev.id.vn/api/v1/koi-fishes
        // https://koi-api.uydev.id.vn/api/v1/odata/koi-fishes

        setFishes(response.data.data.filter(fish => fish.isAvailableForSale === true));
        setSelectedOrigin('')
      } catch (error) {
        setIsLoading(false)
        console.log("Error fetching data:", error);
      } finally {
        setIsLoading(false)
      }
    };
    fetchFishes();
    // console.log("Fetch được rồi ní");
  }, []);
  useFocusEffect(
    useCallback(() => {
      setSelectedOrigin('');
    }, [])
  );
  // const filterKoiFishes = () => {
  //   return fishes.filter(fish =>
  //     fish.name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  // };
  const origins = [...new Set(fishes.map(fish => fish.origin))];
  const filterKoiFishes = () => {
    return fishes.filter(fish => {
      const matchesSearchQuery = fish.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOrigin = selectedOrigin ? fish.origin === selectedOrigin : true; // Filter by origin
      return matchesSearchQuery && matchesOrigin;
    });
  };

  function formatNumber(number) {
    return number.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  const renderFishesCard = ({ item }) => {
    // Check if the item is already in the cart
    const isInCart = carts.some(cartItem => cartItem.id === item.id);
  
    return (
      <>
        <TouchableOpacity
          className="w-1/2 p-2"
          onPress={() => navigation.navigate("FishDetail", { fishID: item.id })}
        >
          <View>
            <View className="bg-white rounded-xl shadow-lg overflow-hidden">
              {item.koiFishImages && item.koiFishImages.length > 0 ? (
                <Image
                  className="w-full h-60"
                  source={{ uri: item.koiFishImages[0].imageUrl }}
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
              
              <View className="p-3 flex-row justify-between items-center">
                <Text className="text-lg font-bold text-black">{item.name}</Text>
              </View>
  
              <View className="p-1 flex-row justify-center">
                <View className="p-1 flex-row justify-start">
                  <Text className="text-md font-bold text-black justify-start">
                    {formatNumber(item.price)}
                  </Text>
                </View>
  
                <View className="p-1 flex-row justify-end">
                  {item.isSold ? (
                    <Text className="text-lg font-bold text-red-800">Sold</Text>
                  ) : (
                    <Text className="text-md font-bold text-green-700">
                      Selling
                    </Text>
                  )}
                </View>
              </View>
  
              <TouchableOpacity
                className="bg-red-500 flex-row justify-center items-center text-white text-center font-bold py-2 px-4"
                onPress={() => addToCart(item)}
              >
                <MaterialCommunityIcons
                  name="cart-plus"
                  size={20}
                  color="white"
                  style={{ marginRight: 0 }}
                />
                
                <Text className="text-white">
                  {isInCart ? "Already in Cart" : "Add to cart"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  };
  
  // console.log(AsyncStorage.getAllKeys());
  return (
    <View className="flex justify-start bg-primary p-3 gap-y-5 h-screen">
      <View className="flex flex-row justify-between items-center gap-x-5">
        <View className="flex-1">
          <Searchbar
            placeholder="Search"
            onChangeText={(query) => setSearchQuery(query)}
            value={searchQuery}
          />
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
     
       <View className="flex-row flex-wrap gap-2 mt-4 mb-4 px-2">
       <TouchableOpacity
          className={`p-2 m-1 rounded ${selectedOrigin === '' ? 'bg-white' : 'border-[1px] rounded-md border-white '}`}
          onPress={() => setSelectedOrigin('')} // Select All
        >
          <Text className={`${selectedOrigin === '' ? 'font-bold text-primary ' : 'text-white'}`}>
            All Origins
          </Text>
        </TouchableOpacity>
        {origins.map((origin, index) => (
          <TouchableOpacity
            key={index}
            className={`p-2 m-1 rounded ${selectedOrigin === origin ? 'bg-white' : 'border-[1px] rounded-md border-white '}`}
            onPress={() => setSelectedOrigin(selectedOrigin === origin ? '' : origin)} // Toggle filter
          >
            <Text className={` ${selectedOrigin === origin ? 'font-bold text-primary ' : 'text-white'}`}>
              {origin}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {isLoading ? (
        <View className="flex-1 justify-center bg-primary items-center h-full">
          <ActivityIndicator size="large" color="#faeaa3" />
        </View>
      ) :
        (<FlatList
          data={filterKoiFishes()}
          renderItem={renderFishesCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 5, paddingBottom: 100 }}
          ListHeaderComponent={
            <>
              {/* <View className="flex flex-row justify-between items-center gap-5 mb-5">
              <View className='flex-1'>
                <Searchbar placeholder="Search" />
              </View>
              <Feather name="shopping-cart" size={24} color="white" />
            </View> */}
              {/* <View className='w-full flex-row mb-5'>
              <View className='w-2/3'>
                <Text className="text-lg font-bold mb-2 text-tertiari">Welcome to Koi Shop</Text>
                <Text className="text-base text-justify pr-5 text-white">
                  Koi Shop specializes in selling high-quality Koi fish of various fishes from various breeds. We offer the best selection to meet your needs, ensuring beautiful and healthy Koi for your pond.
                </Text>
              </View>
              <View className='w-1/3 h-60'>
                <Image className='w-full h-full rounded-xl' source={{ uri: 'https://minhxuankoifarm.com/wp-content/uploads/2020/09/1-1-1.jpg' }} resizeMode="cover" />
              </View>
            </View> */}
              <Text className="text-xl font-bold text-tertiari mb-3">
                Our Koi Fishes
              </Text>
              {filterKoiFishes()?.length === 0 ? (
                <View className="flex-1 flex justify-center items-center pt-40 h-full">
                  <Ionicons name="fish-outline" size={80} color="gray" />
                  <Text className="text-lg text-gray-200 my-2">No fishes yet!</Text>
                </View>
              ) : (
                <Text className="text-lg font-bold text-white mb-3">
                  About {filterKoiFishes()?.length} fishes on selling {searchQuery !== '' ? (<Text>match "{searchQuery}" </Text>) : (<></>)}
                </Text>
              )}
            </>
          }
        />)
      }
    </View>
  );
}

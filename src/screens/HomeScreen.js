import React, { useEffect, useState, useContext } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { List, Searchbar } from "react-native-paper";
import Feather from "@expo/vector-icons/Feather";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { CartContext } from "../context/CartContext"; // Import the FavouriteContext
import Ionicons from "@expo/vector-icons/Ionicons";

const HomeScreen = () => {
  const [question, setQuestion] = useState([]);
  const { carts, addToCart, deleteItemFromCart } = useContext(CartContext); // Use the context
  const [breeds, setBreeds] = useState([]);
  const [news, setNews] = useState([]);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await axios.get(
          "https://koi-api.uydev.id.vn/api/v1/koi-breeds"
        );
        const breedData = response.data.data.filter(breed => breed.isDeleted === false);
        setBreeds(breedData);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    const fetchQuestions = async () => {
      try {
        const responseQuestion = await axios.get(
          "https://671b3d972c842d92c37f0b37.mockapi.io/question"
        );
        setQuestion(responseQuestion.data);

      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    const fetchNews = async () => {
      try {
        const responseNews = await axios.get("https://65459186fe036a2fa9546e52.mockapi.io/api/v1/News");
        setNews(responseNews.data);
      } catch (error) {
        console.log("Error fetching news data:", error);
      }
    };
    fetchNews();
    fetchBreeds();
    fetchQuestions();
  }, []);

  const filterBreeds = () => {
    return breeds.filter(breed =>
      breed.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderQuestionCard = ({ item }) => (
    <View>
      <List.Accordion
        title="Câu hỏi: "
        description={item.question}
        left={props => <List.Icon {...props} icon="chat-question" />}
        style={{ borderTopColor: "gray", borderTopWidth: 0.5, marginBottom: 10 }}>
        <List.Item title="Trả lời: " description={item.answer} style={{ backgroundColor: 'white', borderColor: "gray", borderWidth: 0.5 }} />
        {item.solution ? (
          <List.Item title="Bí quyết: " description={item.solution} style={{ backgroundColor: 'white', borderColor: "gray", borderWidth: 0.5 }} />
        ) : (
          <></>
        )}
      </List.Accordion>
    </View>
  );

  const renderBreedCard = ({ item }) => (
    <TouchableOpacity
      className="w-48 p-2"
      onPress={() => navigation.navigate("BreedDetail", { breedID: item.id })}
    >
      <View>
        <View className="bg-white rounded-xl shadow-lg overflow-hidden">
          {item.imageUrl ? (
            <Image
              className="w-full h-60"
              source={{ uri: item.imageUrl }}
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
            <Text className="text-lg font-bold text-black">{item.name}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderNewsCard = ({ item }) => (
    <TouchableOpacity
      className="w-48 p-2"
      onPress={() => navigation.navigate("NewDetail", { newsItem: item })}
    >
      <View className="bg-white rounded-xl shadow-lg overflow-hidden">
        <Image
          className="w-full h-40"
          source={{ uri: item.imgUrl }}
          resizeMode="cover"
        />
        <View className="p-3">
          <Text className="text-lg font-bold text-black">{item.title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 justify-start bg-primary p-3 gap-y-5">
      <View className="flex flex-row justify-between items-center gap-x-5 ">
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
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
        <View className="w-full h-60 mb-5 px-[5px]">
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
        {filterBreeds()?.length === 0 ? (
          <View className="flex justify-center items-center">
            <Ionicons name="fish-outline" size={60} color="gray" />
            <Text className="text-sm text-gray-200 my-2">No Found Breed!</Text>
          </View>
        ) : (
          <Text className="text-lg font-bold text-white mb-3">
            About {filterBreeds()?.length} breeds
          </Text>
        )}

        <FlatList
          data={filterBreeds()}
          renderItem={renderBreedCard}
          keyExtractor={(item) => item.id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
        <Text className="text-xl font-bold text-tertiari mb-3">
          News
        </Text>
        <FlatList
          data={news}
          renderItem={renderNewsCard}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
        <Text className="text-xl font-bold text-tertiari mb-3">Frequently asked questions</Text>
        <FlatList
          data={question}
          renderItem={renderQuestionCard}
          keyExtractor={(item) => item.id}
          horizontal={false}
          showsHorizontalScrollIndicator={true}
        />
      </ScrollView>
    </View >
  );
};

export default HomeScreen;

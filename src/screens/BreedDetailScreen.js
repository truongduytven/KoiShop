import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, FlatList } from "react-native";
import axios from "axios";

const BreedDetailScreen = ({ route }) => {
  const { breedID } = route.params;
  const [breedDetails, setBreedDetails] = useState(null);
  const [relatedFish, setRelatedFish] = useState([]);

  useEffect(() => {
    const fetchBreedDetails = async () => {
      try {
        const response = await axios.get(`https://koi.eventzone.id.vn/api/v1/koi-breeds/${breedID}`);
        setBreedDetails(response.data.data);
      } catch (error) {
        console.log("Error fetching breed details:", error);
      }
    };

    const fetchRelatedFish = async () => {
      try {
        const response = await axios.get(`https://koi.eventzone.id.vn/api/v1/koi-fishes/?KoiBreedId=${breedID}`);
        setRelatedFish(response.data.data);
      } catch (error) {
        console.log("Error fetching related fish:", error);
      }
    };

    fetchBreedDetails();
    fetchRelatedFish();
  }, [breedID]);

  const renderFishCard = ({ item }) => (
    <View className="w-40 p-2 mb-10">
      <View className="bg-white rounded-xl shadow-lg overflow-hidden">
        {item.imageUrl ? (
          <Image className="w-full h-40" source={{ uri: item.imageUrl }} resizeMode="cover" />
        ) : (
          <Image className="w-full h-40" source={{ uri: 'https://sanvuonadong.vn/wp-content/uploads/2021/02/ca-koi-buom-01.jpg' }} resizeMode="cover" />
        )}
        <View className="p-2">
          <Text className="text-sm font-bold text-black text-center">{item.name}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 p-5 bg-primary">
      {breedDetails && (
        <>
          <Text className="text-3xl text-center font-bold text-tertiari mb-3">{breedDetails.name}</Text>
          <View className="flex-column justify-between items-center gap-y-5 mb-5">
            {breedDetails.imageUrl ? (
              <Image className="w-1/2 h-60 rounded-lg" source={{ uri: breedDetails.imageUrl }} resizeMode="cover" />
            ) : (
              <Image className="w-1/2 h-60 rounded-lg" source={{ uri: 'https://sanvuonadong.vn/wp-content/uploads/2021/02/ca-koi-buom-01.jpg' }} resizeMode="cover" />
            )}
            <Text className="text-base text-justify w-full text-white pr-3">{breedDetails.content}</Text>
          </View>
          <Text className="text-xl font-bold text-tertiari mb-3">Related Fish</Text>
          <FlatList
            data={relatedFish}
            renderItem={renderFishCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 5 }}
          />
        </>
      )}
    </ScrollView>
  );
};

export default BreedDetailScreen;

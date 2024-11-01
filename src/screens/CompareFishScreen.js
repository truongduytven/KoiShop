import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import axios from 'axios';
import Ionicons from "@expo/vector-icons/Ionicons";


const API_URL = 'https://koi-api.uydev.id.vn/api/v1/koi-fishes?PageSize=99'; // Example API

const CompareFishScreen = () => {
  const [data, setData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        // const json = await response.json();
        setData(response.data.data);
        // console.log("Cho coi data nè " + response.data.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filterKoiFishes = () => {
    return data.filter(fish =>
      fish.name.toLowerCase()
    );
  };
  function formatDateToDMY(isoDate) {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  function formatNumber(number) {
    return number.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else if (selectedIds.length < 2) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className="flex flex-row justify-between items-center px-4 py-2"
      style={[styles.item, selectedIds.includes(item.id) && styles.selectedItem]}
      onPress={() => toggleSelect(item.id)}
    >
      <View>
        <Text className="font-bold text-orange-300">{item.name}</Text>
        <Text style={styles.title}>{item.origin}, {item.gender}</Text>
        <Text style={styles.title}>{item.weight} gram</Text>
        <Text style={styles.title}>{item.length} cm</Text>
      </View>
      <View>
        {item.isSold ? (
          <Text className="text-md font-bold text-red-800">Sold</Text>
        ) : (
          <Text className="text-md font-bold text-green-700">
            Selling
          </Text>
        )}
        <Text style={styles.title}>Last health check: </Text>
        <Text style={styles.title}>{formatDateToDMY(item.lastHealthCheck)}</Text>
        <Text className="font-bold text-orange-400">{formatNumber(item.price)}</Text>
      </View>
      {item.koiFishImages && item.koiFishImages.length > 0 ? (
        <Image
          className="w-20 h-20 rounded-md"
          source={{ uri: item.koiFishImages[0].imageUrl }}
          resizeMode="cover"
        />
      ) : (
        <Image
          className="w-20 h-20 rounded-md"
          source={{
            uri: "https://sanvuonadong.vn/wp-content/uploads/2021/02/ca-koi-buom-01.jpg",
          }}
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  );

  const compareObjects = () => {
    if (selectedIds.length === 2) {
      const [first, second] = selectedIds.map(id => data.find(item => item.id === id));
      return (
        <>
          <View style={styles.comparisonContainer}>
            {/* <ScrollView> */}
            <View style={styles.objectContainer}>
              {/* <Text style={styles.objectTitle}>Fish 1</Text> */}
              <Text className="font-bold text-white ">{first.name}</Text>
              <Text className="font-bold text-gray-300">{first.origin}</Text>
              <Text className="font-bold text-gray-300">{first.gender}</Text>
              <Text className="font-bold text-gray-300">{formatDateToDMY(first.dob)}</Text>
              <Text className="font-bold text-gray-300">{first.length}</Text>
              <Text className="font-bold text-gray-300">{first.weight}</Text>
              <Text className="font-bold text-gray-300">{first.personalityTraits}</Text>
              <Text className="font-bold text-gray-300">{first.dailyFeedAmount}</Text>
              <Text className="font-bold text-gray-300">{formatDateToDMY(first.lastHealthCheck)}</Text>
              <Text className="font-bold text-gray-300">{formatNumber(first.price)}</Text>
              {first.isSold ? (
                <Text className="text-lg font-bold text-red-800">Sold</Text>
              ) : (
                <Text className="text-md font-bold text-green-700">
                  Selling
                </Text>
              )}
              <Text>{first.koiBreeds.map((item) => {
                return (
                  <Text key={item.id} className="mb-2">
                    <Text className="text-sm font-bold text-tertiari">
                      {item.name}
                    </Text>
                    <Text className="text-sm font-bold text-white"> - </Text>
                  </Text>
                );
              })}</Text>
              {first.ImageUrl ? (
                <Image
                  className="w-30 h-40 rounded-md"
                  source={{ uri: first.ImageUrl }}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  className="w-30 h-40 rounded-md"
                  source={{
                    uri: "https://sanvuonadong.vn/wp-content/uploads/2021/02/ca-koi-buom-01.jpg",
                  }}
                  resizeMode="cover"
                />
              )}

            </View>

            <View style={styles.infoMid}>
              {/* <Text style={styles.objectTitle}>Fish 2</Text> */}
              <Text className="font-bold text-orange-300">Name</Text>
              <Text className="font-bold text-orange-300">Origin</Text>
              <Text className="font-bold text-orange-300">Gender</Text>
              <Text className="font-bold text-orange-300">DOB</Text>
              <Text className="font-bold text-orange-300">Length(cm)</Text>
              <Text className="font-bold text-orange-300">Weight(g)</Text>
              <Text className="font-bold text-orange-300">Traits</Text>
              <Text className="font-bold text-orange-300">Feed(g/day)</Text>
              <Text className="font-bold text-orange-300">Last check</Text>
              <Text className="font-bold text-orange-300">Price</Text>
              <Text className="font-bold text-orange-300">Available</Text>
              <Text className="font-bold text-orange-300">Breeds</Text>
              <Text className="font-bold text-orange-300"></Text>
              <Image
                className="w-30 h-40"
                // source={{
                //   uri: "https://sanvuonadong.vn/wp-content/uploads/2021/02/ca-koi-buom-01.jpg",
                // }}
                resizeMode="cover"
              />

            </View>
            <View style={styles.objectContainer}>
              {/* <Text style={styles.objectTitle}>Fish 2</Text> */}
              <Text className="font-bold text-white ">{second.name}</Text>
              <Text className="font-bold text-white">{second.origin}</Text>
              <Text className="font-bold text-gray-300">{second.gender}</Text>
              <Text className="font-bold text-gray-300">{formatDateToDMY(second.dob)}</Text>
              <Text className="font-bold text-gray-300">{second.length}</Text>
              <Text className="font-bold text-gray-300">{second.weight}</Text>
              <Text className="font-bold text-gray-300">{second.personalityTraits}</Text>
              <Text className="font-bold text-gray-300">{second.dailyFeedAmount}</Text>
              <Text className="font-bold text-gray-300">{formatDateToDMY(second.lastHealthCheck)}</Text>
              <Text className="font-bold text-gray-300">{formatNumber(second.price)}</Text>
              {second.isSold ? (
                <Text className="text-lg font-bold text-red-800">Sold</Text>
              ) : (
                <Text className="text-md font-bold text-green-700">
                  Selling
                </Text>
              )}
              <Text>{second.koiBreeds.map((item) => {
                return (
                  <Text key={item.id} className="mb-2">
                    <Text className="text-sm font-bold text-tertiari">
                      {item.name}
                    </Text>
                    <Text className="text-sm font-bold text-white"> - </Text>
                  </Text>
                );
              })}</Text>
              {second.ImageUrl ? (
                <Image
                  className="w-30 h-40"
                  source={{ uri: second.ImageUrl }}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  className="w-30 h-40"
                  source={{
                    uri: "https://sanvuonadong.vn/wp-content/uploads/2021/02/ca-koi-buom-01.jpg",
                  }}
                  resizeMode="cover"
                />
              )}

            </View>
            {/* </ScrollView> */}
          </View>
        </>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Comparison, choose 2</Text>

      {filterKoiFishes()?.length === 0 ? (
        <View className="flex-1 flex justify-center items-center pt-40 h-full">
          <Ionicons name="fish-outline" size={80} color="gray" />
          <Text className="text-lg text-gray-200 my-2">No fishes yet!</Text>
        </View>
      ) : (
        <Text className="text-lg font-bold text-white mb-3">
          About {filterKoiFishes()?.length} fishes in total
        </Text>
      )}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      {compareObjects()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#470101',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedItem: {
    backgroundColor: '#e0f7fa',
    color: 'black',
  },
  title: {
    fontSize: 16,
    fontStyle: 'bold',

    color: 'darkgray',
  },
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  objectContainer: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#white',
  },
  infoMid: {
    // flex: 1,
    marginRight: 10,
    paddingTop: 10,
    color: '#white',
  },
  objectTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default CompareFishScreen;
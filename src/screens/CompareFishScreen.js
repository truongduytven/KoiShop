import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import axios from 'axios';

const API_URL = 'https://koi-api.uydev.id.vn/api/v1/koi-fishes'; // Example API

const CompareFishScreen = () => {
  const [data, setData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        // const json = await response.json();
        setData(response.data.data);
        console.log("Cho coi data nè " + response.data.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
      style={[styles.item, selectedIds.includes(item.id) && styles.selectedItem]}
      onPress={() => toggleSelect(item.id)}
    >
      <Text style={styles.title}>{item.name}</Text>
      {item.ImageUrl ? (
        <Image
          className="w-full h-60"
          source={{ uri: item.ImageUrl }}
          resizeMode="cover"
        />
      ) : (
        <Image
          className="w-full h-20"
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
              <Text className="font-bold text-white">{first.origin}</Text>
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
                  className="w-30 h-40"
                  source={{ uri: first.ImageUrl }}
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

            <View style={styles.infoMid}>
              {/* <Text style={styles.objectTitle}>Fish 2</Text> */}
              <Text className="font-bold text-gray-500">Name</Text>
              <Text className="font-bold text-gray-500">Origin</Text>
              <Text className="font-bold text-gray-500">Gender</Text>
              <Text className="font-bold text-gray-500">DOB</Text>
              <Text className="font-bold text-gray-500">Length(cm)</Text>
              <Text className="font-bold text-gray-500">Weight(g)</Text>
              <Text className="font-bold text-gray-500">Traits</Text>
              <Text className="font-bold text-gray-500">Feed(g/ngày)</Text>
              <Text className="font-bold text-gray-500">Last check</Text>
              <Text className="font-bold text-gray-500">Price</Text>
              <Text className="font-bold text-gray-500">Available</Text>
              <Text className="font-bold text-gray-500">Breeds</Text>
              <Text className="font-bold text-gray-500"></Text>
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
      <Text style={styles.header}>Trang so sánh, chọn 2 cá để bắt đầu</Text>
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
    color: 'gray',
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
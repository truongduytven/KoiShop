import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Example API

const CompareFishScreen = () => {
  const [data, setData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(API_URL);
      const json = await response.json();
      setData(json);
    };

    fetchData();
  }, []);

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
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  const compareObjects = () => {
    if (selectedIds.length === 2) {
      const [first, second] = selectedIds.map(id => data.find(item => item.id === id));
      return (
        <View style={styles.comparisonContainer}>
          <View style={styles.objectContainer}>
            <Text style={styles.objectTitle}>Fish 1</Text>
            <Text>{first.title}</Text>
            <Text>{first.body}</Text>
          </View>
          <View style={styles.objectContainer}>
            <Text style={styles.objectTitle}>Fish 2</Text>
            <Text>{second.title}</Text>
            <Text>{second.body}</Text>
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Two Fishes to Compare</Text>
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
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedItem: {
    backgroundColor: '#e0f7fa',
  },
  title: {
    fontSize: 16,
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
  },
  objectTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default CompareFishScreen;
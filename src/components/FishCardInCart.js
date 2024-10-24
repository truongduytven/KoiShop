import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const FishCardInCart = ({ item, deleteItemFromCart, isAvailableCart }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('FishDetail', { fishID: item.id });
      }}
    >
      <View style={[
        styles.container, 
        isAvailableCart ? styles.available : styles.unavailable, 
        { opacity: isAvailableCart ? 1 : 0.5 } // Adjust opacity based on availability
      ]}>
        {item.koiFishImages && item.koiFishImages.length > 0 ? (
          <Image
            style={styles.coverImage}
            source={{ uri: item.koiFishImages[0] }}
            resizeMode="cover"
          />
        ) : (
          <Image
            style={styles.coverImage}
            source={{
              uri: "https://sanvuonadong.vn/wp-content/uploads/2021/02/ca-koi-buom-01.jpg",
            }}
            resizeMode="cover"
          />
        )}
        <View style={styles.favouriteContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{item.name}</Text>
            <TouchableOpacity
              onPress={() => {
                deleteItemFromCart(item);
              }}
            >
              <Text style={styles.deleteText}>Xóa</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.price}>${item.price}</Text>
            {item.limitedTimeDeal > 0 && (
              <Text style={styles.deal}>
                {Math.round(item.limitedTimeDeal * 100)}% OFF
              </Text>
            )}
          </View>

          <View style={styles.additionalInfoContainer}>
            <Text>Origin: <Text style={styles.brand}>{item.origin}</Text></Text>
            <Text>Gender: <Text style={styles.brand}>{item.gender}</Text></Text>
            <Text>Length: <Text style={styles.brand}>{item.length} cm</Text></Text>
            <Text>Weight: <Text style={styles.brand}>{item.weight} g</Text></Text>
            <Text>Personality: <Text style={styles.brand}>{item.personalityTraits}</Text></Text>
            <Text>Daily Feed Amount: <Text style={styles.brand}>{item.dailyFeedAmount} g</Text></Text>
            <Text>Last Health Check: <Text style={styles.brand}>{new Date(item.lastHealthCheck).toLocaleDateString()}</Text></Text>
            <Text>Available for Sale: <Text style={styles.brand}>{item.isAvailableForSale ? "Yes" : "No"}</Text></Text>
          </View>
        </View>
      </View>
      {!isAvailableCart && (
        <Text style={styles.notAvailableText}>This fish is not available.</Text>
      )}
    </TouchableOpacity>
  );
};

export default FishCardInCart;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  coverImage: {
    height: 100,
    width: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  favouriteContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "start",
  },
  title: {
    fontSize: 18,
    color: "#444444",
    fontWeight: "500",
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    color: "#f00530",
    fontWeight: "bold",
    marginBottom: 5,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  additionalInfoContainer: {
    marginTop: 10,
  },
  deleteText: {
    color: "#f00530",
    fontWeight: "bold",
  },
  deal: {
    color: "#f00530",
    fontWeight: "bold",
    marginBottom: 5,
  },
  brand: {
    color: "#444444",
    fontWeight: "bold",
  },
  notAvailableText: {
    color: "#f00530",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
 
});

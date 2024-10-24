  import { View, Text,StyleSheet,ActivityIndicator,FlatList } from 'react-native'
import React,{useContext,useState, useEffect} from 'react'
import { CartContext } from "../context/CartContext"; // Import the FavouriteContext
import axios from "axios";
import FishCardInCart from '../components/FishCardInCart';
const CartScreen = () => {
  const { carts, addToCart, deleteItemFromCart } = useContext(CartContext); // Use the context
  const [fishes, setFishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFishes = async () => {
      try {
        setLoading(true); 

        const response = await axios.get(
          "https://koi-api.uydev.id.vn/api/v1/koi-fishes"
        );
        setFishes(response.data.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }finally {
        setLoading(false); 
      }
    };
    fetchFishes();
  }, []);
  // const isCartAvailable = (item) => {
  //   return fishes.some((fish) => fish.id === item.id);
  // };
  const isCartAvailable = (item) => {
    const fishInCart = fishes.find((fish) => fish.id === item.id);
    return fishInCart && !fishInCart.isSold; // Check if the fish is in the cart and not sold
  };
  return (
    <View>
      {loading ? ( // Show loading indicator while fetching products
        <ActivityIndicator size="large" color="#f00530" />
      ) : carts.length === 0 ? ( // Check if there are no favourites
        <View style={styles.emptyContainer}>
          {/* <Ionicons name="heart-outline" size={50} color="#f00530" /> */}
          <Text style={styles.emptyText}>No carts yet!</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={handleNavigateHome}
          >
            <Text style={styles.shopButtonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={carts}
          renderItem={({ item }) => {
            const available = isCartAvailable(item);
            return (
              <View
                // style={[styles.cardContainer, { opacity: available ? 1 : 0.5 }]}
              >
                <FishCardInCart
                  item={item}
                  deleteItemFromCart={deleteItemFromCart}
                  isAvailableCart={available}
                />
                {/* {!available && (
                  <Text style={styles.notAvailableText}>Not Available</Text>
                )}  */}
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 40,
          }}
        />
      )}
    </View>
    
  )
}

export default CartScreen

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 20,
  },
  container: {
    flex: 1,
    padding: 15,
  },
  removeContainer: {
    backgroundColor: "#f00530",
    width: "100%",
    marginVertical: 10,
    borderRadius: 10,
  },
  remove: {
    fontSize: 25,
    color: "white",
    textAlign: "center",
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#444444",
    marginVertical: 10,
  },
  shopButton: {
    backgroundColor: "#f00530",
    padding: 10,
    borderRadius: 5,
  },
  shopButtonText: {
    color: "white",
    fontSize: 16,
  },
  notAvailableText: {
    color: "#f00530",
    textAlign: "center",
  },
});
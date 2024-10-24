// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useEffect } from "react";
// import { createContext, useState } from "react";

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [carts, setCarts] = useState([]);

//   useEffect(() => {
//     loadCartItem();
//   }, []);
//   const loadCartItem = async () => {
//     let carts = await AsyncStorage.getItem("carts");
//     carts = carts ? JSON.parse(carts) : [];
//     setCarts(carts);
//   };

//   const addToCart = async (item) => {
//     const itemExist = carts.findIndex(
//       (favourtite) => favourtite.id === item.id
//     );
//     if (itemExist === -1) {
//       const newFavourtiesItem = [...carts, item];
//       await AsyncStorage.setItem(
//         "carts",
//         JSON.stringify(newFavourtiesItem)
//       );
//       setCarts(newFavourtiesItem);
//     }
//   };
//   const deleteItemFromCart = async (item) => {
//     const newItems = carts.filter((cart) => cart.id !== item.id);
//     await AsyncStorage.setItem("carts", JSON.stringify(newItems));
//     setCarts(newItems);
//   };

//   const clearAllCarts = async () => {
//     await AsyncStorage.removeItem("carts"); // Remove all items from AsyncStorage
//     setCarts([]); // Update state to an empty array
//   };
//   const value = {
//     carts,
//     addToCart,
//     deleteItemFromCart,
//     clearAllCarts
//   };
//   return (
//     <CartContext.Provider value={value}>
//       {children}
//     </CartContext.Provider>
//   );
// };
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, createContext, useState } from "react";
import Toast from "react-native-toast-message";
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    loadCartItem();
  }, []);

  const loadCartItem = async () => {
    try {
      let carts = await AsyncStorage.getItem("carts");
      carts = carts ? JSON.parse(carts) : [];
      carts = carts.filter((cart) => cart !== null);
      setCarts(carts);
    } catch (error) {
      console.error("Failed to load cart items:", error);
    }
  };

  const addToCart = async (item) => {
    if (!item) {
      console.error("Invalid item:", item);
      return; // Exit if item is null or undefined
    }
    try {
      const itemExist = carts.findIndex((cart) => cart.id === item.id);
      if (itemExist === -1) {
        const newCartItems = [item,...carts];
        await AsyncStorage.setItem("carts", JSON.stringify(newCartItems));
        setCarts(newCartItems);
      } else {
        Toast.show({
          type: "success", // You can also use 'success', 'error', etc.
          text1: "Fish already in cart!",
          text1Style: { color: "green" },
          text2Style: { color: "green" },
          text2: "This fish is already added to your cart.",
          position: "bottom",
        });
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const deleteItemFromCart = async (item) => {
    try {
      const newItems = carts.filter((cart) => cart.id !== item.id);
      await AsyncStorage.setItem("carts", JSON.stringify(newItems));
      setCarts(newItems);
    } catch (error) {
      console.error("Failed to delete item from cart:", error);
    }
  };

  const clearAllCarts = async () => {
    try {
      await AsyncStorage.removeItem("carts");
      setCarts([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const value = {
    carts,
    addToCart,
    deleteItemFromCart,
    clearAllCarts,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

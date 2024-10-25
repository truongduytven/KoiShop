import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./src/screens/SplashScreen";
import BottomTabNavigator from "./src/screens/BottomTabNavigator";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { StatusBar } from "react-native";
import { CartProvider } from "./src/context/CartContext";
import Toast from "react-native-toast-message";
const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#470101",
    secondary: "#6d1a1a",
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <CartProvider>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Main" component={BottomTabNavigator} />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </CartProvider>
      </NavigationContainer>
      <Toast />
    </PaperProvider>
  );
}

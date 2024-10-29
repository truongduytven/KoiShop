import React from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListHistoryOrders from "./ListHistoryOrders";
import OrderDetail from "./OrderDetail";
const Stack = createNativeStackNavigator();

const OrderStack = ({ navigation, route }) => {

    React.useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName === 'OrderDetail') {
            navigation.setOptions({ tabBarStyle: { display: 'none' } });
        } else {
            navigation.setOptions({ tabBarStyle: { display: 'flex', backgroundColor: "#6d1a1a", } });
        }
    }, [navigation, route]);

    return (
        <Stack.Navigator>
            <Stack.Screen name="HistoryOrdersPage" component={ListHistoryOrders} 
            options={{ 
                title: 'History Order', 
                headerTitleAlign: 'center',
                headerStyle: { backgroundColor: '#470101' },
                headerTintColor: '#faeaa3', 
            }} />
            <Stack.Screen 
            name="OrderDetail" 
            component={OrderDetail} 
            options={{ 
                title: 'Order Detail', 
                headerTitleAlign: 'center',
                headerStyle: { backgroundColor: '#470101' },
                headerTintColor: '#faeaa3', 
            }} />
        </Stack.Navigator>
    );
};

export default OrderStack;

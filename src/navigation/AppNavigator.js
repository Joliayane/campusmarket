// src/navigation/AppNavigator.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CartScreen from '../screens/app/CartScreen'; // ✅ ADD THIS
import DashboardScreen from '../screens/app/DashboardScreen';
import ProfileScreen from '../screens/app/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Cart" component={CartScreen} /> {/* ✅ ADD THIS */}

      {/* Future screens */}
      {/* <Stack.Screen name="Listings" component={ListingsScreen} /> */}
      {/* <Stack.Screen name="PostItem" component={PostItemScreen} /> */}
    </Stack.Navigator>
  );
}
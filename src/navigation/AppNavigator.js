// src/navigation/AppNavigator.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/app/DashboardScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      {/* Add more authenticated screens here as you build them */}
      {/* <Stack.Screen name="Listings" component={ListingsScreen} /> */}
      {/* <Stack.Screen name="PostItem" component={PostItemScreen} /> */}
      {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
    </Stack.Navigator>
  );
}
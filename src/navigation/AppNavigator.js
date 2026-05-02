import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CartScreen from '../screens/app/CartScreen';
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
      <Stack.Screen name="Cart" component={CartScreen} />

      {/* Future screens */}
      <Stack.Screen name="Listings" component={() => null} />
      <Stack.Screen name="PostItem" component={() => null} />
    </Stack.Navigator>
  );
}
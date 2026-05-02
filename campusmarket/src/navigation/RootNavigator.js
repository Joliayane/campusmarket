import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useAuth();

  // Show splash/loading while Firebase checks auth state
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#E85D26" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <AppNavigator key="app" />
      ) : (
        <AuthNavigator key="auth" />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
  },
});
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import GraphScreen from './screens/Graph';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="GraphScreen" component={GraphScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
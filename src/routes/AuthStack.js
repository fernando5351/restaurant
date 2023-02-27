import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/login/Login';
import SingUp from '../screens/login/Singup';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
        initialRouteName='login'
        screenOptions={{headerShown: false}}
    >
        <Stack.Screen name='login' component={Login}/>
        <Stack.Screen name='singup' component={SingUp}/>
    </Stack.Navigator>
  )
}
import { StyleSheet } from 'react-native'
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer'
import Home from '../screens/home/Home';
import HomeStack from './HomeStack'
import Cart from '../screens/shopping/Cart';

const Drawer = createDrawerNavigator();

export default function AppStack() {
  return (
    <Drawer.Navigator>
        <Drawer.Screen
        component={HomeStack}
        name="Inicio"
        />
        <Drawer.Screen
        component={Cart}
        name="Carrito"
        />
    </Drawer.Navigator>
  )
}
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeStack from './HomeStack';
import Cart from '../screens/shopping/Cart';
import Account from '../screens/account/User'
import LogOut from '../components/logOut/LogOut';

const Drawer = createDrawerNavigator();

export default function AppStack() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <LogOut {...props} />}
      initialRouteName="Home"
    >
      <Drawer.Screen
        component={HomeStack}
        name="Inicio"
      />
      <Drawer.Screen
        component={Cart}
        name="Carrito"
      />
      <Drawer.Screen
        component={Account}
        name="Mi Cuenta"
      />
    </Drawer.Navigator>
  )
}

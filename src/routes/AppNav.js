import { StatusBar } from 'react-native'
import React, {useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthUser } from '../context/AuthUserContext';
import Loader from '../components/loading/Loading';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

export const  AppNav = () =>{
    const {splashLoading, userToken}= useContext(AuthUser);
  return (
    <NavigationContainer>
        <StatusBar  backgroundColor="#000"/>
        {
            splashLoading ? (
                <Loader/>
            ) : userToken !== "" ? (
                <AppStack/>
            ) : (
                <AuthStack/>
            )
        }
    </NavigationContainer>
  );
}
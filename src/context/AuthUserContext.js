import React, { createContext, useState, useEffect } from 'react';
import { Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const AuthUserProvider = createContext();

export default function AuthUserContext() {
    const [isLoading, setIsLoading] = useState(false);
    const [splasLoading, setAplasLoading] = useState(false);
    const [userToken, setUserToken] = useState('');
    const url = "https://holistic-screw-production.up.railway.app";

    const register = (data) => {
        setIsLoading(true);
        axios.post(`${url}/`, {data})
        .then((res)=>{
            let token = res.data;
            switch (token) {
                case "El usuario ya esta registrado":
                    Alert.alert("Error", "Usuario ya existente");
                    break;
                default:
                    setUserToken(token);
                    AsyncStorage.setItem('UserToken', JSON.stringify(token))
                    break;
            }
         setIsLoading(false);
        })
        .catch((e)=>{
            Alert.alert("Ups!", "Algo salio mal, intentelo de nuevo");
            console.log(e);
            setIsLoading(false);
        })
    }

    const login = (data)=>{
        setIsLoading(true)
        axios.post(`${url}/login`,data)
        .then((res)=>{
            let token = res.data;
            switch (key) {
                case "No se encontro ningún usuario con el correo espedificado":
                    Alert.alert("Alerta", "Email no encontrado");
                    break;
                case "No se encontro ningún usuario con el correo espedificado":
                    Alert.alert("Alerta", "Email no encontrado");
                    break;
                case "Contraseña incorrecta":
                    Alert.alert("Alerta", "Contraseña incorrecta");
                    break;
                default:
                    setUserToken(token);
                    AsyncStorage.setItem('UserToken', JSON.stringify(token));
                    console.log(token);
                    break;
            }
            setIsLoading(false)
        })
        .catch((e)=>{
            Alert.alert("Ups!", "Algo salio mal, intentelo de nuevo");
            console.log(e);
            setIsLoading(false);
        })
    }

    const logOut = () =>{
        setIsLoading(true);
        AsyncStorage.removeItem('UserToken');
        setUserToken('');
        setIsLoading(false)
    }

    const IsLoggedIn = ()=>{
        try {
            setAplasLoading(true);
            let user = AsyncStorage.getItem('UserToken');
            user = JSON.parse(user);

            if (user) {
                setUserToken(user)
            }
            setAplasLoading(false);
        } catch (error) {
            setAplasLoading(false);
            console.log(error);
        }
    }

    useEffect(() => {
      IsLoggedIn();
    }, [])
    
  return (
    <AuthUserProvider.provider
        value={{
            userToken,
            isLoading,
            splasLoading,
            register,
            login,
            logOut
        }}
    >
        {Children}
    </AuthUserProvider.provider>
  )
}
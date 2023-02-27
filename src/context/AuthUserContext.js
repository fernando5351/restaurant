import React, { createContext, useState, useEffect } from 'react';
import { Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const AuthUser = createContext();

export const AuthUserContext = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(false);
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
        console.log(data);
        axios.post(`${url}/login`,data)
        .then((res)=>{
            let token = res.data;
            switch (token) {
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

    const IsLoggedIn = async ()=>{
        try {
            setSplashLoading(true);
            let user = await AsyncStorage.getItem('UserToken');
            user = JSON.parse(user);

            if (user) {
                setUserToken(user)
                console.log(user);
            }
            setSplashLoading(false);
        } catch (error) {
            setSplashLoading(false);
            console.log(error);
        }
    }

    async function borrar(){
        const del = await AsyncStorage.removeItem('UserToken');
        return console.log(del);
    }

    useEffect(() => {
      IsLoggedIn();
      borrar();
    }, [])
    
  return (
    <AuthUser.Provider
       value={{
        userToken,
        isLoading,
        splashLoading,
        register,
        login,
        logOut
       }}
    >
        {children}
    </AuthUser.Provider>
  )
}

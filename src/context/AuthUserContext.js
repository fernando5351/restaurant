import React, { createContext, useState, useEffect } from 'react';
import { Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const AuthUser = createContext();

export const AuthUserContext = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(false);
    const [userToken, setUserToken] = useState('');
    const url = "https://storeonline-production.up.railway.app/api/v1/users";

    const register = (data) => {
        setIsLoading(true);
        axios.post(`${url}`, data)
            .then((res) => {
                setIsLoading(false);
                const token = res.data;
                setUserToken(token);
                console.log(token, ' => async storage');
                AsyncStorage.setItem('UserToken', JSON.stringify(token));
            })
            .catch((error) => {
                setIsLoading(false);
                if ( error.response.data.message) {
                    Alert.alert('Error', error.response.data.message);
                } else {
                    Alert.alert('Error', 'Ha ocurrido un error. Por favor, inténtelo de nuevo más tarde.');
                }
                console.log(error);
            });
    }

    const login = (data) => {
        setIsLoading(true);
        axios.post(`${url}/login`, data)
            .then((res) => {
                setIsLoading(false);
                const response = res.data;
                // Si la respuesta es un objeto con un atributo "data"
                if (Array.isArray(response)) {
                    const token = response;
                    setUserToken(token);
                    console.log(token, ' => async storage');
                    AsyncStorage.setItem('UserToken', JSON.stringify(token));
                }
                // Si la respuesta es un objeto con un atributo "output"
                else if (response.output) {
                    const payload = response.output.payload;
                    switch (payload.statusCode) {
                        // Si el status code es 401, la contraseña es incorrecta
                        case 401:
                            Alert.alert("Ups!", payload.message);
                            break;
                        // Si el status code es 404, el email no se encuentra
                        case 404:
                            Alert.alert("Ups!", payload.message);
                            break;
                        default:
                            Alert.alert("Ups!", "Algo salió mal, intenta de nuevo");
                            break;
                    }
                }
            })
            .catch((e) => {
                setIsLoading(false);
                Alert.alert("Ups!", "Algo salio mal, intentelo de nuevo");
                console.log(e);
            });
    }


    const logOut = () => {
        setIsLoading(true);
        AsyncStorage.removeItem('UserToken');
        setUserToken('');
        setIsLoading(false)
    }

    const IsLoggedIn = async () => {
        try {
            setSplashLoading(true);
            let user = await AsyncStorage.getItem('UserToken');
            user = JSON.parse(user);
            console.log(user);
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

    async function borrar() {
        const del = await AsyncStorage.removeItem('UserToken');
        return console.log(del);
    }


    useEffect(() => {
        IsLoggedIn();
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

import { StyleSheet, View, Text, Image } from 'react-native';
import React from 'react';
import User from "../../../assets/icons/usercircle.png";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function User() {
    const user = await AsyncStorage.getItem('UserToken');
    user = JSON.parse(user)
    return (
        <View style={style.container}>
            <Image source={User} style={style.image} />
            <View style={style.account}>
                <Text>Nombres: {user.name}</Text>
                <Text>Apellidos: {user.lastname}</Text>
                <Text>Correo: {user.email}</Text>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    account: {
        alignItems: 'center',
        paddingStart: 30,
    },
    image: {
        width: "50%",
        height: "50%",
    }
})
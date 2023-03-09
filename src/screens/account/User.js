import { StyleSheet, View, Text, Image } from 'react-native';
import React, { useContext, useState } from 'react';
import UserCircle from "../../../assets/icons/profile/usercircle.png";
import { AuthUser } from '../../context/AuthUserContext'

export default function User() {
    const { userToken } = useContext(AuthUser);
    const user = [];
    user.push(userToken)
    console.log(user, "=> usuario");

    return (
        <View style={style.container}>
            {
                user.map((user) => (
                    <View style={style.account} key={user.id}>
                        <View style={style.containerImg}>
                            <Image style={style.img} source={UserCircle} />
                        </View>
                        <Text style={style.myAccount}>MI CUENTA</Text>
                        <View style={style.containerText}>
                            <Text style={style.text}>Nombres:</Text>
                            <Text style={style.textData}> {user.name}</Text>
                        </View>
                        <View style={style.containerText}>
                            <Text style={style.text}>Apellidos:</Text>
                            <Text style={style.textData}> {user.lastname}</Text>
                        </View>
                        <View style={style.containerText}>
                            <Text style={style.text}>Direccion:</Text>
                            <Text style={style.textData}> {user.direction}</Text>
                        </View>
                        <View style={style.containerText}>
                            <Text style={style.text}>Edad:</Text>
                            <Text style={style.textData}> {user.age}</Text>
                        </View>
                        <View style={style.containerText}>
                            <Text style={style.text}>Numero tel:</Text>
                            <Text style={style.textData}> {user.cellphone}</Text>
                        </View>
                        <View style={style.containerText}>
                            <Text style={style.text}>Correo:</Text>
                            <Text style={style.textData}> {user.email}</Text>
                        </View>
                    </View>
                ))
            }
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerImg: {
        height: 200,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        width: 160,
        height: 150
    },
    myAccount: {
        fontSize: 40,
        fontWeight: 'bold',
        fontStyle: 'italic',
        margin: 10,
        marginTop: 0,
    },
    account: {
        padding: 20,
        width: 380,
        height: 680,
        backgroundColor: '#D3D3D3',
        alignItems: 'center'
    },
    containerText: {
        width: 340,
        height: 35,
        backgroundColor: 'white',
        paddingStart: 20,
        margin: 10,
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 17
    },
    textData: {
        fontWeight: 'bold',
        fontStyle: 'italic'
    }

});
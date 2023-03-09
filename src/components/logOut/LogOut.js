import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react';
import {
    DrawerContentScrollView,
    DrawerItemList,
} from "@react-navigation/drawer";
import Loader from "../../components/loading/Loading"
import { isLoading, AuthUser } from "../../context/AuthUserContext"

export default function LogOut(props) {
    const { logOut } = useContext(AuthUser);
    return (
        <View style={style.container}>
            <Loader visible={isLoading} />
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
            <View style={style.containerBottomD}>
                <TouchableOpacity style={style.subContainerB}
                    onPress={() =>
                        logOut()}
                >
                    <Text style={style.text}>LogOut</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerBottomD: {
        width: "90%",
        marginBottom: "5%",
        marginLeft: "5%",
        borderTopColor: "#fff",
        borderTopWidth: 1,
    },
    text: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 17
    },
        subContainerB: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "2%",
        marginBottom: "2%",
        backgroundColor: ''
    },
});
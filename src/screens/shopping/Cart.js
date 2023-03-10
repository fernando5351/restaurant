import { StyleSheet, View, Text, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useContext } from 'react';
import { AuthUser } from "../../context/AuthUserContext";
import axios from "axios";
import Eliminar from "../../../assets/eliminar.png"

export default function Cart() {
  const { userToken } = useContext(AuthUser);
  const url = "https://storeonline-production.up.railway.app/api/v1/";

  const [shopping, setShopping] = useState([]);

  function getShopping() {
    const id = userToken[0].id;
    axios.get(`${url}/shopping/${id}`)
      .then((res) => {
        setShopping(res.data);
      })
      .catch(err => {
        console.log(err)
      });
  }

  getShopping();

  function delProd(id) {
    axios.delete(`${url}/shopping/${id}`)
      .then((res) => {
        Alert.alert(res.data.message);
        getShopping();
      })
      .catch(err => {
        Alert.alert("Error al eliminar el producto.");
      });
  }


  const totalPrice = shopping.reduce((accumulator, currentValue) => {
    return accumulator + parseFloat(currentValue.price);
  }, 0);

  function comprar() {
    const data = shopping.map(item => item.id);
    const result = { data };

    axios.put(`${url}/shopping`, result)
    .then((res)=>{
      Alert.alert(res.data.message)
    })
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {shopping.map((item, index) => (
          <View style={styles.containerCart} key={index}>
            <View style={styles.cart}>
              <Image style={styles.image} source={{ uri: item.imgurl }} />
              <View style={styles.containerData}>
                <View style={styles.containerText}>
                  <Text style={styles.text}>{item.namePastel}</Text>
                  <Text style={styles.textPrice}>${item.price}</Text>
                </View>
                <View style={styles.containerBtnCart}>
                  <TouchableOpacity
                    style={styles.containerBtn}
                    onPress={() => {
                      delProd(item.id);
                    }}
                  >
                    <Image source={Eliminar} style={styles.imgDelete} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.containerTotal}>
        <Text style={styles.textTotal}>Total: ${totalPrice.toFixed(2)}</Text>
        <TouchableOpacity style={styles.comprar}
          onPress={() => {
            comprar();
          }}
        >
          <Text style={styles.textComprar}>Comprar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  comprar: {
    margin: 10,
    height: "70%",
    width: "30%",
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textComprar: {
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  containerCart: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 5
  },
  containerDrop: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cart: {
    width: 320,
    height: 280,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'gray'
  },
  image: {
    width: "100%",
    height: "75%",
    borderRadius: 25,
  },
  containerData: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  containerText: {
    height: 68,
    width: 260
  },
  text: {
    paddingStart: 30,
    fontWeight: 'bold',
  },
  textPrice: {
    paddingStart: 30,
    fontWeight: 'bold',
    fontSize: 25
  },
  containerTotal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
  },
  textTotal: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  containerBtnCart: {
    width: 51,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerBtn: {
    width: 50,
    height: 50,
  },
  imgDelete: {
    width: "100%",
    height: "100%"
  }
});

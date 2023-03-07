import { StyleSheet, View, Text, ScrollView, Image } from 'react-native'
import React, {useState} from 'react';
import ProductCart from "../../components/data/Product";

export default function Cart() {
  const cart = new ProductCart();
  const [products, setproducts] = useState();
  const [productCart, setProductCart] = useState([]);

  return (
    <View>
      <ScrollView>
        <View style={style.containerCart}>
          <View style={style.cart}>
            <Image style={style.image}/>
            <Text style={style.text}>jo</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const style = StyleSheet.create({
  containerCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cart: {
    width: 350,
    height: 100,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'gray'
  },
  image: {
    width: "100%",
    height: "75%",
    borderRadius: 25,
  },
  text: {
    paddingStart: 30,
    fontWeight: 'bold'
  }
})
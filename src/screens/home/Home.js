import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import {Product} from '../../components/data/Product';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const [products, setProducts] = useState(Product);
  const navigation = useNavigation();
  return (
    <View style={style.container}>
      {
        products.map((pro, index) => (
          <TouchableOpacity key={index}
            onPress={()=>{
              navigation.navigate("product")
            }}
          >
            <View style={style.product}>
              <Image source={{ uri: pro.img }} style={style.image} />
              <Text style={style.name}>{pro.name}</Text>
              <Text style={style.price}>{pro.price}</Text>
            </View>
          </TouchableOpacity>
        ))
      }
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  product: {
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'gray',
    width: 185,
    height: 220,
    margin: 10
  },
  image: {
    width: '100%',
    height: '75%',
    borderRadius: 25,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingStart: 20,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingStart: 20,
  }
})

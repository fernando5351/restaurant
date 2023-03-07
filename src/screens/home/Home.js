import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import {Product} from '../../components/data/Product';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();

  function getProducts() {
    axios.get('https://storeonline-production.up.railway.app/api/v1/pastel')
      .then(response => {
        const data = response.data;
        setProducts(data);
      })
      .catch(error => {
        console.error(error);
      });
  }


  useEffect(() => {
    getProducts();
  }, [])
  return (
    <View style={style.container}>
      {
        products.map((pro, index) => (
          <TouchableOpacity key={index}
            onPress={()=>{
              navigation.navigate("product", {productId: pro.id})
            }}
          >
            <View style={style.product}>
              <Image source={{ uri: pro.imgurl }} style={style.image} />
              <Text style={style.name}>{pro.namePastel}</Text>
              <Text style={style.price}>${pro.price}</Text>
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
    height: 270,
    margin: 10
  },
  image: {
    width: '100%',
    height: '70%',
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

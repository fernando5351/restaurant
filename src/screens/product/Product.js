import { StyleSheet, ScrollView, View, Image, Text, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { CheckBox } from 'react-native-elements';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';


export default function Products() {
  const route = useRoute();
  const { productId } = route.params;
  const [product, setProduct] = useState([])

  const [colors, setColors] = useState([]);
  const [checkboxes, setCheckboxes] = useState([]);

  const [size, setSize] = useState([]);
  const [checkboxSize, setCheckboxSize] = useState([]);

  const [sabores, setSabores] = useState([]);
  const [checkboxSabor, setCheckboxSabor] = useState([]);

  const [decorations, setDecorations] = useState([]);
  const [checkboxDecorations, setCheckboxDecorations] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTamañoVisible, setModalTamañoVisible] = useState(false);
  const [modalSaborVisible, setModalSaborVisible] = useState(false);
  const [modalDecoracionVisible, setModalDecoracionVisible] = useState(false);

  function getProducts() {
    axios.get('https://storeonline-production.up.railway.app/api/v1/pastel')
      .then(response => {
        const data = response.data;
        const prod = data.filter((p) => p.id === productId);
        setProduct(prod);
      })
      .catch(error => {
        console.error(error);
      });
  }

  function getColors() {
    axios.get('https://storeonline-production.up.railway.app/api/v1/colors')
      .then(response => {
        setColors(response.data);
        setCheckboxes(response.data.map(() => false));
      })
      .catch(error => {
        console.error(error);
      });
  }

  const handleCheckboxChange = (index) => {
    const newCheckboxes = [...checkboxes];
    newCheckboxes[index] = !newCheckboxes[index];
    setCheckboxes(newCheckboxes);
  };

  function getSize() {
    axios.get('https://storeonline-production.up.railway.app/api/v1/size')
      .then(response => {
        setSize(response.data);
        setCheckboxSize(response.data.map(() => false));
      })
      .catch(error => {
        console.error(error);
      });
  }

  const handleCheckboxChangeSize = (index) => {
    const newCheckboxes = [...checkboxSize];
    newCheckboxes[index] = !newCheckboxes[index];
    setCheckboxSize(newCheckboxes);
  };

  function getSbores() {
    axios.get('https://storeonline-production.up.railway.app/api/v1/flavor')
      .then(response => {
        setSabores(response.data);
        setCheckboxSize(response.data.map(() => false));
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const handleCheckboxChangeSabores = (index) => {
    const newCheckboxes = [...checkboxSabor];
    newCheckboxes[index] = !newCheckboxes[index];
    setCheckboxSabor(newCheckboxes);
  };

  function getDecorations() {
    axios.get('https://storeonline-production.up.railway.app/api/v1/decoration')
      .then(response => {
        setDecorations(response.data);
        setCheckboxDecorations(response.data.map(() => false));
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const handleCheckboxChangeDecorations = (index) => {
    const newCheckboxes = [...checkboxDecorations];
    newCheckboxes[index] = !newCheckboxes[index];
    setCheckboxDecorations(newCheckboxes);
  };

  useEffect(() => {
    getProducts();
    getColors();
    getSize();
    getSbores();
    getDecorations();
  }, [])

  function submitForm() {
    const data = [];
    const selectedDecorations = [];
    const selectedColores = [];
    const selectedSize = [];
    const selectedSabores = [];
  
    //decoraciones
    for (let i = 0; i < checkboxDecorations.length; i++) {
      if (checkboxDecorations[i]) {
        selectedDecorations.push(decorations[i]);
        console.log(selectedDecorations);
      }
    }
  
    if (selectedDecorations.length > 1) {
      Alert.alert('Solo se puede seleccionar una decoracion como máximo.')
      setCheckboxDecorations([]);
    }

    //colores
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i]) {
        selectedColores.push(colors[i]);
        console.log(selectedColores);
      }
    }
  
    if (selectedColores.length > 2) {
      Alert.alert('Solo se pueden seleccionar dos colores como máximo.');
      setCheckboxes([]);
    }

    //tamaños
    for (let i = 0; i < checkboxSize.length; i++) {
      if (checkboxSize[i]) {
        selectedSize.push(size[i]);
        console.log(selectedSize);
      }
    }
  
    if (selectedSize.length > 1) {
      Alert.alert('Solo se puede seleccionar una decoracion como máximo.')
      setCheckboxSize([]);
    }

    //sabores
    for (let i = 0; i < checkboxSabor.length; i++) {
      if (checkboxSabor[i]) {
        selectedSabores.push(sabores[i]);
        console.log(selectedSabores);
      }
    }
  
    if (selectedSabores.length > 2) {
      Alert.alert('Solo se pueden seleccionar dos sabores como máximo.')
      setCheckboxSabor([]);
    }

    /*axios.post('https://storeonline-production.up.railway.app/api/v1/order', {
      decorations: selectedDecorations
    })
    .then(response => {
      // Manejar la respuesta de la API
    })
    .catch(error => {
      console.error(error.data);
    });
    */
  }
  submitForm();

  return (
    <ScrollView>
      <View style={style.container}>
        {
          product.map((item) => (
            <View style={style.container} key={item.id}>
              <View style={style.containerImage}>
                <Image source={{ uri: item.imgurl }} style={style.image} />
              </View>
              <View style={style.containerData}>
                <View style={style.containerText}>
                  <Text style={style.textName}>{item.namePastel}</Text>
                  <Text style={style.text}>${item.price}</Text>
                </View>
                <TouchableOpacity style={style.cart}>
                  <Text style={style.comprar}>Comprar</Text>
                </TouchableOpacity>
              </View>
              <View style={style.containerDes}>
                <Text style={style.textDes}>{item.description}</Text>
              </View>
            </View>
          ))
        }

        {/*modal colores*/}
        <TouchableOpacity style={style.button} onPress={() => setModalVisible(true)}>
          <Text style={style.buttonText}>Colores</Text>
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          animationType='slide'
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={style.modalOverlay}>
              <View style={style.modal}>
                <View style={style.modalContent}>
                  <View style={style.checkbox}>
                    {
                      colors.map((color, index) => (
                        <CheckBox
                          key={index}
                          title={color.nameColor}
                          checked={checkboxes[index]}
                          onPress={() => handleCheckboxChange(index)}
                        />
                      ))
                    }
                  </View>
                  <TouchableOpacity
                    style={style.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={style.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/*Modal tamaño*/}
        <TouchableOpacity style={style.button} onPress={() => setModalTamañoVisible(true)}>
          <Text style={style.buttonText}>Tamaños</Text>
        </TouchableOpacity>
        <Modal
          visible={modalTamañoVisible}
          animationType='slide'
          transparent={true}
          onRequestClose={() => setModalTamañoVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalTamañoVisible(false)}>
            <View style={style.modalOverlay}>
              <View style={style.modal}>
                <View style={style.modalContent}>
                  <View style={style.checkbox}>
                  {
                      size.map((size, index) => (
                        <CheckBox
                          key={index}
                          title={size.nameSize}
                          checked={checkboxSize[index]}
                          onPress={() => handleCheckboxChangeSize(index)}
                        />
                      ))
                    }
                  </View>
                  <TouchableOpacity
                    style={style.closeButton}
                    onPress={() => setModaTamañolVisible(false)}
                  >
                    <Text style={style.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/*Modal Sabor*/}
        <TouchableOpacity style={style.button} onPress={() => setModalSaborVisible(true)}>
          <Text style={style.buttonText}>Sabores</Text>
        </TouchableOpacity>
        <Modal
          visible={modalSaborVisible}
          animationType='slide'
          transparent={true}
          onRequestClose={() => setModalSaborVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalSaborVisible(false)}>
            <View style={style.modalOverlay}>
              <View style={style.modal}>
                <View style={style.modalContent}>
                  <View style={style.checkbox}>
                  {
                      sabores.map((flavor, index) => (
                        <CheckBox
                          key={index}
                          title={flavor.nameFlavor}
                          checked={checkboxSabor[index]}
                          onPress={() => handleCheckboxChangeSabores(index)}
                        />
                      ))
                    }
                  </View>
                  <TouchableOpacity
                    style={style.closeButton}
                    onPress={() => setModaSaborVisible(false)}
                  >
                    <Text style={style.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/*Modal Decoracion*/}
        <TouchableOpacity style={style.button} onPress={() => setModalDecoracionVisible(true)}>
          <Text style={style.buttonText}>Decoraciones</Text>
        </TouchableOpacity>
        <Modal
          visible={modalDecoracionVisible}
          animationType='slide'
          transparent={true}
          onRequestClose={() => setModalDecoracionVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalDecoracionVisible(false)}>
            <View style={style.modalOverlay}>
              <View style={style.modal}>
                <View style={style.modalContent}>
                  <View style={style.checkbox}>
                  {
                      decorations.map((decoration, index) => (
                        <CheckBox
                          key={index}
                          title={decoration.nameDecoration}
                          checked={checkboxDecorations[index]}
                          onPress={() => handleCheckboxChangeDecorations(index)}
                        />
                      ))
                    }
                  </View>
                  <TouchableOpacity
                    style={style.closeButton}
                    onPress={() => setModalDecoracionVisible(false)}
                  >
                    <Text style={style.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/*comentarios*/}
        <View style={style.comentariosContainer}>
          <View style={style.comentariosAling}>
            <TextInput
              placeholder='Nombre de la Mascota'
              style={style.comentarios}
            />
            <TextInput
              placeholder='Comentarios'
              style={style.comentarios}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerImage: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 290,
    width: 409,
    marginTop: 10
  },
  image: {
    width: '90%',
    height: '100%',
    borderRadius: 25,
    backgroundColor: 'red'
  },
  containerData: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    height: 110,
    width: 409,
  },
  containerText: {
    paddingStart: 20,
    justifyContent: 'flex-start',
    width: 250,
    padding: 10
  },
  cart: {
    width: 100,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 30,
    backgroundColor: 'green'
  },
  comprar: {
    color: 'white'
  },
  containerDes: {
    width: 250,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingStart: 25
  },
  textName: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  textDes: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '300'
  },
  button: {
    backgroundColor: '#34434D',
    padding: 10,
    margin: 8,
    borderRadius: 5,
    width: "90%"
  },
  buttonText: {
    color: 'white',
    paddingStart: 25,
    fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20
  },
  modalContent: {
    alignItems: 'center',
  },
  checkbox: {
    width: 320,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    color: 'blue'
  },
  comentariosContainer: {
    width: "80%",
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20
  },
  comentariosAling: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  comentarios: {
    borderColor: 'gray',
    borderWidth: 2,
    alignItems: 'center',
    paddingStart: 10,
    justifyContent: 'center',
    width: 320,
    height: 55,
    borderRadius: 25,
    margin: 4
  }
})
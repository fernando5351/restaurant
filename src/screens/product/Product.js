import { StyleSheet, ScrollView, View, Image, Text, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { CheckBox } from 'react-native-elements';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from "yup"; 
import { useRoute } from '@react-navigation/native';
import { AuthUser } from "../../context/AuthUserContext";


export default function Products() {
  const route = useRoute();
  const { productId } = route.params;
  const { userToken } = useContext(AuthUser);
  const idUser = userToken.id;

  const [product, setProduct] = useState([]);
  const yupSchema = {
    mensaje: Yup.string().required("El Mensaje es requerido"),
    pets: Yup.string().required("El nombre de la mascota es requerido")
  }

  const [colors, setColors] = useState([]);
  const [checkboxes, setCheckboxes] = useState([]);

  const [sabores, setSabores] = useState([]);
  const [checkboxSabor, setCheckboxSabor] = useState([]);

  const [decorations, setDecorations] = useState([]);
  const [checkboxDecorations, setCheckboxDecorations] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalSaborVisible, setModalSaborVisible] = useState(false);
  const [modalDecoracionVisible, setModalDecoracionVisible] = useState(false);

  const url = 'https://storeonline-production.up.railway.app/api/v1';
  function getProducts() {
    axios.get(`${url}/pastel`)
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
    axios.get(`${url}/colors`)
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


  function getSbores() {
    axios.get(`${url}/flavor`)
      .then(response => {
        setSabores(response.data);
        setCheckboxSabor(response.data.map(() => false));
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
    getSbores();
    getDecorations();
  }, [])

  const pedido = [];
  const data = [];
  const selectedDecorations = [];
  const selectedColores = [];
  const selectedSabores = [];

  function checkbox() {
    //decoraciones
    for (let i = 0; i < checkboxDecorations.length; i++) {
      if (checkboxDecorations[i]) {
        selectedDecorations.push(decorations[i]);
        data.push({ idDecoration: decorations[i].id });
      }
    }

    if (selectedDecorations.length > 1) {
      Alert.alert('Solo se puede seleccionar una decoracion como máximo.')
      setCheckboxDecorations([]);
    }

    //colores
    let idColor1 = null;
    let idColor2 = null;

    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i]) {
        if (idColor1 === null) {
          idColor1 = colors[i].id;
        } else if (idColor2 === null) {
          idColor2 = colors[i].id;
        }
        selectedColores.push(colors[i]);
        if (idColor1 !== null && idColor2 !== null) {
          data.push({ idColor1: idColor1, idColor2: idColor2 });
        }
      }
    }


    if (selectedColores.length > 2) {
      Alert.alert('Solo se pueden seleccionar dos colores como máximo.');
      setCheckboxes([]);
    }

    //sabores
    let idFlavor1 = null;
    let idFlavor2 = null;

    for (let i = 0; i < checkboxSabor.length; i++) {
      if (checkboxSabor[i]) {
        if (idFlavor1 === null) {
          idFlavor1 = sabores[i].id;
        } else if (idFlavor2 === null) {
          idFlavor2 = sabores[i].id;
        }
        selectedSabores.push(sabores[i]);
        if (idFlavor1 !== null && idFlavor2 !== null) {
          data.push({ idFlavor1: idFlavor1, idFlavor2: idFlavor2 });
        }
      }
    }

    if (selectedSabores.length > 2) {
      Alert.alert('Solo se pueden seleccionar dos sabores como máximo.')
      setCheckboxSabor([]);
    }


    pedido.push(data);
  }

  checkbox();

  function Shop() {
    pedido.push({ idUser: idUser });
    pedido.push({ idPastel: productId });
    const shop = pedido.flat(1);

    const cart = shop.reduce((acc, cur) => {
      Object.keys(cur).forEach(key => {
        acc[key] = cur[key];
      });
      return acc;
    }, {});

    if (selectedSabores.length == 0) {
      Alert.alert('Debes seleccionar los sabores deseados!.')
    } if (selectedSabores.length == 1) {
      Alert.alert('Debes seleccionar dos sabores deseados!.')
    } if (selectedColores.length == 0) {
      Alert.alert('Debes seleccionar los colores deseados!.')
    } if (selectedColores.length == 1) {
      Alert.alert('Debes seleccionar dos colores deseados!.')
    } if (selectedDecorations.length == 0) {
      Alert.alert('Debes seleccionar la decoración deseada!.')
    } if (selectedColores.length == 2 && selectedDecorations.length == 1 && selectedSabores.length == 2) {
      axios.post(`${url}/shopping`, cart)
        .then((res) => {
          if (res) {
            Alert.alert("Pedido realizado con exito!!");
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  function onChangeMessage(event){
    console.log(event.target)
    setMessage(
     event.target.value
    )
  }

  const formik = useFormik({
    initialValues: {
      pets: '',
      mensaje: '',
      author: userToken.name
    },
    validationSchema: Yup.object(yupSchema),
    validateOnChange: false,
    onSubmit: data => {
      console.log(data);
      // axios.post(`${url}/comments`, data)
      // .then((res)=>{
      //   console.log(res);
      // })
    }
  })

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
                <TouchableOpacity onPress={() => {
                  Shop()
                }} style={style.cart}>
                  <Text style={style.comprar}>Carrito</Text>
                </TouchableOpacity>
              </View>
              <View style={style.containerDes}>
                <Text style={style.textDes}>{item.description}</Text>
              </View>
            </View>
          ))
        }

        {/*modal colores*/}
        <TouchableOpacity style={style.buttonCheck} onPress={() => setModalVisible(true)}>
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
                    <Text style={style.closeButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/*Modal tamaño*/}
        {/* <TouchableOpacity style={style.button} onPress={() => setModalTamañoVisible(true)}>
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
        </Modal> */}
        {/*Modal Sabor*/}
        <TouchableOpacity style={style.buttonCheck} onPress={() => setModalSaborVisible(true)}>
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
                    <Text style={style.closeButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/*Modal Decoracion*/}
        <TouchableOpacity style={style.buttonCheck} onPress={() => setModalDecoracionVisible(true)}>
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
                    <Text style={style.closeButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/*comentarios*/}
        <View style={style.inputContainer}>
          <Text style={style.comentariosTitle}>Comentarios</Text>
          <View style={style.containerPet}>
            <TextInput
              style={style.inputPet}
              placeholder="Escribe el nombre de tu mascota"
              value={formik.values.pets}
              onChangeText={(text)=> formik.setFieldValue('pets', text)}
            />
          </View>
          <View style={style.containerPet}>
            <TextInput
              style={style.input}
              placeholder="Escribe tu comentario"
              value={formik.values.mensaje}
              onChangeText={(text) => formik.setFieldValue('mensaje', text)}
            />
          </View>
          <TouchableOpacity style={style.button} onPress={formik.handleSubmit}>
            <Text style={style.buttonText}>Enviar</Text>
          </TouchableOpacity>
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
  buttonCheck: {
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
  },
  comentariosTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
    width: "100%",
    textAlign: 'center',
    margin: 15
  },
  inputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 410,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerPet: {
    width: 350,
    height: 50,
    margin: 4
  },
  inputPet: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#00bcd4',
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
})
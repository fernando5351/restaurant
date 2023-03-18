import { StyleSheet, ScrollView, View, Image, Text, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback, Alert, FlatList } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { CheckBox } from 'react-native-elements';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useRoute } from '@react-navigation/native';
import { AuthUser } from "../../context/AuthUserContext";
import Loader from "../../components/loading/Loading"

export default function Products() {
  const route = useRoute();
  const { productId } = route.params;
  const { userToken } = useContext(AuthUser);
  const idUser = userToken[0].id;

  const [product, setProduct] = useState([]);
  const yupSchema = {
    comment: Yup.string().required("El Mensaje es requerido"),
    pets: Yup.string().required("El nombre de la mascota es requerido")
  }

  const [comments, setComments] = useState([]);
  const [colors, setColors] = useState([]);
  const [checkboxes, setCheckboxes] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  const [sabores, setSabores] = useState([]);
  const [checkboxSabor, setCheckboxSabor] = useState([]);

  const [decorations, setDecorations] = useState([]);
  const [checkboxDecorations, setCheckboxDecorations] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalSaborVisible, setModalSaborVisible] = useState(false);
  const [modalDecoracionVisible, setModalDecoracionVisible] = useState(false);

  const url = 'https://storeonline-production.up.railway.app/api/v1';
  function getProducts() {
    setIsLoading(true);
    axios.get(`${url}/pastel`)
      .then(response => {
        const data = response.data;
        const prod = data.filter((p) => p.id === productId);
        setProduct(prod);
        setIsLoading(false);

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
    fetchData();
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
    let idColor1 = 0;
    let idColor2 = 0;

    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i]) {
        if (idColor1 === 0) {
          idColor1 = colors[i].id;
        } else if (idColor2 === 0) {
          idColor2 = colors[i].id;
        }
        selectedColores.push(colors[i]);
        if (selectedColores) {
          data.push({ idColor1: idColor1, idColor2: idColor2 });
        }
      }
    }


    if (selectedColores.length > 2) {
      Alert.alert('Solo se pueden seleccionar dos colores como máximo.');
      setCheckboxes([]);
    }

    //sabores
    for (let i = 0; i < checkboxSabor.length; i++) {
      if (checkboxSabor[i]) {
        selectedSabores.push(sabores[i]);
        data.push({ idFlavor: sabores[i].id });
      }
    }

    if (selectedSabores.length > 1) {
      Alert.alert('Solo se puede seleccionar uno como máximo.')
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
      Alert.alert('¡Debes seleccionar el sabor deseado!.')
    } if (selectedColores.length == 0) {
      Alert.alert('¡Debes seleccionar los colores deseados!.')
    } if (selectedDecorations.length == 0) {
      Alert.alert('¡Debes seleccionar la decoración deseada!.')
    } if (selectedColores.length >= 1 && selectedDecorations.length == 1 && selectedSabores.length == 1) {
      axios.post(`${url}/shopping`, cart)
        .then((res) => {
          if (res) {
            Alert.alert("¡Pedido realizado con exito!");
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  const formik = useFormik({
    initialValues: {
      pets: "",
      comment: "",
      author: userToken[0].name
    },
    validationSchema: Yup.object(yupSchema),
    validateOnChange: false,
    onSubmit: data => {
      setIsLoading(true);
      axios.post(`${url}/comments`, data)
        .then((res) => {
          formik.resetForm();
          setComments(prevComments => [...prevComments, res.data]);
          setIsLoading(false);
          //coment
        })
    },
  })

  async function fetchData() {
    const response = await fetch("https://storeonline-production.up.railway.app/api/v1/comments");
    const data = await response.json();
    setComments(data);
  }

  return (
    <View>
      <Loader visible={isLoading} />
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
                    <Text style={style.textPrice}>${item.price}</Text>
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
                      onPress={() => setModalSaborVisible(false)}
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
            <Text style={style.error}>{formik.errors.pets}</Text>
            <View style={style.containerPet}>
              <TextInput
                style={style.inputPet}
                placeholder="Escribe el nombre de tu mascota"
                value={formik.values.pets}
                onChangeText={(text) => formik.setFieldValue('pets', text)}
              />
            </View>
            <Text style={style.error}>{formik.errors.comment}</Text>
            <View style={style.containerPet}>
              <TextInput
                style={style.input}
                placeholder="Escribe tu comentario"
                value={formik.values.comment}
                onChangeText={(text) => formik.setFieldValue('comment', text)}
              />
            </View>
            <TouchableOpacity style={style.button} onPress={formik.handleSubmit}>
              <Text style={style.buttonText}>{isLoading ? 'Enviando...' : 'Enviar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* comentarios render */}
        <View style={style.containerComents}>
          <Text style={style.titleComents}>Comentarios</Text>
          {
            comments.map((item) => (
              <View style={style.comment} key={item.id}>
                <Text style={style.author}>{item.author}</Text>
                <Text style={style.textPet}>Nombre de la mascota: {item.pets}</Text>
                <Text style={style.text}>{item.comment}</Text>
                <Text style={style.date}>{item.created_at}</Text>
              </View>
            ))
          }
        </View>
      </ScrollView>

    </View>

  )
}

const style = StyleSheet.create({
  error: {
    textAlign: 'center',
    color: '#f00',
    marginTop: 10
  },
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
    borderColor: '#00bcd4',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 30,
    backgroundColor: '#00bcd4'
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
  textPrice: {
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
    fontWeight: 'bold',
    margin: 10
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
  }, containerComents: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  titleComents: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  comment: {
    marginBottom: 20,
  },
  author: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  }, textPet: {
    fontSize: 16,
    marginBottom: 5,
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "gray",
  },
})
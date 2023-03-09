import { StatusBar } from "expo-status-bar";
import React, { useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Loader from "../../components/loading/Loading";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { AuthUser } from '../../context/AuthUserContext';

export default function Signup({ navigation }) {
  const { isLoading, register } = useContext(AuthUser);

  const yupSchema = {
    name: Yup.string().required("El nombre es obligatorio"),
    lastname: Yup.string().required("Los apellidos son obligatorios"),
    direction: Yup.string().required("La direccion es obligatoria"),
    age: Yup.number().required("La edad es obligatoria"),
    email: Yup.string().email("correo invalido").required("El correro es obligatorio"),
    password: Yup.string().required("La contraseña es obligatoria"),
    cellphone: Yup.string().required("El numero de telefono es necesario")
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      lastname: "",
      direction: "",
      age: "",
      email: "",
      password: "",
      cellphone: ""
    },
    validationSchema: Yup.object(yupSchema),
    validateOnChange: false,
    onSubmit: data => {
      console.log(JSON.stringify(data, null, 2))
      register(data)
    },
  })

  return (
    <ScrollView>
      <StatusBar translucent={false} />
      <View style={styles.container}>
        <Loader visible={isLoading} />
        <Text style={styles.titulo}>Hola</Text>
        <Text >Crea tu cuenta</Text>
        <Text style={styles.error}>{formik.errors.name}</Text>
        <TextInput
          placeholder="Juan Alberto"
          style={styles.textInput}
          value={formik.values.name}
          onChangeText={(text) => formik.setFieldValue('name', text)}
        />
        <Text style={styles.error}>{formik.errors.lastname}</Text>
        <TextInput
          placeholder="Fernandez Lima"
          style={styles.textInput}
          value={formik.values.lastname}
          onChangeText={(text) => formik.setFieldValue('lastname', text)}
        />
        <Text style={styles.error}>{formik.errors.direction}</Text>
        <TextInput
          placeholder="direccion de casa"
          style={styles.textInput}
          value={formik.values.direction}
          onChangeText={(text) => formik.setFieldValue('direction', text)}
        />
        <Text style={styles.error}>{formik.errors.age}</Text>
        <TextInput
          placeholder="edad en numeros"
          style={styles.textInput}
          value={formik.values.age.trim()}
          onChangeText={(text) => formik.setFieldValue('age', text)}
        />
        <Text style={styles.error}>{formik.errors.cellphone}</Text>
        <TextInput
          placeholder="7878 7590"
          style={styles.textInput}
          value={formik.values.cellphone.trim()}
          onChangeText={(text) => formik.setFieldValue('cellphone', text)}
        />
        <Text style={styles.error}>{formik.errors.email}</Text>
        <TextInput
          placeholder="jhon@email.com"
          style={styles.textInput}
          value={formik.values.email.trim()}
          onChangeText={(text) => formik.setFieldValue('email', text)}
        />
        <Text style={styles.error}>{formik.errors.password}</Text>
        <TextInput
          placeholder="password"
          style={styles.textInput}
          value={formik.values.password.trim()}
          onChangeText={(text) => formik.setFieldValue('password', text)}
          secureTextEntry
        />
        <TouchableOpacity style={styles.containerBtn} onPress={formik.handleSubmit}>
          <LinearGradient
            // Button Linear Gradient
            colors={['#FFB677', '#FF3CBD']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.btn}
          >
            <Text style={styles.text}>Registrarse</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cuentaButton} onPress={()=>navigation.navigate('login')}>
          <Text style={styles.forgotPassword}>Ya tienes cuenta?, Inicia sesion</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 80,
    color: '#34434D',
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 20,
    color: 'gray',
  },
  textInput: {
    borderWidth: 1,
    height: 50,
    paddingStart: 20,
    padding: 10,
    width: '80%',
    marginTop: 20,
    borderRadius: 30,
    backgroundColor: '#fff'
  },
  forgotPassword: {
    fontSize: 14,
    color: 'gray',
    marginTop: 20
  },
  containerBtn: {
    width: 200,
    alignItems: 'center',
    marginTop: 60
  },
  text: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold'
  },
  btn: {
    width: "80%",
    height: 50,
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  error: {
    textAlign: 'center',
    color: '#f00',
    marginTop: 10
  },
  cuentaButton: {
    margin: 10
  }
})
import { StatusBar } from "expo-status-bar";
import React, { useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Image, SafeAreaView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Loader from "../../components/loading/Loading";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { AuthUser } from '../../context/AuthUserContext';
import Logo from "../../../assets/logotipo.png";

export default function Login({ navigation }) {
  const { isLoading, login } = useContext(AuthUser);

  const yupSchema = {
    email: Yup.string().required("El correo es necesario").matches(/^\S+@\S+\.\S+$/, "Correo inválido, no debe llevar espacios"),
    password: Yup.string().required("La contraseña es obligatoria")
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: Yup.object(yupSchema),
    validateOnChange: false,
    onSubmit: data => {
      login(data)
    },
  })

  return (
    <View style={styles.container}>
      <Loader visible={isLoading} />
      <StatusBar translucent={true} />
      <View style={{ width: "100%" }}>
        <ScrollView>
          <View style={styles.innerContainer}>
            <View>
              <Image style={styles.image} source={Logo} />
            </View>
            <Text style={styles.titulo}>Bienvenido</Text>
            <Text >Inicia sesion en tu cuenta</Text>
            <Text style={styles.error}>{formik.errors.email}</Text>
            <TextInput
              placeholder="jhon@email.com"
              style={styles.textInput}
              value={formik.values.email}
              onChangeText={(text) => formik.setFieldValue('email', text)}
            />
            <Text style={styles.error}>{formik.errors.password}</Text>
            <TextInput
              placeholder="password"
              style={styles.textInput}
              value={formik.values.password}
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
                <Text style={styles.text}>Iniciar sesion</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('singup')}>
              <Text style={styles.forgotPassword}>¿No tienes cuenta?, ¡Registrate!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: 390,
  },
  image: {
    height: 180,
    width: 190,
  },
  titulo: {
    fontSize: 65,
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
    paddingStart: 30,
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
  }
})
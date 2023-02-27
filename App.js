import React from "react";
import "react-native-gesture-handler";
import { AuthUserContext } from "./src/context/AuthUserContext"
import {AppNav} from './src/routes/AppNav';

export default function App() {
  return (
    <AuthUserContext>
      <AppNav/>
    </AuthUserContext>
  );
}
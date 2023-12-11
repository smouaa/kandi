import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TextInput,
  Text,
  Pressable,
  Image,
} from "react-native";
import { supabase } from "../supabase";
import { Button, Input } from "react-native-elements";
import { router } from "expo-router";

export default function Auth({ handleLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      console.log("User logged in!");
      router.push({ pathname: "/home", params: { userID: data.user.id } });
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.loginText}>login</Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputBox}>
          <TextInput
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email"
            autoCapitalize={"none"}
            style={styles.textInput}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="password"
            autoCapitalize={"none"}
            style={styles.textInput}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable disabled={loading} onPress={() => signInWithEmail()}>
          <Image
            source={require("../assets/login_button.png")}
            style={styles.button}
          />
        </Pressable>
      </View>
      <View style={styles.helpContainer}>
        <Text style={styles.helpText}>
          Don't have an account?{" "}
          <Pressable onPress={() => handleLogin(false)}>
            <Text
              style={[{ textDecorationLine: "underline" }, styles.helpText]}
            >
              Sign up
            </Text>
          </Pressable>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    width: "80%",
    height: "20%",
    flexDirection: "column",
  },
  inputBox: {
    backgroundColor: "white",
    height: "35%",
    justifyContent: "center",
    borderRadius: "15%",
  },
  textInput: {
    fontSize: 22,
    fontFamily: "DarkerGrotesqueSemibold",
    padding: 14,
  },
  loginText: {
    fontFamily: "Typo_Round_Bold_Demo",
    color: "white",
    fontSize: 48,
  },
  textContainer: {
    height: "10%",
    width: "80%",
    paddingLeft: 6,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignContent: "flex-end",
    width: "80%",
    height: "8%",
    paddingTop: 30,
  },
  button: {
    width: 98,
    height: 38,
  },
  helpText: {
    fontFamily: "DarkerGrotesqueSemibold",
    color: "white",
    fontSize: 16,
  },
  helpContainer: {
    height: "5%",
    width: "80%",
    marginTop: 40,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

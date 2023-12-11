import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { Stack } from "expo-router/";
import { router } from "expo-router/";

export default function SignIn({ handleLogin }) {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ header: () => null }} />
      <Text style={styles.welcomeText}>welcome to</Text>
      <Image
        source={require("../assets/kandi_logo_main.png")}
        style={styles.mainLogo}
      />
      <Pressable style={styles.signIn} onPress={() => handleLogin(true)}>
        <Image
          source={require("../assets/sign_in_button.png")}
          style={styles.button}
        />
      </Pressable>
      <Pressable
        style={styles.signIn}
        onPress={() => router.push({ pathname: "/register" })}
      >
        <Image
          source={require("../assets/register_button.png")}
          style={styles.button}
        />
      </Pressable>
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
  welcomeText: {
    fontFamily: "Typo_Round_Bold_Demo",
    color: "white",
    fontSize: 24,
  },
  mainLogo: {
    resizeMode: "contain",
    width: "65%",
    height: "50%",
  },
  signIn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
    height: "8%",
  },
  button: {
    resizeMode: "contain",
    height: "80%",
  },
});

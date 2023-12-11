import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import { StyleSheet, Text, SafeAreaView, Image, Pressable } from "react-native";
import { useState } from "react";
import SignIn from "../components/signIn";
import { Stack } from "expo-router/";
import Auth from "../components/auth";
import { useFonts } from "expo-font";
import { useCallback } from "react";
import supabase from "../supabase";
import { router } from "expo-router/";

export default function App() {
  [clicked, setClicked] = useState(false);
  // load font
  const [fontsLoaded] = useFonts({
    Typo_Round_Bold_Demo: require("../assets/fonts/Typo_Round_Bold_Demo.otf"),
    DarkerGrotesque: require("../assets/fonts/DarkerGrotesque-Regular.ttf"),
    DarkerGrotesqueSemibold: require("../assets/fonts/DarkerGrotesque-Semibold.ttf"),
    DarkerGrotesqueBold: require("../assets/fonts/DarkerGrotesque-Bold.ttf"),
  });

  setStatusBarStyle("light");
  window.supabase = supabase;

  if (!fontsLoaded) return null;

  let contentDisplayed = null;

  // if user chooses to login, load login page
  if (clicked) {
    contentDisplayed = <Auth handleLogin={setClicked} />;
  } else {
    contentDisplayed = <SignIn handleLogin={setClicked} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ header: () => null }} />
      {contentDisplayed}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181a1f",
    alignItems: "center",
    justifyContent: "center",
  },
});

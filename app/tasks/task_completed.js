import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
} from "react-native";
import {
  Stack,
  router,
  useLocalSearchParams,
  useFocusEffect,
} from "expo-router/";

export default function CompletedTask() {
  const params = useLocalSearchParams();
  const { userID, beadName } = params;

  setStatusBarStyle("light");

  const paths = {
    totem_bead: require("../../assets/totem_bead.png"),
    glover_bead: require("../../assets/glover_bead.png"),
    selfie_bead: require("../../assets/selfie_bead.png"),
    headbanging_bead: require("../../assets/headbanging_bead.png"),
    fit_bead: require("../../assets/fit_bead.png"),
  };

  let path = paths[beadName];

  const navigateBack = () => {
    router.replace({
      pathname: "tasks/tasks_screen",
      params: { userID: userID },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ header: () => null }} />
      <View style={styles.mainContainer}>
        <Text style={styles.mainText}>task</Text>
        <Text style={styles.mainText}>completed</Text>
        <Image source={path} style={styles.image} />
        <Text style={styles.subText}>+1 bead obtained</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable onPress={navigateBack}>
          <Image
            source={require("../../assets/arrow.png")}
            style={styles.button}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181A1F",
    alignItems: "center",
    justifyContent: "center",
  },
  mainContainer: {
    width: "100%",
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    height: "10%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingRight: 20,
    paddingBottom: 10,
  },
  button: {
    width: 66,
    height: 45,
  },
  mainText: {
    color: "white",
    fontFamily: "Typo_Round_Bold_Demo",
    fontSize: 48,
  },
  subText: { color: "white", fontFamily: "DarkerGrotesque", fontSize: 32 },
  image: { height: 183, width: 183, margin: 40 },
});

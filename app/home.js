import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  Pressable,
  ImageBackground,
  Alert,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Stack } from "expo-router/";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import getUserInfo from "../utils/getUserInfo";
import { supabase } from "../supabase";

export default function Home() {
  const [showSecondBead, setShowSecondBead] = useState(false);
  const [showThirdBead, setShowThirdBead] = useState(false);
  const [showFourthBead, setShowFourthBead] = useState(false);
  const [showFifthBead, setShowFifthBead] = useState(false);
  const [showSixthBead, setShowSixthBead] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [imageURL, setImage] = useState(null);
  const [name, setName] = useState("");

  setStatusBarStyle("light");

  // log user out if they click their profile icon
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            router.replace("/");
            const { error } = await supabase.auth.signOut();
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  // image paths
  const [firstBeadImage, setFirstBeadImage] = useState(
    require("../assets/task_button.png")
  );
  const [secondBeadImage, setSecondBeadImage] = useState(
    require("../assets/task_button.png")
  );
  const [thirdBeadImage, setThirdBeadImage] = useState(
    require("../assets/task_button.png")
  );
  const [fourthBeadImage, setFourthBeadImage] = useState(
    require("../assets/task_button.png")
  );
  const [fifthBeadImage, setFifthBeadImage] = useState(
    require("../assets/task_button.png")
  );

  const completedPaths = {
    totem_bead: require("../assets/totem_bead.png"),
    glover_bead: require("../assets/glover_bead.png"),
    selfie_bead: require("../assets/selfie_bead.png"),
    headbanging_bead: require("../assets/headbanging_bead.png"),
    fit_bead: require("../assets/fit_bead.png"),
  };

  // get user information (profile pic, name, etc.)
  const params = useLocalSearchParams();
  const { userID } = params;

  const fetchUserInfo = async () => {
    const user = await getUserInfo(userID);
    setCompletedTasks(user?.completed_tasks || []);
    setName(user?.name || "");
    setImage(user?.avatar_url || "");
  };

  useEffect(() => {
    // fetch user info when the component mounts
    fetchUserInfo();
  }, [userID]);

  // use useFocusEffect to refetch user info when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, [userID])
  );

  useEffect(() => {
    if (completedTasks.length >= 1) {
      setFirstBeadImage(completedPaths[completedTasks[0]]);
      setShowSecondBead(true);
    }
    if (completedTasks.length >= 2) {
      setSecondBeadImage(completedPaths[completedTasks[1]]);
      setShowThirdBead(true);
    }
    if (completedTasks.length >= 3) {
      setThirdBeadImage(completedPaths[completedTasks[2]]);
      setShowFourthBead(true);
    }
    if (completedTasks.length >= 4) {
      setFourthBeadImage(completedPaths[completedTasks[3]]);
      setShowFifthBead(true);
    }
    if (completedTasks.length >= 5) {
      setFifthBeadImage(completedPaths[completedTasks[4]]);
      setShowSixthBead(true);
    }
  }, [completedTasks]);

  // get array of correct beads to display according to completedTasks array

  const navigateCommunity = () => {
    router.push({
      pathname: "community/community_screen",
      params: { userID: userID },
    });
  };

  console.log(userID);
  return (
    <SafeAreaView style={styles.container}>
      {/* kandi text and user profile */}
      <Stack.Screen options={{ header: () => null }} />
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>kandi</Text>
        <View style={styles.userContainer}>
          <Pressable
            style={{ width: "100%", height: "100%", alignItems: "center" }}
            onPress={handleLogout}
          >
            <Image source={{ uri: imageURL }} style={styles.profilePic} />
          </Pressable>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
      <View style={styles.bodyContainer}>
        {/* community button */}
        <View style={styles.leftContainer}>
          <Pressable onPress={navigateCommunity}>
            <Image
              source={require("../assets/community_button.png")}
              style={styles.communityButton}
            />
          </Pressable>
        </View>
        {/* kandi bracelet */}
        <View style={styles.middleContainer}>
          <ImageBackground
            source={require("../assets/string.png")}
            style={styles.string}
          >
            {/* first bead */}
            <Pressable
              onPress={() => {
                if (!showSecondBead) {
                  router.push({
                    pathname: "tasks/tasks_screen",
                    params: { userID: userID },
                  });
                }
              }}
            >
              <Image source={firstBeadImage} style={styles.firstBead} />
            </Pressable>
            {/* second bead */}
            <Pressable
              onPress={() => {
                if (showSecondBead && !showThirdBead) {
                  router.push({
                    pathname: "tasks/tasks_screen",
                    params: { userID: userID },
                  });
                }
              }}
            >
              <Image
                source={secondBeadImage}
                style={[
                  styles.secondBead,
                  {
                    opacity: showSecondBead ? 1 : 0,
                  },
                ]}
              />
            </Pressable>
            {/* third bead */}
            <Pressable
              onPress={() => {
                if (showThirdBead && !showFourthBead) {
                  router.push({
                    pathname: "tasks/tasks_screen",
                    params: { userID: userID },
                  });
                }
              }}
            >
              <Image
                source={thirdBeadImage}
                style={[
                  styles.thirdBead,
                  {
                    opacity: showThirdBead ? 1 : 0,
                  },
                ]}
              />
            </Pressable>
            {/* fourth bead */}
            <Pressable
              onPress={() => {
                if (showFourthBead && !showFifthBead) {
                  router.push({
                    pathname: "tasks/tasks_screen",
                    params: { userID: userID },
                  });
                }
              }}
            >
              <Image
                source={fourthBeadImage}
                style={[
                  styles.fourthBead,
                  {
                    opacity: showFourthBead ? 1 : 0,
                  },
                ]}
              />
            </Pressable>
            {/* fifth bead */}
            <Pressable
              onPress={() => {
                if (showFifthBead && !showSixthBead) {
                  router.push({
                    pathname: "tasks/tasks_screen",
                    params: { userID: userID },
                  });
                }
              }}
            >
              <Image
                source={fifthBeadImage}
                style={[
                  styles.fifthBead,
                  {
                    opacity: showFifthBead ? 1 : 0,
                  },
                ]}
              />
            </Pressable>
            {/* sixth bead */}
            <Pressable
              onPress={() => {
                if (showSixthBead) {
                  router.push({
                    pathname: "tasks/tasks_screen",
                    params: { userID: userID },
                  });
                }
              }}
            >
              <Image
                source={require("../assets/task_button.png")}
                style={[
                  styles.sixthBead,
                  {
                    opacity: showSixthBead ? 1 : 0,
                  },
                ]}
              />
            </Pressable>
          </ImageBackground>
        </View>
        <View style={styles.rightContainer}>
          {!showSixthBead && (
            <Image
              source={require("../assets/pending_tasks.png")}
              style={styles.pendingTask}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#181a1f",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    height: "10%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontFamily: "Typo_Round_Bold_Demo",
    color: "white",
    fontSize: 44,
    marginLeft: "35%",
  },
  bodyContainer: {
    height: "90%",
    width: "100%",
    flexDirection: "row",
  },
  userContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "17%",
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: 20,
    marginTop: 40,
  },
  profilePic: {
    aspectRatio: 1,
    resizeMode: "cover",
    borderRadius: 50,
    height: "70%",
    top: "15%",
  },
  name: {
    color: "white",
    fontFamily: "DarkerGrotesque",
    fontSize: 18,
  },
  leftContainer: {
    width: "33.33%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  middleContainer: {
    width: "33.33%",
    height: "100%",
    alignItems: "center",
  },
  rightContainer: {
    width: "33.33%",
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  communityButton: {
    resizeMode: "contain",
    height: 115,
    marginLeft: 50,
  },
  string: {
    resizeMode: "contain",
    justifyContent: "center",
    height: 758,
    width: 63,
  },
  firstBead: {
    height: 63,
    width: 63,
    bottom: 105,
  },
  secondBead: {
    height: 63,
    width: 63,
    bottom: 109,
    left: 23,
  },
  thirdBead: {
    height: 63,
    width: 63,
    bottom: 111,
    left: 3,
  },
  fourthBead: {
    height: 63,
    width: 63,
    bottom: 112,
    right: 13,
  },
  fifthBead: {
    height: 63,
    width: 63,
    bottom: 122,
    left: 20,
  },
  sixthBead: {
    height: 63,
    width: 63,
    bottom: 122,
    left: 14,
  },
  pendingTask: {
    width: 160,
    height: 160,
    bottom: 65,
  },
});

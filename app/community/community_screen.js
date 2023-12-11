import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  ImageBackground,
  Alert,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import {
  Stack,
  router,
  useLocalSearchParams,
  useFocusEffect,
} from "expo-router/";
import getUserInfo from "../../utils/getUserInfo";

export default function Community() {
  const [friends, setFriends] = useState([]);
  const params = useLocalSearchParams();
  const { userID } = params;

  setStatusBarStyle("light");

  const navigateFriends = () => {
    router.push({
      pathname: "/community/friends/view_friends",
      params: { userID: userID },
    });
  };

  // if user has at least one friend, load hardcoded event
  // get information about user's friends
  const fetchUserInfo = async () => {
    try {
      const user = await getUserInfo(userID);
      setFriends(user?.friends || []);
    } catch (error) {
      console.error("Error fetching user info:", error.message);
    }
  };

  useEffect(() => {
    // fetch user info when the component mounts
    fetchUserInfo();
  }, [userID]);

  // fetch user info again when screen comes back into focus
  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, [userID])
  );

  return (
    <ImageBackground
      source={require("../../assets/community_background.png")}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: "community",
            headerTransparent: true,
            headerStyle: {
              borderBottomWidth: 0,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: "Typo_Round_Bold_Demo",
              fontSize: 38,
            },
            headerLeft: () => (
              <Pressable
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Image
                  source={require("../../assets/back_button.png")}
                  style={styles.backButton}
                />
              </Pressable>
            ),
          }}
        />
        <View style={styles.friendsGroupsContainer}>
          <Pressable onPress={navigateFriends}>
            <Image
              source={require("../../assets/friends_button.png")}
              style={styles.topButtons}
            />
          </Pressable>
          <Pressable onPress={() => Alert.alert("not implemented yet :(")}>
            <Image
              source={require("../../assets/groups_button.png")}
              style={styles.topButtons}
            />
          </Pressable>
        </View>
        <View style={styles.eventsContainer}>
          <Text style={styles.eventsHeader}>upcoming events</Text>
          <View style={styles.yourEventsContainer}>
            <Text style={styles.eventSubHeader}>you are attending</Text>
            <Pressable onPress={() => Alert.alert("not implemented yet :(")}>
              <Image
                source={require("../../assets/add_event_button.png")}
                style={styles.addButton}
              />
            </Pressable>
          </View>
          <View style={styles.friendsEventsContainer}>
            <Text style={styles.eventSubHeader}>
              your friends are attending
            </Text>
            <View style={styles.events}>
              {friends.length > 0 ? (
                // Render an image if the user has friends
                <Image
                  source={require("../../assets/event.png")}
                  style={styles.event}
                />
              ) : (
                <Text style={styles.eventBodyText}>
                  no events, convince your friends to go to some &#62;:&#41;
                </Text>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    width: 37,
    height: 37,
    paddingLeft: 15,
    bottom: 3,
  },
  friendsGroupsContainer: {
    height: "15%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 30,
    paddingHorizontal: 40,
  },
  eventsContainer: {
    height: "85%",
    width: "100%",
    paddingHorizontal: 40,
  },
  topButtons: {
    width: 139,
    height: 50,
  },
  eventsHeader: {
    color: "white",
    fontSize: 32,
    fontFamily: "Typo_Round_Bold_Demo",
  },
  eventSubHeader: {
    color: "#C8B7ED",
    fontFamily: "Typo_Round_Bold_Demo",
    fontSize: 20,
    marginVertical: 12,
  },
  yourEventsContainer: {
    height: "30%",
    width: "100%",
  },
  friendsEventsContainer: {
    height: "70%",
    width: "100%",
  },
  addButton: {
    width: "100%",
    height: 29,
    marginVertical: 12,
  },
  eventBodyText: {
    color: "white",
    fontFamily: "DarkerGrotesque",
    fontSize: 20,
    textAlign: "center",
    marginVertical: 45,
  },
  events: {
    width: "100%",
    height: "100%",
  },
  event: {
    resizeMode: "contain",
    width: "100%",
    bottom: 35,
  },
});

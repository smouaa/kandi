import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  ImageBackground,
  TextInput,
  SectionList,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import {
  Stack,
  router,
  useLocalSearchParams,
  useFocusEffect,
} from "expo-router/";
import getUserInfo from "../../../utils/getUserInfo";
import fetchUsersInfo from "../../../utils/fetchUsersInfo";
import ViewFriend from "../../../components/viewFriend";

export default function Community() {
  const [friends, setFriends] = useState([]);
  const [friendsInfo, setFriendsInfo] = useState([]);
  const params = useLocalSearchParams();
  const { userID } = params;

  setStatusBarStyle("light");

  // navigation

  const navigateFriends = () => {
    router.push({
      pathname: "community/friends/add_friends",
      params: { userID: userID },
    });
  };

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

  useEffect(() => {
    // fetch friends info when friends changes
    fetchUsersInfo(friends)
      .then((sectionsArray) => {
        setFriendsInfo(sectionsArray);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error.message);
      });
  }, [friends]);

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, [userID])
  );

  return (
    <ImageBackground
      source={require("../../../assets/community_background.png")}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: "my friends",
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
                  source={require("../../../assets/back_button.png")}
                  style={styles.backButton}
                />
              </Pressable>
            ),
          }}
        />
        <View style={styles.buttonContainer}>
          <Pressable onPress={navigateFriends}>
            <Image
              source={require("../../../assets/wide_add_friends_button.png")}
              style={styles.addFriend}
            />
          </Pressable>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="search my friends"
              placeholderTextColor="#939393"
              autoCapitalize={"none"}
              style={styles.textInput}
              color="#939393"
            />
            <Image
              source={require("../../../assets/search_icon.png")}
              style={styles.searchIcon}
            />
          </View>
          <View style={styles.friendsContainer}>
            {friends.length > 0 ? (
              <SectionList
                sections={friendsInfo}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={({ item }) => (
                  <View>
                    <ViewFriend
                      username={item.username}
                      name={item.name}
                      avatarURL={item.avatar_url}
                    />
                  </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <Text style={styles.sectionHeader}>{title}</Text>
                )}
                style={styles.friendlist}
              />
            ) : (
              <View style={styles.noFriends}>
                <Text style={styles.noFriendText}>no friends :&#40;</Text>
                <Text style={styles.noFriendText}>
                  find some by tapping “add friends”
                </Text>
              </View>
            )}
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
    justifyContent: "flex-start",
  },
  backButton: {
    width: 37,
    height: 37,
    paddingLeft: 15,
    bottom: 3,
  },
  mainContainer: {
    height: "85%",
    width: "100%",
  },
  buttonContainer: {
    height: "15%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  addFriend: {
    width: 143,
    height: 60,
    marginVertical: 20,
  },
  noFriends: {
    backgroundColor: "#2A2C31",
    height: "15%",
    width: "78%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    height: "10%",
    alignItems: "center",
  },
  textInput: {
    width: 300,
    height: 40,
    borderWidth: 1,
    borderColor: "#939393",
    borderRadius: 50,
    fontSize: 20,
    paddingBottom: 5,
    paddingHorizontal: 40,
    fontFamily: "DarkerGrotesque",
  },
  searchIcon: {
    height: 17,
    width: 17,
    bottom: "48%",
    right: "33%",
  },
  friendsContainer: {
    height: "90%",
    alignItems: "center",
  },
  noFriendText: {
    color: "white",
    fontFamily: "DarkerGrotesque",
    fontSize: 18,
  },
  friendlist: {
    width: "80%",
    borderRadius: 20,
    marginBottom: "5%",
  },
  sectionHeader: {
    color: "white",
    fontFamily: "DarkerGrotesqueSemibold",
    fontSize: 20,
  },
});

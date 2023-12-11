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
  FlatList,
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import {
  Stack,
  router,
  useLocalSearchParams,
  useFocusEffect,
} from "expo-router/";
import searchUsers from "../../../utils/searchUsers";
import Result from "../../../components/result";
import getPendingFriendRequests from "../../../utils/getPendingRequests";
import Request from "../../../components/request";

export default function Community() {
  const [searchResults, setSearchResults] = useState([]);
  const [pendingRequests, setRequests] = useState(null);
  const params = useLocalSearchParams();
  const { userID } = params;

  // check for pending friend requests, load if so
  const fetchRequests = async () => {
    const friendRequests = await getPendingFriendRequests(userID);
    setRequests(friendRequests || []);
    console.log(pendingRequests);
  };

  setStatusBarStyle("light");

  useEffect(() => {
    if (!pendingRequests) {
      fetchRequests();
    }
  }, [userID]);

  // refresh screen when user navigates to page
  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [userID])
  );

  // get data of users whose usernames match search query
  const handleEndEditing = async (event) => {
    const text = event.nativeEvent.text;
    const query = text.trim();
    if (query !== "") {
      try {
        const results = await searchUsers(text, userID);
        setSearchResults(results);
        console.log(results);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/community_background.png")}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: "add friends",
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
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="search..."
            placeholderTextColor="#939393"
            autoCapitalize={"none"}
            style={styles.textInput}
            color="#939393"
            onEndEditing={(text) => handleEndEditing(text)}
          />
          <Image
            source={require("../../../assets/search_icon.png")}
            style={styles.searchIcon}
          />
        </View>
        <View style={styles.friendsContainer}>
          {searchResults.length > 0 && (
            <Text style={styles.requestHeader}>users found</Text>
          )}
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Result
                username={item.username}
                avatarURL={item.avatar_url}
                name={item.name}
                friendID={item.id}
                userID={userID}
              />
            )}
            style={styles.flatList}
          />
          <Text style={styles.requestHeader}>friend requests</Text>
          <FlatList
            data={pendingRequests}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Request theirID={item} userID={userID}></Request>
            )}
            style={styles.flatList}
            ListEmptyComponent={() => (
              <View style={styles.noRequestsMessageContainer}>
                <Text style={styles.noRequestsMessage}>
                  no pending requests
                </Text>
              </View>
            )}
          />
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
  inputContainer: {
    height: "8%",
    marginTop: 20,
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
    bottom: "49%",
    left: "4%",
  },
  friendsContainer: {
    width: "100%",
    alignItems: "center",
  },
  flatList: {
    backgroundColor: "rgba(42, 44, 49, 0.5)",
    width: "80%",
    borderRadius: 20,
    marginBottom: "5%",
  },
  username: {
    color: "#7E7F81",
    fontSize: 18,
    opacity: 1,
    fontFamily: "DarkerGrotesque",
  },
  name: {
    color: "white",
    fontSize: 20,
    fontFamily: "DarkerGrotesque",
  },
  userTextContainer: {
    width: "55%",
    paddingLeft: 10,
  },
  avatar: {
    width: 50, // Set the width of the image
    height: 50, // Set the height of the image
    borderRadius: 50, // Set borderRadius for a circular avatar (adjust as needed)
  },
  userContainer: {
    padding: 13,
    paddingLeft: 13,
    flexDirection: "row",
    borderBottomWidth: 1,
    alignItems: "center",
  },
  addButton: {
    resizeMode: "contain",
    width: 80,
    height: 30,
  },
  requestHeader: {
    color: "white",
    fontFamily: "DarkerGrotesque",
    fontSize: 20,
    alignSelf: "flex-start",
    paddingLeft: "12%",
    marginBottom: "5%",
  },
  noRequestsMessage: {
    color: "#939393",
    fontFamily: "DarkerGrotesque",
    fontSize: 18,
  },
  noRequestsMessageContainer: {
    height: 50,
    justifyContent: "center",
    paddingLeft: 10,
  },
});

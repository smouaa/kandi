import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { useState, useEffect } from "react";
import getUserInfo from "../utils/getUserInfo";
import acceptRequest from "../utils/acceptRequest";

export default Request = ({ theirID, userID }) => {
  const [buttonImage, setButtonImage] = useState(
    require("../assets/accept_button.png")
  );
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  // get user info
  const fetchUserInfo = async () => {
    const user = await getUserInfo(theirID);
    setName(user.name);
    setUsername(user.username);
    setProfilePic(user.avatar_url);
  };

  useEffect(() => {
    // Fetch user info when the component mounts
    fetchUserInfo();
  }, [theirID]);

  const addFriend = async () => {
    await acceptRequest(userID, theirID);
    // change button to added
    setButtonImage(require("../assets/added_button.png"));
  };

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <Image style={styles.avatar} source={{ uri: profilePic }} />
        <View style={styles.userTextContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.username}>{username}</Text>
        </View>
        <Pressable onPress={() => addFriend()}>
          <Image source={buttonImage} style={styles.addButton} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
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
});

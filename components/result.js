import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { useState } from "react";
import sendFriendRequest from "../utils/sendFriendRequest";

export default Result = ({ username, name, avatarURL, friendID, userID }) => {
  const [clicked, setClicked] = useState(false);
  const [buttonImage, setButtonImage] = useState(
    require("../assets/add_button.png")
  );

  // send friend request to server if user clicks add button
  const addFriend = async (friendID) => {
    await sendFriendRequest(userID, friendID);
    // change button to added
    setClicked(true);
    setButtonImage(require("../assets/added_button.png"));
  };

  return (
    <View style={styles.userContainer}>
      <Image style={styles.avatar} source={{ uri: avatarURL }} />
      <View style={styles.userTextContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.username}>{username}</Text>
      </View>
      <Pressable onPress={() => addFriend(friendID)}>
        <Image source={buttonImage} style={styles.addButton} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181a1f",
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

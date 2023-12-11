import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";

export default ViewFriend = ({ username, name, avatarURL }) => {
  return (
    <View style={styles.userContainer}>
      <Image style={styles.avatar} source={{ uri: avatarURL }} />
      <View style={styles.userTextContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.username}>{username}</Text>
      </View>
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
    backgroundColor: "#333539",
    padding: 13,
    paddingLeft: 13,
    flexDirection: "row",
    borderRadius: 13,
    alignItems: "center",
    margin: 10,
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

import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router/";
import * as ImagePicker from "expo-image-picker";
import createNewGroup from "../../utils/createNewGroup";
import getUserInfo from "../../utils/getUserInfo";
import fetchUsersInfo from "../../utils/fetchUsersInfo";
import uploadImage from "../../utils/uploadImage";

export default function createGroup() {
  const params = useLocalSearchParams();
  const { userID, userFriends, beadName, userGroups } = params;
  const [friends, setFriends] = useState([]);
  const [friendsInfo, setInfo] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState(
    require("../../assets/create_group.png")
  );

  const newGroupArray = userGroups.split(",");
  setStatusBarStyle("light");

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
    // fetch friends info when friends changes
    fetchUsersInfo(friends)
      .then((sectionsArray) => {
        console.log("UR HERE", sectionsArray);
        const flatArray = sectionsArray.flatMap((section) =>
          section.data.map((user) => ({
            name: user.name,
            username: user.username,
            avatar_url: user.avatar_url,
            selected: false,
            selectedURL:
              "https://xlinbzpbkixmjhjlqkjy.supabase.co/storage/v1/object/sign/avatars/sofia_selected.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL3NvZmlhX3NlbGVjdGVkLnBuZyIsImlhdCI6MTcwMTkyNjUwMSwiZXhwIjoxNzA0NTE4NTAxfQ.xQhn6x4ZCGZv3QyRqsXN1fzMu7heCCyKPrb6Oguki3k&t=2023-12-07T05%3A21%3A41.056Z",
          }))
        );
        setInfo(flatArray);

        console.log(flatArray); //
      })
      .catch((error) => {
        console.error("Error fetching user info:", error.message);
      });
  }, [friends]);

  useEffect(() => {
    // fetch user info when the component mounts
    fetchUserInfo();
  }, [userID]);

  const handleFriendPress = (friendIndex) => {
    setInfo((prevFriendData) => {
      const updatedData = [...prevFriendData];
      updatedData[friendIndex] = {
        ...updatedData[friendIndex],
        selected: !updatedData[friendIndex].selected,
      };
      return updatedData;
    });
  };

  const handleConfirm = async () => {
    if (groupName != "") {
      await uploadImage("group_pics", `${groupName}.jpg`, groupImage.base64);
      newGroupArray.push(groupName);
      await createNewGroup(userID, newGroupArray);
      const newGroups = newGroupArray.join(",");
      router.replace({
        pathname: "tasks/select_group",
        params: {
          userID: userID,
          userGroups: newGroups,
          userFriends: userFriends,
          beadName: beadName,
        },
      });
    }
  };

  // allow user to pick a group image
  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        // update the state with the selected image
        setGroupImage(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking an image: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <Stack.Screen
        options={{
          title: "create group",
          headerStyle: { backgroundColor: "#181A1F" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: "Typo_Round_Bold_Demo",
            fontSize: 38,
          },
          headerLeft: () => (
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Image
                source={require("../../assets/back_button.png")}
                style={styles.backButton}
              />
            </Pressable>
          ),
        }}
      />
      {/* body */}
      {/* set group pic and name */}
      <View style={styles.picNameContainer}>
        <Pressable onPress={handleImagePicker}>
          <Image source={groupImage} style={styles.groupPic} />
        </Pressable>
        <TextInput
          placeholder="group name"
          placeholderTextColor="#939393"
          autoCapitalize={"none"}
          style={styles.textInput}
          onChangeText={(text) => setGroupName(text)}
        />
      </View>
      <View style={styles.friendContainer}>
        <View style={styles.friendHeader}>
          <Text style={styles.mainText}>select friends</Text>
          <Text style={styles.subtext}>&#40;select 1+ friends&#41;</Text>
        </View>
        <ScrollView
          horizontal
          indicatorStyle={{ backgroundColor: "white" }}
          contentContainerStyle={styles.scrollViewContent}
        >
          {friendsInfo.map((friend, index) => (
            <View key={index} style={styles.friend}>
              <Pressable onPress={() => handleFriendPress(index)}>
                <Image
                  source={{
                    uri: friend.selected
                      ? friend.selectedURL
                      : friend.avatar_url,
                  }}
                  style={styles.image}
                />
              </Pressable>
              <Text style={styles.friendName}>{friend.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable onPress={handleConfirm}>
          <Image
            source={
              friendsInfo.some((friend) => friend.selected)
                ? require("../../assets/selected_confirm_button.png")
                : require("../../assets/group_confirm_button.png")
            }
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
  backButton: {
    width: 37,
    height: 37,
    paddingLeft: 15,
    bottom: 3,
  },
  textInput: {
    color: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#939393",
    fontFamily: "DarkerGrotesque",
    fontSize: 20,
    width: "60%",
    marginTop: 20,
  },
  groupPic: {
    width: 166,
    height: 166,
  },
  picNameContainer: {
    height: "40%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  friendContainer: {
    height: "30%",
    width: "100%",
    marginTop: 30,
    alignItems: "center",
    flex: 1,
  },
  subtext: {
    color: "white",
    fontFamily: "DarkerGrotesque",
    fontSize: 20,
  },
  mainText: {
    color: "white",
    fontFamily: "Typo_Round_Bold_Demo",
    fontSize: 20,
    marginRight: 10,
  },
  friendHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 40,
  },
  image: {
    width: 76,
    height: 76,
    resizeMode: "cover",
    borderRadius: 50,
  },
  friendName: {
    marginTop: 5,
    color: "white",
    fontSize: 18,
    fontFamily: "DarkerGrotesque",
  },
  scrollViewContent: {
    width: "90%",
    alignItems: "flex-start",
    marginTop: 10,
    justifyContent: "flex-start",
    padding: 10,
  },
  friend: {
    borderWidth: 0,
    borderColor: "green",
    alignItems: "center",
    justifyContent: "center",
    margin: 17,
  },
  button: {
    width: 138,
    height: 57,
  },
  buttonContainer: {
    height: "20%",
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 20,
    paddingBottom: 20,
  },
  groupPic: {
    height: 166,
    width: 166,
    borderRadius: 100,
  },
});

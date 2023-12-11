import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { Stack, router, useLocalSearchParams } from "expo-router/";
import Group from "../../components/group";
import * as ImagePicker from "expo-image-picker";
import markCompleted from "../../utils/markCompleted";

export default function selectGroup() {
  const [groupSelected, setGroupSelected] = useState(false);
  // get userID
  const params = useLocalSearchParams();
  const { userID, userGroups, beadName, userFriends } = params;
  // convert groups into an array for scrollview
  const groups = userGroups.split(",");
  const groupsData = groups.map((group, index) => ({
    name: group,
    index: index,
  }));

  setStatusBarStyle("light");

  // prompt user to upload media

  const handleImageSelection = async () => {
    Alert.alert(
      "Upload your media",
      "Take a picture or select an image from your camera roll.",
      [
        {
          text: "Camera",
          onPress: () => launchCamera(),
        },
        {
          text: "Camera Roll",
          onPress: () => launchImageLibrary(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const launchCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access the camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    handleImageResult(result);
  };

  const launchImageLibrary = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access the camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    handleImageResult(result);
  };

  // mark task as completed
  const handleImageResult = (result) => {
    if (!result.canceled) {
      markCompleted({ userID, beadName });

      // show task completed
      router.replace({
        pathname: "/tasks/task_completed",
        params: { userID: userID, beadName: beadName },
      });
    }
  };

  // mark group as selected for task
  const handleGroupSelection = () => {
    setGroupSelected((prevSelected) => !prevSelected);
  };

  const handleConfirmPress = async () => {
    if (groupSelected) {
      // proceed with image selection
      await handleImageSelection();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <Stack.Screen
        options={{
          title: "select group",
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
      <View style={styles.groupsContainer}>
        <Text style={styles.headerText}>my groups</Text>
        <ScrollView
          horizontal={true}
          bounces={false}
          contentContainerStyle={styles.scrollViewContainer}
          showsHorizontalScrollIndicator={false}
        >
          {groupsData.map((item) => (
            <Group
              key={item.index}
              groupName={item.name}
              userID={userID}
              userFriends={userFriends}
              beadName={beadName}
              userGroups={userGroups}
              handleGroupSelection={handleGroupSelection}
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable onPress={handleConfirmPress}>
          <Image
            source={
              groupSelected
                ? require("../../assets/selected_confirm_button.png")
                : require("../../assets/group_confirm_button.png")
            }
            style={styles.confirmButton}
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
  scrollViewContainer: {
    width: "100%",
    height: "90%",
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    marginTop: 30,
  },
  groupsContainer: {
    alignItems: "flex-start",
    paddingTop: 60,
    paddingLeft: 20,
    paddingRight: 20,
    height: "80%",
  },
  buttonContainer: {
    height: "20%",
    width: "100%",
    paddingRight: 20,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 40,
  },
  headerText: {
    color: "white",
    fontFamily: "Typo_Round_Bold_Demo",
    fontSize: 22,
    paddingLeft: 20,
    marginTop: 20,
  },
  confirmButton: {
    resizeMode: "contain",
    width: 138,
    height: 57,
  },
});

import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, Pressable, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import markCompleted from "../utils/markCompleted";
import { router, useLocalSearchParams } from "expo-router";

const Task = ({ userID, beadName, status, setNumBeadsCollected, userInfo }) => {
  const [path, setPath] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // hard code group beads in
  const groupTasks = ["headbanging_bead", "fit_bead"];
  let isGroupTask = false;

  if (groupTasks.includes(beadName)) {
    isGroupTask = true;
  }

  // selecting image for bead
  useEffect(() => {
    if (!selectedImage) {
      if (status === "incomplete") {
        setPath(paths[beadName]);
      } else {
        setPath(completedPaths[beadName]);
      }
    } else {
      setPath(completedPaths[beadName]);
      setNumBeadsCollected((old) => old + 1);
    }
  }, [selectedImage]);

  // task and bead information
  const descriptions = {
    totem_bead: "take a picture of a cool totem",
    glover_bead: "take a video of a glover",
    selfie_bead: "take a selfie at the rails",
    headbanging_bead: "take a video of your group headbanging",
    fit_bead: "take a picture of your group coordinating fits",
  };

  const paths = {
    totem_bead: require("../assets/incomplete_totem_bead.png"),
    glover_bead: require("../assets/incomplete_glover_bead.png"),
    selfie_bead: require("../assets/incomplete_selfie_bead.png"),
    headbanging_bead: require("../assets/incomplete_headbanging_bead.png"),
    fit_bead: require("../assets/incomplete_fit_bead.png"),
  };

  const completedPaths = {
    totem_bead: require("../assets/complete_totem_bead.png"),
    glover_bead: require("../assets/complete_glover_bead.png"),
    selfie_bead: require("../assets/complete_selfie_bead.png"),
    headbanging_bead: require("../assets/complete_headbanging_bead.png"),
    fit_bead: require("../assets/complete_fit_bead.png"),
  };

  // choose path

  const groupOrIndividual = async () => {
    if (isGroupTask) {
      router.replace({
        pathname: "tasks/select_group",
        params: {
          userID: userID,
          userGroups: userInfo.groups,
          userFriends: userInfo.friends,
          beadName: beadName,
        },
      });
    } else {
      await handleImageSelection();
    }
  };

  // have user upload media
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

  const handleImageResult = (result) => {
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      markCompleted({ userID, beadName });
      router.replace({
        pathname: "/tasks/task_completed",
        params: { userID: userID, beadName: beadName },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.bead}
        onPress={groupOrIndividual}
        disabled={path === completedPaths[beadName]}
      >
        <Image source={path} style={styles.bead} />
      </Pressable>
      <View style={styles.descriptionContainer}>
        {isGroupTask && (
          <View style={styles.groupTaskContainer}>
            <Text style={styles.groupTaskText}>group task</Text>
          </View>
        )}
        <Text style={styles.description}>{descriptions[beadName]}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#181a1f",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    height: 105,
    margin: 0,
    borderTopWidth: 1,
    borderTopColor: "#404144",
    borderBottomWidth: 1,
    borderBottomColor: "#404144",
  },
  bead: {
    alignSelf: "center",
    height: 70,
    width: 70,
  },
  descriptionContainer: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 10,
    justifyContent: "center",
    flexWrap: "wrap",
    width: "60%",
  },
  description: {
    fontFamily: "DarkerGrotesque",
    fontSize: 23,
    color: "white",
    width: "100%",
  },
  groupTaskContainer: {
    backgroundColor: "#333539",
    height: "18%",
    width: "30%",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  groupTaskText: {
    color: "white",
    fontFamily: "DarkerGrotesque",
    fontSize: 14,
    alignSelf: "center",
  },
});

export default Task;

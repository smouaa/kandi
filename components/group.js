import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { router } from "expo-router";
import getImageUrl from "../utils/getImageUrl";

const Group = ({
  groupName,
  userID,
  userFriends,
  beadName,
  userGroups,
  handleGroupSelection,
}) => {
  const [selected, setSelected] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  // get group image to display
  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const url = await getImageUrl("group_pics", `${groupName}.jpg`);
        console.log("CRANBERRIES", url.publicUrl);
        setImageURL(url.publicUrl);
      } catch (error) {
        console.error("Error fetching group image URL:", error.message);
      }
    };

    fetchImageUrl();
  }, [groupName]);

  // update filepath
  const filepath =
    groupName === "create_group"
      ? require("../assets/create_group.png")
      : { uri: imageURL };

  let groupTitle = groupName;

  if (groupName === "create_group") {
    groupTitle = " ";
  }

  const createOrSelect = () => {
    if (groupName === "create_group") {
      if (userFriends === undefined) {
        // prompt user to add friends if they don't have any
        alert("Please add friends before creating a group.");
        return;
      }
      router.replace({
        pathname: "tasks/create_group",
        params: {
          userID: userID,
          userFriends: userFriends,
          beadName: beadName,
          userGroups: userGroups,
        },
      });
    } else {
      setSelected((prevSelected) => !prevSelected);
      handleGroupSelection(!selected);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={createOrSelect}>
        <Image source={filepath} style={styles.groupImage} />
        {selected && (
          <View style={styles.overlayContainer}>
            <Image
              source={require("../assets/member_selection.png")}
              style={styles.overlayImage}
            />
          </View>
        )}
      </Pressable>
      <Text style={styles.groupName}>{groupTitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#181a1f",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 114,
    height: 140,
    flexDirection: "column",
    marginBottom: 15,
  },
  groupImage: {
    height: 87,
    width: 87,
    borderRadius: 50,
    marginBottom: 8,
  },
  groupName: {
    fontFamily: "DarkerGrotesque",
    color: "white",
    fontSize: 18,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  overlayImage: {
    height: 87,
    width: 87,
    borderRadius: 50,
  },
});

export default Group;

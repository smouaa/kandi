import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  SectionList,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import {
  Stack,
  router,
  useLocalSearchParams,
  useFocusEffect,
} from "expo-router/";
import getUserInfo from "../../utils/getUserInfo";
import Task from "../../components/task";

export default function Tasks() {
  const [userInfo, setUserInfo] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [incompleteTasks, setIncompleteTasks] = useState([]);
  const [numBeadsCollected, setNumCollected] = useState(0);

  setStatusBarStyle("light");

  // get userID
  const params = useLocalSearchParams();
  const { userID } = params;

  const DATA = [
    { title: "incomplete", data: incompleteTasks },
    { title: "complete", data: completedTasks },
  ];

  useEffect(() => {
    // update num of beads completed when user completes a task
    setNumCollected(completedTasks.length);
  }, [completedTasks]);

  // fetch bead information to render completed vs incomplete tasks
  const fetchUserInfo = async () => {
    const user = await getUserInfo(userID);
    setUserInfo(user);
    setCompletedTasks(user?.completed_tasks || []);
    setIncompleteTasks(user?.incomplete_tasks || []);
  };

  useEffect(() => {
    if (!userInfo) {
      fetchUserInfo();
    }
  }, [userID, userInfo]);

  // refresh data when user goes back to tasks screen
  useFocusEffect(
    useCallback(() => {
      // get user info
      fetchUserInfo();
    }, [userID])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <Stack.Screen
        options={{
          title: "tasks",
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
      {/* num of beads collected */}
      <View style={styles.beadsCollectedContainer}>
        <Text
          style={{
            fontSize: 22,
            fontFamily: "Typo_Round_Bold_Demo",
            color: "white",
          }}
        >
          my progress
        </Text>
        <Text
          style={{
            fontSize: 22,
            fontFamily: "DarkerGrotesque",
            color: "white",
          }}
        >
          {numBeadsCollected} task(s) completed
        </Text>
      </View>
      {/* tasks */}
      <View style={styles.taskContainer}>
        <SectionList
          style={styles.list}
          sections={DATA}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, section }) => (
            <Task
              beadName={item}
              userID={userID}
              status={section.title}
              setNumBeadsCollected={setNumCollected}
              userInfo={userInfo}
            />
          )}
        />
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
  beadsCollectedContainer: {
    width: "60%",
    height: "12%",
    backgroundColor: "#26282C",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  taskContainer: {
    width: "80%",
    height: "75%",
    marginTop: 40,
    backgroundColor: "#181A1F",
    borderRadius: 15,
  },
});

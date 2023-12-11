import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  ImageBackground,
  FlatList,
  Alert,
} from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router/";
import uploadImage from "../utils/uploadImage";
import getImageUrl from "../utils/getImageUrl";
import sendFriendRequest from "../utils/sendFriendRequest";
import { supabase } from "../supabase";

export default function ConfirmProfile() {
  const params = useLocalSearchParams();
  const {
    likedGenres,
    name,
    username,
    email,
    password,
    imageUri,
    imageBase64,
  } = params;

  setStatusBarStyle("light");

  // convert genres string into array
  const genres = likedGenres.split(",");

  const renderGenre = ({ item }) => (
    <View style={styles.musicGenre}>
      <Text style={styles.musicText}>{item}</Text>
    </View>
  );

  // upload information to database
  const handleConfirm = async () => {
    try {
      // upload image to profile pic bucket
      await uploadImage("profile_pics", `${username}${name}.jpg`, imageBase64);

      // get public URL for the image
      const url = (await getImageUrl("profile_pics", `${username}${name}.jpg`))
        .publicUrl;

      // create new user
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
            username: username,
            avatar_url: url,
          },
        },
      });

      if (error) {
        Alert.alert(error.message);
      } else {
        await sendFriendRequest(
          "c2afc68b-762c-4646-a01e-66db00726b60",
          data.user.id
        );
        router.replace({ pathname: "/home", params: { userID: data.user.id } });
      }
    } catch (error) {
      console.error("Error handling confirmation:", error);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/confirm_profile_bg.png")}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        {/* header */}
        <Stack.Screen
          options={{
            title: "confirm profile",
            headerTransparent: true,
            headerStyle: { borderBottomWidth: 0 },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: "Typo_Round_Bold_Demo",
              fontSize: 30,
            },
            headerLeft: () => (
              <Pressable
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Image
                  source={require("../assets/back_button.png")}
                  style={styles.backButton}
                />
              </Pressable>
            ),
          }}
        />
        {/* body */}
        <View style={styles.profileCard}>
          <ImageBackground
            style={styles.profileCardBg}
            imageStyle={{
              borderRadius: 50,
              borderWidth: 0.2,
              borderColor: "white",
            }}
            source={require("../assets/confirm_profile_card.png")}
          >
            {/* user info */}
            <View style={styles.userInfoContainer}>
              <Image style={styles.profilePic} source={{ uri: imageUri }} />
              <View style={styles.userInfoTextContainer}>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={styles.usernameText}>{username}</Text>
                <Text style={styles.usernameText}>{email}</Text>
              </View>
            </View>
            <View style={styles.musicInterestsContainer}>
              <Text style={styles.subheader}>music interests</Text>
              <FlatList
                data={genres}
                renderItem={renderGenre}
                keyExtractor={(item) => item}
                horizontal={false}
                numColumns={4}
                style={styles.flatList}
              />
            </View>
            <View style={styles.socialsContainer}>
              <Text style={styles.subheader}>connected socials</Text>
              <View style={styles.socialsButtonContainer}>
                <Image
                  style={styles.socials}
                  source={require("../assets/selected_spotify.png")}
                />
                <Image
                  style={styles.socials}
                  source={require("../assets/selected_instagram.png")}
                />
              </View>
            </View>
            <View style={styles.trackContainer}>
              <Text style={styles.subheader}>current favorite track</Text>
              <Image
                style={styles.track}
                source={require("../assets/confirmed_song.png")}
              />
            </View>
          </ImageBackground>
        </View>
        {/* next button */}
        <View style={styles.buttonContainer}>
          <Pressable onPress={handleConfirm}>
            <Image
              style={styles.button}
              source={require("../assets/arrow.png")}
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  backButton: {
    width: 25,
    height: 25,
    paddingLeft: 12,
    bottom: "5%",
  },
  profileCard: {
    width: "80%",
    height: "75%",
  },
  profileCardBg: {
    width: "100%",
    height: "100%",
  },
  userInfoContainer: {
    width: "100%",
    height: "27%",
    padding: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePic: {
    aspectRatio: 1,
    borderRadius: 100,
    height: "100%",
  },
  userInfoTextContainer: {
    height: "100%",
    width: "60%",
    padding: 13,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  nameText: {
    fontFamily: "Typo_Round_Bold_Demo",
    color: "white",
    fontSize: 32,
  },
  usernameText: {
    fontFamily: "DarkerGrotesque",
    color: "white",
    fontSize: 14,
  },
  musicInterestsContainer: {
    height: "33%",
    width: "100%",
    padding: 20,
  },
  subheader: {
    fontFamily: "Typo_Round_Bold_Demo",
    color: "white",
    fontSize: 20,
  },
  musicGenre: {
    flexBasis: "auto",
    height: 20,
    borderRadius: 20,
    marginHorizontal: "1%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingBottom: 2,
    marginVertical: 5,
    backgroundColor: "#DBD4ED",
  },
  musicText: {
    color: "#181A1F",
    fontFamily: "DarkerGrotesqueBold",
    fontSize: 13,
  },
  flatList: {
    marginTop: 10,
  },
  socialsContainer: {
    width: "100%",
    height: "20%",
    paddingHorizontal: 20,
    justifyContent: "space-evenly",
  },
  socials: {
    resizeMode: "contain",
    width: "45%",
  },
  socialsButtonContainer: {
    width: "100%",
    height: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trackContainer: {
    width: "100%",
    height: "20%",
    paddingHorizontal: 20,
    justifyContent: "space-evenly",
  },
  track: {
    resizeMode: "contain",
    width: "100%",
    bottom: "5%",
  },
  buttonContainer: {
    width: "100%",
    height: "10%",
    top: "7%",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: "10%",
  },
  button: {
    resizeMode: "contain",
    width: 80,
  },
});

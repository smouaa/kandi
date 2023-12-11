import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Stack, router, useFocusEffect } from "expo-router/";
import * as ImagePicker from "expo-image-picker";

export default function Register() {
  const [profilePic, setProfilePic] = useState(
    require("../assets/choose_profile_pic.png")
  );
  const [likedGenres, setLikedGenres] = useState([]);
  const [spotifyPressed, setSpotifyPressed] = useState(false);
  const [instagramPressed, setInstagramPressed] = useState(false);
  const [trackPressed, setTrackPressed] = useState(false);
  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  setStatusBarStyle("light");

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
        setProfilePic(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking an image: ", error);
    }
  };

  // keep track of liked genres
  const toggleGenre = (genre) => {
    if (likedGenres.includes(genre)) {
      // if genre is already pressed, remove it
      setLikedGenres(likedGenres.filter((g) => g !== genre));
    } else {
      // if genre is not pressed, add it
      setLikedGenres([...likedGenres, genre]);
    }
  };

  const isGenrePressed = (genre) => likedGenres.includes(genre);

  // re-render when genre is pressed
  useEffect(() => {}, [likedGenres]);

  // if socials buttons are pressed
  const handleSpotifyPress = () => {
    setSpotifyPressed(!spotifyPressed);
  };

  const handleInstagramPress = () => {
    setInstagramPressed(!instagramPressed);
  };

  const handleTrackPress = () => {
    setTrackPressed(!trackPressed);
  };

  const navigate = () => {
    if (
      likedGenres &&
      spotifyPressed &&
      instagramPressed &&
      name &&
      username &&
      email &&
      password
    ) {
      router.push({
        pathname: "confirm_profile",
        params: {
          likedGenres: likedGenres,
          name: name,
          username: username,
          email: email,
          password: password,
          imageUri: profilePic.uri,
          imageBase64: profilePic.base64,
        },
      });
    } else {
      alert("Please fill out all fields before continuing.");
      return;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <Stack.Screen
        options={{
          title: "create your profile",
          headerStyle: { backgroundColor: "#181A1F" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: "Typo_Round_Bold_Demo",
            fontSize: 30,
          },
          headerLeft: () => (
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Image
                source={require("../assets/back_button.png")}
                style={styles.backButton}
              />
            </Pressable>
          ),
        }}
      />
      {/* profile info */}
      <View style={styles.profileContainer}>
        {/* profile pic */}
        <View style={styles.profilePicContainer}>
          <Pressable onPress={handleImagePicker}>
            <Image source={profilePic} style={styles.profilePic} />
          </Pressable>
        </View>
        {/* name, username,  */}
        <View style={styles.userInfoContainer}>
          <TextInput
            placeholder="name"
            placeholderTextColor="#939393"
            autoCapitalize={"none"}
            style={styles.textInput}
            color="#939393"
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            placeholder="username"
            placeholderTextColor="#939393"
            autoCapitalize={"none"}
            style={styles.textInput}
            color="#939393"
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            placeholder="email"
            placeholderTextColor="#939393"
            autoCapitalize={"none"}
            style={styles.textInput}
            color="#939393"
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            placeholder="password"
            secureTextEntry={true}
            placeholderTextColor="#939393"
            autoCapitalize={"none"}
            style={styles.textInput}
            color="#939393"
            onChangeText={(text) => setPassword(text)}
          />
        </View>
      </View>
      {/* music */}
      <View style={styles.musicContainer}>
        <View style={styles.textRow}>
          <Text style={styles.subheaderText}>select your music interests</Text>
        </View>
        <View style={styles.row}>
          <Pressable
            style={[
              {
                backgroundColor: isGenrePressed("EDM") ? "#6C2FF1" : "#C8B7ED",
              },
              styles.musicGenre,
            ]}
            onPress={() => toggleGenre("EDM")}
          >
            <Text style={styles.musicText}>EDM</Text>
          </Pressable>
          <Pressable
            style={[
              {
                backgroundColor: isGenrePressed("Hip-Hop")
                  ? "#6C2FF1"
                  : "#C8B7ED",
              },
              styles.musicGenre,
            ]}
            onPress={() => toggleGenre("Hip-Hop")}
          >
            <Text style={styles.musicText}>Hip-Hop</Text>
          </Pressable>
          <Pressable
            style={[
              {
                backgroundColor: isGenrePressed("Pop") ? "#6C2FF1" : "#C8B7ED",
              },
              styles.musicGenre,
            ]}
            onPress={() => toggleGenre("Pop")}
          >
            <Text style={styles.musicText}>Pop</Text>
          </Pressable>
          <Pressable
            style={[
              {
                backgroundColor: isGenrePressed("R&B") ? "#6C2FF1" : "#C8B7ED",
              },
              styles.musicGenre,
            ]}
            onPress={() => toggleGenre("R&B")}
          >
            <Text style={styles.musicText}>R&B</Text>
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            style={[
              {
                backgroundColor: isGenrePressed("Indie")
                  ? "#6C2FF1"
                  : "#C8B7ED",
              },
              styles.musicGenre,
            ]}
            onPress={() => toggleGenre("Indie")}
          >
            <Text style={styles.musicText}>Indie</Text>
          </Pressable>
          <Pressable
            style={[
              {
                backgroundColor: isGenrePressed("Classical")
                  ? "#6C2FF1"
                  : "#C8B7ED",
              },
              styles.musicGenre,
            ]}
            onPress={() => toggleGenre("Classical")}
          >
            <Text style={styles.musicText}>Classical</Text>
          </Pressable>
          <Pressable
            style={[
              {
                backgroundColor: isGenrePressed("Folk") ? "#6C2FF1" : "#C8B7ED",
              },
              styles.musicGenre,
            ]}
            onPress={() => toggleGenre("Folk")}
          >
            <Text style={styles.musicText}>Folk</Text>
          </Pressable>
          <Pressable
            style={[
              {
                backgroundColor: isGenrePressed("Latin")
                  ? "#6C2FF1"
                  : "#C8B7ED",
              },
              styles.musicGenre,
            ]}
            onPress={() => toggleGenre("Latin")}
          >
            <Text style={styles.musicText}>Latin</Text>
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            style={[
              {
                backgroundColor: isGenrePressed("Metal")
                  ? "#6C2FF1"
                  : "#C8B7ED",
              },
              styles.musicGenre,
            ]}
            onPress={() => toggleGenre("Metal")}
          >
            <Text style={styles.musicText}>Metal</Text>
          </Pressable>
          <Pressable
            style={[
              {
                backgroundColor: isGenrePressed("Rap") ? "#6C2FF1" : "#C8B7ED",
              },
              styles.musicGenre,
            ]}
            onPress={() => toggleGenre("Rap")}
          >
            <Text style={styles.musicText}>Rap</Text>
          </Pressable>
          <Pressable
            style={[
              {
                backgroundColor: isGenrePressed("Rock") ? "#6C2FF1" : "#C8B7ED",
              },
              styles.musicGenre,
            ]}
            onPress={() => toggleGenre("Rock")}
          >
            <Text style={styles.musicText}>Rock</Text>
          </Pressable>
          <Pressable
            style={[
              {
                backgroundColor: isGenrePressed("K-Pop")
                  ? "#6C2FF1"
                  : "#C8B7ED",
              },
              styles.musicGenre,
            ]}
            onPress={() => toggleGenre("K-Pop")}
          >
            <Text style={styles.musicText}>K-Pop</Text>
          </Pressable>
        </View>
      </View>
      {/* socials */}
      <View style={styles.socialsContainer}>
        <View style={[{ marginTop: "2%" }, styles.textRow]}>
          <Text style={styles.subheaderText}>link your socials</Text>
        </View>
        <View style={styles.socialsButtonsContainer}>
          <Pressable onPress={handleSpotifyPress}>
            <Image
              style={styles.socialButton}
              source={
                spotifyPressed
                  ? require("../assets/selected_spotify.png")
                  : require("../assets/unselected_spotify.png")
              }
            />
          </Pressable>
          <Pressable onPress={handleInstagramPress}>
            <Image
              style={styles.socialButton}
              source={
                instagramPressed
                  ? require("../assets/selected_instagram.png")
                  : require("../assets/unselected_instagram.png")
              }
            />
          </Pressable>
        </View>
      </View>
      {/* current favorite track */}
      <View style={styles.trackContainer}>
        <View style={styles.textRow}>
          <Text style={styles.subheaderText}>
            add your current favorite track!
          </Text>
        </View>
        <Pressable onPress={handleTrackPress}>
          <Image
            style={styles.trackButton}
            source={
              trackPressed
                ? require("../assets/selected_track.png")
                : require("../assets/unselected_track.png")
            }
          />
        </Pressable>
      </View>
      {/* next button */}
      <View style={styles.nextContainer}>
        <Pressable onPress={navigate}>
          <Image
            style={styles.nextButton}
            source={require("../assets/arrow.png")}
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
    width: 25,
    height: 25,
    paddingLeft: 12,
    bottom: "5%",
  },
  profileContainer: {
    height: "30%",
    width: "100%",
    padding: "6%",
    flexDirection: "row",
  },
  musicContainer: {
    height: "30%",
    width: "100%",
  },
  socialsContainer: {
    height: "18%",
    width: "100%",
  },
  trackContainer: {
    height: "13%",
    width: "100%",
  },
  nextContainer: {
    height: "9%",
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginTop: "5%",
  },
  profilePicContainer: {
    height: "100%",
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  profilePic: {
    height: "90%",
    marginTop: "5%",
    aspectRatio: 1,
    borderRadius: 100,
  },
  userInfoContainer: {
    height: "100%",
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    width: "90%",
    height: "20%",
    backgroundColor: "#26272C",
    borderRadius: 50,
    fontSize: 20,
    paddingBottom: 5,
    paddingHorizontal: 15,
    fontFamily: "DarkerGrotesque",
    margin: 5,
    alignSelf: "flex-end",
  },
  subheaderText: {
    color: "white",
    fontFamily: "Typo_Round_Bold_Demo",
    fontSize: 20,
    alignSelf: "flex-start",
  },
  textRow: {
    width: "100%",
    height: "25%",
    paddingHorizontal: "6%",
    justifyContent: "center",
  },
  row: {
    width: "100%",
    height: "25%",
    paddingHorizontal: "3%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  musicGenre: {
    flexBasis: "auto",
    height: "70%",
    borderRadius: 20,
    marginHorizontal: "1.5%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingBottom: 2,
  },
  musicText: {
    color: "#181A1F",
    fontFamily: "DarkerGrotesqueBold",
    fontSize: 20,
  },
  socialsButtonsContainer: {
    width: "100%",
    height: "60%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  socialButton: {
    resizeMode: "contain",
    height: "80%",
    width: 170,
  },
  trackButton: {
    height: "65%",
    width: "90%",
    marginTop: "4%",
    alignSelf: "center",
  },
  nextButton: {
    resizeMode: "contain",
    height: "90%",
  },
});

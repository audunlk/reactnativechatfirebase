import React, { useEffect } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";


export default function Home( {navigation}) {



  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
          <FontAwesome name="search" size={24} color="black" />
      ),
      headerRight: () => (
          <Entypo name="dots-three-vertical" size={24} color="black" />
      ),
    });
  }, [navigation]);




  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Chat")} style={styles.chatButton}>
        <Text style={styles.chatButtonText}>Chat</Text>
      </TouchableOpacity>
      </View>
    
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  chatButton: {
    width: "100%",
    height: 40,
    backgroundColor: "#333",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  chatButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

  

import React, { useEffect, useState, useLayoutEffect } from "react";
import { TouchableOpacity, Text } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { database, auth } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import ReactTimeAgo from "react-time-ago";

export default function Chat({navigation}) {
  const [messages, setMessages] = useState([]);
  



  const onSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate('Login');
      })
      .catch((error) => {
        alert(error.message);
        console.log(error);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onSignOut}>
          <AntDesign name="logout" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const q = query(
          collection(database, "messages"), 
          orderBy("createdAt", "desc")
          );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();
          const data = {
            _id: firebaseData._id,
            createdAt: firebaseData.createdAt.toDate(),
            text: firebaseData.text,
            user: firebaseData.user,
          };

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.email,
            };
          }
          return data;
        })
      );
    });
    return () => unsubscribe();
  }, []);

  const onSend = async (newMessages = []) => {
    setMessages(GiftedChat.append(messages, newMessages));
    const { _id, createdAt, user, text } = newMessages[0];
    await addDoc(collection(database, "messages"), {
      _id,
      text,
      createdAt,
      user,
    });
  };
  

   
    


  return (
    <GiftedChat 
      messages={messages}
      onSend={(newMessages) => onSend(newMessages)}
      user={{
        _id: auth?.currentUser?.uid,
        name: auth?.currentUser?.email,
          }}
    />
  )
}

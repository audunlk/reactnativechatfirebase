import { StatusBar } from "expo-status-bar";
import React, { createContext, useState, useContext, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./config/firebase";
import firebase from 'firebase/compat/app';

import Chat from "./components/Chat";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";

const Stack = createStackNavigator();

type AuthenticatedUserContextType = {
  authenticatedUser: User | null;
  setAuthenticatedUser: React.Dispatch<React.SetStateAction<User | null>>;
}
const AuthenticatedUserContext = createContext<AuthenticatedUserContextType>({} as AuthenticatedUserContextType);




function AuthenticatedUserProvider({ children }) {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  return (
    <AuthenticatedUserContext.Provider value={{ authenticatedUser, setAuthenticatedUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
  
}


function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chat" component={Chat} /> 
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { authenticatedUser, setAuthenticatedUser}= useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,
      async authenticatedUser => {
        try {
          authenticatedUser ? setAuthenticatedUser(authenticatedUser) : setAuthenticatedUser(null);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    );
    return () => unsubscribe();
  }, [authenticatedUser]);

  if (loading) {
    return(
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {authenticatedUser ? <ChatStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {

  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
      </AuthenticatedUserProvider>
      );
    }

const styles = StyleSheet.create({
  
});

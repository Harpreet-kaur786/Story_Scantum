import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BookListScreen from "./components/BookListScreen";
import BookDetailsScreen from "./components/BookDetailsScreen";
import BorrowedBooksScreen from "./components/BorrowedBooksScreen";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, Image, Text } from "react-native";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// const BookStack = () => (
//   <Stack.Navigator>
//     <Stack.Screen name="Book List" component={BookListScreen} />
//     <Stack.Screen name="Book Details" component={BookDetailsScreen} />
//   </Stack.Navigator>
// );
const BookStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Book List"
      component={BookListScreen}
      options={{
        headerTitle: () => (
          <View style={styles.header}>
            <Image source={require("./assets/THE-2.png")} style={styles.logo} />
            <Text style={styles.appName}>Story Scantum</Text>
          </View>
        ),
        headerStyle: { backgroundColor: "#fff" },
      }}
    />
    <Stack.Screen name="Book Details" component={BookDetailsScreen} />
  </Stack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Books"
          component={BookStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Borrowed"
          component={BorrowedBooksScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="library-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  appName: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
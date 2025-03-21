import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BookListScreen from "./components/BookListScreen";
import BookDetailsScreen from "./components/BookDetailsScreen";
import BorrowedBooksScreen from "./components/BorrowedBooksScreen";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const { width } = Dimensions.get("window");

const BookStack = ({ navigation }) => {
  const slideAnim = useRef(new Animated.Value(width)).current; 
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: width * 0.4, 
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setMenuVisible(false));
  };

  const navigateToScreen = (screenName) => {
    closeMenu(); 
    navigation.navigate(screenName);
  };

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="Book List"
          component={BookListScreen}
          options={{
            headerTitle: () => (
              <View style={styles.header}>
                <Image source={require("./assets/THE-2.png")} style={styles.logo} />
                <Text style={styles.appName}>Story Scantum</Text>
                <TouchableOpacity onPress={openMenu}>
                  <Ionicons name="menu" size={28} color="white" />
                </TouchableOpacity>
              </View>
            ),
            headerStyle: { backgroundColor: "#121212" },
          }}
        />
        <Stack.Screen name="Book Details" component={BookDetailsScreen} />
        <Stack.Screen name="Borrowed Books" component={BorrowedBooksScreen} />
      </Stack.Navigator>

      {/* Slide-in Menu */}
      {menuVisible && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeMenu}>
          <Animated.View style={[styles.menu, { right: slideAnim }]}>
            <TouchableOpacity onPress={closeMenu}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen("Books")}>
              <Ionicons name="book-outline" size={24} color="white" />
              <Text style={styles.menuText}>Books</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen("Borrowed")}>
              <Ionicons name="library-outline" size={24} color="white" />
              <Text style={styles.menuText}>Borrowed</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      )}
    </>
  );
};

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
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 15,
  },
  logo: {
    width: 35,
    height: 35,
  },
  appName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)", 
  },
  menu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: width * 0.6,
    backgroundColor: "#222",
    padding: 20,
    alignItems: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  menuText: {
    fontSize: 18,
    color: "#fff",
    marginLeft: 10,
  },
});

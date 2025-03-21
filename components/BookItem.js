import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const BookItem = ({ book, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.container}>
    <Image source={{ uri: book.coverImage }} style={styles.image} />
    <View>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>{book.author}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flexDirection: "row", padding: 10, borderBottomWidth: 1 },
  image: { width: 50, height: 75, marginRight: 10 },
  title: { fontWeight: "bold" },
  author: { color: "gray" }
});

export default BookItem;

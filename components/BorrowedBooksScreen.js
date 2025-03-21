import React, { useEffect, useState } from "react";
import { View, FlatList, Alert, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Image } from "react-native";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import BookItem from "../components/BookItem";
const BorrowedBooksScreen = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "borrowedBooks"), (snapshot) => {
      const books = snapshot.docs.map((doc) => ({
        firestoreId: doc.id,
        ...doc.data(),
      }));
      setBorrowedBooks(books);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const returnBook = async (book) => {
    try {
      if (!book.firestoreId) {
        Alert.alert("Error", "Invalid book ID.");
        return;
      }
      await deleteDoc(doc(db, "borrowedBooks", book.firestoreId));
      Alert.alert("Success", "Book returned successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to return the book.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

   return (
    <View style={styles.container}>
      <Text style={styles.title}>Borrowed Books</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : borrowedBooks.length === 0 ? (
        <Text style={styles.noBooks}>No books borrowed.</Text>
      ) : (
        <FlatList
        data={borrowedBooks}
        keyExtractor={(item) => item.firestoreId}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.coverImage }} style={styles.bookCover} />
            <View style={styles.textContainer}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookAuthor}>{item.author}</Text>
              <TouchableOpacity style={styles.returnButton} onPress={() => returnBook(item)}>
                <Text style={styles.buttonText}>Return</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 20,
    marginTop: 50
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#444",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  bookCover: {
    width: 100,
    height: 150,
    borderRadius: 5,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 10,
  },
  returnButton: {
    backgroundColor: "#E63946",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  noBooks: {
    fontSize: 16,
    color: "#bbb",
    textAlign: "center",
    marginTop: 20,
  },
  
});

export default BorrowedBooksScreen;

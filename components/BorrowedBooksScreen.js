import React, { useEffect, useState } from "react";
import { View, FlatList, Alert, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
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
      const bookDocRef = doc(db, "borrowedBooks", book.firestoreId);
      await deleteDoc(bookDocRef);
      setBorrowedBooks((prevBooks) => prevBooks.filter((b) => b.firestoreId !== book.firestoreId));
      Alert.alert("Success", "Book returned successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to return book. Please try again.");
    }
  };

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
            <View style={styles.bookItem}>
              <BookItem book={item} />
              <TouchableOpacity style={styles.returnButton} onPress={() => returnBook(item)}>
                <Text style={styles.buttonText}>Return</Text>
              </TouchableOpacity>
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
    padding: 20,
    backgroundColor: "#F8F9FA",
    marginTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  noBooks: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginTop: 20,
  },
  bookItem: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  returnButton: {
    backgroundColor: "#DC3545",
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default BorrowedBooksScreen;

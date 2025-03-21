
// import React from "react";
// import { View, Text, Image, Button, Alert } from "react-native";
// import { collection, addDoc, getDocs } from "firebase/firestore";
// import { db } from "../firebaseConfig";

// const BookDetailsScreen = ({ route }) => {
//   const { book } = route.params;
//   const borrowedBooksRef = collection(db, "borrowedBooks");

//   const borrowBook = async () => {
//     try {
//       // ✅ Fetch current borrowed books
//       const querySnapshot = await getDocs(borrowedBooksRef);
//       const borrowedBooks = querySnapshot.docs.map((doc) => doc.data());

//       // ✅ Check if the book is already borrowed
//       const isAlreadyBorrowed = borrowedBooks.some((b) => b?.title === book.title);
//       if (isAlreadyBorrowed) {
//         Alert.alert("Already Borrowed", "You have already borrowed this book.");
//         return;
//       }

//       // ✅ Limit borrowing to 3 books
//       if (borrowedBooks.length >= 3) {
//         Alert.alert("Limit Reached", "You cannot borrow more than 3 books at a time.");
//         return;
//       }

//       // ✅ Borrow the book
//       await addDoc(borrowedBooksRef, book);
//       Alert.alert("Success", "Book borrowed successfully!");
//     } catch (error) {
//       console.error("Error borrowing book:", error);
//       Alert.alert("Error", "Failed to borrow the book.");
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Image source={{ uri: book.coverImage }} style={{ width: 200, height: 300 }} />
//       <Text style={{ fontSize: 18, fontWeight: "bold" }}>{book.title}</Text>
//       <Text>{book.author}</Text>
//       <Text>{book.description}</Text>
//       <Button title="Borrow Book" onPress={borrowBook} />
//     </View>
//   );
// };

// export default BookDetailsScreen;


import React, { useEffect, useState } from "react";
import { View, Text, Image, Button, Alert, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { collection, addDoc, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes?q=intitle:";

const BookDetailsScreen = ({ route }) => {
  const { book } = route.params;
  const borrowedBooksRef = collection(db, "borrowedBooks");
  const bookDocRef = doc(db, "books", book.id);
  const [preview, setPreview] = useState(book.preview || "Fetching preview...");
  const [loading, setLoading] = useState(!book.preview);
  const [description, setDescription] = useState("Fetching description...");
  const [rating, setRating] = useState("Fetching rating...");
  const [ratingsCount, setRatingsCount] = useState(0);
  
  const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes?q=intitle:";

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        // Fetch book details from Firebase
        const docSnap = await getDoc(bookDocRef);
        let firebaseData = docSnap.exists() ? docSnap.data() : {};
  
        setDescription(firebaseData.description || "No description available.");
  
        // Keep the existing preview functionality
        if (!book.preview) {
          setPreview("Fetching preview...");
          const response = await fetch(GOOGLE_BOOKS_API_URL + encodeURIComponent(book.title));
          const json = await response.json();
          const bookPreview = json.items?.[0]?.volumeInfo?.description || "No preview available.";
          setPreview(bookPreview);
          await updateDoc(bookDocRef, { preview: bookPreview });
        } else {
          setPreview(book.preview);
        }
  
        // Fetch book rating if not in Firebase
        if (!firebaseData.averageRating) {
          const response = await fetch(
            `${GOOGLE_BOOKS_API_URL}${encodeURIComponent(book.title)}&key=AIzaSyD9ne-B6O2T_Hc2Gv38f0SwS_nXY-qBGeo`
          );
          const json = await response.json();
  
          if (json.items && json.items.length > 0) {
            const bookData = json.items[0].volumeInfo;
            const bookRating = bookData.averageRating || "No rating available";
            const ratingsCount = bookData.ratingsCount || 0;
  
            // Update Firebase with the new rating
            await updateDoc(bookDocRef, {
              averageRating: bookRating,
              ratingsCount: ratingsCount,
            });
  
            setRating(bookRating);
            setRatingsCount(ratingsCount);
          }
        } else {
          setRating(firebaseData.averageRating);
          setRatingsCount(firebaseData.ratingsCount);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookDetails();
  }, [book.id, book.title, book.preview]);


  const borrowBook = async () => {
    try {
      const querySnapshot = await getDocs(borrowedBooksRef);
      const borrowedBooks = querySnapshot.docs.map((doc) => doc.data());

      if (borrowedBooks.some((b) => b?.title === book.title)) {
        Alert.alert("Already Borrowed", "You have already borrowed this book.");
        return;
      }

      if (borrowedBooks.length >= 3) {
        Alert.alert("Limit Reached", "You cannot borrow more than 3 books at a time.");
        return;
      }

      await addDoc(borrowedBooksRef, book);
      Alert.alert("Success", "Book borrowed successfully!");
    } catch (error) {
      console.error("Error borrowing book:", error);
      Alert.alert("Error", "Failed to borrow the book.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: book.coverImage }} style={styles.bookImage} />
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>{book.author}</Text>
      
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{description}</Text>

      <Text style={styles.sectionTitle}>Preview</Text>
      {loading ? <ActivityIndicator size="small" color="#0000ff" /> : <Text style={styles.preview}>{preview}</Text>}
      <Text style={styles.sectionTitle}>Rating</Text>
<Text style={styles.rating}>
  ⭐ {rating} ({ratingsCount} reviews)
</Text>


      <Button title="Borrow Book" onPress={borrowBook} color="#6200EE" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  bookImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  author: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "justify",
  },
  rating: { fontSize: 16, marginBottom: 10 },
  preview: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "justify",
    marginBottom: 20,
  },
});

export default BookDetailsScreen;

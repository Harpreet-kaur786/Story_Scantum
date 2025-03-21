import React, { useEffect, useState } from "react";
import { View,Text,Image, Alert,ActivityIndicator,ScrollView,StyleSheet,TouchableOpacity,KeyboardAvoidingView,Platform,} from "react-native";
import { collection, addDoc, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

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
        const docSnap = await getDoc(bookDocRef);
        let firebaseData = docSnap.exists() ? docSnap.data() : {};
        setDescription(firebaseData.description || "No description available.");

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

        if (!firebaseData.averageRating) {
          const response = await fetch(
            `${GOOGLE_BOOKS_API_URL}${encodeURIComponent(book.title)}&key=AIzaSyD9ne-B6O2T_Hc2Gv38f0SwS_nXY-qBGeo`
          );
          const json = await response.json();

          if (json.items && json.items.length > 0) {
            const bookData = json.items[0].volumeInfo;
            const bookRating = bookData.averageRating || "No rating available";
            const ratingsCount = bookData.ratingsCount || 0;

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={{ uri: book.coverImage }} style={styles.bookImage} />

        <View style={styles.card}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>by {book.author}</Text>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{description}</Text>

          <Text style={styles.sectionTitle}>Preview</Text>
          {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.preview}>{preview}</Text>}

          <Text style={styles.sectionTitle}>Rating</Text>
          <Text style={styles.rating}>⭐ {rating} ({ratingsCount} reviews)</Text>
          
          <TouchableOpacity style={styles.borrowButton} onPress={borrowBook}>
            <Text style={styles.borrowButtonText}>Borrow Book</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
  },
  bookImage: {
    width: "50%",
    height: 300,
    resizeMode: "cover",
    borderRadius: 12,
    marginBottom: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#2A2A2A",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  author: {
    fontSize: 16,
    color: "#BBB",
    textAlign: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FF6B6B",
    marginTop: 15,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#DDD",
    textAlign: "justify",
    lineHeight: 22,
  },
  preview: {
    fontSize: 15,
    color: "#DDD",
    textAlign: "justify",
    fontWeight: 500,
    lineHeight: 22,
  },
  rating: {
    fontSize: 16,
    color: "#FFD700",
  },
  borrowButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  borrowButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
});

export default BookDetailsScreen;

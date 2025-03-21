import React, { useEffect, useState } from "react";
import { 
  View, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity, Text, Image, ScrollView 
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const BookListScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      const querySnapshot = await getDocs(collection(db, "books"));
      const booksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

   
      const popularBooks = booksData.filter(book => book.popular === true);

      setBooks(booksData);
      setFilteredBooks(booksData);
      setPopularBooks(popularBooks); 
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const filterBooks = (query, genre) => {
    let filtered = books;
    if (query) {
      filtered = filtered.filter(book => book.title.toLowerCase().includes(query.toLowerCase()));
    }
    if (genre) {
      filtered = filtered.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
    }
    setFilteredBooks(filtered);
  };

  if (loading) return <ActivityIndicator size="large" style={styles.loading} />;

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Search books..."
        placeholderTextColor="#aaa"
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          filterBooks(text, selectedGenre);
        }}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.genreContainer}>
        {["All", "Horror", "Fiction", "Romance", "Comedy", "Fantasy", "Mystery/Thriller"].map((genre) => (
          <TouchableOpacity
            key={genre}
            style={[styles.genreButton, selectedGenre === genre.toLowerCase() && styles.selectedGenre]}
            onPress={() => {
              setSelectedGenre(genre.toLowerCase() === "all" ? "" : genre.toLowerCase());
              filterBooks(searchQuery, genre.toLowerCase() === "all" ? "" : genre.toLowerCase());
            }}
          >
            <Text style={styles.genreText}>{genre}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <Text style={styles.sectionTitle}>🔥 Popular Books</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularBooksContainer}>
        {popularBooks.map((book) => ( // ✅ Renders only popular books
          <TouchableOpacity
            key={book.id}
            style={styles.popularBookItem}
            onPress={() => navigation.navigate("Book Details", { book })}
          >
            <Image source={{ uri: book.coverImage || "https://via.placeholder.com/150" }} style={styles.popularBookImage} />
            <Text style={styles.popularBookTitle}>{book.title}</Text>
            <Text style={styles.popularBookAuthor}>{book.author}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {filteredBooks.length > 0 && <Text style={styles.sectionTitle}>📚 All Books</Text>}
      <View style={styles.gridContainer}>
        {filteredBooks.map((book) => (
          <TouchableOpacity
            key={book.id}
            style={styles.bookItem}
            onPress={() => navigation.navigate("Book Details", { book })}
          >
            <Image source={{ uri: book.coverImage || "https://via.placeholder.com/150" }} style={styles.bookImage} />
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>{book.author}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: 
  { flex: 1,
   backgroundColor: "#121212"
  },
  searchBar: 
  { height: 45,
   backgroundColor: "#252525",
   borderRadius: 10,
   paddingHorizontal: 15,
   fontSize: 16, 
   marginHorizontal: 15,
   marginTop: 10, 
   color: "#fff" },
  genreContainer: {
   paddingVertical: 10, 
   paddingLeft: 15
   },
  genreButton: { 
  paddingVertical: 8, 
  paddingHorizontal: 15, 
  backgroundColor: "#333", 
  borderRadius: 20, 
  marginRight: 10
 },
  selectedGenre: { 
  backgroundColor: "#E63946" 
},
  genreText: {
   fontWeight: "bold", 
   color: "#fff" 
  },
  sectionTitle: { 
  fontSize: 22, 
  fontWeight: "bold", 
  marginLeft: 15, 
  marginTop: 15, color: "#E63946" 
 },
  popularBooksContainer: { 
  flexDirection: "row", 
  paddingHorizontal: 15, 
  marginBottom: 15 ,
  marginTop: 10
},
  popularBookItem: { 
  marginRight: 15, 
  alignItems: "center" 
},
  popularBookImage: {
   width: 110, 
   height: 160, 
   resizeMode: "cover", 
   borderRadius: 5 
  },
  popularBookTitle: {
   marginTop: 5, 
   fontWeight: "bold", 
   fontSize: 14, 
   textAlign: "center", 
   color: "#fff" 
  },
  popularBookAuthor: { 
  fontSize: 12,
  color: "#BBB", 
  textAlign: "center" 
},
  gridContainer: { 
  flexDirection: "row", 
  flexWrap: "wrap", 
  justifyContent: "space-between", 
  padding: 15
 },
  bookItem: { 
  width: "48%", 
  marginBottom: 15, 
  backgroundColor: "#252525",
  borderRadius: 10, 
  padding: 10, 
  alignItems: "center", 
  elevation: 2 
},
  bookImage: {
  width: 130, 
  height: 180, 
  resizeMode: "cover", 
  borderRadius: 5 
},
  bookTitle: { 
  marginTop: 5, 
  fontWeight: "bold", 
  textAlign: "center", 
  color: "#fff" 
},
  bookAuthor: { 
  color: "#BBB", 
  fontSize: 12, 
  textAlign: "center"
 },
});

export default BookListScreen;

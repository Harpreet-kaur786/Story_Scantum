

// import React, { useEffect, useState } from "react";
// import { View, FlatList, TextInput, ActivityIndicator, StyleSheet, Button } from "react-native";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebaseConfig";
// import BookItem from "../components/BookItem";

// const BookListScreen = ({ navigation }) => {
//   const [books, setBooks] = useState([]);
//   const [filteredBooks, setFilteredBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedGenre, setSelectedGenre] = useState("");

//   useEffect(() => {
//     const fetchBooks = async () => {
//       const querySnapshot = await getDocs(collection(db, "books"));
//       const booksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setBooks(booksData);
//       setFilteredBooks(booksData);
//       setLoading(false);
//     };
//     fetchBooks();
//   }, []);

//   // Handle genre filter
//   const handleGenreFilter = (genre) => {
//     setSelectedGenre(genre);
//     filterBooks(searchQuery, genre);
//   };

//   // Handle search functionality
//   const handleSearch = (text) => {
//     setSearchQuery(text);
//     filterBooks(text, selectedGenre);
//   };

//   // Filter books by search query and selected genre
//   const filterBooks = (searchQuery, genre) => {
//     let filtered = books;

//     // Apply search filter by title
//     if (searchQuery) {
//       filtered = filtered.filter((book) =>
//         book.title.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Apply genre filter
//     if (genre) {
//       filtered = filtered.filter((book) =>
//         book.genre.toLowerCase() === genre.toLowerCase()
//       );
//     }

//     setFilteredBooks(filtered);
//   };

//   if (loading) return <ActivityIndicator size="large" />;

//   return (
//     <View style={styles.container}>
//       {/* Search Bar */}
//       <TextInput
//         style={styles.searchBar}
//         placeholder="Search by title..."
//         value={searchQuery}
//         onChangeText={handleSearch}
//       />

//       {/* Filter Buttons */}
//       <View style={styles.filterContainer}>
//         <Button title="All" onPress={() => handleGenreFilter("")} />
//         <Button title="Horror" onPress={() => handleGenreFilter("horror")} />
//         <Button title="Fiction" onPress={() => handleGenreFilter("fiction")} />
//       </View>

//       {/* Book List */}
//       <FlatList
//         data={filteredBooks}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <BookItem
//             book={item}
//             onPress={() => navigation.navigate("Book Details", { book: item })}
//           />
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, paddingTop: 10 },
//   searchBar: {
//     height: 40,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     margin: 10,
//     paddingLeft: 10,
//     borderRadius: 5,
//   },
//   filterContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginBottom: 10,
//   },
// });

// export default BookListScreen;


import React, { useEffect, useState } from "react";
import { 
  View, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity, Text, Image, ScrollView 
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import BookItem from "../components/BookItem";

const BookListScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [popularBooks, setPopularBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const querySnapshot = await getDocs(collection(db, "books"));
      const booksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Separate popular books
    const popularBooks = booksData.filter(book => book.popular === true);


      setBooks(booksData);
      setFilteredBooks(booksData);
      setPopularBooks(popularBooks);
      setLoading(false);
    };
    fetchBooks();
  }, []);

  // Filter books
  const filterBooks = (query, genre) => {
    let filtered = books;
    if (query) {
      filtered = filtered.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (genre) {
      filtered = filtered.filter((book) =>
        book.genre.toLowerCase() === genre.toLowerCase()
      );
    }
    setFilteredBooks(filtered);
  };

  if (loading) return <ActivityIndicator size="large" style={styles.loading} />;

 
    return (
      <View style={styles.container}>
        {/* Search Bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="🔍 Search books..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            filterBooks(text, selectedGenre);
          }}
        />

        {/* Genre Filters */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal contentContainerStyle = "true">
          {["All", "Horror", "Fiction","Romance", "Comedy","Fantasy","Mystery/Thriller"].map((genre) => (
            <TouchableOpacity
              key={genre}
              style={[
                styles.genreButton,
                selectedGenre === genre.toLowerCase() && styles.selectedGenre,
              ]}
              onPress={() => {
                setSelectedGenre(
                  genre.toLowerCase() === "all" ? "" : genre.toLowerCase()
                );
                filterBooks(
                  searchQuery,
                  genre.toLowerCase() === "all" ? "" : genre.toLowerCase()
                );
              }}
            >
              <Text style={styles.genreText}>{genre}</Text>
            </TouchableOpacity>
          ))}
          </ScrollView>
        </View>
    


        {/* Popular Books Section */}
        {popularBooks.length > 0 && (
      <>
        <Text style={styles.sectionTitle}>🔥 Popular Books</Text>
        <ScrollView horizontal contentContainerStyle={styles.popularContainer}>
          {popularBooks.map((book) => (
            <TouchableOpacity 
              key={book.id} 
              style={styles.popularBookItem} 
              onPress={() => navigation.navigate("Book Details", { book })}
            >
              <Image source={{ uri: book.coverImage }} style={styles.popularBookImage} />
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.authorName}>{book.author}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>
    )}
        {/* Book Grid List */}
        <ScrollView contentContainerStyle={styles.gridContainer}>
          {filteredBooks.map((book) => (
            <TouchableOpacity
              key={book.id}
              style={styles.bookItem}
              onPress={() => navigation.navigate("Book Details", { book })}
            >
              <Image
                source={{
                  uri: book.coverImage || "https://via.placeholder.com/150",
                }}
                style={styles.bookImage}
              />
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookAuthor}>{book.author}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
    
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f8f9fa",
  },
  searchBar: {
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    elevation: 3,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  genreButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
  },
  selectedGenre: {
    backgroundColor: "#007bff",
  },
  genreText: {
    fontWeight: "bold",
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  popularContainer: {
    flexDirection: "row",
    paddingBottom: 10,
    height: 200,
    border: 20,
    marginBottom: 50,
    backgroundColor: "pink",
    borderRadius: 10,
    padding: 10,
  },
  popularBookItem: {
    marginRight: 15,
    alignItems: "center",
  },
  popularBookImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 5,
    marginLeft: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  bookItem: {
    width: "48%", 
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    elevation: 2,
  },
  bookImage: {
    width: 130, // Increased size
    height: 190, // Increased size
    resizeMode: "cover",
    borderRadius: 5,
  },
  bookTitle: {
    marginTop: 5,
    fontWeight: "bold",
    textAlign: "center",
  },
  bookAuthor: {
    color: "#555",
    fontSize: 12,
    textAlign: "center",
  },
});


export default BookListScreen;

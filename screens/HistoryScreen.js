import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons'; // for the search icon

const PostLigne = () => {
  const [names, setNames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNames();
  }, []);

  const fetchNames = async () => {
    try {
      const response = await fetch('https://andonapi.c2i.tn/test-data');
      if (!response.ok) {
        throw new Error('Failed to fetch names');
      }
      const data = await response.json();
      setNames(data);
    } catch (error) {
      console.error('Error fetching names:', error);
    }
  };

  const updatePost = async (name, newPostValue) => {
    try {
      if (!name) {
        throw new Error('ID is undefined');
      }
      const response = await fetch(`https://andonapi.c2i.tn/update-post/${name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post: newPostValue }),
      });
      if (!response.ok) {
        throw new Error('Failed to update post value');
      }
      fetchNames();
    } catch (error) {
      console.error('Error updating post value:', error);
    }
  };

  const filteredNames = names.filter(name =>
    name.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}><Text style={styles.boldText}>Name:</Text> {item.name}</Text>
      <Text style={styles.cardText}><Text style={styles.boldText}>Shift:</Text></Text>
      <Picker
        selectedValue={item.post}
        style={styles.picker}
        onValueChange={(value) => updatePost(item.name, value)}
      >
        <Picker.Item label="A" value="A" />
        <Picker.Item label="B" value="B" />
        <Picker.Item label="C" value="C" />
      </Picker>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <Ionicons name="search" size={24} color="gray" style={styles.searchIcon} />
        </View>
      </View>

      <FlatList
        data={filteredNames}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default PostLigne;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
  },
  searchIcon: {
    padding: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

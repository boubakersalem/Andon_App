import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // for the search icon

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://andonapi.c2i.tn/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <Ionicons name="search" size={24} color="gray" style={styles.searchIcon} />
        </View>
      </View>

      <View style={styles.cardsContainer}>
        {filteredUsers.map((user) => (
          <View key={user.id} style={styles.card}>
            <Text style={styles.cardText}><Text style={styles.boldText}>Name:</Text> {user.Name}</Text>
            <Text style={styles.cardText}><Text style={styles.boldText}>Type:</Text> {user.type}</Text>
            <Text style={styles.cardText}><Text style={styles.boldText}>Genre:</Text> {user.genre}</Text>
            <Text style={styles.cardText}><Text style={styles.boldText}>Level:</Text> {user.level}</Text>
            <Text style={styles.cardText}><Text style={styles.boldText}>Post:</Text> {user.post}</Text>
            <Text style={styles.cardText}><Text style={styles.boldText}>Phone:</Text> {user.tlp}</Text>
            <Text style={styles.cardText}><Text style={styles.boldText}>Date:</Text> {user.date}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Users;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f7f7f7',
  },
  header: {
    marginBottom: 20,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  searchIcon: {
    paddingLeft: 10,
  },
  cardsContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
});

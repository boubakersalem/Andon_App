import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // for the search icon

const Users = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [editUserData, setEditUserData] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
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

  const handleDeleteUser = async (id) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await fetch(`https://andonapi.c2i.tn/users/${id}`, {
                method: 'DELETE',
              });
              if (!response.ok) {
                throw new Error('Failed to delete user');
              }
              fetchUsers();
            } catch (error) {
              console.error('Error deleting user:', error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const handleUpdateUser = (user) => {
    setEditUserData(user);
    setShowEditForm(true);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
  };

  const handleEditFormSubmit = async () => {
    Alert.alert(
      'Confirm Update',
      'Are you sure you want to update this user?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Update',
          onPress: async () => {
            try {
              const response = await fetch(`https://andonapi.c2i.tn/users/${editUserData.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(editUserData),
              });
              if (!response.ok) {
                throw new Error('Failed to update user');
              }
              setShowEditForm(false);
              fetchUsers();
            } catch (error) {
              console.error('Error updating user:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const filteredUsers = users.filter(user =>
    user.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
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
            <View style={styles.cardButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleUpdateUser(user)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteUser(user.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {showEditForm && (
        <View style={styles.editFormOverlay}>
          <View style={styles.editForm}>
            <Text style={styles.formTitle}>Edit User</Text>
            <ScrollView>
              <View style={styles.inputContainer}>
                <Text>Name & LastName:</Text>
                <TextInput
                  style={styles.input}
                  value={editUserData.Name}
                  onChangeText={(text) =>
                    setEditUserData({ ...editUserData, Name: text })
                  }
                />
              </View>
              <View style={styles.inputContainer}>
                <Text>Type Of Problem:</Text>
                <TextInput
                  style={styles.input}
                  value={editUserData.type}
                  onChangeText={(text) =>
                    setEditUserData({ ...editUserData, type: text })
                  }
                />
              </View>
              <View style={styles.inputContainer}>
                <Text>Ligne Type:</Text>
                <TextInput
                  style={styles.input}
                  value={editUserData.genre}
                  onChangeText={(text) =>
                    setEditUserData({ ...editUserData, genre: text })
                  }
                />
              </View>
              <View style={styles.inputContainer}>
                <Text>Gradar:</Text>
                <TextInput
                  style={styles.input}
                  value={editUserData.level}
                  onChangeText={(text) =>
                    setEditUserData({ ...editUserData, level: text })
                  }
                />
              </View>
              <View style={styles.inputContainer}>
                <Text>Post:</Text>
                <TextInput
                  style={styles.input}
                  value={editUserData.post}
                  onChangeText={(text) =>
                    setEditUserData({ ...editUserData, post: text })
                  }
                />
              </View>
              <View style={styles.inputContainer}>
                <Text>Phone:</Text>
                <TextInput
                  style={styles.input}
                  value={editUserData.tlp}
                  onChangeText={(text) =>
                    setEditUserData({ ...editUserData, tlp: text })
                  }
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button title="Save" onPress={handleEditFormSubmit} />
                <Button title="Cancel" onPress={handleCloseEditForm} color="red" />
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Users;

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
  searchContainer: {
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
  },
  searchIcon: {
    padding: 10,
  },
  cardsContainer: {
    marginBottom: 20,
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
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: 'rgb(73, 182, 30)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'rgb(241, 53, 53)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  editFormOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editForm: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

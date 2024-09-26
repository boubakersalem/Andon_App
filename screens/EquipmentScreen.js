import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Picker } from '@react-native-picker/picker';

const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  Name: yup.string().required('Name is required'),
  type: yup.string().required('Type is required'),
  genre: yup.string().required('Genre is required'),
  level: yup.string().required('Level is required'),
  post: yup.string().required('Post is required'),
  tlp: yup.string().matches(phoneRegExp, 'Phone number is not valid').required('Phone is required'),
});

const initialValues = {
  Name: '',
  type: '',
  genre: '',
  level: '',
  post: 'A',
  tlp: '',
};

const EquipmentScreen = ({ navigation }) => {
  const handleSubmit = async (values, { resetForm }) => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to add this user?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const response = await fetch('https://andonapi.c2i.tn/users', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
              });
              if (!response.ok) {
                throw new Error('Failed to add user');
              }
              Alert.alert('Success', 'New user added');
              resetForm();
              navigation.navigate('BureauScreenStack', {
                screen: 'BureauScreen',
              });
            } catch (error) {
              console.error('Error adding user:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create New User</Text>
      <Formik
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Name & LastName"
                onBlur={handleBlur('Name')}
                onChangeText={handleChange('Name')}
                value={values.Name}
              />
              {touched.Name && errors.Name && <Text style={styles.errorText}>{errors.Name}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Picker
                selectedValue={values.type}
                onValueChange={(itemValue) => setFieldValue('type', itemValue)}
                onBlur={handleBlur('type')}
                style={styles.picker}
              >
                <Picker.Item label="Type Of Problem" value="" />
                <Picker.Item label="Qualité" value="Qualité" />
                <Picker.Item label="Prüftechnik" value="Prüftechnik" />
                <Picker.Item label="Logistique" value="Logistique" />
                <Picker.Item label="Maintenance" value="Maintenance" />
              </Picker>
              {touched.type && errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Picker
                selectedValue={values.genre}
                onValueChange={(itemValue) => setFieldValue('genre', itemValue)}
                onBlur={handleBlur('genre')}
                style={styles.picker}
              >
                <Picker.Item label="Ligne Type" value="" />
                <Picker.Item label="MR" value="MR" />
                <Picker.Item label="IR" value="IR" />
                <Picker.Item label="VIDEO" value="VIDEO" />
                <Picker.Item label="ARBEIT" value="ARBEIT" />
              </Picker>
              {touched.genre && errors.genre && <Text style={styles.errorText}>{errors.genre}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Picker
                selectedValue={values.level}
                onValueChange={(itemValue) => setFieldValue('level', itemValue)}
                onBlur={handleBlur('level')}
                style={styles.picker}
              >
                <Picker.Item label="Gradar" value="" />
                <Picker.Item label="Technician" value="Technician" />
                <Picker.Item label="Supervisor" value="Supervisor" />
                <Picker.Item label="Assistant Director" value="Assistant Director" />
                <Picker.Item label="Director" value="Director" />
              </Picker>
              {touched.level && errors.level && <Text style={styles.errorText}>{errors.level}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Picker
                selectedValue={values.post}
                onValueChange={(itemValue) => setFieldValue('post', itemValue)}
                onBlur={handleBlur('post')}
                style={styles.picker}
              >
                <Picker.Item label="Post" value="" />
                <Picker.Item label="A" value="A" />
                <Picker.Item label="B" value="B" />
                <Picker.Item label="C" value="C" />
              </Picker>
              {touched.post && errors.post && <Text style={styles.errorText}>{errors.post}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Phone"
                onBlur={handleBlur('tlp')}
                onChangeText={handleChange('tlp')}
                value={values.tlp}
              />
              {touched.tlp && errors.tlp && <Text style={styles.errorText}>{errors.tlp}</Text>}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Add New User</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default EquipmentScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#1e90ff',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

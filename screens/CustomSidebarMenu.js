import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, Image } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CustomSidebarMenu = (props) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserIdFromStorage = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('idAdmin');
        if (storedUserId !== null) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error getting user ID from AsyncStorage:', error);
      }
    };
    getUserIdFromStorage();
  }, []);


  return (
    <View style={stylesSidebar.sideMenuContainer}>
      <View style={stylesSidebar.profileHeader}>
        <View
          style={{
            height: 180,
            width: '100%',
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require('../assets/c2i.png')}
            style={{width: '40%', resizeMode: 'contain', margin: 30}}
          />
          <Text
            style={{
              fontSize: 20,
              marginVertical: 5,
              fontWeight: "bold",
              color: "#1679AB",
              borderBottomColor: "#0073b7",
              borderBottomWidth: 1,
           
            }}
          >
            Andon
          </Text>
        </View>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label={({color}) =>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons
                name="logout"
                size={24}
                color="#585858"
                style={{ marginRight: 10 }}
              />
              <Text style={{color: '#585858',fontWeight: 'bold', marginLeft: 25 }}>
                Log out
              </Text>
            </View>
          }
          onPress={() => {
            props.navigation.toggleDrawer();
            Alert.alert(
              'Log out',
              'Do you want to disconnect?',
              [
                {
                  text: 'Cancel',
                  onPress: () => {
                    return null;
                  },
                },
                {
                  text: 'Confirm',
                  onPress: () => {
                    AsyncStorage.clear();
                    props.navigation.replace('Auth');
                  },
                },
              ],
              {cancelable: false},
            );
          }}
        />
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomSidebarMenu;

const stylesSidebar = StyleSheet.create({
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    paddingTop: 40,
    color: 'white',
  },
  profileHeader: {
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 15,
    textAlign: 'center',
    alignItems: 'center',
  },
  profileHeaderPicCircle: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    color: 'white',
    backgroundColor: '#307ecc',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeaderText: {
    color: 'white',
    alignSelf: 'center',
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  profileHeaderLine: {
    height: 1,
    marginHorizontal: 20,
    backgroundColor: '#e2e2e2',
    marginTop: 15,
  },
});

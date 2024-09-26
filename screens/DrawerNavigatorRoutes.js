import React from 'react';

// Import Navigators from React Navigation
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import Screens
import HomeScreen from './HomeScreen';
import EquipmentScreen from './EquipmentScreen';
import BureauScreen from './BureauScreen';
import HistoryScreen from './HistoryScreen';
import CustomSidebarMenu from './CustomSidebarMenu';
import NavigationDrawerHeader from './NavigationDrawerHeader';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeScreenStack = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: 'Home', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#585858', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

const EquipmentScreenStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="EquipmentScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#585858', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="EquipmentScreen"
        component={EquipmentScreen}
        options={{
          title: 'Add Supervisor', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const BureauScreenStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="BureauScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#585858', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="BureauScreen"
        component={BureauScreen}
        options={{
          title: 'List Supervisor', 
        }}
      />
    </Stack.Navigator>
  );
};

const HistoryScreenStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="HistoryScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#585858', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{
          title: 'Shift Line', 
        }}
      />
    </Stack.Navigator>
  );
};

const DrawerNavigatorRoutes = (props) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#0073b7',
        drawerInactiveTintColor: '#000',
        drawerItemStyle: { marginVertical: 7 },
        drawerLabelStyle: { fontWeight: 'bold' },
      }}
      drawerContent={props => <CustomSidebarMenu {...props} />}>
      <Drawer.Screen
        name="HomeScreenStack"
        options={{
          title: 'Home',
          drawerIcon: ({ focused, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              size={size}
              color={focused ? '#0073b7' : '#444'}
            />
          ),
        }}
        component={HomeScreenStack}
      />
      <Drawer.Screen
        name="EquipmentScreenStack"
        options={{
          title: 'Add Supervisor',
          drawerIcon: ({ focused, size }) => (
            <MaterialCommunityIcons
              name="account-plus"
              size={size}
              color={focused ? '#0073b7' : '#444'}
            />
          ),
        }}
        component={EquipmentScreenStack}
      />
      <Drawer.Screen
        name="BureauScreenStack"
        options={{
          title: 'List Supervisor',
          drawerIcon: ({ focused, size }) => (
            <MaterialCommunityIcons
              name="format-list-bulleted"
              size={size}
              color={focused ? '#0073b7' : '#444'}
            />
          ),
        }}
        component={BureauScreenStack}
      />
      <Drawer.Screen
        name="HistoryScreenStack"
        options={{
          title: 'Shift Line',
          drawerIcon: ({ focused, size }) => (
            <MaterialCommunityIcons
              name="file-import"
              size={size}
              color={focused ? '#0073b7' : '#444'}
            />
          ),
        }}
        component={HistoryScreenStack}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;

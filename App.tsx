import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MapScreen from './src/screens/MapScreen/MapScreen.tsx';
import WeatherScreen from './src/screens/WeatherScreen/WeatherScreen.tsx';
import {BaseProps} from './src/shared/globalProps.ts';
import {StatusBar} from 'react-native';
import Colors from './src/shared/ui/colors/colors.ts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export type RootStackParamList = {
  Map: undefined;
  Weather: undefined;
};

export type WeatherStackParamList = {
  WeatherScreen: {cityInfo: {cityName: string; lat: number; lon: number}};
  SearchScreen: undefined;
};

const WeatherStack = createNativeStackNavigator<WeatherStackParamList>();

const WeatherStackNavigator = () => (
  <WeatherStack.Navigator
    initialRouteName="WeatherScreen"
    {...BaseProps.navigatorProps}>
    <WeatherStack.Screen name="WeatherScreen" component={WeatherScreen} />
  </WeatherStack.Navigator>
);

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({color, size}) => {
              let iconName: string = '';

              if (route.name === 'Map') {
                iconName = 'map-marker';
              } else if (route.name === 'Weather') {
                iconName = 'weather-cloudy';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            headerShown: false,
            tabBarActiveTintColor: Colors.primary.main,
            tabBarInactiveTintColor: Colors.gray[500],
            tabBarStyle: {
              backgroundColor: Colors.background,
              borderTopWidth: 0,
              elevation: 5,
              shadowOpacity: 0.3,
              shadowRadius: 10,
              shadowColor: Colors.gray[300],
              height: 60,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              marginBottom: 5,
            },
          })}>
          <Tab.Screen name="Map" component={MapScreen} />
          <Tab.Screen name="Weather" component={WeatherStackNavigator} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;

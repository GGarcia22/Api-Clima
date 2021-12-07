import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground, Dimensions } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Constants from 'expo-constants';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Weather from './components/Weather';
import SearchBar from './components/SearchBar';
import { fondo, fondo2 } from './assets/Images/index';

const API_KEY = "1a46651cd620bc2d75f6ab3a869c547b";
const Tab = createBottomTabNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen
          name="Home" component={HomeScreen} options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
          }} />
        <Tab.Screen name="Buscador" component={ClimaScreen} options={{
          tabBarLabel: 'Buscador',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cloud-circle-outline" color={color} size={size} />
          ),
        }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    padding: 10
  },
  backgroundImg: {
    flex: 1,
    width: null,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

function HomeScreen() {
  return (
    <ImageBackground source={fondo}
      style={styles.backgroundImg}
      resizeMode='cover'>
      <Card style={styles.card}>  
      <View >      
        <Text style={styles.text}>Bienvenido/a!</Text>
        <Card.Divider/>
        <Text style={styles.text}>• Busca el clima actual de cualquier pais con todos los detalles{"\n"}
        • Conoce la velocidad del viento actual.{"\n"}
        • Conoce la humedad actual.</Text>
      </View>
      </Card>
    </ImageBackground>
  );
}



function ClimaScreen() {

  const [weatherData, setWeatherData] = useState(null);
  const [loaded, setLoaded] = useState(true);

  async function fetchWeatherData(cityName) {
    setLoaded(false);
    const API = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
    try {
      const response = await fetch(API);
      if (response.status == 200) {
        const data = await response.json();
        setWeatherData(data);
      } else {
        setWeatherData(null);
      }
      setLoaded(true);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchWeatherData('Argentina');
  }, [])


  if (!loaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color='gray' size={36} />
      </View>

    )
  }

  else if (weatherData === null) {
    return (
      <View style={styles.container}>
        <SearchBar fetchWeatherData={fetchWeatherData} />
        <Text style={styles.primaryText}>{"\n"}No se encontro la ciudad! Intentalo de nuevo.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Weather weatherData={weatherData} fetchWeatherData={fetchWeatherData} />
    </View>
  );

}


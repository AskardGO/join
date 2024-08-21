import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert, PermissionsAndroid, Image} from 'react-native';
import MapView, {Marker, Callout, LongPressEvent} from 'react-native-maps';
import axios, {AxiosError} from 'axios';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Geolocation from 'react-native-geolocation-service';
import {RootStackParamList} from '../../../App.tsx';
import {WEATHER_API} from '../../shared/global.ts';
import {useNavigation} from '@react-navigation/native';
import {WeatherResponse} from '../../shared/types/weather.ts';
import GLOBAL from '../../shared/platform.ts';
import {Column} from '../../shared/ui/layout';
import {Typography} from '../../shared/ui/components/Typography.tsx';
import Colors from '../../shared/ui/colors/colors.ts';
import {BaseProps} from '../../shared/globalProps.ts';

type MapScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Map'
>;

type MarkerData = {
  latitude: number;
  longitude: number;
};

type CityInfo = {
  cityName: string;
  weather: string;
};

const DEFAULT_LOCATION = {
  latitude: 50.4501,
  longitude: 30.5234,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const MapScreen = () => {
  const {navigate} = useNavigation<MapScreenNavigationProp>();
  const [marker, setMarker] = useState<MarkerData | null>(null);
  const [pointCityInfo, setPointCityInfo] = useState<CityInfo | null>(null);
  const [fullCityInfo, setFullCityInfo] = useState<WeatherResponse | null>(
    null,
  );
  const [cityTemp, setCityTemp] = useState('');
  const [region, setRegion] = useState(DEFAULT_LOCATION);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (GLOBAL.isAndroid) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Location permission denied',
            'The map will default to Kyiv.',
          );
          return;
        }
      }

      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        },
        error => {
          Alert.alert(
            'Failed to get location',
            'The map will default to Kyiv.',
          );
          console.error(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    };

    requestLocationPermission();
  }, []);

  const handleLongPress = async (e: LongPressEvent) => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    setMarker({latitude, longitude});
    const data = await fetchCityInfo(latitude, longitude);
    if (data) {
      setPointCityInfo(data);
    }
  };

  const fetchCityInfo = async (
    latitude: number,
    longitude: number,
  ): Promise<CityInfo | null> => {
    try {
      const response = await axios.get<WeatherResponse>(
        `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API}&units=metric`,
      );
      if (response && response.data && response.status === 200) {
        const {name, weather} = response.data;
        if (response.data) {
          const temp = Math.ceil(response.data.main.temp);
          const temperatureString = temp >= 0 ? `+${temp}` : `-${temp}`;
          setFullCityInfo(response.data);
          setCityTemp(temperatureString);
          return {cityName: name, weather: weather[0].description};
        }
      }
      return null;
    } catch (e: AxiosError | any) {
      console.error(e.response);
      return null;
    }
  };

  const handleCalloutPress = () => {
    // Navigate to the weather screen with city info
    if (pointCityInfo && fullCityInfo) {
      navigate(
        'Weather' as never,
        {
          screen: 'WeatherScreen',
          params: {
            cityInfo: {
              cityName: pointCityInfo.cityName,
              lon: marker?.longitude || 0,
              lat: marker?.latitude || 0,
            },
          },
        } as never,
      );
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onLongPress={handleLongPress}
        followsUserLocation
        showsUserLocation
        customMapStyle={BaseProps.mapStyle}>
        {marker && (
          <Marker
            coordinate={marker}
            style={{
              width: 64,
              height: 64,
            }}
            image={require('../../assets/clipart_norm.png')}>
            <Callout
              tooltip
              onPress={handleCalloutPress}
              style={styles.callout}
              renderToHardwareTextureAndroid>
              {pointCityInfo && fullCityInfo && (
                <Column>
                  <Typography variant="t16" color={Colors.gray['500']}>
                    {`${pointCityInfo.cityName}, ${fullCityInfo.sys.country}`}
                  </Typography>
                  <Typography variant="t16" color={Colors.gray['500']}>
                    {cityTemp}°
                  </Typography>
                </Column>
              )}
            </Callout>
          </Marker>
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  callout: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    width: 220,
  },
  mask: {
    position: 'absolute',
  },
});

export default MapScreen;

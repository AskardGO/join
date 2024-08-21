import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, KeyboardAvoidingView} from 'react-native';
import axios from 'axios';
import {RouteProp, useRoute} from '@react-navigation/native';
import {WeatherStackParamList} from '../../../App.tsx';
import {GOOGLE_MAP_API, WEATHER_API} from '../../shared/global.ts';
import {Typography} from '../../shared/ui/components/Typography.tsx';
import {ScreenWrapper} from '../../shared/ui/components/ScreenWrapper.tsx';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Colors from '../../shared/ui/colors/colors.ts';
import {Column, Gap, Row} from '../../shared/ui/layout';

type ForecastItem = {
  dt: number;
  weather: {description: string}[];
  temp: {day: number};
};

const WeatherScreen = () => {
  const {params} =
    useRoute<RouteProp<WeatherStackParamList, 'WeatherScreen'>>();
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [cityInfo, setCityInfo] = useState<{
    cityName: string;
    lat: number;
    lon: number;
  } | null>(null);
  const [fieldValue, setFieldValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    setFieldValue(undefined);
    if (params?.cityInfo) {
      setCityInfo({
        ...params.cityInfo,
      });
      setFieldValue(params.cityInfo.cityName);
    }
  }, [params]);

  useEffect(() => {
    if (cityInfo && cityInfo.lat && cityInfo.lon) {
      (async () => {
        await fetchWeeklyForecast(cityInfo.lat, cityInfo.lon);
      })();
    }
  }, [cityInfo]);

  const fetchWeeklyForecast = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${WEATHER_API}&units=metric`,
      );
      setForecast(response.data.list);
    } catch (error) {
      console.error('Error fetching forecast:', error);
    }
  };

  const handleCitySelection = (data: any, details: any = null) => {
    if (details && details.geometry) {
      const selectedCityInfo = {
        cityName: details.address_components[0].long_name,
        lat: details.geometry.location.lat,
        lon: details.geometry.location.lng,
      };
      setCityInfo(selectedCityInfo);
      setFieldValue(selectedCityInfo.cityName);
    }
  };

  const renderForecastItems = () => {
    return forecast.map(item => {
      const dayOfWeek = new Date(item.dt * 1000).toLocaleDateString('en-US', {
        weekday: 'long',
      });
      const temperature = item.temp.day;
      const formattedTemp =
        temperature === 0
          ? '0°C'
          : temperature > 0
          ? `+${Math.ceil(temperature)}°C`
          : `-${Math.ceil(temperature)}°C`;

      return (
        <Row key={item.dt} style={styles.forecastItem}>
          <Typography color={Colors.gray['200']} variant="p24">
            {dayOfWeek}
          </Typography>
          <Typography color={Colors.gray['200']} variant="p24">
            {formattedTemp}
          </Typography>
        </Row>
      );
    });
  };

  return (
    <ScreenWrapper>
      <Gap vertical={16} />
      <View style={styles.poweredContainer}>
        <GooglePlacesAutocomplete
          placeholder="Search for a city"
          onPress={handleCitySelection}
          query={{
            key: GOOGLE_MAP_API,
            language: 'en',
            types: '(cities)',
          }}
          fetchDetails
          textInputProps={{
            value:
              params && params.cityInfo ? params.cityInfo.cityName : fieldValue,
            onChangeText: text => setFieldValue(text),
          }}
          styles={{
            textInputContainer: styles.searchContainer,
            textInput: styles.searchInput,
            poweredContainer: styles.poweredContainer,
            description: {color: Colors.gray['600'], fontWeight: '800'},
          }}
        />
      </View>

      {cityInfo && forecast && (
        <KeyboardAvoidingView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Column>{renderForecastItems()}</Column>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  poweredContainer: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  searchContainer: {
    backgroundColor: 'transparent',
    marginHorizontal: 16,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#f0f0f0',
    color: Colors.gray['600'],
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  forecastItem: {
    backgroundColor: Colors.primary.main,
    marginBottom: 20,
    borderRadius: 4,
    padding: 10,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  scrollViewContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },
});

export default WeatherScreen;

import React, {FC, useState, ReactNode, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Text,
} from 'react-native';
import Colors from '../colors/colors.ts';

import ClearIcon from '../../../assets/icons/x.svg';
import DownArrowIcon from '../../../assets/icons/down-arrow.svg';
import CheckmarkIcon from '../../../assets/icons/checkmark.svg';
import SearchIcon from '../../../assets/icons/search.svg';

import {Gap} from '../layout';
import {CountryFlag} from './CountryFlag.tsx';
import GLOBAL from '../../platform.ts';
import {Typography} from './Typography.tsx';
import Input from './Input.tsx';

type Country = {
  code: string;
  name: string;
  flag: ReactNode;
};

type PhoneInputProps = {
  customStyle?: TextInput['props']['style'];
  onClear?: () => void;
  fieldTitle?: string;
  maxLength?: number;
  subText?: string;
  onChange?: (phonenumber: string) => void;
};

const countries: Country[] = [
  {code: '+1', name: 'США', flag: <CountryFlag countryCode="us" />},
  {code: '+380', name: 'Украина', flag: <CountryFlag countryCode="ua" />},
  {code: '+61', name: 'Австралия', flag: <CountryFlag countryCode="au" />},
  {code: '+49', name: 'Германия', flag: <CountryFlag countryCode="de" />},
  {code: '+34', name: 'Испания', flag: <CountryFlag countryCode="es" />},
  {code: '+33', name: 'Франция', flag: <CountryFlag countryCode="fr" />},
  {code: '+91', name: 'Индия', flag: <CountryFlag countryCode="in" />},
  {code: '+86', name: 'Китай', flag: <CountryFlag countryCode="cn" />},
];

const PhoneInput: FC<PhoneInputProps> = ({
  customStyle,
  onClear,
  fieldTitle,
  maxLength = 10,
  onChange,
  subText,
  ...rest
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredCountries, setFilteredCountries] =
    useState<Country[]>(countries);
  const [errors, setErrors] = useState<string | null>(null);
  const [debouncedPhoneNumber, setDebouncedPhoneNumber] = useState(phoneNumber);

  const handlePhoneNumberChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setPhoneNumber(numericText.slice(0, maxLength));
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPhoneNumber(phoneNumber);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [phoneNumber]);

  useEffect(() => {
    if (debouncedPhoneNumber.length < 8 && debouncedPhoneNumber.length !== 0) {
      setErrors('Номер телефона должен содержать не менее 7 цифр.');
    } else if (debouncedPhoneNumber.length > maxLength) {
      setErrors(`Номер телефона не может содержать более ${maxLength} цифр.`);
    } else {
      setErrors(null);
    }
    onChange && onChange(selectedCountry.code + debouncedPhoneNumber);
  }, [debouncedPhoneNumber]);

  useEffect(() => {
    onChange && onChange(selectedCountry.code + debouncedPhoneNumber);
  }, [selectedCountry]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setModalVisible(false);
  };

  const filterCountries = (str: string) => {
    if (str.length > 0) {
      const result = countries.filter(el =>
        el.name.toLowerCase().includes(str.toLowerCase()),
      );
      setFilteredCountries(result);
    } else {
      setFilteredCountries(countries);
    }
  };

  return (
    <>
      {fieldTitle && (
        <>
          <Typography variant="t16">{fieldTitle}</Typography>
          <Gap vertical={8} />
        </>
      )}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.countryCodeContainer}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.countryCodeText}>{selectedCountry.code}</Text>
          <DownArrowIcon />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TextInput
          style={[styles.input, customStyle, onClear && {paddingRight: 40}]}
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          keyboardType="numeric"
          {...rest}
        />
        {onClear && (
          <View style={styles.clear}>
            <TouchableOpacity onPress={onClear}>
              <ClearIcon />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {debouncedPhoneNumber.length < 8 && (
        <>
          <Gap vertical={6} />
          <Typography color={Colors.gray['500']} variant="t14">
            {errors || subText}
          </Typography>
        </>
      )}

      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.searchFieldWrapper}>
              <Input
                placeholder="Поиск"
                style={styles.searchField}
                onChangeText={filterCountries}
              />
              <View style={styles.searchIcon}>
                <SearchIcon />
              </View>
            </View>
            <Gap vertical={8} />
            <FlatList
              data={filteredCountries}
              keyExtractor={item => item.code}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => handleCountrySelect(item)}>
                  {item.flag}
                  <Gap horizontal={12} />
                  <View style={{width: 60}}>
                    <Typography color={Colors.gray['900']} variant="p14">
                      ({item.code})
                    </Typography>
                  </View>
                  <Typography color={Colors.black} variant="p14">
                    {item.name}
                  </Typography>
                  {item.code === selectedCountry.code && (
                    <CheckmarkIcon style={styles.checkmark} />
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default PhoneInput;

const styles = StyleSheet.create({
  fieldTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.gray['300'],
    borderRadius: 6,
  },
  divider: {
    height: '100%',
    width: 1.2,
    backgroundColor: Colors.gray['300'],
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 16,
    width: 100,
    overflow: 'hidden',
  },
  countryCodeText: {
    marginLeft: 5,
    marginRight: 8,
    fontSize: 18,
  },
  input: {
    flex: 1,
    height: 42,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    marginLeft: 10,
    color: Colors.gray['900'],
  },
  clear: {
    position: 'absolute',
    right: 16,
  },
  modalContainer: {
    flex: 1,
    position: 'absolute',
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '100%',
  },
  modalContent: {
    backgroundColor: Colors.background,
    width: GLOBAL.screenWidth,
    justifyContent: 'space-between',
    flex: 1,
    height: '100%',
    paddingBottom: 12,
    paddingTop: 32,
  },
  searchFieldWrapper: {
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 24,
  },
  searchField: {
    position: 'relative',
    backgroundColor: Colors.gray['200'],
    borderColor: Colors.gray['200'],
    paddingVertical: 5.5,
    fontSize: 12,
    height: 32,
    paddingLeft: 32,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  countryName: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
  },
  countryCode: {
    fontSize: 18,
    marginRight: 10,
  },
  checkmark: {
    marginLeft: 'auto',
    color: Colors.gray['300'],
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: Colors.gray['300'],
  },
});

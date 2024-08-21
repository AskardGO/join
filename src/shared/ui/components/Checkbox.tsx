import React, {useState, useEffect} from 'react';
import {TouchableOpacity, Animated, StyleSheet, View} from 'react-native';
import CheckIcon from '../../../assets/icons/checkmark_white.svg';
import Colors from '../colors/colors.ts';

type CustomCheckboxProps = {
  checked?: boolean;
  onToggle?: (checked: boolean) => void;
  size?: number;
  color?: string;
};

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked = false,
  onToggle,
  size = 16,
  color = Colors.primary.main,
}) => {
  const [isChecked, setIsChecked] = useState(checked);
  const [fadeAnim] = useState(new Animated.Value(checked ? 1 : 0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isChecked ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [isChecked, fadeAnim]);

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
    if (onToggle) {
      onToggle(!isChecked);
    }
  };

  return (
    <TouchableOpacity onPress={toggleCheckbox} activeOpacity={0.7}>
      <View
        style={[
          styles.checkbox,
          {
            width: size,
            height: size,
            borderColor: color,
            backgroundColor: isChecked ? color : 'transparent',
          },
        ]}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: fadeAnim,
            },
          ]}>
          <CheckIcon width={size - 6} height={size - 6} fill="white" />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 4,
  },
  iconContainer: {
    position: 'absolute',
  },
});

export default CustomCheckbox;

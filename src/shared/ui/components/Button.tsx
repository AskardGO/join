import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import Colors from '../colors/colors.ts';

type ButtonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: 'outlined' | 'filled';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export const Button = ({
  title,
  onPress,
  variant = 'filled',
  disabled = false,
  style,
  textStyle,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'outlined' ? styles.outlined : styles.filled,
        disabled &&
          (variant === 'outlined'
            ? styles.outlinedDisabled
            : styles.filledDisabled),
        style,
      ]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.8}
      disabled={disabled}>
      <Text
        style={[
          styles.text,
          variant === 'outlined' ? styles.outlinedText : styles.filledText,
          disabled &&
            (variant === 'outlined'
              ? styles.outlinedTextDisabled
              : styles.filledTextDisabled),
          textStyle,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {
    backgroundColor: Colors.primary.main,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },
  filledDisabled: {
    backgroundColor: Colors.primary.disable,
    borderColor: Colors.primary.disable,
  },
  outlinedDisabled: {
    borderColor: Colors.primary.disable,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  filledText: {
    color: '#FFFFFF',
  },
  outlinedText: {
    color: Colors.primary.main,
  },
  filledTextDisabled: {
    color: '#DFF1ED',
  },
  outlinedTextDisabled: {
    color: '#9ABAB3',
  },
});

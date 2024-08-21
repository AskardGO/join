import React from 'react';

import {TouchableOpacity, Text, TextStyle, StyleSheet} from 'react-native';

type TextButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: TextStyle;
  color?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
};

export const TextButton = ({
  title,
  onPress,
  disabled = false,
  style,
  color = '#6B7280',
  fontSize = 16,
  fontWeight = 'normal',
}: TextButtonProps) => {
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      style={[styles.button, disabled && styles.disabled]}
      disabled={disabled}
      activeOpacity={0.7}>
      <Text
        style={[
          styles.text,
          {color: disabled ? 'gray' : color, fontSize, fontWeight},
          style,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
});

import React, {ReactNode} from 'react';
import {Text, TextStyle} from 'react-native';

type FontWeight = 'BOLD' | 'REGULAR' | 'THIN';
type FontStyle = 'italic' | 'normal';
type FontVariant = `${'p' | 't' | 'th'}${number}`;

interface TypographyProps {
  variant: FontVariant;
  fontWeight?: FontWeight;
  fontStyle?: FontStyle;
  style?: TextStyle;
  children: ReactNode;
  color?: TextStyle['color'];
  isUnderline?: boolean;
}

const weightMap: Record<FontWeight, TextStyle> = {
  BOLD: {fontFamily: 'Inter-Italic-VariableFont_opsz,wght', fontWeight: '700'},
  REGULAR: {
    fontFamily: 'Inter-Italic-VariableFont_opsz,wght',
    fontWeight: '400',
  },
  THIN: {fontFamily: 'Inter-Italic-VariableFont_opsz,wght', fontWeight: '100'},
};

const variantToWeight: Record<'p' | 't' | 'th', FontWeight> = {
  p: 'BOLD',
  t: 'REGULAR',
  th: 'THIN',
};

const getTextProps = (
  variant: FontVariant,
  color: TextStyle['color'],
  fontStyle?: FontStyle,
): TextStyle => {
  const fontSize = parseInt(variant.slice(1), 10);
  return {fontSize, color, fontStyle};
};

export const Typography = ({
  variant,
  fontWeight,
  fontStyle,
  style,
  children,
  color = 'black',
  isUnderline = false,
}: TypographyProps) => {
  const derivedWeight = variantToWeight[variant[0] as 'p' | 't' | 'th'];
  const textStyle = getTextProps(variant, color, fontStyle);

  return (
    <Text
      style={[
        textStyle,
        weightMap[fontWeight || derivedWeight],
        isUnderline && {
          textDecorationLine: 'underline',
          textDecorationColor: color,
        },
        style,
      ]}>
      {children}
    </Text>
  );
};

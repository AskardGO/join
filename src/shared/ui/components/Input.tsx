import React, {FC} from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  StyleProp,
  TextStyle,
  View,
  TouchableOpacity,
} from 'react-native';
import Colors from '../colors/colors.ts';
import ClearIcon from '../../../assets/icons/x.svg';
import {Typography} from './Typography.tsx';
import {Gap} from '../layout';

type InputProps = TextInputProps & {
  customStyle?: StyleProp<TextStyle>;
  onClear?: () => void;
  fieldTitle?: string;
};

const Input: FC<InputProps> = ({
  style,
  customStyle,
  onClear,
  fieldTitle,
  ...rest
}) => {
  return (
    <>
      {fieldTitle && (
        <>
          <Typography variant="t16">{fieldTitle}</Typography>
          <Gap vertical={8} />
        </>
      )}
      <View style={styles.container}>
        <TextInput
          style={[
            styles.input,
            customStyle,
            style,
            onClear && {paddingRight: 40},
          ]}
          {...rest}
        />
        {onClear ? (
          <View style={styles.clear}>
            <TouchableOpacity>
              <ClearIcon />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </>
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    height: 42,
    borderColor: Colors.gray['300'],
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    fontFamily: 'Inter-Italic-VariableFont_opsz,wght',
    fontWeight: '400',
    color: Colors.gray['900'],
  },
  container: {
    position: 'relative',
    justifyContent: 'center',
  },
  clear: {
    position: 'absolute',
    right: 16,
  },
});

import {Gap} from './Gap.tsx';
import {View} from 'react-native';
import {Colors} from '../../../theme';
import React from 'react';

export const Divider = ({vertical}: {vertical: number}) => {
  return (
    <>
      <Gap vertical={vertical / 2} />
      <View
        style={{
          height: 1,
          borderRadius: 2,
          backgroundColor: Colors.Gray['100'],
        }}
      />
      <Gap vertical={vertical / 2} />
    </>
  );
};

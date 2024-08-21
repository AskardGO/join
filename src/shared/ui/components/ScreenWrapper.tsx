import React, {PropsWithChildren} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import Colors from '../colors/colors.ts';
import GLOBAL from '../../platform.ts';
import {Gap} from '../layout';

type ScreenWrapperProps = PropsWithChildren<{
  noHorizontalPaddings?: boolean;
  noTopMargin?: boolean;
}>;

export const ScreenWrapper = ({
  children,
  noHorizontalPaddings = false,
  noTopMargin = false,
}: ScreenWrapperProps) => {
  return (
    <SafeAreaView
      style={[
        styles.container,
        noHorizontalPaddings && {paddingHorizontal: 0},
      ]}>
      {GLOBAL.isAndroid && !noTopMargin && <Gap vertical={40} />}
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    position: 'relative',
    paddingHorizontal: 12,
  },
});

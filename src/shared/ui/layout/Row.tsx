import React, {PropsWithChildren} from 'react';
import {View, ViewStyle, FlexStyle} from 'react-native';

type Flex = Partial<
  Pick<FlexStyle, 'justifyContent' | 'alignItems' | 'flex'> & {style: ViewStyle}
>;

type RowProps = PropsWithChildren<Flex>;

export const Row = ({
  justifyContent = undefined,
  alignItems = undefined,
  style,
  flex = undefined,
  children,
}: RowProps) => {
  const row: ViewStyle = {
    flex,
    flexDirection: 'row',
    justifyContent,
    alignItems,
  };

  return <View style={[row, style]}>{children}</View>;
};

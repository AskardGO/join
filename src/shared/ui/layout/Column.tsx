import React, {PropsWithChildren} from 'react';
import {View, ViewStyle, FlexStyle} from 'react-native';

type Flex = Partial<
  Pick<FlexStyle, 'justifyContent' | 'alignItems' | 'flex'> & {style: ViewStyle}
> & {
  gap?: number;
};

type ColumnProps = PropsWithChildren<Flex>;

export const Column = ({
  justifyContent = undefined,
  alignItems = undefined,
  flex = undefined,
  style,
  children,
  gap = 0,
}: ColumnProps): React.JSX.Element => {
  const column: ViewStyle = {
    flex,
    flexDirection: 'column',
    justifyContent,
    alignItems,
    gap,
  };

  return <View style={[column, style]}>{children}</View>;
};

import React from 'react';
import { ViewProps } from 'react-native';

import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { boxStyle } from './styles';
import { View } from '@/components/themed';

type IBoxProps = ViewProps &
  VariantProps<typeof boxStyle> & { className?: string };

const Box = React.forwardRef<React.ElementRef<typeof View>, IBoxProps>(
  ({ className, ...props }, ref) => {
    return (
      <View ref={ref} {...props} className={boxStyle({ class: className })} />
    );
  }
);

Box.displayName = 'Box';
export { Box };

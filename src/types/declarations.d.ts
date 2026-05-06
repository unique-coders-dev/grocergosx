declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import { IconProps } from 'react-native-vector-icons/Icon';
  import { Component } from 'react';
  class MaterialCommunityIcons extends Component<IconProps> {}
  export default MaterialCommunityIcons;
}

declare module 'react-native-vector-icons/Icon' {
  import { TextStyle, ViewStyle, Context } from 'react-native';
  import { Component } from 'react';

  export interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle | ViewStyle;
    onPress?: () => void;
  }

  export default class Icon extends Component<IconProps> {}
}

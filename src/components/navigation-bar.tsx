import {View, Text, ViewStyle, StyleSheet} from 'react-native';
import React from 'react';

type Props = {
  title: string | undefined;
  onPress?: () => void;
  containerStyle?: ViewStyle;
};

const NavigationBar = (props: Props) => {
  const {title, onPress, containerStyle} = props;
  return (
    <View style={[styles.container, containerStyle]}>
      <Text>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: '100%',
    backgroundColor: '#fff',
  },
});

export default NavigationBar;

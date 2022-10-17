import {
  View,
  Text,
  ViewStyle,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import ICONS from '../assets/icons';
import {useNavigation} from '@react-navigation/native';
import {useUser} from '../hooks/use-user';
import {ActionType} from '../store/action';

type Props = {
  title: string | undefined;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  children?: JSX.Element;
  hiddenBackButton?: boolean;
  hiddenLogoutButton?: boolean;
};

const NavigationBar = (props: Props) => {
  const navigation = useNavigation();
  const {
    title,
    onPress,
    containerStyle,
    children,
    hiddenBackButton,
    hiddenLogoutButton,
  } = props;
  const {dispatch} = useUser();
  const _onPress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };
  const onLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất ?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          dispatch({type: ActionType.LOGOUT});
          navigation.goBack();
        },
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <View style={[styles.navigationBar, containerStyle]}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        {/* Set background color and height if device has a touch bar */}
        <View style={styles.hiddenContainer} />
        {!hiddenBackButton && (
          <TouchableOpacity
            onPress={_onPress}
            activeOpacity={0.9}
            style={styles.button}>
            <FastImage source={ICONS.arrowLeft} style={styles.icon} />
          </TouchableOpacity>
        )}
        {!hiddenLogoutButton && (
          <TouchableOpacity
            onPress={onLogout}
            activeOpacity={0.9}
            style={styles.logoutButton}>
            <FastImage source={ICONS.logout} style={styles.icon} />
          </TouchableOpacity>
        )}

        <Text style={styles.title}>{title}</Text>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 12,
  },
  navigationBar: {
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  hiddenContainer: {
    position: 'absolute',
    left: 0,
    top: -48,
    right: 0,
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
  },
  button: {
    position: 'absolute',
    left: 16,
  },
  icon: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    position: 'absolute',
    right: 16,
  },
});

export default NavigationBar;

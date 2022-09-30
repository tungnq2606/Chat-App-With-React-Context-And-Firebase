import {
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {useUser} from '../../hooks/use-user';
import {ActionType} from '../../store/action';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {User} from '../../interfaces/user-interface';

const LoginScreen: React.FC = () => {
  const {dispatch} = useUser();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const onChangeUsername = (text: string) => {
    setUsername(text);
  };

  const onChangePassword = (text: string) => {
    setPassword(text);
  };

  const clearInputs = () => {
    setUsername('');
    setPassword('');
  };

  const onRegister = () => {
    navigation.navigate('Register' as never);
  };

  const onLogin = () => {
    dispatch({
      type: ActionType.SHOW_LOADING,
    });
    firestore()
      .collection('users')
      .get()
      .then(querySnapshot => {
        dispatch({
          type: ActionType.HIDE_LOADING,
        });
        clearInputs();
        if (querySnapshot.docs.length > 0) {
          const user = querySnapshot.docs.find(
            item =>
              item.data().username === username &&
              item.data().password === password,
          );
          if (user) {
            dispatch({
              type: ActionType.LOGIN,
              payload: user.data() as User,
            });
            navigation.navigate('GiftedChat' as never);
          } else {
            Alert.alert('Tên đăng nhập hoặc mật khẩu không chính xác');
          }
        } else {
          Alert.alert('Tên đăng nhập hoặc mật khẩu không chính xác');
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.appName}>Chat App With Context + Firebase</Text>
      <TextInput
        placeholder="Tên đăng nhập"
        style={styles.input}
        value={username}
        onChangeText={onChangeUsername}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Mật khẩu"
        style={styles.input}
        value={password}
        onChangeText={onChangePassword}
        autoCapitalize="none"
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.7}
        onPress={onLogin}>
        <Text>Đăng nhập</Text>
      </TouchableOpacity>
      <Text>
        Chưa có tài khoản?{' '}
        <Text style={styles.link} onPress={onRegister}>
          Đăng ký
        </Text>
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#7FBCD2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  link: {
    color: '#F7A76C',
    fontWeight: 'bold',
  },
});

export default LoginScreen;

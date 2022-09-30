import {
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import {useUser} from '../../hooks/use-user';
import {ActionType} from '../../store/action';
import {useNavigation} from '@react-navigation/native';

const RegisterScreen: React.FC = () => {
  const {state, dispatch} = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const onChangeUsername = (text: string) => {
    setUsername(text);
  };

  const onChangePassword = (text: string) => {
    setPassword(text);
  };

  const onLogin = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.appName}>Đăng ký ngay</Text>
      <TextInput
        placeholder="Tên đăng nhập"
        style={styles.input}
        value={username}
        onChangeText={onChangeUsername}
      />
      <TextInput
        placeholder="Mật khẩu"
        style={styles.input}
        value={password}
        onChangeText={onChangePassword}
      />
      <TouchableOpacity style={styles.button}>
        <Text>Đăng ký</Text>
      </TouchableOpacity>
      <Text>
        Đã có tài khoản?{' '}
        <Text style={styles.link} onPress={onLogin}>
          Đăng nhập
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

export default RegisterScreen;

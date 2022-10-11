import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import React from 'react';
import firestore from '@react-native-firebase/firestore';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {useUser} from '../../hooks/use-user';
import {ActionType} from '../../store/action';
import {ControlInput} from '../../components';
import {loginSchema} from '../../schema';
import {Account, LoginScreenProps} from '../../types';
import {COLORS} from '../../constants';

enum defaultValues {
  username = '',
  password = '',
}

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const {dispatch} = useUser();
  const {
    handleSubmit,
    formState: {errors, isValid},
    control,
    reset,
  } = useForm<Account>({
    resolver: yupResolver(loginSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onRegister = () => {
    navigation.navigate('Register');
  };

  const onSubmit = (data: Account) => {
    const {username, password} = data;
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

        if (querySnapshot.docs.length > 0) {
          const user = querySnapshot.docs.find(
            item =>
              item.data()?.username.toUpperCase() === username.toUpperCase() &&
              item.data()?.password === password,
          );
          if (user) {
            const payload = {
              id: user.id,
              displayName: user.data()?.displayName,
            };
            dispatch({
              type: ActionType.LOGIN,
              payload,
            });
            reset(defaultValues);
            navigation.navigate('GiftedChatList');
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
      <ControlInput
        name="username"
        control={control}
        errors={errors}
        placeholder="Tên đăng nhập"
        style={styles.input}
        autoCapitalize="none"
        trim
      />
      <ControlInput
        name="password"
        control={control}
        errors={errors}
        placeholder="Mật khẩu"
        style={styles.input}
        autoCapitalize="none"
        secureTextEntry
      />
      <TouchableOpacity
        disabled={!isValid}
        style={styles.button}
        activeOpacity={0.7}
        onPress={handleSubmit(onSubmit)}>
        <Text style={styles.labelButton}>Đăng nhập</Text>
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
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 20,
  },
  link: {
    color: '#F7A76C',
    fontWeight: 'bold',
  },
  labelButton: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default LoginScreen;

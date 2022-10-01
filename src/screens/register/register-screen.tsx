import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import React from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {useUser} from '../../hooks/use-user';
import {ActionType} from '../../store/action';
import {User} from '../../interfaces/user-interface';
import {registerSchema} from '../../schema';
import {ControlInput} from '../../components';

interface Info extends User {
  displayName: string;
  confirmPassword: string;
}

enum defaultValues {
  username = '',
  password = '',
  displayName = '',
  confirmPassword = '',
}

const RegisterScreen: React.FC = () => {
  const {dispatch} = useUser();
  const navigation = useNavigation();
  const {
    handleSubmit,
    formState: {errors, isValid},
    control,
    reset,
  } = useForm<Info>({
    resolver: yupResolver(registerSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onLogin = () => {
    navigation.goBack();
  };

  const createRegisterSuccessAlert = () =>
    Alert.alert('Đăng ký thành công', '', [
      {
        text: 'Đăng nhập ngay',
        onPress: onLogin,
      },
      {
        text: 'Huỷ',
      },
    ]);

  const onSubmit = async (data: Info) => {
    const {username, password, displayName} = data;
    dispatch({
      type: ActionType.SHOW_LOADING,
    });
    const users = await firestore().collection('users').get();
    const user = users.docs.find(item => item.data().username === username);
    if (user) {
      dispatch({
        type: ActionType.HIDE_LOADING,
      });
      reset();
      Alert.alert('Tên đăng nhập đã tồn tại');
    } else {
      firestore()
        .collection('users')
        .add({
          displayName,
          username,
          password,
        })
        .then(() => {
          reset();
          dispatch({
            type: ActionType.HIDE_LOADING,
          });
          createRegisterSuccessAlert();
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.appName}>Đăng ký ngay</Text>
      <ControlInput
        name="displayName"
        control={control}
        errors={errors}
        placeholder="Tên hiển thị"
        style={styles.input}
        autoCapitalize="none"
      />
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
      <ControlInput
        name="confirmPassword"
        control={control}
        errors={errors}
        placeholder="Nhập lại khẩu"
        style={styles.input}
        autoCapitalize="none"
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        disabled={!isValid}
        onPress={handleSubmit(onSubmit)}
        activeOpacity={0.7}>
        <Text style={styles.labelButton}>Đăng ký</Text>
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
    backgroundColor: '#FFB72B',
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

export default RegisterScreen;

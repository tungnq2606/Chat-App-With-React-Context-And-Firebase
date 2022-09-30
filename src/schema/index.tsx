import * as yup from 'yup';
import {usernameRegex} from '../utils';
export const loginSchema = yup.object().shape({
  username: yup.string().required('Vui lòng nhập tên đăng nhập'),
  password: yup.string().required('Vui lòng nhập mật khẩu'),
});

export const registerSchema = yup.object().shape({
  displayName: yup.string().required('Vui lòng nhập tên hiển thị'),
  username: yup
    .string()
    .required('Vui lòng nhập tên đăng nhập')
    .matches(usernameRegex, 'Tên đăng nhập không được chứa ký tự đặc biệt')
    .min(6, 'Tên đăng nhập phải có ít nhất 6 ký tự'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp'),
});

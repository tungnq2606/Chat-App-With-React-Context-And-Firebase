import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';
import React from 'react';
import {Controller} from 'react-hook-form';

interface Props extends TextInputProps {
  control: any;
  name: string;
  errors: any;
  trim?: boolean;
}

const ControlInput = (props: Props) => {
  const {control, name, errors, trim, ...rest} = props;

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => {
          const onChangeText = (text: string) => {
            if (trim) {
              onChange(text.trim());
            } else {
              onChange(text);
            }
          };
          return (
            <TextInput
              {...rest}
              onChangeText={onChangeText}
              value={value}
              onBlur={onBlur}
            />
          );
        }}
        name={name}
      />
      {errors[name] && <Text style={styles.error}>{errors[name].message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  error: {
    fontSize: 13,
    color: 'red',
    textAlign: 'left',
    width: '100%',
    paddingTop: 5,
  },
});

export default ControlInput;

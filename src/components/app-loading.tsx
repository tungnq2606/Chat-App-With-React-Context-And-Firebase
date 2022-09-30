import {Modal, View, StyleSheet, ActivityIndicator} from 'react-native';
import React from 'react';
import {useUser} from '../hooks/use-user';

const AppLoading = () => {
  const {state} = useUser();
  return (
    <Modal visible={state.loading} transparent>
      <View style={styles.container}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default AppLoading;

import {
  Text,
  SafeAreaView,
  View,
  TextInput,
  StyleSheet,
  FlatList,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';

import {NavigationBar} from '../../components';
import ICONS from '../../assets/icons';
import {COLORS} from '../../constants';
import {getAbbreviations} from '../../utils';
import {useUser} from '../../hooks/use-user';

type UserItemProps = {
  id: string;
  displayName: string;
  color: string;
};

const NewChatScreen = () => {
  const userRef = firestore().collection('users');
  const [users, setUsers] = useState<Array<UserItemProps>>([]);
  const {state} = useUser();

  const renderItem = useCallback(({item}: {item: UserItemProps}) => {
    const {displayName, color} = item;
    const abbreviationName = getAbbreviations(displayName);
    return (
      <View style={styles.item}>
        <View style={[styles.avatar, {backgroundColor: color}]}>
          <Text style={styles.avatarText}>{abbreviationName}</Text>
        </View>
        <Text style={styles.displayName}>{displayName}</Text>
      </View>
    );
  }, []);

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const keyExtractor = (item: UserItemProps) => item.id;

  useEffect(() => {
    const fetchData = async () => {
      const res = await firestore().collection('users').get();
      const listUsers: UserItemProps[] = [];
      res.docs.forEach(doc => {
        if (doc.id !== state.user.id) {
          const user: UserItemProps = {
            id: doc.id,
            displayName: doc.data()?.displayName,
            color: doc.data()?.color,
          };
          listUsers.push(user);
        }
      });
      setUsers(listUsers);
    };
    fetchData();
  }, [state.user.id]);

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar title="Tin nhắn mới">
        <View style={styles.searchContainer}>
          <FastImage source={ICONS.search} style={styles.searchIcon} />
          <TextInput placeholder="Tìm kiếm" style={styles.search} />
        </View>
      </NavigationBar>
      <View style={styles.listContainer}>
        <Text style={styles.title}>GỢI Ý</Text>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.flatListContentContainer}
          ItemSeparatorComponent={renderSeparator}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchContainer: {
    backgroundColor: COLORS.backgroundMainHome,
    marginHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 40,
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  searchIcon: {
    width: 15,
    height: 15,
  },
  search: {
    paddingLeft: 8,
    fontSize: 13,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#707070',
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 15,
  },
  displayName: {
    fontSize: 15,
    paddingLeft: 12,
  },
  flatListContentContainer: {
    borderBottomColor: COLORS.borderColor,
    borderBottomWidth: 1,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.borderColor,
  },
});
export default NewChatScreen;

import {
  Text,
  SafeAreaView,
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import {isEqual} from 'lodash';

import {NavigationBar} from '../../components';
import ICONS from '../../assets/icons';
import {COLORS} from '../../constants';
import {getAbbreviations} from '../../utils';
import {useUser} from '../../hooks/use-user';
import {NewChatScreenProps, UserItemProps} from '../../types';
import {ActionType} from '../../store/action';

let usersTemp: UserItemProps[] = [];

const NewChatScreen = ({navigation}: NewChatScreenProps) => {
  const [search, setSearch] = useState('');
  const {state, dispatch} = useUser();
  const [users, setUsers] = useState<Array<UserItemProps>>(state.users);

  const renderItem = useCallback(
    ({item}: {item: UserItemProps}) => {
      const {displayName, color} = item;
      const abbreviationName = getAbbreviations(displayName);

      const onPress = () => {
        navigation.navigate('GiftedChat', {
          partnerName: displayName,
          partnerId: item.partnerId,
          chatId: item.chatId,
          color,
        });
      };
      return (
        <TouchableOpacity
          style={styles.item}
          onPress={onPress}
          activeOpacity={0.8}>
          <View style={[styles.avatar, {backgroundColor: color}]}>
            <Text style={styles.avatarText}>{abbreviationName}</Text>
          </View>
          <Text style={styles.displayName}>{displayName}</Text>
        </TouchableOpacity>
      );
    },
    [navigation],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const keyExtractor = (item: UserItemProps) => item.id;

  useEffect(() => {
    const fetchData = async () => {
      const resUsers = await firestore().collection('users').get();
      dispatch({type: ActionType.CLEAR_MESSAGES});

      const listUsers: UserItemProps[] = [];
      for (const doc of resUsers.docs) {
        if (doc.id !== state.user.id) {
          const user: UserItemProps = {
            id: doc.id,
            displayName: doc.data()?.displayName,
            color: doc.data()?.color,
            partnerId: '',
          };
          const usersMap: {
            [key: string]: null;
          } = {};
          usersMap[state.user.id] = null;
          usersMap[doc.id] = null;
          const resChat = await firestore().collection('userChats').get();
          const partnerId = Object.keys(usersMap).find(
            id => id !== state.user.id,
          );
          user.partnerId = partnerId || '';
          for (const docChat of resChat.docs) {
            if (isEqual(docChat.data()?.users, usersMap)) {
              user.chatId = docChat.data().chatId;
              break;
            }
          }
          listUsers.push(user);
        }
      }
      dispatch({type: ActionType.SET_USERS, payload: listUsers});
      usersTemp = listUsers;
      setUsers(listUsers);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user.id]);

  const onSearchTextChange = (text: string) => {
    setSearch(text);
    searchUser(text);
  };

  const searchUser = (text: string) => {
    if (text) {
      const res = usersTemp.filter(user =>
        user.displayName.toLowerCase().includes(text.toLowerCase()),
      );
      setUsers(res);
    } else {
      setUsers(usersTemp);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar title="Tin nhắn mới" hiddenLogoutButton>
        <View style={styles.searchContainer}>
          <FastImage source={ICONS.search} style={styles.searchIcon} />
          <TextInput
            placeholder="Tìm kiếm"
            style={styles.search}
            value={search}
            onChangeText={onSearchTextChange}
          />
        </View>
      </NavigationBar>
      <View style={styles.listContainer}>
        {search.trim().length === 0 && <Text style={styles.title}>GỢI Ý</Text>}
        <FlatList
          data={users?.slice(0, 10)}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={
            users?.length === 0 && styles.flatListContentContainer
          }
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
    borderWidth: 1,
    height: 40,
    borderColor: COLORS.borderColor,
    borderRadius: 40,
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'center',
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

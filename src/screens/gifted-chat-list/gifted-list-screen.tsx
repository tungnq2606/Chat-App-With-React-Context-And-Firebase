import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';

import {NavigationBar} from '../../components';
import MessageRenderItem, {
  MessageProps,
} from './components/message-render-item';
import {COLORS} from '../../constants';
import ICONS from '../../assets/icons';
import {useUser} from '../../hooks/use-user';
import {GiftedChatListScreenProps} from '../../types';
import {ActionType} from '../../store/action';
import {useFocusEffect} from '@react-navigation/native';

const renderSeparator = () => <View style={styles.separator} />;

const renderEmpty = () => (
  <View style={styles.empty}>
    <Text style={styles.emptyLabel}>Không có tin nhắn nào</Text>
  </View>
);

const GiftedChatListScreen = ({navigation}: GiftedChatListScreenProps) => {
  const {state, dispatch} = useUser();
  const [messages, setMessages] = React.useState<Array<MessageProps>>([]);

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
    return true;
  };

  useEffect(() => {
    const fetchData = async () => {
      const reference = firestore().collection('users').doc(state.user.id);
      firestore()
        .collection('chat')
        .where('members', 'array-contains', reference)
        .onSnapshot(documentSnapshot => {
          const listMsg: MessageProps[] = [];

          documentSnapshot.docs.forEach(async doc => {
            if (doc.data()?.members?.length > 0) {
              const member = doc
                .data()
                ?.members.find((e: {id: string}) => e.id !== state.user.id);
              const partner = await member.get();
              const msg: MessageProps = {
                id: doc.id,
                displayName: partner.data()?.displayName,
                message: doc.data()?.recentMessage?.content,
                isRead: doc.data()?.isRead,
                sentDate: doc.data()?.recentMessage?.sentDate?.toDate(),
                sentBy: doc.data()?.recentMessage?.sentBy,
                color: partner.data()?.color,
              };
              listMsg.push(msg);
            }
            setMessages(
              listMsg.sort(
                (a, b) =>
                  new Date(b.sentDate).valueOf() -
                  new Date(a.sentDate).valueOf(),
              ),
            );
          });
        });
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user.id]);

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onLogout);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onLogout);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const createChat = () => {
    navigation.navigate('NewChat');
  };

  const renderItem: ListRenderItem<MessageProps> = ({item}) => {
    return <MessageRenderItem {...item} />;
  };

  const keyExtractor = (item: MessageProps) => item.id;
  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar
        title="Tin nhắn"
        hiddenBackButton={true}
        onPressLogout={onLogout}>
        <View style={styles.searchContainer}>
          <FastImage source={ICONS.search} style={styles.searchIcon} />
          <TextInput placeholder="Tìm kiếm" style={styles.search} />
        </View>
      </NavigationBar>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={messages}
        renderItem={renderItem}
        contentContainerStyle={[
          messages.length > 0 && styles.flatListContentContainer,
        ]}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmpty}
        keyExtractor={keyExtractor}
      />
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={createChat}>
        <FastImage source={ICONS.plus} style={styles.plusIcon} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default GiftedChatListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    backgroundColor: COLORS.backgroundMainHome,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 40,
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'center',
    height: 40,
  },
  searchIcon: {
    width: 15,
    height: 15,
  },
  search: {
    paddingLeft: 8,
    fontSize: 13,
  },
  flatListContentContainer: {
    marginVertical: 12,
    marginHorizontal: 16,
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  separator: {
    height: 0.8,
    backgroundColor: '#E5E5E5',
    marginVertical: 8,
  },
  empty: {
    marginTop: 24,
  },
  emptyLabel: {
    textAlign: 'center',
    fontSize: 14,
    color: '#BDBDBD',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    bottom: 40,
    right: 30,
    backgroundColor: '#54BAB9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    width: 25,
    height: 25,
  },
});

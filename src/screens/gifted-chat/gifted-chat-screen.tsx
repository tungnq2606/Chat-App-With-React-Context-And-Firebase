import React, {useCallback, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Day,
  DayProps,
  GiftedChat,
  IMessage,
  Send,
  SendProps,
} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';

import {NavigationBar} from '../../components';
import {GiftedChatScreenProps, Message} from '../../types';
import {useUser} from '../../hooks/use-user';
import {getAbbreviations} from '../../utils';
import {ActionType} from '../../store/action';

const GiftedChatScreen = ({route, navigation}: GiftedChatScreenProps) => {
  const {chatId, partnerName, color} = route.params;
  const routes = navigation.getState()?.routes;
  const previosRoute = routes?.[routes.length - 2]?.name;

  const onBackPress = () => {
    if (previosRoute === 'GiftedChatList') {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 1,
        routes: [{name: 'Login'}, {name: 'GiftedChatList'}],
      });
    }
  };
  let newChatId = useRef(chatId);
  const {state, dispatch} = useUser();

  useEffect(() => {
    dispatch({type: ActionType.CLEAR_MESSAGES});
    const subscriber = firestore()
      .collection('chatMessages')
      .doc(newChatId.current)
      .collection('messages')
      .onSnapshot(documentSnapshot => {
        const listMsg: Message[] = [];
        documentSnapshot.docs.forEach(doc => {
          const msg: Message = {
            _id: doc.id,
            text: doc.data().content,
            createdAt: doc.data().sentDate.toDate(),
            user: {
              _id: doc.data().sentBy,
            },
          };
          listMsg.push(msg);
        });
        dispatch({
          type: ActionType.SET_MESSAGES,
          payload: listMsg.sort(
            (a, b) =>
              new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
          ),
        });
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [newChatId, dispatch]);

  const renderSend = (props: SendProps<IMessage>) => (
    <Send {...props}>
      <View style={styles.sendButton}>
        <Text style={styles.sendButtonText}>Gửi</Text>
      </View>
    </Send>
  );

  const onSend = useCallback(
    async (mess: Message[] = []) => {
      const params = {
        content: mess[0].text,
        sentDate: firestore.Timestamp.fromDate(mess[0].createdAt),
        sentBy: state.user.id,
        isRead: false,
      };
      dispatch({
        type: ActionType.ADD_MESSAGE,
        payload: {
          _id: mess[0]._id,
          text: mess[0].text,
          createdAt: mess[0].createdAt,
          user: {
            _id: mess[0].user._id,
          },
        },
      });

      if (!newChatId.current) {
        const id = firestore().collection('chatMessages').doc().id;
        newChatId.current = id;
        await firestore()
          .collection('chat')
          .doc(id)
          .set({
            createAt: firestore.Timestamp.fromDate(new Date()),
            isRead: false,
            members: [
              firestore().collection('users').doc(route.params.partnerId),
              firestore().collection('users').doc(state.user.id),
            ],
            recentMessage: {
              content: mess[0].text,
              sentDate: firestore.Timestamp.fromDate(mess[0].createdAt),
              sentBy: state.user.id,
            },
          });
        await firestore()
          .collection('userChats')
          .add({
            chatId: id,
            users: {
              [state.user.id]: null,
              [route.params.partnerId]: null,
            },
          });
      }

      firestore()
        .collection('chatMessages')
        .doc(newChatId.current)
        .collection('messages')
        .add(params)
        .then(async () => {
          const recentParams = {
            content: mess[0].text,
            sentDate: firestore.Timestamp.fromDate(mess[0].createdAt),
            sentBy: state.user.id,
          };
          await firestore()
            .collection('chat')
            .doc(newChatId.current)
            .update({recentMessage: recentParams, isRead: false});
        })
        .catch(error => {
          console.log(error);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [newChatId, state.user.id],
  );

  const renderEmptyChat = () => (
    <View>
      <Text style={styles.emptyChatText}>Chưa có tin nhắn nào</Text>
    </View>
  );

  const renderAvatar = () => (
    <View
      style={[
        styles.avatar,
        {
          backgroundColor: color || 'green',
        },
      ]}>
      <Text style={styles.avatarText}>{getAbbreviations(partnerName)}</Text>
    </View>
  );

  const renderDay = (props: DayProps) => (
    <Day {...props} dateFormat="DD/MM/YYYY" />
  );

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <NavigationBar
          title={partnerName}
          hiddenLogoutButton
          onPress={onBackPress}
        />
      </SafeAreaView>
      <GiftedChat
        renderLoading={() => (
          <View>
            <ActivityIndicator size="small" color="#5c5b5b" />
          </View>
        )}
        placeholder="Nhập tin nhắn..."
        messages={state.messages}
        onSend={onSend}
        user={{
          _id: state.user.id,
        }}
        minInputToolbarHeight={80}
        minComposerHeight={80}
        textInputProps={{
          style: styles.textInputStyle,
        }}
        listViewProps={{
          showsVerticalScrollIndicator: false,
          initialNumToRender: 100,
        }}
        scrollToBottom
        renderSend={renderSend}
        renderChatEmpty={renderEmptyChat}
        renderAvatar={renderAvatar}
        renderDay={renderDay}
        messagesContainerStyle={[
          state.messages.length === 0 && {transform: [{scaleY: -1}]},
        ]}
        renderComposer={() => null}
        wrapInSafeArea={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sendButton: {
    height: 80,
    alignItems: 'center',
    paddingTop: 20,
    paddingRight: 18,
  },
  sendButtonText: {
    color: '#007AFF',
  },
  textInputStyle: {
    paddingTop: 12,
    paddingHorizontal: 18,
    flex: 1,
    height: 80,
    alignItems: 'center',
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
    fontSize: 16,
  },
  emptyChatText: {
    width: '100%',
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
  },
});

export default GiftedChatScreen;

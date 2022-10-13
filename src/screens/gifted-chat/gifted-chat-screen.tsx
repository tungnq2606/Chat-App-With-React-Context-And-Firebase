import React, {useCallback, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
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

const GiftedChatScreen = ({route}: GiftedChatScreenProps) => {
  const {chatId, partnerName, color} = route.params;

  const {state, dispatch} = useUser();

  useEffect(() => {
    dispatch({type: ActionType.CLEAR_MESSAGES});
    const subscriber = firestore()
      .collection('chatMessages')
      .doc(chatId)
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
  }, [chatId, dispatch]);

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
      firestore()
        .collection('chatMessages')
        .doc(chatId)
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
            .doc(chatId)
            .update({recentMessage: recentParams, isRead: false});
        })
        .catch(error => {
          console.log(error);
        });
    },
    [chatId, state.user.id, dispatch],
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
        <NavigationBar title={partnerName} hiddenLogoutButton />
      </SafeAreaView>
      <GiftedChat
        placeholder="Nhập tin nhắn..."
        messages={state.messages}
        onSend={onSend}
        user={{
          _id: state.user.id,
        }}
        minInputToolbarHeight={80}
        textInputProps={{
          style: styles.textInputStyle,
        }}
        listViewProps={{
          bounces: false,
          showsVerticalScrollIndicator: false,
        }}
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

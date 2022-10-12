import React, {useState, useCallback, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {GiftedChat, IMessage, Send, SendProps} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';

import {NavigationBar} from '../../components';
import {GiftedChatScreenProps} from '../../types';
import {useUser} from '../../hooks/use-user';
import {getAbbreviations} from '../../utils';

type Message = {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
  };
};

const GiftedChatScreen = ({route}: GiftedChatScreenProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const {chatId, partnerName, color} = route.params;

  const {state} = useUser();

  useEffect(() => {
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
        setMessages(
          listMsg.sort(
            (a, b) =>
              new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf(),
          ),
        );
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [chatId]);

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
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, mess),
      );
      await firestore()
        .collection('chatMessages')
        .doc(chatId)
        .collection('messages')
        .add(params);
    },
    [chatId, state.user.id],
  );

  const renderEmptyChat = () => <Text>Hello</Text>;

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

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <NavigationBar title={partnerName} hiddenLogoutButton />
      </SafeAreaView>
      <GiftedChat
        placeholder="Nhập tin nhắn..."
        messages={messages}
        onSend={onSend}
        user={{
          _id: state.user.id,
        }}
        minInputToolbarHeight={80}
        textInputProps={{
          style: styles.textInputStyle,
        }}
        renderSend={renderSend}
        renderChatEmpty={renderEmptyChat}
        renderAvatar={renderAvatar}
        messagesContainerStyle={[
          messages.length === 0 && {transform: [{scaleY: -1}]},
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
});

export default GiftedChatScreen;

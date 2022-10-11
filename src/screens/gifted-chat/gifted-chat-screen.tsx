import React, {useState, useCallback, useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {NavigationBar} from '../../components';
import {useUser} from '../../hooks/use-user';

type Message = {
  _id: number;
  text: string;
  createdAt: Date;
  user: {
    _id: number;
    name: string;
    avatar: string;
  };
};

const GiftedChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const {state} = useUser();

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'User 2',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Husky',
          avatar:
            'https://images.unsplash.com/photo-1617895153857-82fe79adfcd4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((mess: Message[] = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, mess));
  }, []);

  return (
    <SafeAreaView>
      <NavigationBar title="Tin nhắn" />
      <GiftedChat
        messages={messages}
        onSend={mess => onSend(mess)}
        user={{
          _id: 1,
        }}
      />
    </SafeAreaView>
  );
};

export default GiftedChatScreen;

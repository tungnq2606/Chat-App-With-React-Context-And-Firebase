import {
  View,
  Text,
  StyleSheet,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import {getAbbreviations, getDisplayTime} from '../../../utils';
import {useUser} from '../../../hooks/use-user';
import {GiftedChatListScreenProps} from '../../../types';

export type MessageProps = {
  id: string;
  displayName: string;
  message: string;
  isRead: boolean;
  sentDate: Date;
  sentBy: string;
  color?: string;
};

type MessageNavigationProp = GiftedChatListScreenProps['navigation'];

const MessageRenderItem = (props: MessageProps) => {
  const {state} = useUser();
  const {id, displayName, message, isRead, sentDate, color, sentBy} = props;

  const navigation = useNavigation<MessageNavigationProp>();

  const isMessageFromMe = sentBy === state.user.id;

  const abbreviationName = getAbbreviations(displayName);
  const backgroundColorStyle: ViewStyle = {
    backgroundColor: color,
  };

  const styleForUnreadMessage: TextStyle = {
    fontWeight: !isMessageFromMe && !isRead ? 'bold' : 'normal',
  };

  const goToChat = async () => {
    navigation.navigate('GiftedChat', {
      partnerName: displayName,
      chatId: id,
      color,
      partnerId: sentBy,
    });
    if (!isMessageFromMe && !isRead) {
      await firestore().collection('chat').doc(id).update({isRead: true});
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={goToChat}>
      <View style={[styles.avatar, backgroundColorStyle]}>
        <Text style={styles.avatarLabel}>{abbreviationName}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.displayName, styleForUnreadMessage]}>
          {displayName}
        </Text>
        <View style={styles.messageContainer}>
          <Text style={[styles.message, styleForUnreadMessage]}>
            {isMessageFromMe ? `Bạn: ${message}` : message}
          </Text>
          <Text style={[styles.sentDate, styleForUnreadMessage]}>
            {getDisplayTime(sentDate)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    color: '#fff',
  },
  content: {
    marginLeft: 12,
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  displayName: {
    fontSize: 13,
  },
  messageContainer: {
    flexDirection: 'row',
  },
  message: {
    fontSize: 12,
    marginRight: 8,
  },
  sentDate: {
    fontSize: 11,
  },
});

export default MessageRenderItem;
